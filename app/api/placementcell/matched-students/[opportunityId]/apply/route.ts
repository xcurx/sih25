import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export const POST = async (req: NextRequest, context: { params: Promise<{ opportunityId: string }> }) => {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { opportunityId } = await context.params

    try {
        // Parse the request body to get studentIds (optional - if not provided, apply all matched students)
        let studentIds: string[] = []
        try {
            const body = await req.json()
            studentIds = body.studentIds || []
        } catch {
            // If no body, we'll apply all matched students
        }

        // Get the opportunity
        const opportunity = await prisma.opportunity.findUnique({
            where: { id: opportunityId },
            select: {
                id: true,
                title: true,
                employerId: true,
                applicationDeadline: true,
            }
        })

        if (!opportunity) {
            return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
        }

        // Check if deadline has passed
        if (opportunity.applicationDeadline < new Date()) {
            return NextResponse.json({ error: "Application deadline has passed" }, { status: 400 })
        }

        // Get all students who have already applied
        const existingApplications = await prisma.application.findMany({
            where: { opportunityId },
            select: { studentId: true }
        })
        const appliedStudentIds = new Set(existingApplications.map(a => a.studentId))

        // Get matched students who are eligible (not placed, not already applied, accepted or pending)
        const whereClause: any = {
            opportunityId,
            studentRel: {
                placed: false
            },
            status: { in: ["pending", "accepted"] }
        }

        // If specific studentIds are provided, filter by them
        if (studentIds.length > 0) {
            whereClause.studentId = { in: studentIds }
        }

        const matchedStudents = await prisma.matchedStudent.findMany({
            where: whereClause,
            include: {
                studentRel: {
                    select: {
                        id: true,
                        name: true,
                        resumes: {
                            orderBy: { uploadedAt: "desc" },
                            take: 1,
                            select: { id: true }
                        }
                    }
                }
            }
        })

        // Filter out students who already applied
        const eligibleStudents = matchedStudents.filter(m => !appliedStudentIds.has(m.studentId))

        if (eligibleStudents.length === 0) {
            return NextResponse.json({ 
                message: "No eligible students to apply", 
                appliedCount: 0 
            }, { status: 200 })
        }

        // Create applications for each eligible student
        const applications = []
        const notifications = []

        for (const match of eligibleStudents) {
            const resumeId = match.studentRel.resumes[0]?.id

            // Create application (without resume if student doesn't have one)
            applications.push({
                studentId: match.studentId,
                opportunityId,
                resumeId: resumeId || null,
                coverLetter: `Application submitted by Placement Cell on behalf of ${match.studentRel.name}`,
            })
        }

        // Bulk create applications
        const createdApplications = await prisma.application.createMany({
            data: applications,
            skipDuplicates: true,
        })

        // Create notification for employer
        await prisma.notification.create({
            data: {
                employerId: opportunity.employerId,
                title: "Bulk Applications Received",
                message: `${createdApplications.count} new applications have been submitted by Placement Cell for: ${opportunity.title}`,
                redirectUrl: `/company/applications/${opportunity.id}`,
                type: "new_application",
            }
        })

        // Update matched student statuses to reflect they've been applied
        await prisma.matchedStudent.updateMany({
            where: {
                opportunityId,
                studentId: { in: eligibleStudents.map(s => s.studentId) }
            },
            data: {
                status: "accepted"
            }
        })

        return NextResponse.json({ 
            message: `Successfully applied ${createdApplications.count} students to the opportunity`,
            appliedCount: createdApplications.count 
        }, { status: 200 })

    } catch (error) {
        console.error("Error applying students:", error)
        return NextResponse.json({ error: "Failed to apply students" }, { status: 500 })
    }
}

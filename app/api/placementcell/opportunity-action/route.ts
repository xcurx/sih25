import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user?.id || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { opportunityId, action, reason } = await req.json();

    if (!opportunityId || !action) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (action !== "approve" && action !== "reject") {
        return NextResponse.json({ message: "Invalid action. Must be 'approve' or 'reject'" }, { status: 400 });
    }

    try {
        // Get the opportunity first
        const existingOpportunity = await prisma.opportunity.findUnique({
            where: { id: opportunityId },
            include: {
                companyRel: true,
                employerRel: true
            }
        });

        if (!existingOpportunity) {
            return NextResponse.json({ message: "Opportunity not found" }, { status: 404 });
        }

        if (existingOpportunity.status !== "draft") {
            return NextResponse.json({ message: "Opportunity is not in draft status" }, { status: 400 });
        }

        if (action === "approve") {
            // Update opportunity status to active
            const opportunity = await prisma.opportunity.update({
                where: { id: opportunityId },
                data: { status: "active" }
            });

            // Create notifications for all students about the new opportunity
            const students = await prisma.student.findMany({
                select: { id: true }
            });

            if (students.length > 0) {
                await prisma.notification.createMany({
                    data: students.map(student => ({
                        studentId: student.id,
                        title: "New Opportunity",
                        message: `New opportunity has been arrived: ${opportunity.title}`,
                        type: "new_opportunity"
                    }))
                });
            }

            // Send notification to employer about approval
            await prisma.notification.create({
                data: {
                    employerId: existingOpportunity.employerId,
                    title: "Job Posting Approved",
                    message: `Your job posting "${opportunity.title}" has been approved and is now visible to students.`,
                    type: "new_opportunity",
                    redirectUrl: `/internships`
                }
            });

            // Add job to recommendation engine
            try {
                axios.post(`${process.env.RECOMMENDATION_API_URL}/api/jobs`, {
                    id: opportunity.id,
                    title: opportunity.title,
                    description: opportunity.description,
                    type: opportunity.type,
                    location: opportunity.location,
                    status: opportunity.status,
                    salary: opportunity.salary,
                    requirements: opportunity.requirements,
                    eligibleDepartments: opportunity.eligibleDepartments,
                    skillsRequired: opportunity.skillsRequired,
                    additionalInfo: opportunity.additionalInfo
                });
            } catch (error) {
                console.error('Failed to add job to recommendation engine:', error);
                // Don't fail the whole request if recommendation engine is down
            }

            return NextResponse.json({ 
                message: "Opportunity approved successfully", 
                opportunity 
            }, { status: 200 });
        } else {
            // Reject the opportunity
            const opportunity = await prisma.opportunity.update({
                where: { id: opportunityId },
                data: { 
                    status: "rejected",
                    additionalInfo: reason 
                        ? `${existingOpportunity.additionalInfo || ''}\n\n[Rejection Reason]: ${reason}`.trim()
                        : existingOpportunity.additionalInfo
                }
            });

            // Send notification to employer about rejection
            await prisma.notification.create({
                data: {
                    employerId: existingOpportunity.employerId,
                    title: "Job Posting Rejected",
                    message: `Your job posting "${opportunity.title}" has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
                    type: "application_rejected",
                    redirectUrl: `/internships`
                }
            });

            return NextResponse.json({ 
                message: "Opportunity rejected", 
                opportunity 
            }, { status: 200 });
        }
    } catch (error) {
        console.error("Error processing opportunity action:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

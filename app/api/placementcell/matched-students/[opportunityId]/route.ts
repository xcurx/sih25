import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

interface CandidateStudent {
    id: string
    email: string
    name: string
    branch: string | null
    batch: number | null
    cgpa: number | null
    phone: string | null
    skills: string[]
}

export const GET = async (req: NextRequest, context: { params: Promise<{ opportunityId: string }> }) => {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { opportunityId } = await context.params

    try {
        // Get all students who have already applied for this opportunity
        const existingApplications = await prisma.application.findMany({
            where: { opportunityId },
            select: { studentId: true }
        })
        const appliedStudentIds = new Set(existingApplications.map(a => a.studentId))

        // First fetch existing matched students from DB (exclude placed and already applied)
        const existingMatches = await prisma.matchedStudent.findMany({
            where: { 
                opportunityId,
                studentRel: { 
                    placed: false 
                }
            },
            include: {
                studentRel: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        branch: true,
                        batch: true,
                        cgpa: true,
                        skills: true,
                        placed: true,
                    }
                }
            }
        })

        // Get the opportunity details for recommendation API
        const opportunity = await prisma.opportunity.findUnique({
            where: { id: opportunityId },
            select: {
                id: true,
                title: true,
                skillsRequired: true,
                eligibleDepartments: true,
                cgpa: true,
                type: true,
                location: true,
            }
        })

        if (!opportunity) {
            return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
        }

        // Call recommendation engine API to get candidate students for this opportunity
        let candidateStudents: CandidateStudent[] = []
        try {
            const res = await axios.get(`${process.env.RECOMMENDATION_API_URL}/api/opportunities/${opportunity.id}/students`)
            candidateStudents = res.data.candidates || []
        } catch (apiError) {
            console.error("Recommendation API error:", apiError)
            // Continue with existing matches if API fails
        }

        // Get student IDs that are already matched
        const existingStudentIds = new Set(existingMatches.map(m => m.studentId))

        // Filter new candidates to only include students not already matched, not placed, and not already applied
        const newStudentIds = candidateStudents
            .filter(s => !existingStudentIds.has(s.id) && !appliedStudentIds.has(s.id))
            .map(s => s.id)

        // Check which of these students are not placed
        const eligibleStudents = await prisma.student.findMany({
            where: {
                id: { in: newStudentIds },
                placed: false
            },
            select: { id: true }
        })
        const eligibleStudentIds = eligibleStudents.map(s => s.id)

        // Create new matches in DB if there are any
        if (eligibleStudentIds.length > 0) {
            await prisma.matchedStudent.createMany({
                data: eligibleStudentIds.map(studentId => ({
                    studentId,
                    opportunityId,
                    status: "pending"
                })),
                skipDuplicates: true,
            })
        }

        // Fetch all matched students (existing + new) - exclude placed students and those who already applied
        const allMatches = await prisma.matchedStudent.findMany({
            where: { 
                opportunityId,
                studentRel: {
                    placed: false
                },
                studentId: {
                    notIn: Array.from(appliedStudentIds)
                }
            },
            include: {
                studentRel: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        branch: true,
                        batch: true,
                        cgpa: true,
                        skills: true,
                        placed: true,
                    }
                }
            },
            orderBy: {
                studentRel: {
                    cgpa: 'desc'
                }
            }
        })

        // Combine with student data
        const matchedStudents = allMatches.map(match => ({
            id: match.id,
            studentId: match.studentId,
            opportunityId: match.opportunityId,
            status: match.status,
            emailSent: match.emailSent,
            student: match.studentRel,
        }))

        return NextResponse.json({ matchedStudents }, { status: 200 })
    } catch (error) {
        console.error("Error fetching matched students:", error)
        return NextResponse.json({ error: "Failed to fetch matched students" }, { status: 500 })
    }
}

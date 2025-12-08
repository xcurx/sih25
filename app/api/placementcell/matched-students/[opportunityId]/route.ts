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
        // First fetch existing matched students from DB
        const existingMatches = await prisma.matchedStudent.findMany({
            where: { opportunityId },
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

        // Filter new candidates to only include students not already matched
        const newStudentIds = candidateStudents
            .filter(s => !existingStudentIds.has(s.id))
            .map(s => s.id)

        // Create new matches in DB if there are any
        if (newStudentIds.length > 0) {
            await prisma.matchedStudent.createMany({
                data: newStudentIds.map(studentId => ({
                    studentId,
                    opportunityId,
                    status: "pending"
                })),
                skipDuplicates: true,
            })
        }

        // Fetch all matched students (existing + new)
        const allMatches = await prisma.matchedStudent.findMany({
            where: { opportunityId },
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

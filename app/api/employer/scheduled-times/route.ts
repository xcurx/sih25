import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
    const session = await auth()

    if (!session?.user || session.user.role !== "employer") { 
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Get all interviews scheduled by this employer that are not cancelled/completed
        const interviews = await prisma.interview.findMany({
            where: {
                applicationRel: {
                    opportunityRel: {
                        employerId: session.user.id,
                    },
                },
                status: "scheduled",
            },
            select: {
                id: true,
                scheduledAt: true,
                length: true,
                applicationRel: {
                    select: {
                        studentRel: {
                            select: {
                                name: true,
                            }
                        },
                        opportunityRel: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            },
        })

        // Transform the data to a simpler format
        const scheduledTimes = interviews.map(interview => ({
            id: interview.id,
            scheduledAt: interview.scheduledAt,
            length: interview.length ?? 30, // default 30 minutes
            studentName: interview.applicationRel.studentRel.name,
            opportunityTitle: interview.applicationRel.opportunityRel.title,
        }))

        return NextResponse.json({ scheduledTimes }, { status: 200 })
    } catch (error) {
        console.error("Error fetching scheduled times:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

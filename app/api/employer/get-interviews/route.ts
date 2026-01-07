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
        // Update any interviews that are past their scheduled time + length to completed
        const now = new Date();
        await prisma.interview.updateMany({
            where: {
                status: "scheduled",
                scheduledAt: {
                    lt: new Date(now.getTime() - 60 * 60 * 1000) // 1 hour buffer after scheduled time
                }
            },
            data: {
                status: "completed"
            }
        });

        const applications = await prisma.application.findMany({
            where: {
                opportunityRel: {
                    employerId: session.user.id,
                },
                status: { in: ["shortlisted", "rejected", "accepted"] },
            },
            include: {
                interviewRel: true,
                opportunityRel: {
                    include: {
                        companyRel: true,
                    }
                },
            },
        })

        return NextResponse.json({ applications }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
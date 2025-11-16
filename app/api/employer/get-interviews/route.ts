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
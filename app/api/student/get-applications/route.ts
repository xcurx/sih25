import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const GET = async (req: NextRequest) => {
    const session = await auth();

    if (session?.user.role && session?.user?.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const applications = await prisma.application.findMany({
            where: {
                studentId: session?.user.id
            },
            include: {
                resumeRel: {
                    select: {
                        id: true,
                        name: true,
                        resumeUrl: true,
                        uploadedAt: true,
                    },
                },
                opportunityRel: {
                    include: {
                        companyRel: true
                    }
                }
            },
            orderBy: {
                appliedAt: "desc"
            }
        })

        return NextResponse.json({ applications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const GET = async (req: NextRequest) => {
    const session = await auth();

    if (session?.user.role && session?.user?.role !== "employer") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // First get the user's company
        const employer = await prisma.employer.findUnique({
            where: { id: session?.user.id },
        })

        const applications = await prisma.application.findMany({
            where: { opportunityRel: { companyRel: { id: employer?.companyId } } },
            include: {
                studentRel: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        batch: true,
                        branch: true,
                        skills: true,
                    }
                },
                opportunityRel: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        })

        return NextResponse.json({ applications },{ status:200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }   
}

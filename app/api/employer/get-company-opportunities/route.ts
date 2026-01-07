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
        const employer = await prisma.employer.findUnique({
            where: { id: session?.user.id },
        })

        const opportunities = await prisma.opportunity.findMany({
            where: { companyId: employer?.companyId },
            include: {
                companyRel: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        applications: true
                    }
                }
            },
            orderBy: {
                postedAt: 'desc'
            }
        })

        return NextResponse.json({ opportunities },{ status:200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }   
}

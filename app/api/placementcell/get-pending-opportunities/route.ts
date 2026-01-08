import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const GET = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user?.id || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const opportunities = await prisma.opportunity.findMany({
            where: { status: { in: ['draft', 'rejected'] } },
            include: {
                companyRel: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                employerRel: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
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
        });

        return NextResponse.json({ opportunities }, { status: 200 });
    } catch (error) {
        console.error("Error fetching pending opportunities:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

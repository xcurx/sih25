import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
    const session = await auth();

    if (session?.user.role && session?.user?.role !== "placement-cell") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // First, update any expired active jobs to closed status
        await prisma.opportunity.updateMany({
            where: {
                status: "active",
                applicationDeadline: {
                    lt: new Date()
                }
            },
            data: {
                status: "closed"
            }
        });

        const opportunities = await prisma.opportunity.findMany({
            where: {
                status: { in: ['active', 'closed'] }
            },
            include: { 
                companyRel: true, 
                employerRel: true,
                _count: {
                    select: {
                        applications: true,
                    }
                }
            },
            orderBy: {
                postedAt: 'desc'
            }
        })
    
        return NextResponse.json({ opportunities }, { status: 200 });
    } catch (error) {
        console.error("Error fetching opportunities:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
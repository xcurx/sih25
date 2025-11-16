import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const GET = async (req: NextRequest) => {
    const session = await auth();

    if (session?.user.role && session?.user?.role === "employer") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        if (session?.user?.role === "student") {
            const opportunities = await prisma.opportunity.findMany({
                include: { 
                    companyRel: true, 
                    employerRel: true,
                    applications: {
                        where: {
                            studentId: session?.user?.id
                        },
                        select: {
                            id: true
                        }
                    },
                    _count: {
                        select: {
                            applications: true,
                        }
                    }
                },
                take: 20, 
            })
        
            const opportunitiesWithApplied = opportunities.map(opportunity => ({
                ...opportunity,
                applied: opportunity.applications.length > 0,
                applications: undefined
            }))
        
            return NextResponse.json({ opportunities: opportunitiesWithApplied }, { status: 200 });
        } else {
            const opportunities = await prisma.opportunity.findMany({
                include: { 
                    companyRel: true, 
                    employerRel: true,
                    _count: {
                        select: {
                            applications: true,
                        }
                    }
                },
                take: 20, 
            })
        
            return NextResponse.json({ opportunities }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
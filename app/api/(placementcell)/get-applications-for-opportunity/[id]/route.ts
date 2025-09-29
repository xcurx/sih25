import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const GET = async (req: NextRequest, context: { params: Promise<{ id:string }> }) => {
    const session = await auth();

    if (session?.user.role && session?.user?.role === "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ message: "Opportunity ID is required" }, { status: 400 });
    }

    try {
        const applications = await prisma.application.findMany({
            where: { opportunityId: id },
            include: {
                studentRel: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        batch: true,
                        branch: true,
                    }
                }
            }
        })

        return NextResponse.json({ applications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }    
}
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (req: NextRequest, context: { params: Promise<{ id:string }> }) => {
    const session = await auth();

    if (!session?.user || session?.user.role !== "placement-cell") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        if (!id) {
            return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
        }

        const applications = await prisma.application.findMany({
            where: { studentId: id },
            select: {
                id: true,
                status: true,
                appliedAt: true,
                coverLetter: true,
                mentorApproved: true,
                mentorRemarks: true,
                opportunityRel: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        type: true,
                        location: true,
                        salary: true,
                        skillsRequired: true,
                        postedAt: true,
                        applicationDeadline: true,
                        companyRel: {
                            select: {
                                id: true,
                                name: true,
                                website: true,
                                description: true,
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({ applications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
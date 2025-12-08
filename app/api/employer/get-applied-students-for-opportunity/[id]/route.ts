import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const session = await auth();

    if (!session || session.user.role !== "employer") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        const applications = await prisma.application.findMany({
            where: { opportunityId: id },
            select: {
                id: true,
                status: true,
                studentRel: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        batch: true,
                        branch: true,
                        cgpa: true,
                        resumes: {
                            orderBy: { uploadedAt: "desc" },
                            select: {
                                id: true,
                                name: true,
                                resumeUrl: true,
                                uploadedAt: true,
                            },
                        },
                        phone: true,
                        skills: true,
                    }
                }
            },
        })

        return NextResponse.json({ applications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

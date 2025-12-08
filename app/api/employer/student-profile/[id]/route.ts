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
        const student = await prisma.student.findUnique({
            where: { id },
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
        });

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        return NextResponse.json({ student }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

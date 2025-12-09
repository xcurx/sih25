import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const GET = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user || (session.user.role !== "placement-cell" && session.user.role !== "faculty")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const isFaculty = session.user.role === "faculty"
        const students = await prisma.student.findMany({
            where: isFaculty ? { mentorId: session.user.id } : undefined,
            select: {
                id: true,
                name: true,
                email: true,
                batch: true,
                branch: true,
                cgpa: true,
                github: true,
                linkedin: true,
                mentorId: true,
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
                applications: true,
            },
            take: isFaculty ? undefined : 20,
        })

        return NextResponse.json({ students }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch students", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

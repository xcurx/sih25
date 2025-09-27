import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
    const session = await auth();

    if (!session?.user?.role || session?.user?.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const student = await prisma.student.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                branch: true,
                batch: true,
                skills: true,
                cgpa: true,
            }
        })
    
        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
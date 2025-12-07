import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
    const session = await auth();

    if (!session || (session.user.role != "student" && session.user.role != "employer" && session.user.role != "faculty")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                OR: [
                    { studentId: session.user.id },
                    { employerId: session.user.id },
                    { facultyId: session.user.id }
                ]
            }
        });

        return NextResponse.json({ notifications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
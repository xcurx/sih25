import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
    const session = await auth()

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const certificates = await prisma.certificate.findMany({
            where: { studentId: session.user.id },
        })

        return NextResponse.json({ message: "Certificate uploaded successfully", certificates })
    } catch (error) {
        return NextResponse.json({ error: "Failed to upload certificate" }, { status: 500 })
    }
}
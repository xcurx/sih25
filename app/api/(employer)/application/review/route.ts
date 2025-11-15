import { auth } from "@/auth";
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const PATCH = async (req: NextRequest) => {
    const session = await auth()

    if (!session || session.user.role !== "employer") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { apId } = await req.json()

        if (!apId) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const ap = await prisma.application.update({
            where: {
                id: apId
            },
            data: {
                status: "reviewed"
            }
        })

        return NextResponse.json({ application: ap }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&  error.code == "P2025") {
            return NextResponse.json({ message: "Application not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
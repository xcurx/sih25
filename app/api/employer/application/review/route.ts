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

        // Check if student is already placed
        const existingApplication = await prisma.application.findUnique({
            where: { id: apId },
            include: {
                studentRel: {
                    select: { placed: true }
                }
            }
        })

        if (!existingApplication) {
            return NextResponse.json({ message: "Application not found" }, { status: 404 });
        }

        if (existingApplication.studentRel.placed) {
            return NextResponse.json(
                { message: "Cannot proceed with this application. The student has already been placed." },
                { status: 403 }
            );
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
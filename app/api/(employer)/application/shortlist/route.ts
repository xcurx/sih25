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

        const now = new Date();
        const daysAhead = Math.floor(Math.random() * 30) + 10; // 0-29 days within one month
        const scheduled = new Date(now);
        scheduled.setDate(scheduled.getDate() + daysAhead);
        const hour = 12 + Math.floor(Math.random() * 4); // 12-15 (12pm - 4pm exclusive)
        const minute = Math.floor(Math.random() * 60);
        scheduled.setHours(hour, minute, 0, 0);

        const interview = await prisma.interview.create({
            data: {
                applicationId: apId,
                scheduledAt: scheduled,
                interviewLink: "https://meet.example.com/" + apId
            }
        })

        const ap = await prisma.application.update({
            where: {
                id: apId
            },
            data: {
                status: "shortlisted"
            }
        })

        return NextResponse.json({ application: ap, interview }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&  error.code == "P2025") {
            return NextResponse.json({ message: "Application not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
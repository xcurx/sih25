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
        const { apId, interviewDate } = await req.json()

        if (!apId) {
            return NextResponse.json({ message: "Missing application ID" }, { status: 400 });
        }

        if (!interviewDate) {
            return NextResponse.json({ message: "Missing interview date" }, { status: 400 });
        }

        // parse the interview date and set a random time between 12pm-4pm
        const scheduled = new Date(interviewDate);
        const hour = 12 + Math.floor(Math.random() * 4); // 12-15 (12pm - 4pm exclusive)
        const minute = Math.floor(Math.random() * 60);
        scheduled.setHours(hour, minute, 0, 0);

        console.log("Scheduling interview for application ID:", apId, "at", scheduled);

        const interview = await prisma.interview.create({
            data: {
                applicationId: apId,
                scheduledAt: scheduled,
                interviewLink: "https://meet.example.com/" + apId
            }
        })
        console.log("Interview created:", interview);

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
        console.error("Shortlist API Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Error Code:", error.code);
            console.error("Prisma Error Meta:", error.meta);
            if (error.code === "P2025") {
                return NextResponse.json({ message: "Application not found" }, { status: 404 });
            }
            if (error.code === "P2002") {
                return NextResponse.json({ message: "Interview already exists for this application" }, { status: 409 });
            }
        }
        return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
    }
}
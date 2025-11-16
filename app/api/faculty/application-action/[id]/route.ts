import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const PATCH = async (req: NextRequest, context: { params: Promise<{ id:string }> }) => {
    const session = await auth();

    if (!session || session.user.role !== "faculty") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        const { action, remarks } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "Invalid application ID" }, { status: 400 });
        }

        if (action !== "approve" && action !== "reject") {
            return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        const application = await prisma.application.update({
            where: { id },
            data: {
                status: action === "approve" ? "applied" : "rejected",
                mentorRemarks: remarks,
                mentorApproved: action === "approve" ? true : false,
            }
        })

        return NextResponse.json({ message: "Application updated successfully", application }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const PATCH = async (request: NextRequest) => {
    const session = await auth();

    if (!session || (session.user.role != "student" && session.user.role != "employer" && session.user.role != "faculty")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { notificationIds } = await request.json();

        if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
            return NextResponse.json({ message: "No notification IDs provided" }, { status: 400 });
        }

        await prisma.notification.updateMany({
            where: {
                id: { in: notificationIds }
            },
            data: {
                isRead: true
            }
        });

        return NextResponse.json({ message: "Notifications marked as read" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
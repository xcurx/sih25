import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const POST = async (request: NextRequest) => {
    const session = await auth();
    
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { skills } = await request.json();

    if (skills) {
        if (!Array.isArray(skills) || !skills.every((skill) => typeof skill === "string")) {
            return NextResponse.json({ message: "Invalid skills format" }, { status: 400 });
        }

        if (skills.length == 0) {
            return NextResponse.json({ message: "Empty skills array" }, { status: 400 });
        }
    }

    console.log("Updating skills for user:", session.user, "with skills:", skills);

    try {
        const updatesUser = await prisma.student.update({
            where: { id: session.user.id },
            data: { skills },
        });
        
        return NextResponse.json({ message: "Skills updated successfully", user: updatesUser }, { status: 200 });
    } catch (error) {
        // console.error("Error updating skills:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
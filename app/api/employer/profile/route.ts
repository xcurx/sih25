import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const GET = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user?.id || session?.user?.role !== "employer") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const employer = await prisma.employer.findUnique({
            where: { id: session.user.id },
            include: {
                companyRel: true
            }
        });

        if (!employer) {
            return NextResponse.json({ message: "Employer not found" }, { status: 404 });
        }

        return NextResponse.json({ employer }, { status: 200 });
    } catch (error) {
        console.error("Error fetching employer profile:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

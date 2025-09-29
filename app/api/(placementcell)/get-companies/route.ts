import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const GET = async (req: NextRequest) => {
    const session = await auth();

    if (session?.user.role && session?.user?.role !== "placement-cell") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const companies = await prisma.company.findMany({
        include: { employees: true },
        take: 20, 
    })

    return NextResponse.json({ companies });
}
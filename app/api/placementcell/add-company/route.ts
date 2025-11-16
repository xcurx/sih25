import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (session?.user.role && session?.user?.role !== "placement-cell") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
        name,
        description,
        website,
        industry,
        type,
        location
    } = await req.json();

    if (!name || !description) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        const company = await prisma.company.create({
            data: {
                name,
                description,
                website,
                industry,
                type,
                location
            }
        })

        return NextResponse.json({ company }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
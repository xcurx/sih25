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
        email,
        name,
        companyId,
        position,
        linkedin,
    } = await req.json();

    if (!email || !name || !companyId) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        const company = await prisma.company.findUnique({
            where: {
                id: companyId
            }
        });

        if (!company) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        const employee = await prisma.employer.create({
            data: {
                email,
                name,
                password: name + "@123", // Default password, should be changed by the employer
                position,
                linkedin,
                companyId: companyId
            }
        })

        return NextResponse.json({ employee }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
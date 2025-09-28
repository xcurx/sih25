import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { isStringArray } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (session?.user.role && session?.user?.role !== "placement-cell") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
        title,
        description,
        type,
        location,
        salary,
        applicationDeadline,
        requirements,
        eligibleDepartments,
        skillsRequired,
        additionalInfo,
        employerId,
        companyId
    } = await req.json();

    if (!title || !description || !type || !location || !salary || !applicationDeadline || !requirements || !eligibleDepartments || !skillsRequired || !employerId || !companyId) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (isStringArray(eligibleDepartments)) {
        if (eligibleDepartments.length === 0) {
            return NextResponse.json({ message: "Eligible departments cannot be empty" }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "Eligible departments must be an array of strings" }, { status: 400 });
    }

    if (isStringArray(skillsRequired)) {
        if (skillsRequired.length === 0) {
            return NextResponse.json({ message: "Skills required cannot be empty" }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "Skills required must be an array of strings" }, { status: 400 });
    }

    try {
        const opportunity = await prisma.opportunity.create({
            data: {
                title,
                description,
                type,
                location,
                salary,
                applicationDeadline: new Date(applicationDeadline),
                requirements,
                eligibleDepartments,
                skillsRequired,
                additionalInfo,
                employerId,
                companyId
            }
        })
    
        return NextResponse.json({ message: "Opportunity created successfully", opportunity }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { isStringArray } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user?.id || session?.user?.role !== "employer") {
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
    } = await req.json();

    if (!title || !description || !type || !location || !salary || !applicationDeadline || !requirements || !eligibleDepartments || !skillsRequired) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (requirements && !isStringArray(requirements)) {
        return NextResponse.json({ message: "Requirements must be an array of strings" }, { status: 400 });
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
        // Get employer's company
        const employer = await prisma.employer.findUnique({
            where: { id: session.user.id },
            select: { companyId: true }
        });

        if (!employer) {
            return NextResponse.json({ message: "Employer not found" }, { status: 404 });
        }

        // Create opportunity with draft status
        const opportunity = await prisma.opportunity.create({
            data: {
                title,
                description,
                type,
                location,
                salary,
                status: "draft", // Employers create opportunities as drafts for review
                applicationDeadline: new Date(applicationDeadline),
                requirements,
                eligibleDepartments,
                skillsRequired,
                additionalInfo,
                employerId: session.user.id,
                companyId: employer.companyId,
                startDate: new Date(applicationDeadline), // Default start date
                endDate: new Date(new Date(applicationDeadline).setMonth(new Date(applicationDeadline).getMonth() + 6)), // Default end date 6 months after
            }
        });
    
        return NextResponse.json({ message: "Opportunity submitted for review", opportunity }, { status: 200 });
    } catch (error) {
        console.log((error as Error).message)
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}

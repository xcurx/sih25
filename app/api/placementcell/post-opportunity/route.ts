import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { isStringArray } from "@/lib/utils";
import axios from "axios";
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
        const opportunity = await prisma.opportunity.create({
            data: {
                title,
                description,
                type,
                location,
                salary,
                status: "active",
                applicationDeadline: new Date(applicationDeadline),
                requirements,
                eligibleDepartments,
                skillsRequired,
                additionalInfo,
                employerId,
                companyId,
                startDate: "2026-06-28T15:52:12.803Z",
                endDate: "2026-12-28T15:52:12.803Z",
            }
        })

        try {
            await axios.post(`${process.env.RECOMMENDATION_API_URL}/jobs/add`, {
                id: opportunity.id,
                title: opportunity.title,
                description: opportunity.description,
                type: opportunity.type,
                location: opportunity.location,
                status: opportunity.status,
                salary: opportunity.salary,
                requirements: opportunity.requirements,
                eligibleDepartments: opportunity.eligibleDepartments,
                skillsRequired: opportunity.skillsRequired,
                additionalInfo: opportunity.additionalInfo
            })
        } catch (error) {
            console.error('Failed to add job to recommendation engine:', error)
            // Don't fail the whole request if recommendation engine is down
        }
    
        return NextResponse.json({ message: "Opportunity created successfully", opportunity }, { status: 200 });
    } catch (error) {
        console.log((error as Error).message)
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
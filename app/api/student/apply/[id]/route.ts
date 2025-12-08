import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const session = await auth();

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const { coverLetter } = await req.json();

    try {
        const opportunity = await prisma.opportunity.findUnique({
            where: { id }
        })

        if (!opportunity) {
            return NextResponse.json({ message: "Opportunity not found" }, { status: 404 });
        }

        const existingApplication = await prisma.application.findFirst({
            where: {
                studentId: session.user.id,
                opportunityId: id,
            }
        })

        if (existingApplication) {
            return NextResponse.json({ message: "You have already applied for this opportunity" }, { status: 400 });
        }

        if (opportunity.applicationDeadline < new Date()) {
            return NextResponse.json({ message: "The application deadline has passed" }, { status: 400 });
        }

        const application = await prisma.application.create({
            data: {
                studentId: session.user.id,
                opportunityId: id,
                coverLetter,
            }
        })

        const notification = await prisma.notification.create({
            data: {
                employerId: opportunity.employerId,
                title: "New Application Received",
                message: `A new application has been submitted for your opportunity: ${opportunity.title}`,
                redirectUrl: `/company/applications/${opportunity.id}`,
                type: "new_application",
            }
        })

        return NextResponse.json({ message: "Application submitted successfully", application }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
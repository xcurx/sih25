import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const PATCH = async (req: NextRequest, context: { params: Promise<{ id:string }> }) => {
    const session = await auth();

    if (!session || session.user.role !== "faculty") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        const { action, remarks } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "Invalid application ID" }, { status: 400 });
        }

        if (action !== "approve" && action !== "reject") {
            return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        // Check if student is already placed
        const existingApplication = await prisma.application.findUnique({
            where: { id },
            include: {
                studentRel: {
                    select: { placed: true }
                }
            }
        })

        if (!existingApplication) {
            return NextResponse.json({ message: "Application not found" }, { status: 404 });
        }

        if (existingApplication.studentRel.placed) {
            return NextResponse.json(
                { message: "Cannot proceed with this application. The student has already been placed." },
                { status: 403 }
            );
        }

        const application = await prisma.application.update({
            where: { id },
            data: {
                status: action === "approve" ? "applied" : "rejected",
                mentorRemarks: remarks,
                mentorApproved: action === "approve" ? true : false,
            },
            include: {
                opportunityRel: true
            }
        })

        const notification = await prisma.notification.create({
            data: {
                studentId: application.studentId,
                title: action === "approve" ? "Application Approved" : "Application Rejected",
                message: action === "approve"
                    ? "Your application has been approved by the faculty mentor."
                    : `Your application has been rejected by the faculty mentor. Remarks: ${remarks || "No remarks provided."}`,
                redirectUrl: `/applications/${application.id}`,
                type: action === "approve" ? "approval_accepted" : "approval_rejected"
            }
        })

        if (action === "approve") {
            await prisma.notification.create({
                data: {
                    employerId: application.opportunityRel.employerId,
                    title: "New Application Received",
                    message: `A new application has been submitted for your opportunity "${application.opportunityRel.title}".`,
                    redirectUrl: `/employer/applications/${application.id}`,
                    type: "new_application"
                }
            })
        }

        return NextResponse.json({ message: "Application updated successfully", application }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
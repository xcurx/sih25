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

    let body: { coverLetter?: string; resumeId?: string } = {};
    try {
        body = await req.json();
    } catch {
        // ignore empty body
    }

    const { coverLetter, resumeId } = body;

    if (!resumeId || typeof resumeId !== "string") {
        return NextResponse.json({ message: "Please select a resume before applying" }, { status: 400 });
    }

    try {
        const [opportunity, student, resume] = await Promise.all([
            prisma.opportunity.findUnique({
                where: { id }
            }),
            prisma.student.findUnique({
                where: { id: session.user.id },
                select: { cgpa: true, placed: true }
            }),
            prisma.resume.findFirst({
                where: { id: resumeId, studentId: session.user.id }
            })
        ])

        if (!opportunity) {
            return NextResponse.json({ message: "Opportunity not found" }, { status: 404 });
        }

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        // Check if student is already placed
        if (student.placed) {
            return NextResponse.json(
                { message: "You have already been placed and cannot apply for new opportunities" },
                { status: 403 }
            );
        }

        if (!resume) {
            return NextResponse.json({ message: "Selected resume not found" }, { status: 404 });
        }

        if (opportunity.cgpa !== null && opportunity.cgpa !== undefined) {
            const studentCgpa = student?.cgpa ?? 0;
            if (studentCgpa < opportunity.cgpa) {
                return NextResponse.json(
                    { message: `Minimum CGPA of ${opportunity.cgpa} is required to apply` },
                    { status: 400 }
                );
            }
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
                resumeId: resume.id,
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

import { auth } from "@/auth";
import { interviewScheduledTemplate } from "@/components/mail/mailTemplate";
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { client } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type CreateMeetPayload = {
    applicationId: string;
    studentEmail: string;
    studentName: string;
    recruiterEmail?: string | null;
    recruiterName?: string | null;
    opportunityTitle: string;
    companyName: string;
    startIso: string;
    endIso: string;
    durationMinutes: number;
    timezone: string;
    notes?: string;
};

type CreateMeetResponse = {
    meetLink: string;
    eventId?: string;
    htmlLink?: string;
};

async function createMeetWithAppsScript(payload: CreateMeetPayload): Promise<CreateMeetResponse> {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
    if (!scriptUrl) {
        console.warn("GOOGLE_APPS_SCRIPT_WEB_APP_URL is not configured, falling back to placeholder meeting link.");
        return {
            meetLink: `https://meet.google.com/lookup/${payload.applicationId}`,
        };
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };

    const response = await fetch(scriptUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
            studentEmail: payload.studentEmail,
            interviewerEmail: payload.recruiterEmail || "recruiter@example.com",
            startDate: payload.startIso,
            endDate: payload.endIso,
            duration: String(payload.durationMinutes),
            notes: payload.notes,
            opportunityTitle: payload.opportunityTitle,
            companyName: payload.companyName,
            applicationId: payload.applicationId,
            token: process.env.GOOGLE_APPS_SCRIPT_TOKEN,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Apps Script error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (data.status && data.status !== "success" && !String(data.status).includes("partial")) {
        throw new Error(data.message || "Apps Script responded with an error status.");
    }

    const meetLink =
        data.meetLink ||
        data.hangoutLink ||
        data.conferenceLink ||
        data.meet?.meetLink ||
        data.meet?.hangoutLink;

    if (!meetLink) {
        throw new Error("Apps Script response did not include a Meet link.");
    }

    return {
        meetLink,
        eventId: data.eventId || data.meet?.eventId,
        htmlLink: data.htmlLink || data.meet?.htmlLink,
    };
}

export const PATCH = async (req: NextRequest) => {
    const session = await auth();

    if (!session || session.user.role !== "employer") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { apId, interviewDateTime, interviewDate, interviewTime, timezone } = await req.json();

        if (!apId) {
            return NextResponse.json({ message: "Missing application ID" }, { status: 400 });
        }

        // Support the new payload (interviewDateTime) and remain backwards compatible.
        let scheduled: Date | null = null;
        if (interviewDateTime) {
            scheduled = new Date(interviewDateTime);
        } else if (interviewDate && interviewTime) {
            scheduled = new Date(`${interviewDate}T${interviewTime}`);
        }

        if (!scheduled || Number.isNaN(scheduled.getTime())) {
            return NextResponse.json({ message: "Missing or invalid interview date/time" }, { status: 400 });
        }

        const application = await prisma.application.findUnique({
            where: { id: apId },
            include: {
                studentRel: true,
                opportunityRel: {
                    include: {
                        companyRel: true,
                    },
                },
            },
        });

        if (!application) {
            return NextResponse.json({ message: "Application not found" }, { status: 404 });
        }

        const scheduledTimezone = typeof timezone === "string" && timezone.length > 0 ? timezone : "Asia/Kolkata";

        const durationMinutes = 45;
        const endTime = new Date(scheduled.getTime() + durationMinutes * 60000);

        const meetDetails = await createMeetWithAppsScript({
            applicationId: apId,
            studentEmail: application.studentRel.email,
            studentName: application.studentRel.name,
            recruiterEmail: session.user.email,
            recruiterName: session.user.name,
            opportunityTitle: application.opportunityRel.title,
            companyName: application.opportunityRel.companyRel?.name || "the company",
            startIso: scheduled.toISOString(),
            endIso: endTime.toISOString(),
            durationMinutes,
            timezone: scheduledTimezone,
            notes: `Created from shortlist flow by ${session.user.name || session.user.email}`,
        });

        const { interview, updatedApplication } = await prisma.$transaction(async (tx) => {
            const createdInterview = await tx.interview.create({
                data: {
                    applicationId: apId,
                    scheduledAt: scheduled,
                    interviewLink: meetDetails.meetLink,
                },
            });

            const updatedApp = await tx.application.update({
                where: {
                    id: apId,
                },
                data: {
                    status: "shortlisted",
                },
                include: {
                    studentRel: true,
                    opportunityRel: {
                        include: {
                            companyRel: true,
                        },
                    },
                },
            });

            await tx.notification.create({
                data: {
                    studentId: updatedApp.studentId,
                    title: "Interview Scheduled",
                    message: `Your application has been shortlisted. An interview is scheduled on ${scheduled.toLocaleString()}.`,
                    redirectUrl: `/interviews`,
                    type: "interview_scheduled",
                },
            });

            return { interview: createdInterview, updatedApplication: updatedApp };
        });

        client.send({
            to: [{ email: updatedApplication.studentRel.email, name: updatedApplication.studentRel.name }],
            from: { email: "cell@gmail.com", name: "Placement Cell" },
            subject: "Interview Scheduled for Your Application",
            html: interviewScheduledTemplate({
                companyName: updatedApplication.opportunityRel.companyRel?.name || "the company",
                opportunityTitle: updatedApplication.opportunityRel.title,
                interviewDate: scheduled.toLocaleDateString(),
                interviewTime: scheduled.toLocaleTimeString(),
                interviewLink: interview.interviewLink,
                studentName: updatedApplication.studentRel.name,
                applicationUrl: ""
            }),
        });

        return NextResponse.json({ application: updatedApplication, interview, meetDetails }, { status: 200 });
    } catch (error) {
        console.error("Shortlist API Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Error Code:", error.code);
            console.error("Prisma Error Meta:", error.meta);
            if (error.code === "P2025") {
                return NextResponse.json({ message: "Application not found" }, { status: 404 });
            }
            if (error.code === "P2002") {
                return NextResponse.json({ message: "Interview already exists for this application" }, { status: 409 });
            }
        }
        if (error instanceof Error && error.message.toLowerCase().includes("apps script")) {
            return NextResponse.json(
                { message: "Failed to create Google Meet", error: error.message },
                { status: 502 }
            );
        }
        return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
    }
};

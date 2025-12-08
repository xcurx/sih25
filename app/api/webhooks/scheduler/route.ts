// app/api/webhooks/scheduler/route.ts
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId, scheduledAt, interviewLink, interviewerEmail } = body;

    // Create or Update the Interview record
    const interview = await prisma.interview.upsert({
      where: { applicationId: applicationId },
      update: {
        scheduledAt: new Date(scheduledAt),
        interviewLink: interviewLink,
        interviewerDetails: interviewerEmail,
        status: 'scheduled'
      },
      create: {
        applicationId: applicationId,
        scheduledAt: new Date(scheduledAt),
        interviewLink: interviewLink,
        interviewerDetails: interviewerEmail,
        status: 'scheduled'
      }
    });

    return NextResponse.json({ success: true, interview });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, error: "Failed to store interview" }, { status: 500 });
  }
}
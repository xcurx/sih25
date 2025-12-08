import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  const { id } = await params;

  if (!session?.user || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [opportunity, student] = await Promise.all([
      prisma.opportunity.findUnique({
        where: { id },
        include: {
          companyRel: true,
          employerRel: {
            select: {
              id: true,
              name: true,
              position: true,
              email: true,
              linkedin: true,
            },
          },
          applications: {
            where: {
              studentId: session.user.id,
            },
            select: {
              id: true,
              status: true,
              appliedAt: true,
              resumeRel: {
                select: {
                  id: true,
                  name: true,
                  resumeUrl: true,
                  uploadedAt: true,
                },
              },
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.student.findUnique({
        where: { id: session.user.id },
        select: { cgpa: true },
      }),
    ]);

    if (!opportunity) {
      return NextResponse.json(
        { message: "Opportunity not found" },
        { status: 404 }
      );
    }

    const userApplicationRecord = opportunity.applications[0];
    const { applications, ...baseOpportunity } = opportunity;

    const opportunityWithApplied = {
      ...baseOpportunity,
      applied: Boolean(userApplicationRecord),
      userApplication: userApplicationRecord
        ? {
            id: userApplicationRecord.id,
            status: userApplicationRecord.status,
            appliedAt: userApplicationRecord.appliedAt,
            resume: userApplicationRecord.resumeRel ?? undefined,
          }
        : null,
    };

    return NextResponse.json(
      { opportunity: opportunityWithApplied, studentCgpa: student?.cgpa ?? null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

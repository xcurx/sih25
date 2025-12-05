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

  if (!session?.user || session.user.role !== "placement-cell") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const opportunity = await prisma.opportunity.findUnique({
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
          include: {
            studentRel: {
              select: {
                id: true,
                name: true,
                email: true,
                branch: true,
                batch: true,
                cgpa: true,
              },
            },
            interviewRel: {
              select: {
                id: true,
                status: true,
                scheduledAt: true,
              },
            },
          },
          orderBy: {
            appliedAt: 'desc',
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { message: "Opportunity not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const stats = {
      total: opportunity.applications.length,
      shortlisted: opportunity.applications.filter(a => a.status === 'shortlisted').length,
      interviewed: opportunity.applications.filter(a => a.interviewRel).length,
      accepted: opportunity.applications.filter(a => a.status === 'accepted').length,
      rejected: opportunity.applications.filter(a => a.status === 'rejected').length,
      pending: opportunity.applications.filter(a => ['applied', 'reviewed', 'mentor_approval_needed'].includes(a.status)).length,
    };

    return NextResponse.json({ opportunity, stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

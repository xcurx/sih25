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
          where: {
            studentId: session.user.id,
          },
          select: {
            id: true,
            status: true,
            appliedAt: true,
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

    const opportunityWithApplied = {
      ...opportunity,
      applied: opportunity.applications.length > 0,
      userApplication: opportunity.applications[0] || null,
      applications: undefined,
    };

    return NextResponse.json({ opportunity: opportunityWithApplied }, { status: 200 });
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

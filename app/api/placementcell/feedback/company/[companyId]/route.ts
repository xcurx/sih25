import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Get all feedbacks for a specific company across all opportunities
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ companyId: string }> }
) => {
  const session = await auth();

  if (!session || session.user.role !== "placement-cell") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await context.params;

  try {
    // Verify the company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    // Get all feedbacks for internships from opportunities of this company
    const feedbacks = await prisma.feedback.findMany({
      where: {
        internshipRel: {
          opportunityRel: {
            companyId: companyId,
          },
        },
      },
      include: {
        studentRel: {
          select: {
            id: true,
            name: true,
            email: true,
            branch: true,
            batch: true,
          },
        },
        internshipRel: {
          include: {
            studentRel: {
              select: {
                id: true,
                name: true,
                email: true,
                branch: true,
                batch: true,
              },
            },
            opportunityRel: {
              select: {
                id: true,
                title: true,
                type: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ feedbacks, company }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company feedbacks:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

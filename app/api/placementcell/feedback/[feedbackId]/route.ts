import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Get a single feedback with full details
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ feedbackId: string }> }
) => {
  const session = await auth();

  if (!session || session.user.role !== "placement-cell") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { feedbackId } = await context.params;

  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        studentRel: {
          select: {
            id: true,
            name: true,
            email: true,
            branch: true,
            batch: true,
            cgpa: true,
            phone: true,
            linkedin: true,
            github: true,
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
                cgpa: true,
              },
            },
            opportunityRel: {
              include: {
                companyRel: true,
                employerRel: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    position: true,
                  },
                },
              },
            },
            certificateRel: true,
          },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ feedback }, { status: 200 });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

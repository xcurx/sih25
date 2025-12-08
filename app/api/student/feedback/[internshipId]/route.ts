import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Get feedback for a specific internship
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ internshipId: string }> }
) => {
  const session = await auth();

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { internshipId } = await context.params;

  try {
    // Verify the internship belongs to the student
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return NextResponse.json(
        { message: "Internship not found" },
        { status: 404 }
      );
    }

    if (internship.studentId !== session.user.id) {
      return NextResponse.json(
        { message: "You can only view feedback for your own internships" },
        { status: 403 }
      );
    }

    const feedback = await prisma.feedback.findFirst({
      where: {
        internshipId,
        studentId: session.user.id,
      },
      include: {
        internshipRel: {
          include: {
            opportunityRel: {
              include: {
                companyRel: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ feedback }, { status: 200 });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

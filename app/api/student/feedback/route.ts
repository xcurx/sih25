import { auth } from "@/auth";
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST - Create a new feedback for an internship
export const POST = async (req: NextRequest) => {
  const session = await auth();

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { internshipId, feedbackText, description } = body;

    if (!internshipId || !feedbackText || !description) {
      return NextResponse.json(
        { message: "internshipId, feedbackText, and description are required" },
        { status: 400 }
      );
    }

    // Verify the internship belongs to the student
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        opportunityRel: true,
      },
    });

    if (!internship) {
      return NextResponse.json(
        { message: "Internship not found" },
        { status: 404 }
      );
    }

    if (internship.studentId !== session.user.id) {
      return NextResponse.json(
        { message: "You can only add feedback for your own internships" },
        { status: 403 }
      );
    }

    // Check if feedback already exists for this internship by this student
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        internshipId,
        studentId: session.user.id,
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { message: "You have already submitted feedback for this internship" },
        { status: 400 }
      );
    }

    // Create the feedback
    const feedback = await prisma.feedback.create({
      data: {
        internshipId,
        studentId: session.user.id,
        feedbackText,
        description,
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
            opportunityRel: {
              include: {
                companyRel: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully", feedback },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating feedback:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "Database error", error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

// GET - Get all feedbacks by the current student
export const GET = async (req: NextRequest) => {
  const session = await auth();

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { studentId: session.user.id },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

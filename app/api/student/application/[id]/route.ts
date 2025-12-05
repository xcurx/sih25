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
    const application = await prisma.application.findUnique({
      where: {
        id,
        studentId: session.user.id, // Ensure the student can only access their own applications
      },
      include: {
        opportunityRel: {
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
          },
        },
        interviewRel: true,
        intership: {
          include: {
            certificateRel: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

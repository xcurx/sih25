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
    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        applicationRel: {
          include: {
            studentRel: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    // Ensure the student can only access their own interviews
    if (interview.applicationRel.studentRel.id !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ interview }, { status: 200 });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};

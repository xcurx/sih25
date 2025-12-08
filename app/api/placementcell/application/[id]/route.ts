import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user?.role !== "placement-cell" && session.user?.role !== "faculty")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        studentRel: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            branch: true,
            batch: true,
            cgpa: true,
            resumes: {
              orderBy: { uploadedAt: "desc" },
              select: {
                id: true,
                name: true,
                resumeUrl: true,
                uploadedAt: true,
              },
            },
            skills: true,
            github: true,
            linkedin: true,
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
        interviewRel: true,
        intership: {
          include: {
            certificateRel: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ application }, { status: 200 })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

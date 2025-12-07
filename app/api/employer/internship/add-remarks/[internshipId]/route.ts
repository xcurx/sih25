import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ internshipId: string }> }
) => {
  const session = await auth()

  if (!session?.user || session.user.role !== "employer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { internshipId } = await params

  try {
    const { remarks } = await req.json()

    if (!remarks || typeof remarks !== "string") {
      return NextResponse.json({ error: "Remarks are required" }, { status: 400 })
    }

    // Verify the internship belongs to an opportunity created by this employer
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        opportunityRel: true,
      },
    })

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 })
    }

    if (internship.opportunityRel.employerId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to add remarks for this internship" }, { status: 403 })
    }

    // Check if internship has ended
    if (new Date(internship.endDate) > new Date()) {
      return NextResponse.json({ error: "Cannot add remarks before internship ends" }, { status: 400 })
    }

    // Update internship with employer remarks
    const updatedInternship = await prisma.internship.update({
      where: { id: internshipId },
      data: { employerRemarks: remarks },
    })

    return NextResponse.json({
      message: "Remarks saved successfully",
      internship: updatedInternship,
    })
  } catch (error) {
    console.error("Error saving remarks:", error)
    return NextResponse.json({ error: "Failed to save remarks" }, { status: 500 })
  }
}

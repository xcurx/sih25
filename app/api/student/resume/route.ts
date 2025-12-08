import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"
import { deleteFromCloudinary, getPublicIdFromUrl } from "../../upload/route"

const prisma = new PrismaClient()

const unauthorized = NextResponse.json({ error: "Unauthorized" }, { status: 401 })

export const GET = async () => {
  const session = await auth()

  if (!session || session.user.role !== "student") {
    return unauthorized
  }

  try {
    const resumes = await prisma.resume.findMany({
      where: { studentId: session.user.id },
      orderBy: { uploadedAt: "desc" },
    })

    return NextResponse.json({ resumes })
  } catch (error) {
    console.error("Failed to fetch resumes:", error)
    return NextResponse.json({ error: "Failed to get resumes" }, { status: 500 })
  }
}

const generateUniqueName = async (studentId: string, desired?: string) => {
  const baseName = (desired ?? "Resume").trim() || "Resume"
  let candidate = baseName
  let suffix = 1

  while (true) {
    const exists = await prisma.resume.findFirst({
      where: { studentId, name: candidate },
      select: { id: true },
    })
    if (!exists) return candidate
    candidate = `${baseName} (${suffix++})`
  }
}

export const POST = async (request: Request) => {
  const session = await auth()

  if (!session || session.user.role !== "student") {
    return unauthorized
  }

  try {
    const { url, name } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Resume URL is required" }, { status: 400 })
    }

    const uniqueName = await generateUniqueName(session.user.id, name)

    const resume = await prisma.resume.create({
      data: {
        studentId: session.user.id,
        resumeUrl: url,
        name: uniqueName,
      },
    })

    return NextResponse.json({ resume })
  } catch (error) {
    console.error("Failed to upload resume:", error)
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 })
  }
}

export const DELETE = async (request: Request) => {
  const session = await auth()

  if (!session || session.user.role !== "student") {
    return unauthorized
  }

  try {
    const { resumeId } = await request.json()

    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 })
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        studentId: session.user.id,
      },
    })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    const publicId = getPublicIdFromUrl(resume.resumeUrl)
    if (publicId) {
      const result = await deleteFromCloudinary(publicId)
      if (!result.success) {
        console.error("Failed to delete resume from Cloudinary", result.error)
        return NextResponse.json({ error: "Failed to delete resume from storage" }, { status: 500 })
      }
    }

    await prisma.resume.delete({ where: { id: resume.id } })

    return NextResponse.json({ message: "Resume deleted successfully", resumeId })
  } catch (error) {
    console.error("Failed to delete resume:", error)
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 })
  }
}
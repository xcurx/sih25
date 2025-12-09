import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

const roleHandlers = {
  "placement-cell": {
    find: (id: string) =>
      prisma.placmentCell.findUnique({ where: { id }, select: { id: true, password: true } }),
    update: (id: string, password: string) =>
      prisma.placmentCell.update({ where: { id }, data: { password } }),
  },
  student: {
    find: (id: string) => prisma.student.findUnique({ where: { id }, select: { id: true, password: true } }),
    update: (id: string, password: string) => prisma.student.update({ where: { id }, data: { password } }),
  },
  faculty: {
    find: (id: string) => prisma.faculty.findUnique({ where: { id }, select: { id: true, password: true } }),
    update: (id: string, password: string) => prisma.faculty.update({ where: { id }, data: { password } }),
  },
  employer: {
    find: (id: string) => prisma.employer.findUnique({ where: { id }, select: { id: true, password: true } }),
    update: (id: string, password: string) => prisma.employer.update({ where: { id }, data: { password } }),
  },
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Current and new passwords are required" }, { status: 400 })
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
  }

  if (newPassword === currentPassword) {
    return NextResponse.json({ message: "New password must be different from current password" }, { status: 400 })
  }

  try {
    const handler = roleHandlers[session.user.role]

    if (!handler) {
      return NextResponse.json({ message: "Unsupported account type" }, { status: 400 })
    }

    const existingUser = await handler.find(session.user.id)

    if (!existingUser) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 })
    }

    if (existingUser.password !== currentPassword) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    await handler.update(session.user.id, newPassword)

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Password change failed:", error)
    return NextResponse.json({ message: "Failed to update password" }, { status: 500 })
  }
}

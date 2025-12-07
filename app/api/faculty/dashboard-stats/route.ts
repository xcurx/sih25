import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export const GET = async () => {
  const session = await auth()

  if (!session || session.user.role !== "faculty") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const facultyId = session.user.id

    const studentsCount = await prisma.student.count({
      where: {
        mentorId: facultyId,
      },
    })

    const pendingApprovalsCount = await prisma.application.count({
      where: {
        status: "mentor_approval_needed",
        studentRel: {
          mentorId: facultyId,
        },
      },
    })

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    const interviewsThisWeek = await prisma.interview.count({
      where: {
        scheduledAt: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
        applicationRel: {
          studentRel: {
            mentorId: facultyId,
          },
        },
      },
    })

    const totalApplications = await prisma.application.count({
      where: {
        studentRel: {
          mentorId: facultyId,
        },
      },
    })

    const acceptedApplications = await prisma.application.count({
      where: {
        status: "accepted",
        studentRel: {
          mentorId: facultyId,
        },
      },
    })

    const placementRate = totalApplications > 0 
      ? Math.round((acceptedApplications / totalApplications) * 100) 
      : 0

    const placedStudents = await prisma.student.count({
      where: {
        mentorId: facultyId,
        applications: {
          some: {
            status: "accepted",
          },
        },
      },
    })

    const inProcessStudents = await prisma.student.count({
      where: {
        mentorId: facultyId,
        applications: {
          some: {
            status: {
              in: ["applied", "reviewed", "shortlisted", "mentor_approval_needed"],
            },
          },
          none: {
            status: "accepted",
          },
        },
      },
    })

    const notAppliedStudents = await prisma.student.count({
      where: {
        mentorId: facultyId,
        applications: {
          none: {},
        },
      },
    })

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const monthlyData = []
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(sixMonthsAgo)
      monthStart.setMonth(sixMonthsAgo.getMonth() + i)

      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthStart.getMonth() + 1)

      const applications = await prisma.application.count({
        where: {
          appliedAt: {
            gte: monthStart,
            lt: monthEnd,
          },
          studentRel: {
            mentorId: facultyId,
          },
        },
      })

      const placements = await prisma.application.count({
        where: {
          status: "accepted",
          appliedAt: {
            gte: monthStart,
            lt: monthEnd,
          },
          studentRel: {
            mentorId: facultyId,
          },
        },
      })

      const monthName = monthStart.toLocaleString("default", { month: "short" })
      monthlyData.push({
        name: monthName,
        applications,
        placements,
      })
    }

    return NextResponse.json({
      stats: {
        studentsCount,
        pendingApprovalsCount,
        placementRate,
        interviewsThisWeek,
      },
      pieData: {
        placed: placedStudents,
        inProcess: inProcessStudents,
        notApplied: notAppliedStudents,
      },
      chartData: monthlyData,
    })
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return NextResponse.json(
      { message: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}

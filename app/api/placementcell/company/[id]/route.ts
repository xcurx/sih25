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
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            linkedin: true,
          },
        },
        opportunities: {
          include: {
            applications: {
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
              },
            },
          },
          orderBy: {
            postedAt: "desc",
          },
        },
      },
    })

    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 })
    }

    // Calculate stats
    const totalOpportunities = company.opportunities.length
    const activeOpportunities = company.opportunities.filter((o: { status: string }) => o.status === "active").length
    const totalApplications = company.opportunities.reduce(
      (acc: number, o: { applications: unknown[] }) => acc + o.applications.length,
      0
    )
    const acceptedApplications = company.opportunities.reduce(
      (acc: number, o: { applications: { status: string }[] }) =>
        acc + o.applications.filter((a: { status: string }) => a.status === "accepted").length,
      0
    )
    const pendingApplications = company.opportunities.reduce(
      (acc: number, o: { applications: { status: string }[] }) =>
        acc + o.applications.filter((a: { status: string }) => a.status === "applied" || a.status === "reviewed" || a.status === "shortlisted").length,
      0
    )

    const stats = {
      totalOpportunities,
      activeOpportunities,
      totalApplications,
      acceptedApplications,
      pendingApplications,
      recruiters: company.employees.length,
    }

    return NextResponse.json({ company, stats })
  } catch (error) {
    console.error("Error fetching company:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

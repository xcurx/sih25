import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export const GET = async () => {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Get counts in parallel
        const [
            activeJobsCount,
            totalStudentsCount,
            partnerCompaniesCount,
            totalApplicationsCount,
            acceptedApplicationsCount,
            thisWeekJobsCount,
        ] = await Promise.all([
            // Active jobs count
            prisma.opportunity.count({
                where: { status: "active" }
            }),
            // Total students count
            prisma.student.count(),
            // Partner companies count
            prisma.company.count(),
            // Total applications count
            prisma.application.count(),
            // Accepted applications count (placed students)
            prisma.application.count({
                where: { status: "accepted" }
            }),
            // Jobs posted this week
            prisma.opportunity.count({
                where: {
                    postedAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),
        ])

        // Calculate placement rate
        const placementRate = totalApplicationsCount > 0 
            ? Math.round((acceptedApplicationsCount / totalStudentsCount) * 100) 
            : 0

        return NextResponse.json({
            stats: {
                activeJobs: activeJobsCount,
                activeJobsChange: thisWeekJobsCount > 0 ? `+${thisWeekJobsCount} this week` : "No new jobs this week",
                totalStudents: totalStudentsCount,
                partnerCompanies: partnerCompaniesCount,
                placementRate: `${placementRate}%`,
                placedStudents: acceptedApplicationsCount,
            }
        }, { status: 200 })
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
    }
}

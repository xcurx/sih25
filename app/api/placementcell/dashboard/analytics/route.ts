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
        // Get data for the last 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        // Fetch applications grouped by month
        const applications = await prisma.application.findMany({
            where: {
                appliedAt: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                appliedAt: true,
                status: true,
            }
        })

        // Group by month
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const chartData: { name: string; applications: number; placements: number }[] = []

        // Create array for last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthName = monthNames[date.getMonth()]
            const year = date.getFullYear()
            const month = date.getMonth()

            const monthApplications = applications.filter(app => {
                const appDate = new Date(app.appliedAt)
                return appDate.getMonth() === month && appDate.getFullYear() === year
            })

            const totalApps = monthApplications.length
            const placements = monthApplications.filter(app => app.status === "accepted").length

            chartData.push({
                name: monthName,
                applications: totalApps,
                placements: placements,
            })
        }

        return NextResponse.json({ chartData }, { status: 200 })
    } catch (error) {
        console.error("Error fetching analytics:", error)
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }
}

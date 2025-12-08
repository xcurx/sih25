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
        // Get companies with their placement counts (accepted applications)
        const companies = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                opportunities: {
                    select: {
                        applications: {
                            where: { status: "accepted" },
                            select: { id: true }
                        }
                    }
                }
            }
        })

        // Calculate placement count for each company
        const companiesWithPlacements = companies.map(company => {
            const placementCount = company.opportunities.reduce((total, opp) => {
                return total + opp.applications.length
            }, 0)
            return {
                id: company.id,
                name: company.name,
                placementCount,
            }
        })

        // Sort by placement count descending and take top 5
        const topRecruiters = companiesWithPlacements
            .sort((a, b) => b.placementCount - a.placementCount)
            .slice(0, 5)

        return NextResponse.json({ topRecruiters }, { status: 200 })
    } catch (error) {
        console.error("Error fetching top recruiters:", error)
        return NextResponse.json({ error: "Failed to fetch top recruiters" }, { status: 500 })
    }
}

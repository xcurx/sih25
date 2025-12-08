import { auth } from "@/auth"
import { PrismaClient, ApplicationStatus } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

interface JobPipeline {
    id: string
    title: string
    totalApplications: number
    applied: number
    reviewed: number
    shortlisted: number
    rejected: number
    accepted: number
}

export const GET = async () => {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "employer") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employerId = session.user.id

    try {
        // Get all active opportunities with application counts by status
        const opportunities = await prisma.opportunity.findMany({
            where: { 
                employerId,
                status: "active"
            },
            include: {
                applications: {
                    select: {
                        status: true
                    }
                }
            },
            orderBy: {
                postedAt: "desc"
            },
            take: 5
        })

        const pipelineData: JobPipeline[] = opportunities.map(opp => {
            const statusCounts = {
                applied: 0,
                reviewed: 0,
                shortlisted: 0,
                rejected: 0,
                accepted: 0
            }

            opp.applications.forEach((app: { status: ApplicationStatus }) => {
                if (app.status in statusCounts) {
                    statusCounts[app.status as keyof typeof statusCounts]++
                }
            })

            return {
                id: opp.id,
                title: opp.title,
                totalApplications: opp.applications.length,
                ...statusCounts
            }
        })

        return NextResponse.json({ pipeline: pipelineData }, { status: 200 })
    } catch (error) {
        console.error("Error fetching pipeline data:", error)
        return NextResponse.json({ error: "Failed to fetch pipeline data" }, { status: 500 })
    }
}

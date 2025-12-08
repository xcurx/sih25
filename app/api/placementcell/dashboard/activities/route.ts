import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

interface Activity {
    id: string
    type: "job_posted" | "application" | "interview" | "placement"
    title: string
    description: string
    timestamp: Date
}

export const GET = async () => {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Fetch recent data in parallel
        const [recentJobs, recentApplications, recentInterviews, recentPlacements] = await Promise.all([
            // Recent job postings
            prisma.opportunity.findMany({
                take: 5,
                orderBy: { postedAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    postedAt: true,
                    companyRel: {
                        select: { name: true }
                    }
                }
            }),
            // Recent applications
            prisma.application.findMany({
                take: 5,
                orderBy: { appliedAt: "desc" },
                select: {
                    id: true,
                    appliedAt: true,
                    studentRel: {
                        select: { name: true }
                    },
                    opportunityRel: {
                        select: { title: true }
                    }
                }
            }),
            // Recent interviews
            prisma.interview.findMany({
                take: 5,
                orderBy: { scheduledAt: "desc" },
                select: {
                    id: true,
                    scheduledAt: true,
                    applicationRel: {
                        select: {
                            studentRel: { select: { name: true } },
                            opportunityRel: { 
                                select: { 
                                    title: true,
                                    companyRel: { select: { name: true } }
                                } 
                            }
                        }
                    }
                }
            }),
            // Recent placements (accepted applications)
            prisma.application.findMany({
                take: 5,
                where: { status: "accepted" },
                orderBy: { appliedAt: "desc" },
                select: {
                    id: true,
                    appliedAt: true,
                    studentRel: {
                        select: { name: true }
                    },
                    opportunityRel: {
                        select: { 
                            title: true,
                            companyRel: { select: { name: true } }
                        }
                    }
                }
            }),
        ])

        // Combine and format activities
        const activities: Activity[] = []

        recentJobs.forEach(job => {
            activities.push({
                id: `job-${job.id}`,
                type: "job_posted",
                title: "New job posted",
                description: `${job.companyRel.name} - ${job.title}`,
                timestamp: job.postedAt,
            })
        })

        recentApplications.forEach(app => {
            activities.push({
                id: `app-${app.id}`,
                type: "application",
                title: "Student applied",
                description: `${app.studentRel.name} applied for ${app.opportunityRel.title}`,
                timestamp: app.appliedAt,
            })
        })

        recentInterviews.forEach(interview => {
            activities.push({
                id: `interview-${interview.id}`,
                type: "interview",
                title: "Interview scheduled",
                description: `${interview.applicationRel.studentRel.name} - ${interview.applicationRel.opportunityRel.companyRel.name}`,
                timestamp: interview.scheduledAt,
            })
        })

        recentPlacements.forEach(placement => {
            activities.push({
                id: `placement-${placement.id}`,
                type: "placement",
                title: "Student placed",
                description: `${placement.studentRel.name} at ${placement.opportunityRel.companyRel.name}`,
                timestamp: placement.appliedAt,
            })
        })

        // Sort by timestamp descending and take top 10
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        const topActivities = activities.slice(0, 10)

        return NextResponse.json({ activities: topActivities }, { status: 200 })
    } catch (error) {
        console.error("Error fetching recent activities:", error)
        return NextResponse.json({ error: "Failed to fetch recent activities" }, { status: 500 })
    }
}

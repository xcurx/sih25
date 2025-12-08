import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export const GET = async () => {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "employer") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employerId = session.user.id

    try {
        // Get employer's company
        const employer = await prisma.employer.findUnique({
            where: { id: employerId },
            select: { companyId: true }
        })

        if (!employer) {
            return NextResponse.json({ error: "Employer not found" }, { status: 404 })
        }

        // Get counts in parallel
        const [
            activeJobsCount,
            totalApplicationsCount,
            interviewsScheduledCount,
            offersCount,
            shortlistedCount,
            thisWeekApplicationsCount,
        ] = await Promise.all([
            // Active jobs count for this employer
            prisma.opportunity.count({
                where: { 
                    employerId,
                    status: "active" 
                }
            }),
            // Total applications for employer's opportunities
            prisma.application.count({
                where: {
                    opportunityRel: { employerId }
                }
            }),
            // Interviews scheduled
            prisma.interview.count({
                where: {
                    applicationRel: {
                        opportunityRel: { employerId }
                    },
                    status: "scheduled"
                }
            }),
            // Offers made (accepted applications)
            prisma.application.count({
                where: {
                    opportunityRel: { employerId },
                    status: "accepted"
                }
            }),
            // Shortlisted candidates
            prisma.application.count({
                where: {
                    opportunityRel: { employerId },
                    status: "shortlisted"
                }
            }),
            // Applications this week
            prisma.application.count({
                where: {
                    opportunityRel: { employerId },
                    appliedAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),
        ])

        return NextResponse.json({
            stats: {
                activeJobs: activeJobsCount,
                totalApplications: totalApplicationsCount,
                interviewsScheduled: interviewsScheduledCount,
                offers: offersCount,
                shortlisted: shortlistedCount,
                thisWeekApplications: thisWeekApplicationsCount,
            }
        }, { status: 200 })
    } catch (error) {
        console.error("Error fetching employer dashboard stats:", error)
        return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
    }
}

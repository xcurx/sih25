import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { isStringArray } from "@/lib/utils"
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

interface JobData {
    title: string
    description: string
    type: string
    location: string
    salary?: string
    applicationDeadline: string
    cgpa?: number
    requirements?: string[]
    eligibleDepartments: string[]
    skillsRequired: string[]
    additionalInfo?: string
    startDate?: string
    endDate?: string
    employerId: string
    companyId: string
    status?: "active" | "draft" | "closed"
}

interface BulkResult {
    success: { title: string; id: string; companyId: string }[]
    failed: { title: string; error: string }[]
}

export async function POST(req: NextRequest) {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { jobs, sendNotifications = true }: { jobs: JobData[]; sendNotifications?: boolean } = await req.json()

        if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
            return NextResponse.json(
                { error: "Jobs array is required and must not be empty" },
                { status: 400 }
            )
        }

        if (jobs.length > 100) {
            return NextResponse.json(
                { error: "Maximum 100 jobs can be posted at once" },
                { status: 400 }
            )
        }

        const result: BulkResult = {
            success: [],
            failed: [],
        }

        // Validate all employer and company IDs upfront
        const employerIds = [...new Set(jobs.map((j) => j.employerId))]
        const companyIds = [...new Set(jobs.map((j) => j.companyId))]

        const existingEmployers = await prisma.employer.findMany({
            where: { id: { in: employerIds } },
            select: { id: true, companyId: true },
        })
        const existingEmployerMap = new Map(existingEmployers.map((e) => [e.id, e.companyId]))

        const existingCompanies = await prisma.company.findMany({
            where: { id: { in: companyIds } },
            select: { id: true },
        })
        const existingCompanyIds = new Set(existingCompanies.map((c) => c.id))

        // Process each job
        const createdOpportunities: { id: string; title: string; description: string; type: string; location: string; status: string; salary?: string | null; requirements: string[]; eligibleDepartments: string[]; skillsRequired: string[]; additionalInfo?: string | null }[] = []

        for (const jobData of jobs) {
            const {
                title,
                description,
                type,
                location,
                salary,
                applicationDeadline,
                cgpa,
                requirements,
                eligibleDepartments,
                skillsRequired,
                additionalInfo,
                startDate,
                endDate,
                employerId,
                companyId,
                status = "active",
            } = jobData

            // Validate required fields
            if (!title || !description || !type || !location || !applicationDeadline || !employerId || !companyId) {
                result.failed.push({
                    title: title || "unknown",
                    error: "Missing required fields (title, description, type, location, applicationDeadline, employerId, companyId)",
                })
                continue
            }

            // Validate employer exists
            if (!existingEmployerMap.has(employerId)) {
                result.failed.push({
                    title,
                    error: `Employer with ID ${employerId} does not exist`,
                })
                continue
            }

            // Validate company exists
            if (!existingCompanyIds.has(companyId)) {
                result.failed.push({
                    title,
                    error: `Company with ID ${companyId} does not exist`,
                })
                continue
            }

            // Validate eligibleDepartments
            if (!eligibleDepartments || !isStringArray(eligibleDepartments) || eligibleDepartments.length === 0) {
                result.failed.push({
                    title,
                    error: "Eligible departments must be a non-empty array of strings",
                })
                continue
            }

            // Validate skillsRequired
            if (!skillsRequired || !isStringArray(skillsRequired) || skillsRequired.length === 0) {
                result.failed.push({
                    title,
                    error: "Skills required must be a non-empty array of strings",
                })
                continue
            }

            // Validate requirements if provided
            if (requirements && !isStringArray(requirements)) {
                result.failed.push({
                    title,
                    error: "Requirements must be an array of strings",
                })
                continue
            }

            // Validate deadline date
            const deadlineDate = new Date(applicationDeadline)
            if (isNaN(deadlineDate.getTime())) {
                result.failed.push({
                    title,
                    error: "Invalid applicationDeadline date format",
                })
                continue
            }

            try {
                // Set default dates if not provided
                const jobStartDate = startDate ? new Date(startDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                const jobEndDate = endDate ? new Date(endDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days from now

                const opportunity = await prisma.opportunity.create({
                    data: {
                        title,
                        description,
                        type,
                        location,
                        salary: salary || null,
                        status,
                        applicationDeadline: deadlineDate,
                        cgpa: cgpa || null,
                        requirements: requirements || [],
                        eligibleDepartments,
                        skillsRequired,
                        additionalInfo: additionalInfo || null,
                        employerId,
                        companyId,
                        startDate: jobStartDate,
                        endDate: jobEndDate,
                    },
                })

                result.success.push({
                    title: opportunity.title,
                    id: opportunity.id,
                    companyId: opportunity.companyId,
                })

                createdOpportunities.push({
                    id: opportunity.id,
                    title: opportunity.title,
                    description: opportunity.description,
                    type: opportunity.type,
                    location: opportunity.location,
                    status: opportunity.status,
                    salary: opportunity.salary,
                    requirements: opportunity.requirements,
                    eligibleDepartments: opportunity.eligibleDepartments,
                    skillsRequired: opportunity.skillsRequired,
                    additionalInfo: opportunity.additionalInfo,
                })
            } catch (error) {
                result.failed.push({
                    title,
                    error: `Database error: ${(error as Error).message}`,
                })
            }
        }

        // Send notifications to students if enabled and there are successful creations
        if (sendNotifications && result.success.length > 0) {
            try {
                const students = await prisma.student.findMany({
                    select: { id: true },
                })

                if (students.length > 0) {
                    const notificationMessage = result.success.length === 1
                        ? `New opportunity has been posted: ${result.success[0].title}`
                        : `${result.success.length} new opportunities have been posted`

                    await prisma.notification.createMany({
                        data: students.map((student) => ({
                            studentId: student.id,
                            title: "New Opportunities",
                            message: notificationMessage,
                            type: "new_opportunity",
                        })),
                    })
                }
            } catch (error) {
                console.error("Failed to send notifications:", error)
                // Don't fail the request if notifications fail
            }
        }

        // Add jobs to recommendation engine
        if (createdOpportunities.length > 0 && process.env.RECOMMENDATION_API_URL) {
            try {
                for (const opportunity of createdOpportunities) {
                    await axios.post(`${process.env.RECOMMENDATION_API_URL}/api/jobs`, {
                        id: opportunity.id,
                        title: opportunity.title,
                        description: opportunity.description,
                        type: opportunity.type,
                        location: opportunity.location,
                        status: opportunity.status,
                        salary: opportunity.salary,
                        requirements: opportunity.requirements,
                        eligibleDepartments: opportunity.eligibleDepartments,
                        skillsRequired: opportunity.skillsRequired,
                        additionalInfo: opportunity.additionalInfo,
                    })
                }
            } catch (error) {
                console.error("Failed to add jobs to recommendation engine:", error)
                // Don't fail the request if recommendation engine is down
            }
        }

        return NextResponse.json(
            {
                message: `Bulk job posting completed. ${result.success.length} succeeded, ${result.failed.length} failed.`,
                result,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Bulk job posting error:", error)
        return NextResponse.json(
            { error: "Internal server error", details: (error as Error).message },
            { status: 500 }
        )
    }
}

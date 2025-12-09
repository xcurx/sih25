import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export const GET = async () => {
    const session = await auth()

    if (!session?.user || (session?.user?.role !== "placement-cell" && session?.user?.role !== "faculty")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const now = new Date()
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

        // ============= KEY METRICS =============
        const [
            totalStudents,
            placedStudents,
            totalCompanies,
            totalOpportunities,
            totalApplications,
            totalInterviews,
            acceptedApplications,
        ] = await Promise.all([
            prisma.student.count(),
            prisma.student.count({ where: { placed: true } }),
            prisma.company.count(),
            prisma.opportunity.count(),
            prisma.application.count(),
            prisma.interview.count(),
            prisma.application.count({ where: { status: "accepted" } }),
        ])

        // Calculate placement rate
        const placementRate = totalStudents > 0 
            ? ((placedStudents / totalStudents) * 100).toFixed(1) 
            : "0"

        // Get average salary from opportunities with accepted applications
        const opportunitiesWithAccepted = await prisma.opportunity.findMany({
            where: {
                applications: {
                    some: { status: "accepted" }
                }
            },
            select: { salary: true }
        })
        
        const salaries = opportunitiesWithAccepted
            .map(o => parseFloat(o.salary || "0"))
            .filter(s => s > 0)
        
        const avgSalary = salaries.length > 0 
            ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
            : 0

        // ============= MONTHLY PLACEMENT DATA (Last 6 months) =============
        const applications = await prisma.application.findMany({
            where: {
                appliedAt: { gte: sixMonthsAgo }
            },
            include: {
                interviewRel: true,
                opportunityRel: {
                    select: { companyId: true }
                }
            }
        })

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const placementData: { month: string; applications: number; interviews: number; placements: number; companies: number }[] = []

        for (let i = 5; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthName = monthNames[date.getMonth()]
            const year = date.getFullYear()
            const month = date.getMonth()

            const monthApps = applications.filter(app => {
                const appDate = new Date(app.appliedAt)
                return appDate.getMonth() === month && appDate.getFullYear() === year
            })

            const monthInterviews = monthApps.filter(app => app.interviewRel).length
            const monthPlacements = monthApps.filter(app => app.status === "accepted").length
            const monthCompanies = new Set(monthApps.map(app => app.opportunityRel.companyId)).size

            placementData.push({
                month: monthName,
                applications: monthApps.length,
                interviews: monthInterviews,
                placements: monthPlacements,
                companies: monthCompanies,
            })
        }

        // ============= DEPARTMENT DATA =============
        const students = await prisma.student.findMany({
            select: {
                branch: true,
                placed: true,
            }
        })

        const departmentMap = new Map<string, { total: number; placed: number }>()
        
        students.forEach(student => {
            const branch = student.branch || "Unknown"
            if (!departmentMap.has(branch)) {
                departmentMap.set(branch, { total: 0, placed: 0 })
            }
            const dept = departmentMap.get(branch)!
            dept.total++
            if (student.placed) dept.placed++
        })

        const departmentData = Array.from(departmentMap.entries())
            .map(([name, data]) => ({
                name,
                students: data.total,
                placed: data.placed,
                percentage: data.total > 0 ? Math.round((data.placed / data.total) * 100) : 0
            }))
            .sort((a, b) => b.percentage - a.percentage)

        // ============= COMPANY DATA (Top Recruiters) =============
        const companies = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                industry: true,
                opportunities: {
                    select: {
                        salary: true,
                        applications: {
                            where: { status: "accepted" },
                            select: { id: true }
                        }
                    }
                }
            }
        })

        const companyData = companies
            .map(company => {
                const hires = company.opportunities.reduce((total, opp) => total + opp.applications.length, 0)
                const salaries = company.opportunities
                    .map(o => parseFloat(o.salary || "0"))
                    .filter(s => s > 0)
                const avgCompanySalary = salaries.length > 0 
                    ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) 
                    : 0
                
                return {
                    name: company.name,
                    hires,
                    avgSalary: avgCompanySalary,
                    type: company.industry || "Other"
                }
            })
            .filter(c => c.hires > 0)
            .sort((a, b) => b.hires - a.hires)
            .slice(0, 10)

        // ============= SALARY DISTRIBUTION =============
        const opportunitiesWithSalary = await prisma.opportunity.findMany({
            where: {
                applications: {
                    some: { status: "accepted" }
                }
            },
            select: { 
                salary: true,
                applications: {
                    where: { status: "accepted" },
                    select: { id: true }
                }
            }
        })

        const salaryRanges = {
            "0-3 LPA": 0,
            "3-5 LPA": 0,
            "5-8 LPA": 0,
            "8-12 LPA": 0,
            "12+ LPA": 0,
        }

        opportunitiesWithSalary.forEach(opp => {
            const salary = parseFloat(opp.salary || "0")
            const count = opp.applications.length
            
            if (salary < 300000) salaryRanges["0-3 LPA"] += count
            else if (salary < 500000) salaryRanges["3-5 LPA"] += count
            else if (salary < 800000) salaryRanges["5-8 LPA"] += count
            else if (salary < 1200000) salaryRanges["8-12 LPA"] += count
            else salaryRanges["12+ LPA"] += count
        })

        const salaryDistribution = [
            { range: "0-3 LPA", count: salaryRanges["0-3 LPA"], color: "#9ca3af" },
            { range: "3-5 LPA", count: salaryRanges["3-5 LPA"], color: "#94b8f2" },
            { range: "5-8 LPA", count: salaryRanges["5-8 LPA"], color: "#49cca1" },
            { range: "8-12 LPA", count: salaryRanges["8-12 LPA"], color: "#f97316" },
            { range: "12+ LPA", count: salaryRanges["12+ LPA"], color: "#22c55e" },
        ]

        // ============= SKILL DEMAND =============
        const activeOpportunities = await prisma.opportunity.findMany({
            where: { status: "active" },
            select: { skillsRequired: true }
        })

        const skillCount = new Map<string, number>()
        activeOpportunities.forEach(opp => {
            opp.skillsRequired.forEach(skill => {
                skillCount.set(skill, (skillCount.get(skill) || 0) + 1)
            })
        })

        const totalActiveOpps = activeOpportunities.length
        const skillDemand = Array.from(skillCount.entries())
            .map(([skill, jobs]) => ({
                skill,
                jobs,
                demand: totalActiveOpps > 0 ? Math.round((jobs / totalActiveOpps) * 100) : 0
            }))
            .sort((a, b) => b.demand - a.demand)
            .slice(0, 10)

        // ============= RESPONSE =============
        return NextResponse.json({
            keyMetrics: {
                placementRate: `${placementRate}%`,
                totalStudents,
                placedStudents,
                partnerCompanies: totalCompanies,
                avgSalary,
                totalApplications,
                totalInterviews,
            },
            placementData,
            departmentData,
            companyData,
            salaryDistribution,
            skillDemand,
        }, { status: 200 })
        
    } catch (error) {
        console.error("Error fetching analytics:", error)
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }
}

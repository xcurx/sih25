import { auth } from "@/auth"
import { Opportunity, PrismaClient, Status } from "@/lib/generated/prisma"
import axios, { AxiosError } from "axios"
import { NextResponse } from "next/server"

interface RecommendationResponse {
    job_id: string;
    score: number;
    job_type: string;
    location: string;
    composite_score: number;
    s_vec: number;
    s_skill: number;
    highlights: {
        skills: string[];
        department: string;
        batch: string;
        requirements: string[];
    }
}

interface RecommendedOpportunity {
    score: number;
    composite_score: number;
    s_vec: number;
    s_skill: number;
    highlights: {
        skills: string[];
        department: string;
        batch: string;
        requirements: string[];
    }
    opportunity: {
        id: string;
        title: string;
        type: string;
        applicationDeadline: Date;
        location: string;
        postedAt: Date;
        companyRel: {
            id: string;
            name: string;
        };
        skillsRequired: string[];
        employerRel: {
            id: string;
            name: string;
        };
        additionalInfo: string | null;
        description: string;
        salary: string | null;
        status: Status;
        eligibleDepartments: string[];
        requirements: string[];
        _count: {
            applications: number;
        };
    };
}
    

const prisma = new PrismaClient()

export const GET = async () => {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const student = await prisma.student.findUnique({
            where: { id: session?.user.id },
            select: {
                branch: true,
                batch: true,
                skills: true,
            }
        })

        if (!student) {
            return NextResponse.json({ error: "Student profile not found." }, { status: 404 })
        }

        const missingFields: string[] = []
        if (!student.branch) missingFields.push("branch")
        if (!student.batch) missingFields.push("batch")
        if (!student.skills || student.skills.length === 0) missingFields.push("skills")

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    error: `Please complete your profile (${missingFields.join(
                        ", "
                    )}) to receive recommendations.`,
                },
                { status: 400 }
            )
        }

        const res = await axios.post(`${process.env.RECOMMENDATION_API_URL}/api/recommendations`, {
            department: student.branch,
            batch: student.batch?.toString(),
            skills: student.skills ?? [],
        })

        console.log("Recommendations response:", res.data);

        const recommendations: RecommendationResponse[] = res.data.recommendations;

        const opportunities = await prisma.opportunity.findMany({
            where: {
                id: { in: recommendations.map((r) => r.job_id) }
            },
            select: {
                id: true,
                title: true,
                type: true,
                applicationDeadline: true,
                location: true,
                postedAt: true,
                companyRel: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                skillsRequired: true,
                employerRel: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                additionalInfo: true,
                description: true,
                salary: true,
                status: true,
                eligibleDepartments: true,
                requirements: true,
                _count: {
                    select: {
                        applications: true,
                    }
                }
            },
            orderBy: {
                postedAt: 'desc'
            },
            take: 20, 
        })

        const opportunityMap = new Map(opportunities.map((opp) => [opp.id, opp]))

        const recommendedOpportunities: RecommendedOpportunity[] = recommendations
            .map((rec) => {
                const opportunity = opportunityMap.get(rec.job_id)
                if (!opportunity) return null
                const { job_id, job_type, location, ...rest } = rec
                return {
                    ...rest,
                    opportunity,
                }
            })
            .filter((rec): rec is RecommendedOpportunity => rec !== null)

        return NextResponse.json(recommendedOpportunities, { status: 200 })
    } catch (error) {
        console.error("Student recommendations error:", error)
        if (axios.isAxiosError(error)) {
            const message = error.response?.data ?? error.message
            return NextResponse.json(
                { error: "Recommendation service failed", details: message },
                { status: error.response?.status || 502 }
            )
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

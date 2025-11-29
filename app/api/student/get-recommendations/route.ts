import { auth } from "@/auth"
import { Opportunity, PrismaClient } from "@/lib/generated/prisma"
import axios from "axios"
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
    opportunity: Opportunity;
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

        const res = await axios.post(`${process.env.RECOMMENDATION_API_URL}/api/recommendations`, {
            department: student?.branch,
            batch: student?.batch?.toString(),
            skills: student?.skills,
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

        const recommendedOpportunities: RecommendedOpportunity[] = recommendations.map((r:any, index:number) => {
            return {
                ...r, job_id: undefined, opportunity: opportunities[index], job_type: undefined, location: undefined
            }
        });

        return NextResponse.json( recommendedOpportunities, { status: 200 } )
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}
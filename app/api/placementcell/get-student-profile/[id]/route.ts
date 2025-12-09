import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (req: NextRequest, context: { params: Promise<{ id:string }> }) => {
    const session = await auth();

    if (!session?.user || (session?.user.role !== "placement-cell" && session?.user.role !== "faculty" && session?.user.role !== "employer")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        if (!id) {
            return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
        }

        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                applications: {
                    include: {
                        opportunityRel: {
                            include: {
                                companyRel: true,
                            },
                        },
                        interviewRel: true,
                    },
                    orderBy: {
                        appliedAt: 'desc',
                    },
                },
                internships: {
                    include: {
                        opportunityRel: {
                            include: {
                                companyRel: true,
                            },
                        },
                        certificateRel: true,
                    },
                },
                projects: true,
                certificates: true,
                resumes: {
                    orderBy: { uploadedAt: "desc" },
                },
            },
        })

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        // Calculate stats
        const stats = {
            totalApplications: student.applications.length,
            accepted: student.applications.filter(a => a.status === 'accepted').length,
            rejected: student.applications.filter(a => a.status === 'rejected').length,
            pending: student.applications.filter(a => ['applied', 'reviewed', 'shortlisted', 'mentor_approval_needed'].includes(a.status)).length,
            interviews: student.applications.filter(a => a.interviewRel).length,
            internships: student.internships.length,
        };

        return NextResponse.json({ student, stats }, { status: 200 });
    } catch (error) {
        console.error("Error fetching student:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

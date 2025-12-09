import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

const prima = new PrismaClient()

export const GET = async () => {
    const session = await auth();

    if (!session || session.user.role !== "faculty") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const applications = await prima.application.findMany({
            where: { 
                OR:[
                    { mentorApproved: true },
                    { status: "mentor_approval_needed" }
                ],
                studentRel : {
                    mentorId: session.user.id
                }
            },
            select: {
                id: true,
                status: true,
                appliedAt: true,
                coverLetter: true,
                mentorApproved: true,
                opportunityRel: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        salary: true,
                        type: true,
                        companyRel: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                studentRel: {
                   select: {
                        id: true,
                        name: true,
                        email: true,
                        branch: true,
                        batch: true,
                        phone: true,
                        skills: true,
                        placed: true,
                   }
                },
            }
        })

        return NextResponse.json({ applications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
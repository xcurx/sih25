import { auth } from "@/auth";
import { applicationRejectedTemplate, interviewAcceptedTemplate } from "@/components/mail/mailTemplate";
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { client } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const PATCH = async (req: NextRequest, context: { params: Promise<{ id:string }> }) => {
    const session = await auth()

    if (!session || session.user.role !== 'employer') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const { action } = await req.json();

        if (action !== 'cancelled' && action !== 'completed' && action !== 'rejected' && action !== 'accepted') {
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }

        const interview = await prisma.interview.findUnique({
            where: { id },
            include: {
                applicationRel: {
                    include: {
                        studentRel: {
                            select: {
                                id: true,
                                placed: true,
                            }
                        }
                    }
                }
            }
        })

        if (!interview) {
            return NextResponse.json({ message: "Interview not found" }, { status: 404 });
        }

        // Check if student is already placed
        if (interview.applicationRel.studentRel.placed) {
            return NextResponse.json(
                { message: "Cannot proceed with this action. The student has already been placed." },
                { status: 403 }
            );
        }

        if (interview?.status === 'canceled' || interview?.status === 'rejected' || interview?.status === 'accepted') {
            return NextResponse.json({ message: `Cannot ${action} an interview that is already ${interview?.status}` }, { status: 400 });
        }

        if (interview?.status !== 'completed' && (action === 'accepted' || action === 'rejected')) {
            return NextResponse.json({ message: `Cannot ${action} an interview that is not complete` }, { status: 400 });
        }

        if (interview?.scheduledAt as Date > new Date() && (action === 'completed')) {
            return NextResponse.json({ message: `Cannot complete an interview before its scheduled time` }, { status: 400 });
        }

        const updatedInterview = await prisma.interview.update({
            where: { id },
            data: { status: action },
            include: {
                applicationRel: {
                    include: {
                        opportunityRel: {
                            include:{
                                companyRel: {
                                    select: {
                                        name: true,
                                    }
                                }
                            } 
                        },
                        studentRel: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        })

        if (action === 'accepted' || action === 'rejected') {
            await prisma.application.update({
                where: { id: updatedInterview.applicationId },
                data: { status: action === 'accepted' ? action : action }
            })

            if (action === 'accepted') {
                // Mark the student as placed
                await prisma.student.update({
                    where: { id: updatedInterview.applicationRel.studentId },
                    data: { placed: true }
                })

                const internship = await prisma.internship.create({
                    data: {
                        studentId: updatedInterview.applicationRel.studentId,
                        opportunityId: updatedInterview.applicationRel.opportunityId,
                        applicationId: updatedInterview.applicationId,
                        endDate: updatedInterview.applicationRel.opportunityRel.endDate,
                        startDate: updatedInterview.applicationRel.opportunityRel.startDate,
                        salary: updatedInterview.applicationRel.opportunityRel.salary,
                    }
                })


                const notification = await prisma.notification.create({
                    data: {
                        studentId: updatedInterview.applicationRel.studentId,
                        title: "Interview Accepted",
                        message: `Congratulations! Your interview for the position of ${updatedInterview.applicationRel.opportunityRel.title} has been accepted. An intership offer has been given to you.`,
                        redirectUrl: `/internships`,
                        type: "internship_offer",
                    }
                })

                client.send({
                    to: [{email: updatedInterview.applicationRel.studentRel.email, name: updatedInterview.applicationRel.studentRel.name}],
                    from: {email: "cell@gmail.com", name: "Placement Cell"},
                    subject: "Interview Scheduled for Your Application",
                    html: interviewAcceptedTemplate({
                        companyName: updatedInterview.applicationRel.opportunityRel.companyRel?.name || "the company",
                        opportunityTitle: updatedInterview.applicationRel.opportunityRel.title,
                        studentName: updatedInterview.applicationRel.studentRel.name,
                        applicationUrl: "",
                        startDate: internship.startDate.toISOString(),
                        salary: internship.salary || "To be discussed"
                    })
                })
            } else {
                const notification = await prisma.notification.create({
                    data: {
                        studentId: updatedInterview.applicationRel.studentId,
                        title: "Interview Rejected",
                        message: `We regret to inform you that your interview for the position of ${updatedInterview.applicationRel.opportunityRel.title} has been rejected. We encourage you to apply for other opportunities.`,
                        redirectUrl: `/jobs`,
                        type: "application_rejected",
                    }
                })

                client.send({
                    to: [{email: updatedInterview.applicationRel.studentRel.email, name: updatedInterview.applicationRel.studentRel.name}],
                    from: {email: "cell@gmail.com", name: "Placement Cell"},
                    subject: "Interview Scheduled for Your Application",
                    html: applicationRejectedTemplate({
                        companyName: updatedInterview.applicationRel.opportunityRel.companyRel?.name || "the company",
                        opportunityTitle: updatedInterview.applicationRel.opportunityRel.title,
                        studentName: updatedInterview.applicationRel.studentRel.name,
                        jobsUrl: ""
                    })
                })
            }
        }

        return NextResponse.json({ message: `Interview ${action} successfully`, updatedInterview }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&  error.code == "P2025") {
            return NextResponse.json({ message: "Interview not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
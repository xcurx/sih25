import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { sendEmail } from "@/lib/mail"
import { matchedStudentTemplate } from "@/components/mail/matchedStudentTemplate"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

// Send emails to all pending matched students for an opportunity
export const POST = async (req: NextRequest, context: { params: Promise<{ opportunityId: string }> }) => {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { opportunityId } = await context.params

    try {
        // Get opportunity details
        const opportunity = await prisma.opportunity.findUnique({
            where: { id: opportunityId },
            include: {
                companyRel: {
                    select: { name: true }
                }
            }
        })

        if (!opportunity) {
            return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
        }

        // Get all pending matched students who haven't been emailed yet
        const pendingMatches = await prisma.matchedStudent.findMany({
            where: {
                opportunityId,
                status: "pending",
                emailSent: false, // Only send to those who haven't been emailed
            },
            include: {
                studentRel: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        if (pendingMatches.length === 0) {
            return NextResponse.json({ 
                message: "No pending students to email", 
                sentCount: 0 
            }, { status: 200 })
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
        const errors: string[] = []
        const successfulIds: string[] = []

        // Helper function to sleep
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

        // Send emails sequentially with delay to avoid rate limiting
        for (const match of pendingMatches) {
            if (!match.studentRel.email) {
                errors.push("no-email")
                continue
            }

            const acceptUrl = `${baseUrl}/api/student/matched-response/${match.id}/accept`
            const rejectUrl = `${baseUrl}/api/student/matched-response/${match.id}/reject`

            const emailHtml = matchedStudentTemplate({
                studentName: match.studentRel.name,
                opportunityTitle: opportunity.title,
                companyName: opportunity.companyRel?.name || "Company",
                location: opportunity.location,
                type: opportunity.type,
                salary: opportunity.salary?.toString(),
                deadline: new Date(opportunity.applicationDeadline).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
                description: opportunity.description || "",
                skillsRequired: opportunity.skillsRequired || [],
                acceptUrl,
                rejectUrl,
            })

            try {
                await sendEmail({
                    from: {
                        email: "placement@sih25.demomailtrap.co",
                        name: "Placement Portal",
                    },
                    to: [{ email: match.studentRel.email }],
                    subject: `✨ You've Been Matched: ${opportunity.title} at ${opportunity.companyRel?.name}`,
                    html: emailHtml,
                })

                successfulIds.push(match.id)
                console.log(`Email sent to ${match.studentRel.email} (${successfulIds.length}/${pendingMatches.length})`)
            } catch (emailError) {
                console.error(`Failed to send email to ${match.studentRel.email}:`, emailError)
                errors.push(match.studentRel.email)
            }

            // Wait 11 seconds before sending the next email to avoid rate limiting
            if (pendingMatches.indexOf(match) < pendingMatches.length - 1) {
                await sleep(11000)
            }
        }

        // Batch update all successfully sent emails
        if (successfulIds.length > 0) {
            await prisma.matchedStudent.updateMany({
                where: { id: { in: successfulIds } },
                data: { emailSent: true }
            })
        }

        return NextResponse.json({
            message: `Emails sent successfully`,
            sentCount: successfulIds.length,
            totalPending: pendingMatches.length,
            errors: errors.length > 0 ? errors : undefined,
        }, { status: 200 })
    } catch (error) {
        console.error("Error sending matched student emails:", error)
        return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
    }
}
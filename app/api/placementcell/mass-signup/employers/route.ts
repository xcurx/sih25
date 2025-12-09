import { auth } from "@/auth"
import { welcomeEmailTemplate } from "@/components/mail/mailTemplate"
import { PrismaClient } from "@/lib/generated/prisma"
import { client } from "@/lib/mail"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

interface EmployerData {
    email: string
    name: string
    password: string
    companyId: string
    position?: string
    linkedin?: string
}

interface BulkResult {
    success: { email: string; id: string; companyId: string }[]
    failed: { email: string; error: string }[]
}

export async function POST(req: NextRequest) {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { employers, sendEmails = true }: { employers: EmployerData[]; sendEmails?: boolean } = await req.json()

        if (!employers || !Array.isArray(employers) || employers.length === 0) {
            return NextResponse.json(
                { error: "Employers array is required and must not be empty" },
                { status: 400 }
            )
        }

        if (employers.length > 500) {
            return NextResponse.json(
                { error: "Maximum 500 employers can be added at once" },
                { status: 400 }
            )
        }

        const result: BulkResult = {
            success: [],
            failed: [],
        }

        // Get existing emails to avoid duplicates
        const emails = employers.map((e) => e.email.toLowerCase())
        const existingEmployers = await prisma.employer.findMany({
            where: { email: { in: emails } },
            select: { email: true },
        })
        const existingEmails = new Set(existingEmployers.map((e) => e.email.toLowerCase()))

        // Validate all company IDs exist
        const companyIds = [...new Set(employers.map((e) => e.companyId))]
        const existingCompanies = await prisma.company.findMany({
            where: { id: { in: companyIds } },
            select: { id: true, name: true },
        })
        const companyMap = new Map(existingCompanies.map((c) => [c.id, c.name]))

        // Process each employer
        for (const employerData of employers) {
            const { email, name, password, companyId, ...optionalFields } = employerData

            // Validate required fields
            if (!email || !name || !password || !companyId) {
                result.failed.push({
                    email: email || "unknown",
                    error: "Missing required fields (email, name, password, companyId)",
                })
                continue
            }

            // Check if company exists
            if (!companyMap.has(companyId)) {
                result.failed.push({
                    email,
                    error: `Company with ID ${companyId} does not exist`,
                })
                continue
            }

            // Check for duplicate email
            if (existingEmails.has(email.toLowerCase())) {
                result.failed.push({
                    email,
                    error: "Employer with this email already exists",
                })
                continue
            }

            try {
                const employer = await prisma.employer.create({
                    data: {
                        email: email.toLowerCase(),
                        name,
                        password,
                        companyId,
                        position: optionalFields.position,
                        linkedin: optionalFields.linkedin,
                    },
                })

                result.success.push({ email, id: employer.id, companyId })
                existingEmails.add(email.toLowerCase()) // Prevent duplicates within same batch

                // Send welcome email
                if (sendEmails) {
                    try {
                        const companyName = companyMap.get(companyId)
                        await client.send({
                            to: [{ email, name }],
                            from: { email: "cell@gmail.com", name: "Placement Cell" },
                            subject: "Welcome to the Placement Portal",
                            html: welcomeEmailTemplate({
                                email,
                                name,
                                role: "employer",
                                loginUrl: "https://placement-cell.example.com/sign-in",
                            }),
                        })
                    } catch (emailError) {
                        console.error(`Failed to send email to ${email}:`, emailError)
                        // Don't fail the creation if email fails
                    }
                }
            } catch (createError) {
                console.error(`Failed to create employer ${email}:`, createError)
                result.failed.push({
                    email,
                    error: createError instanceof Error ? createError.message : "Failed to create employer",
                })
            }
        }

        return NextResponse.json({
            message: `Bulk employer sign-up completed`,
            summary: {
                total: employers.length,
                successful: result.success.length,
                failed: result.failed.length,
            },
            result,
        })
    } catch (error) {
        console.error("Mass employer sign-up error:", error)
        return NextResponse.json(
            { error: "Failed to process bulk employer sign-up" },
            { status: 500 }
        )
    }
}

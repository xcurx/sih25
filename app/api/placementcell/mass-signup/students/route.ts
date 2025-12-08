import { auth } from "@/auth"
import { welcomeEmailTemplate } from "@/components/mail/mailTemplate"
import { PrismaClient } from "@/lib/generated/prisma"
import { client } from "@/lib/mail"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

interface StudentData {
    email: string
    name: string
    password: string
    branch?: string
    batch?: number
    cgpa?: number
    phone?: string
    skills?: string[]
    linkedin?: string
    github?: string
    mentorId?: string
}

interface BulkResult {
    success: { email: string; id: string }[]
    failed: { email: string; error: string }[]
}

export async function POST(req: NextRequest) {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { students, sendEmails = true }: { students: StudentData[]; sendEmails?: boolean } = await req.json()

        if (!students || !Array.isArray(students) || students.length === 0) {
            return NextResponse.json(
                { error: "Students array is required and must not be empty" },
                { status: 400 }
            )
        }

        if (students.length > 500) {
            return NextResponse.json(
                { error: "Maximum 500 students can be added at once" },
                { status: 400 }
            )
        }

        const result: BulkResult = {
            success: [],
            failed: [],
        }

        // Get existing emails to avoid duplicates
        const emails = students.map((s) => s.email.toLowerCase())
        const existingStudents = await prisma.student.findMany({
            where: { email: { in: emails } },
            select: { email: true },
        })
        const existingEmails = new Set(existingStudents.map((s) => s.email.toLowerCase()))

        // Process each student
        for (const studentData of students) {
            const { email, name, password, ...optionalFields } = studentData

            // Validate required fields
            if (!email || !name || !password) {
                result.failed.push({
                    email: email || "unknown",
                    error: "Missing required fields (email, name, password)",
                })
                continue
            }

            // Check for duplicate
            if (existingEmails.has(email.toLowerCase())) {
                result.failed.push({
                    email,
                    error: "Student with this email already exists",
                })
                continue
            }

            try {
                const student = await prisma.student.create({
                    data: {
                        email: email.toLowerCase(),
                        name,
                        password,
                        branch: optionalFields.branch,
                        batch: optionalFields.batch,
                        cgpa: optionalFields.cgpa,
                        phone: optionalFields.phone,
                        skills: optionalFields.skills || [],
                        linkedin: optionalFields.linkedin,
                        github: optionalFields.github,
                        mentorId: optionalFields.mentorId,
                    },
                })

                result.success.push({ email, id: student.id })
                existingEmails.add(email.toLowerCase()) // Prevent duplicates within same batch

                // Send welcome email
                if (sendEmails) {
                    try {
                        await client.send({
                            to: [{ email, name }],
                            from: { email: "cell@gmail.com", name: "Placement Cell" },
                            subject: "Welcome to the Placement Portal",
                            html: welcomeEmailTemplate({
                                email,
                                name,
                                role: "student",
                                loginUrl: "https://placement-cell.example.com/sign-in",
                            }),
                        })
                    } catch (emailError) {
                        console.error(`Failed to send email to ${email}:`, emailError)
                        // Don't fail the creation if email fails
                    }
                }
            } catch (createError) {
                console.error(`Failed to create student ${email}:`, createError)
                result.failed.push({
                    email,
                    error: createError instanceof Error ? createError.message : "Failed to create student",
                })
            }
        }

        return NextResponse.json({
            message: `Bulk student sign-up completed`,
            summary: {
                total: students.length,
                successful: result.success.length,
                failed: result.failed.length,
            },
            result,
        })
    } catch (error) {
        console.error("Mass student sign-up error:", error)
        return NextResponse.json(
            { error: "Failed to process bulk student sign-up" },
            { status: 500 }
        )
    }
}

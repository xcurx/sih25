import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

interface CompanyData {
    name: string
    description: string
    website?: string
    industry?: string
    type?: string
    location?: string
}

interface BulkResult {
    success: { name: string; id: string }[]
    failed: { name: string; error: string }[]
}

export async function POST(req: NextRequest) {
    const session = await auth()

    if (!session?.user || session?.user?.role !== "placement-cell") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { companies }: { companies: CompanyData[] } = await req.json()

        if (!companies || !Array.isArray(companies) || companies.length === 0) {
            return NextResponse.json(
                { error: "Companies array is required and must not be empty" },
                { status: 400 }
            )
        }

        if (companies.length > 500) {
            return NextResponse.json(
                { error: "Maximum 500 companies can be added at once" },
                { status: 400 }
            )
        }

        const result: BulkResult = {
            success: [],
            failed: [],
        }

        // Get existing company names to avoid duplicates (case-insensitive)
        const companyNames = companies.map((c) => c.name.toLowerCase())
        const existingCompanies = await prisma.company.findMany({
            where: {
                name: {
                    in: companyNames,
                    mode: "insensitive",
                },
            },
            select: { name: true },
        })
        const existingNames = new Set(existingCompanies.map((c) => c.name.toLowerCase()))

        // Process each company
        for (const companyData of companies) {
            const { name, description, ...optionalFields } = companyData

            // Validate required fields
            if (!name || !description) {
                result.failed.push({
                    name: name || "unknown",
                    error: "Missing required fields (name, description)",
                })
                continue
            }

            // Check for duplicate name
            if (existingNames.has(name.toLowerCase())) {
                result.failed.push({
                    name,
                    error: "Company with this name already exists",
                })
                continue
            }

            try {
                const company = await prisma.company.create({
                    data: {
                        name,
                        description,
                        website: optionalFields.website,
                        industry: optionalFields.industry,
                        type: optionalFields.type,
                        location: optionalFields.location,
                    },
                })

                result.success.push({ name, id: company.id })
                existingNames.add(name.toLowerCase()) // Prevent duplicates within same batch
            } catch (createError) {
                console.error(`Failed to create company ${name}:`, createError)
                result.failed.push({
                    name,
                    error: createError instanceof Error ? createError.message : "Failed to create company",
                })
            }
        }

        return NextResponse.json({
            message: `Bulk company creation completed`,
            summary: {
                total: companies.length,
                successful: result.success.length,
                failed: result.failed.length,
            },
            result,
        })
    } catch (error) {
        console.error("Mass company creation error:", error)
        return NextResponse.json(
            { error: "Failed to process bulk company creation" },
            { status: 500 }
        )
    }
}

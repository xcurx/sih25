import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

const prisma = new PrismaClient()

export const POST = async () => {
    try {
        const opportunities = await prisma.opportunity.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                location: true,
                status: true,
                salary: true,
                requirements: true,
                eligibleDepartments: true,
                skillsRequired: true,
                additionalInfo: true,
            }
        })

        const BATCH_SIZE = 50
        const batches = []
        for (let i = 0; i < opportunities.length; i += BATCH_SIZE) {
            batches.push(opportunities.slice(i, i + BATCH_SIZE))
        }

        let totalAdded = 0
        let totalSkipped = 0
        let totalFailed = 0
        const allResults = {
            added: [] as string[],
            skipped: [] as any[],
            failed: [] as any[]
        }

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i]
            console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} jobs)`)
            
            const response = await axios.post(
                `${process.env.RECOMMENDATION_API_URL}/api/jobs/bulk`,
                batch,
                { 
                    timeout: 60000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            totalAdded += response.data.added_count
            totalSkipped += response.data.skipped_count
            totalFailed += response.data.failed_count
            allResults.added.push(...response.data.results.added)
            allResults.skipped.push(...response.data.results.skipped)
            allResults.failed.push(...response.data.results.failed)

            // small delay between batches
            if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }

        return NextResponse.json({
            success: true,
            message: "Jobs synced to recommendation engine",
            total: opportunities.length,
            batches: batches.length,
            added: totalAdded,
            skipped: totalSkipped,
            failed: totalFailed,
            details: allResults
        })

    } catch (error) {
        console.error('Failed to sync jobs to recommendation engine:', error)
        
        return NextResponse.json({
            success: false,
            message: "Failed to sync jobs",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
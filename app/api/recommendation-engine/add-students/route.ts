import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

const prisma = new PrismaClient()

export const POST = async () => {
    try {
        const students = await prisma.student.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                branch: true,
                batch: true,
                cgpa: true,
                phone: true,
                skills: true,
                projects: {
                    select: {
                        id: true,
                        studentId: true,
                        title: true,
                        description: true,
                        startDate: true,
                        endDate: true,
                        link: true,
                        technologies: true,
                    }
                }
            }
        })

        // Transform projects to match the recommendation engine schema
        const transformedStudents = students.map(student => ({
            ...student,
            projects: student.projects.map(project => ({
                ...project,
                startDate: project.startDate?.toISOString() || null,
                endDate: project.endDate?.toISOString() || null,
            }))
        }))

        const BATCH_SIZE = 50
        const batches = []
        for (let i = 0; i < transformedStudents.length; i += BATCH_SIZE) {
            batches.push(transformedStudents.slice(i, i + BATCH_SIZE))
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
            console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} students)`)
            
            const response = await axios.post(
                `${process.env.RECOMMENDATION_API_URL}/api/students/bulk`,
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
            allResults.added.push(...(response.data.results?.added || []))
            allResults.skipped.push(...(response.data.results?.skipped || []))
            allResults.failed.push(...(response.data.results?.failed || []))

            // small delay between batches
            if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }

        return NextResponse.json({
            success: true,
            message: "Students synced to recommendation engine",
            total: students.length,
            batches: batches.length,
            added: totalAdded,
            skipped: totalSkipped,
            failed: totalFailed,
            details: allResults
        })

    } catch (error) {
        console.error('Failed to sync students to recommendation engine:', error)
        
        return NextResponse.json({
            success: false,
            message: "Failed to sync students",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
    const session = await auth()

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { title, issuer, issueDate, url } = await req.json();

        if (!title || !issuer || !issueDate || !url) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const isValidISODate = (dateString: string): boolean => {
            const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/
            return isoRegex.test(dateString)
        }

        if (!isValidISODate(issueDate.toString())) {
            return NextResponse.json({ error: "Invalid date format. Use ISO format (YYYY-MM-DD)" }, { status: 400 })
        }

        const certificate = await prisma.certificate.create({
            data: {
                studentId: session.user.id,
                title: title,
                issuer: issuer,
                issueDate: issueDate,
                certificateUrl: url.toString(),
            }
        })

        return NextResponse.json({ message: "Certificate uploaded successfully", certificate })
    } catch (error) {
        return NextResponse.json({ error: "Failed to upload certificate" }, { status: 500 })
    }
}
import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"
import { deleteFromCloudinary, getPublicIdFromUrl } from "../../upload/route"

const prisma = new PrismaClient()

export const GET = async () => {
    const session = await auth()

    if (!session || session.user.role != "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const student = await prisma.student.findUnique({
            where: { id: session.user.id },
            select: { resume: true },
        })

        return NextResponse.json({ resume: student?.resume || null })
    } catch (error) {
        return NextResponse.json({ error: "Failed to get resume" }, { status: 500 })
    }
}

export const PUT = async (request: Request) => {
    const session = await auth()

    if (!session || session.user.role != "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { url } = await request.json()

        const student = await prisma.student.findUnique({
            where: { id: session.user.id },
            select: { resume: true },
        })

        // delete old resume from Cloudinary if exists
        if (student?.resume) {
            const publicId = getPublicIdFromUrl(student.resume)
            if (publicId) {
                await deleteFromCloudinary(publicId)
            }
        }

        await prisma.student.update({
            where: { id: session.user.id },
            data: { resume: url },
        })

        return NextResponse.json({ message: "Resume updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update resume" }, { status: 500 })
    }
}

export const DELETE = async () => {
    const session = await auth()

    if (!session || session.user.role != "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const student = await prisma.student.findUnique({
            where: { id: session.user.id },
            select: { resume: true },
        })

        if (student?.resume) {
            const publicId = getPublicIdFromUrl(student.resume)
            if (publicId) {
                const res = await deleteFromCloudinary(publicId)
                if (!res.success) {
                    return NextResponse.json({ error: "Failed to delete resume from storage" }, { status: 500 })
                }
            }
        }

        await prisma.student.update({
            where: { id: session.user.id },
            data: { resume: null },
        })

        return NextResponse.json({ message: "Resume deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 })
    }
}
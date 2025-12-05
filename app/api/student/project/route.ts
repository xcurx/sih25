import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
    const session = await auth()

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, description, startDate, endDate, link, technologies } = await req.json()

        if (!title || !description || !startDate || !technologies) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (!Array.isArray(technologies)) {
            return NextResponse.json({ message: "Technologies must be an array" }, { status: 400 });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                startDate,
                endDate: endDate || null,
                link: link || null,
                technologies,
                studentId: session.user.id
            }
        })

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });    
    }
}

export const GET = async (req: NextRequest) => {
    const session = await auth()

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                studentId: session.user.id
            },
            orderBy: {
                startDate: "desc"
            }
        })

        return NextResponse.json({ projects }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });    
    }
}

export const DELETE = async (req: NextRequest) => {
    const session = await auth()

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { projectId } = await req.json()

        if (!projectId) {
            return NextResponse.json({ message: "Missing project ID" }, { status: 400 });
        }

        await prisma.project.deleteMany({
            where: {
                id: projectId,
                studentId: session.user.id
            }
        })

        return NextResponse.json({ message: "Project deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });    
    }
}

export const PATCH = async (req: NextRequest) => {
    const session = await auth()

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { projectId, title, description, startDate, endDate, link, technologies } = await req.json()

        if (!projectId || !title || !description || !startDate || !technologies) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (!Array.isArray(technologies)) {
            return NextResponse.json({ message: "Technologies must be an array" }, { status: 400 });
        }

        const project = await prisma.project.updateMany({
            where: {
                id: projectId,
                studentId: session.user.id
            },
            data: {
                title,
                description,
                startDate,
                endDate: endDate || null,
                link: link || null,
                technologies,
            }
        })

        return NextResponse.json({ project }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });    
    }
}
import { auth } from "@/auth";
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
    const session = await auth()

    if (!session || session.user.role !== 'employer') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const employer = await prisma.employer.findUnique({
            where: { id: session.user.id },
        })

        const internships = await prisma.internship.findMany({
            where: { opportunityRel: { companyId: employer?.companyId } },
            include: {
                studentRel: true,
                opportunityRel: {
                    include: {
                        companyRel: true
                    }
                },
                certificateRel: true,
            }
        })

        return NextResponse.json({ internships }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&  error.code == "P2025") {
            return NextResponse.json({ message: "Interview not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
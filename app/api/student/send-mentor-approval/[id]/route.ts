import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const POST = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const session = await auth();

    if (!session || session.user.role !== "student") {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const { id } = await context.params;
    console.log(id);

    try {
        if (!id) {
            return NextResponse.json({ message: "Invalid opportunity ID" }, { status: 400 });
        }

        const opportunity = await prisma.opportunity.findUnique({
            where: { id }
        });

        if (!opportunity) {
            return NextResponse.json({ message: "Opportunity not found" }, { status: 404 });
        }

        const application = await prisma.application.create({
            data: {
                studentId: session.user.id,
                opportunityId: id,
                status: "mentor_approval_needed",
            }
        });

        return NextResponse.json({ message: "Mentor approval request sent successfully", application }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
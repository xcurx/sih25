import { auth } from "@/auth";
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const PATCH = async (req: NextRequest, context: { params: Promise<{ id:string }> }) => {
    const session = await auth()

    if (!session || session.user.role !== 'employer') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const { action } = await req.json();

        if (action !== 'cancelled' && action !== 'completed' && action !== 'rejected' && action !== 'accepted') {
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }

        let interview = await prisma.interview.findUnique({
            where: { id },
        })

        if (interview?.status === 'canceled' || interview?.status === 'rejected' || interview?.status === 'accepted') {
            return NextResponse.json({ message: `Cannot ${action} an interview that is already ${interview?.status}` }, { status: 400 });
        }

        if (interview?.status !== 'completed' && (action === 'accepted' || action === 'rejected')) {
            return NextResponse.json({ message: `Cannot ${action} an interview that is not complete` }, { status: 400 });
        }

        if (interview?.scheduledAt as Date > new Date() && (action === 'completed')) {
            return NextResponse.json({ message: `Cannot complete an interview before its scheduled time` }, { status: 400 });
        }

        interview = await prisma.interview.update({
            where: { id },
            data: { status: action }
        })

        if (action === 'accepted' || action === 'rejected') {
            await prisma.application.update({
                where: { id: interview.applicationId },
                data: { status: action === 'accepted' ? action : action }
            })
        }

        return NextResponse.json({ message: `Interview ${action} successfully`, interview }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&  error.code == "P2025") {
            return NextResponse.json({ message: "Interview not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}
import { auth } from "@/auth";
import { certificateUploadedTemplate } from "@/components/mail/mailTemplate";
import { PrismaClient } from "@/lib/generated/prisma";
import { client } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const POST = async (req: NextRequest, context: { params: Promise<{ id:string }> }) => {
    const session = await auth()

    if (!session || session.user.role !== "employer") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await context.params;

        const internship = await prisma.internship.findUnique({
            where: { id: id },
            include: { opportunityRel: true, studentRel: true },
        })

        const employer = await prisma.employer.findUnique({
            where: { id: session.user.id },
            include: { companyRel: true },
        })

        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        if (!internship) {
            return NextResponse.json({ error: "Internship not found" }, { status: 404 })
        }

        const certificate = await prisma.certificate.create({
            data: {
                studentId: internship.studentId,
                title: internship.opportunityRel.title,
                issuer: employer?.companyRel.name as string,
                issueDate: new Date(),
                certificateUrl: url.toString(),
                internshipId: internship.id,
            }
        })
        
        client.send({
            to: [{email: internship.studentRel.email, name: internship.studentRel.name}],
            from: {email: "cell@gmail.com", name: "Placement Cell"},
            subject: "Interview Scheduled for Your Application",
            html: certificateUploadedTemplate({
                companyName: employer?.companyRel.name as string,
                studentName: internship.studentRel.name,
                certificateTitle: internship.opportunityRel.title,
                certificateUrl: url.toString(),
                internshipTitle: internship.opportunityRel.title,
                issueDate: new Date().toLocaleDateString(),
                issuer: employer?.companyRel.name as string,
                profileUrl: ""
            })
        })

        return NextResponse.json({ message: "Certificate uploaded successfully", certificate })
    } catch (error) {
        return NextResponse.json({ error: "Failed to upload certificate" }, { status: 500 })
    }
}
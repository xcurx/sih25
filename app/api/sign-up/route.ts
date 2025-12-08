import { welcomeEmailTemplate } from "@/components/mail/mailTemplate";
import { PrismaClient } from "@/lib/generated/prisma";
import { client } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const { email, name, password, roll, companyId } = await req.json();

    if (!email || !name || !password || !roll) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (roll === "student") {
        const studentExist = await prisma.student.findUnique({
            where: { email },
        })

        if (studentExist) {
            return NextResponse.json({ error: "Student with this email already exists" }, { status: 400 });
        }

        const student = await prisma.student.create({
            data: {
                email,
                name,
                password,
            },
        })

        return NextResponse.json({ message: "Student sign-up successful", student }, { status: 200 });
    }

    if (roll === "faculty") {
        const facultyExist = await prisma.faculty.findUnique({
            where: { email },
        })

        if (facultyExist) {
            return NextResponse.json({ error: "Faculty with this email already exists" }, { status: 400 });
        }

        const faculty = await prisma.faculty.create({
            data: {
                email,
                name,
                password,
            },
        })

        return NextResponse.json({ message: "Faculty sign-up successful", faculty }, { status: 200 });
    }

    if (roll === "placement-cell") {
        const cellExist = await prisma.placmentCell.findUnique({
            where: { email },
        })

        if (cellExist) {
            return NextResponse.json({ error: "Placement cell with this email already exists" }, { status: 400 });
        }

        const placmentCell = await prisma.placmentCell.create({
            data: {
                email,
                name,
                password,
            },
        })

        return NextResponse.json({ message: "Placement cell sign-up successful", placmentCell }, { status: 200 });
    }

    if (roll === "employer") {
        if (!companyId) {
            return NextResponse.json({ error: "Company name is required for employers" }, { status: 400 });
        }

        const employerExist = await prisma.employer.findUnique({
            where: { email },
        })

        if (employerExist) {
            return NextResponse.json({ error: "Employer with this email already exists" }, { status: 400 });
        }

        const employer = await prisma.employer.create({
            data: {
                email,
                name,
                password,
                companyId,
            },
        })

        return NextResponse.json({ message: "Employer sign-up successful", employer }, { status: 200 });
    }

    client.send({
        to: [{ email, name }],
        from: { email: "cell@gmail.com", name: "Placement Cell" },
        subject: "Welcome",
        text: welcomeEmailTemplate({
            email,
            name,
            role: roll,
            loginUrl: "https://placement-cell.example.com/sign-in",
        })
    })

    return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
}
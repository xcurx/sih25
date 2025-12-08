import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { name, description, website, industry, type, location, contactName, contactEmail, contactPhone, message } = body

  if (!name?.trim() || !description?.trim() || !contactName?.trim() || !contactEmail?.trim()) {
    return NextResponse.json({ error: "Name, description, contact name, and contact email are required." }, { status: 400 })
  }

  const request = await prisma.companyRequest.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      website: website?.trim() || null,
      industry: industry?.trim() || null,
      type: type || null,
      location: location?.trim() || null,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone?.trim() || null,
      message: message?.trim() || null,
    },
  })

  return NextResponse.json({ message: "Request submitted successfully.", request })
}

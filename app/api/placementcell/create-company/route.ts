import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "placement-cell") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, description, website, industry, type, location } = await req.json()

  if (!name || !description) {
    return NextResponse.json({ error: "Company name and description are required." }, { status: 400 })
  }

  const existing = await prisma.company.findFirst({
    where: {
      name: name.trim(),
    },
  })

  if (existing) {
    return NextResponse.json({ error: "Company with this name already exists." }, { status: 400 })
  }

  const company = await prisma.company.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      website: website?.trim() || null,
      industry: industry?.trim() || null,
      type: type || null,
      location: location?.trim() || null,
    },
  })

  return NextResponse.json({ message: "Company created successfully.", company })
}

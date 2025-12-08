import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const session = await auth()
  if (!session?.user || session.user.role !== "placement-cell") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  const request = await prisma.companyRequest.findUnique({
    where: { id },
  })

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  return NextResponse.json({ request })
}

export async function POST(req: NextRequest, context: RouteContext) {
  const session = await auth()
  if (!session?.user || session.user.role !== "placement-cell") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const body = await req.json()
  const action = body?.action as "approve" | "reject" | undefined
  const note = body?.note as string | undefined

  if (!action) {
    return NextResponse.json({ error: "Action is required." }, { status: 400 })
  }

  const requestRecord = await prisma.companyRequest.findUnique({
    where: { id },
  })

  if (!requestRecord) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  if (requestRecord.status !== "pending") {
    return NextResponse.json({ error: "Request already processed." }, { status: 400 })
  }

  if (action === "reject") {
    const updated = await prisma.companyRequest.update({
      where: { id },
      data: {
        status: "rejected",
        reviewNote: note?.trim() || null,
        reviewedAt: new Date(),
        reviewerId: session.user.id,
      },
    })
    return NextResponse.json({ message: "Request rejected.", request: updated })
  }

  // Approve flow
  const conflictingCompany = await prisma.company.findFirst({
    where: {
      name: requestRecord.name,
    },
  })

  if (conflictingCompany) {
    return NextResponse.json({ error: "A company with this name already exists." }, { status: 400 })
  }

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: requestRecord.name,
        description: requestRecord.description,
        website: requestRecord.website,
        industry: requestRecord.industry,
        type: requestRecord.type,
        location: requestRecord.location,
      },
    })

    const updatedRequest = await tx.companyRequest.update({
      where: { id: requestRecord.id },
      data: {
        status: "approved",
        reviewNote: note?.trim() || null,
        reviewedAt: new Date(),
        reviewerId: session.user.id,
      },
    })

    return { company, request: updatedRequest }
  })

  return NextResponse.json({ message: "Company approved and created.", ...result })
}

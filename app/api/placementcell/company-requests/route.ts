import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "placement-cell") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const summary = searchParams.get("summary")
  const statusParam = searchParams.get("status")
  const takeParam = Number(searchParams.get("take") ?? 20)

  if (summary) {
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.companyRequest.count({ where: { status: "pending" } }),
      prisma.companyRequest.count({ where: { status: "approved" } }),
      prisma.companyRequest.count({ where: { status: "rejected" } }),
    ])
    return NextResponse.json({ pendingCount, approvedCount, rejectedCount })
  }

  const requests = await prisma.companyRequest.findMany({
    where: statusParam ? { status: statusParam as any } : undefined,
    orderBy: { createdAt: "desc" },
    take: Number.isNaN(takeParam) ? 20 : takeParam,
  })

  return NextResponse.json({ requests })
}

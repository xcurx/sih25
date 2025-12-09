"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Student } from "@/lib/types"
import { ExternalLink, Eye, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentCard({
  student,
  onViewDetails,
}: {
  student: Student
  onViewDetails: (student: Student) => void
}) {
  const router = useRouter()

  const getPlacementStatus = (student: Student) => {
    if (student.applications.some((app) => app.status === "accepted")) {
      return { status: "Placed", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }
    }
    if (
      student.applications.some((app) =>
        ["pending", "interview", "shortlisted", "mentor_approval_needed"].includes(app.status),
      )
    ) {
      return { status: "In Process", color: "bg-amber-100 text-amber-700 border-amber-200" }
    }
    return { status: "Unplaced", color: "bg-slate-100 text-slate-700 border-slate-200" }
  }

  const placementInfo = getPlacementStatus(student)
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Card className="group relative rounded-2xl border border-slate-100 bg-white/90 shadow-sm hover:shadow-md transition-all">
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-sky-50/50 to-transparent transition-opacity" />
      <CardContent className="relative flex flex-wrap items-center gap-4 p-4">
        <div className="flex items-center gap-3 min-w-[200px] flex-1">
          <Avatar className="h-12 w-12 rounded-xl border border-white shadow-sm">
            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-700 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="text-lg font-semibold text-slate-900">{student.name}</p>
              <Badge className={`rounded-full ${placementInfo.color}`}>{placementInfo.status}</Badge>
            </div>
            <p className="text-sm text-slate-600">
              {student.branch} - Year {`${4 - (student.batch - 2025)}`}
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 max-w-full">
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              <span className="truncate">{student.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-700">
          <div className="rounded-xl bg-sky-50 px-3 py-1.5 text-center min-w-[70px]">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">CGPA</p>
            <p className="text-lg font-semibold text-sky-700">{student.cgpa ?? "-"}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 px-3 py-1.5 text-center min-w-[80px]">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Apps</p>
            <p className="text-lg font-semibold text-indigo-700">{student.applications.length}</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-slate-200 px-4 py-1"
            onClick={() => onViewDetails(student)}
          >
            <Eye className="h-4 w-4 mr-1.5" />
            View
          </Button>
          <Button
            size="sm"
            className="rounded-full px-4 py-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow"
            onClick={() => router.push(`/students/${student.id}`)}
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

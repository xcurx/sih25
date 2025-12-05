"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "@/lib/types"
import {
    Briefcase,
    ExternalLink,
    Eye,
    FileText,
    GraduationCap,
    Mail,
    MessageSquare,
    Phone,
    User
} from "lucide-react"
import Link from "next/link"
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
      return { status: "Placed", color: "bg-green-100 text-green-700 border-green-200" }
    }
    if (student.applications.some((app) => ["pending", "interview", "shortlisted"].includes(app.status))) {
      return { status: "In Process", color: "bg-amber-100 text-amber-700 border-amber-200" }
    }
    return { status: "Unplaced", color: "bg-slate-100 text-slate-700 border-slate-200" }
  }

  const placementInfo = getPlacementStatus(student)

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
      
      <CardHeader className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-16 w-16 rounded-2xl border-2 border-slate-200">
              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
              <AvatarFallback className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-700 text-lg font-semibold">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl font-bold text-slate-900">{student.name}</CardTitle>
                <Badge className={`rounded-full ${placementInfo.color}`}>
                  {placementInfo.status}
                </Badge>
              </div>
              <CardDescription className="text-base font-medium text-slate-600 mb-3">
                {student.branch} • Year {`${4 - (student.batch - 2025)}`}
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span className="truncate max-w-[150px]">{student.email}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 px-4 py-3 text-center">
              <div className="text-2xl font-bold text-sky-700">{student.cgpa}</div>
              <div className="text-xs text-slate-600">CGPA</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {/* Skills */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-500" />
            Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {student.skills.slice(0, 6).map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
              >
                {skill}
              </Badge>
            ))}
            {student.skills.length > 6 && (
              <Badge 
                variant="outline"
                className="rounded-full border-slate-300 bg-slate-100 text-slate-700"
              >
                +{student.skills.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-sky-50 to-blue-50 p-3 text-center">
            <div className="text-lg font-bold text-sky-700">{student.applications.length}</div>
            <div className="text-xs text-slate-600">Applications</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-3 text-center">
            <div className="text-lg font-bold text-indigo-700">{student.projects?.length || 0}</div>
            <div className="text-xs text-slate-600">Projects</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-emerald-50 to-green-50 p-3 text-center">
            <div className="text-lg font-bold text-emerald-700">{student.certifications?.length || 0}</div>
            <div className="text-xs text-slate-600">Certificates</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 w-full sm:w-auto rounded-full border-slate-200 hover:bg-slate-50"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => onViewDetails(student)}
            className="flex-1 w-full sm:w-auto rounded-full border-sky-200 text-sky-700 hover:bg-sky-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            Quick View
          </Button>
          <Link href={`/students/${student.id}`} className="flex-1 w-full sm:w-auto">
            <Button 
              size="sm"
              className="w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Full Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

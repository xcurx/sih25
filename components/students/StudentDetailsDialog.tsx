"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Student } from "@/lib/types"
import {
  GraduationCap,
  Mail,
  Phone,
  Star,
  Code2
} from "lucide-react"

export default function StudentDetailsDialog({
  student,
  onClose,
}: {
  student: Student | null
  onClose: () => void
}) {
  if (!student) return null

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl border-slate-200 bg-white/95 backdrop-blur-sm overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{student.name} - Quick View</DialogTitle>
        </DialogHeader>

        {/* Hero Header */}
        <div className="relative -mx-6 -mt-6 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-500 to-blue-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),transparent_50%)]" />
          
          <div className="relative px-6 py-8">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 ring-4 ring-white/30 ring-offset-2 ring-offset-sky-500">
                <AvatarImage src={"/placeholder.svg"} alt={student.name} />
                <AvatarFallback className="bg-white/20 text-white text-2xl font-semibold backdrop-blur-sm">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white">{student.name}</h2>
                <div className="mt-1 flex items-center gap-2 text-white/80">
                  <GraduationCap className="h-4 w-4" />
                  <span>{student.branch}</span>
                  <span className="text-white/50">•</span>
                  <span>Year {`${4-(student.batch-2025)}`}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                <div>
                  <p className="text-xl font-bold text-white">{student.cgpa}</p>
                  <p className="text-xs text-white/70">CGPA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 max-h-[50vh] overflow-y-auto px-1">
          {/* Contact Information */}
          <Card className="rounded-2xl border-slate-200 bg-slate-50/50">
            <CardContent className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                  <div className="p-2 rounded-full bg-sky-50">
                    <Mail className="h-4 w-4 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                  <div className="p-2 rounded-full bg-sky-50">
                    <Phone className="h-4 w-4 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-700">{student.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Details */}
          <Card className="rounded-2xl border-slate-200 bg-slate-50/50">
            <CardContent className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Academic Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">Department</p>
                  <p className="text-sm font-medium text-slate-700">{student.branch}</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">Year</p>
                  <p className="text-sm font-medium text-slate-700">Year {`${4-(student.batch-2025)}`}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="rounded-2xl border-slate-200 bg-slate-50/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Technical Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    className="bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200 rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

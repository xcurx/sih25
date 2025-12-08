"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Opportunity, StudentApplication } from "@/lib/types"
import axios from "axios"
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  ExternalLink,
  Eye,
  Layers,
  MapPin,
  MoreHorizontal,
  Trash2,
  Users,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function JobPostingCard({ job }: { job: Opportunity }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "draft":
        return "bg-slate-100 text-slate-700 border-slate-200"
      case "closed":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const daysUntilDeadline = Math.ceil(
    (new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  const isExpired = daysUntilDeadline <= 0
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0

  const getDeadlineClass = () => {
    if (isExpired) return "bg-red-100 text-red-700 border-red-200"
    if (isUrgent) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-sky-100 text-sky-700 border-sky-200"
  }

  const getDeadlineText = () => {
    if (daysUntilDeadline > 0) return daysUntilDeadline + " days left"
    return "Expired"
  }

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />

      <CardHeader className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-sm flex-shrink-0">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <CardTitle className="text-xl font-bold text-slate-900">{job.title}</CardTitle>
                <Badge className={"rounded-full capitalize " + getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
              <CardDescription className="text-base font-semibold text-slate-700 mb-3">
                {job?.companyRel?.name}
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{job.location}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  <span className="capitalize">{job.type}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>₹{job.salary}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={"rounded-full px-3 py-1 " + getDeadlineClass()}>
              <Clock className="h-3 w-3 mr-1" />
              {getDeadlineText()}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0 hover:bg-slate-100">
                  <MoreHorizontal className="h-4 w-4 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Job
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-sky-600">
              <Users className="h-4 w-4" />
              <span className="text-xl font-bold">{job._count?.applications || 0}</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">Applications</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <Layers className="h-4 w-4" />
              <span className="text-xl font-bold">{job.eligibleDepartments?.length || 0}</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">Departments</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-600">
              <Briefcase className="h-4 w-4" />
              <span className="text-xl font-bold">{job.skillsRequired?.length || 0}</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">Skills</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-bold">
                {new Date(job.applicationDeadline).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-1">Deadline</div>
          </div>
        </div>

        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired.slice(0, 5).map((skill: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-full border-sky-200 bg-white text-sky-700 px-3 py-1"
              >
                {skill}
              </Badge>
            ))}
            {job.skillsRequired.length > 5 && (
              <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-600 px-3 py-1">
                +{job.skillsRequired.length - 5} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href={"/job-postings/" + job.id}>
            <Button className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          <ApplicationsDialog opportunity={job} />
          <Link href={`/job-postings/${job.id}/recommended-students`}>
            <Button variant="outline" className="rounded-full border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:border-purple-300">
              <Sparkles className="h-4 w-4 mr-2" />
              View Recommended Students
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function ApplicationsDialog({ opportunity }: { opportunity: Opportunity }) {
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(false)

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/placementcell/get-applications-for-opportunity/" + opportunity.id)
      if (res.status === 200) {
        setApplications(res.data.applications)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (opportunity.id) {
      fetchApplications()
    }
  }, [opportunity.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "reviewed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "shortlisted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200"
      case "mentor_approval_needed":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full border-slate-200 hover:bg-slate-100">
          <Users className="h-4 w-4 mr-2" />
          Applications ({opportunity._count?.applications || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Applications for {opportunity.title}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {opportunity.companyRel?.name} • {applications.length} applications received
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-slate-100 p-4 w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600">No applications yet.</p>
            </div>
          ) : (
            applications.map((app) => (
              <Link key={app.id} href={"/applications/" + app.id} className="block">
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-200 hover:shadow-md cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-gradient-to-br from-sky-100 to-blue-100 h-12 w-12 flex items-center justify-center text-sky-700 font-bold text-lg">
                        {app.studentRel?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {app.studentRel?.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {app.studentRel?.branch} • Batch {app.studentRel?.batch} • CGPA: {app.studentRel?.cgpa}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={"rounded-full capitalize " + getStatusColor(app.status)}>
                        {app.status.replace(/_/g, " ")}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

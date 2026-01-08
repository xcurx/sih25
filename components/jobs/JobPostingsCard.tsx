"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Opportunity, StudentApplication } from "@/lib/types"
import axios from "axios"
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  Layers,
  MapPin,
  Users,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function JobPostingCard({ job }: { job: Opportunity }) {
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
    <Card className="rounded-2xl border-slate-200 bg-gradient-to-br from-slate-50/30 to-white shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-sky-100 p-3">
              <Building2 className="h-7 w-7 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                <button className="text-slate-400 hover:text-amber-500 transition" aria-label="Bookmark opportunity">
                  <Star className="h-5 w-5" />
                </button>
              </div>
              <p className="text-base text-slate-700">{job?.companyRel?.name}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-sky-600">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sky-600">
                <Briefcase className="h-4 w-4" />
                <span className="capitalize">{job.type}</span>
              </div>
              <div className="text-sky-600 font-semibold text-base">
                ₹{job.salary}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={"rounded-full px-3 py-1.5 font-medium " + getDeadlineClass()}>
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                {getDeadlineText()}
              </Badge>
              <Badge className="rounded-full px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                {job._count?.applications || 0} applicant{(job._count?.applications || 0) !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Skills and Departments Section */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-3">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">Required Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired && job.skillsRequired.length > 0 ? (
                job.skillsRequired.slice(0, 5).map((skill: string, index: number) => (
                  <Badge
                    key={index}
                    className="rounded-md bg-sky-50 text-sky-600 border-0 px-3 py-1 text-sm font-normal"
                  >
                    {skill}
                  </Badge>
                ))
              ) : null}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-3">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm font-medium">Eligible Departments</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.eligibleDepartments && job.eligibleDepartments.length > 0 ? (
                job.eligibleDepartments.slice(0, 5).map((dept: string, index: number) => (
                  <Badge
                    key={index}
                    className="rounded-md bg-indigo-50 text-indigo-600 border-0 px-3 py-1 text-sm font-normal"
                  >
                    {dept}
                  </Badge>
                ))
              ) : null}
            </div>
          </div>
        </div>

        {/* Posted and Deadline Dates */}
        <div className="flex items-center gap-8 mb-6 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>Posted on</span>
            <span className="font-medium text-slate-900">
              {new Date(job.postedAt).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="h-4 w-4" />
            <span>Apply by</span>
            <span className="font-medium text-slate-900">
              {new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href={"/job-postings/" + job.id}>
            <Button 
              variant="outline" 
              className="rounded-lg bg-white border-sky-200 text-sky-600 hover:bg-sky-50 font-normal"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          <ApplicationsDialog opportunity={job} />
          {job.status === "active" && (
            <Link href={"/job-postings/" + job.id + "/recommended-students"}>
              <Button 
                className="rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-normal shadow-sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Matched Students
              </Button>
            </Link>
          )}
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
        return "bg-sky-100 text-sky-700 border-sky-200"
      case "reviewed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "shortlisted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      case "accepted":
        return "bg-sky-200 text-sky-700 border-sky-300"
      case "mentor_approval_needed":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50">
          <Users className="h-4 w-4 mr-2" />
          Applications ({opportunity._count?.applications || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl">
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
                <div className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-200 hover:shadow-md cursor-pointer">
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

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
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-sky-50 rounded-lg">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-xl text-gray-900">{job.title}</CardTitle>
                {/* <Badge variant={getStatusColor(job.status)}>{job.status}</Badge> */}
              </div>
              <CardDescription className="text-base font-normal text-gray-600">{
                job?.companyRel?.name
              }</CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                View Applications
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-gray-600 line-clamp-2 mb-4">{job.description}</p>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-900">Skills: </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {job.skillsRequired.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-700 bg-white">
                      {skill}
                    </Badge>
                  ))}
                  {job.skillsRequired.length > 4 && (
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-white">
                      +{job.skillsRequired.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900">Departments: </span>
                <span className="text-gray-600">{job.eligibleDepartments.join(", ")}</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-1">Applications</div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xl font-bold text-gray-900">{job._count.applications}</div>
                <div className="text-xs text-gray-500 mt-1">Applications</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500 mt-1">Shortlisted</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <ApplicationsDialog id={job.id}/>
              <Button variant="outline" size="sm" className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
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
        if (!id) return;
        getApplications();
    }, [id]);

    const getStatusBadgeStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'bg-gray-900 text-white hover:bg-gray-900';
            case 'reviewed':
                return 'bg-red-600 text-white hover:bg-red-600';
            case 'shortlisted':
                return 'bg-red-600 text-white hover:bg-red-600';
            case 'applied':
                return 'bg-gray-200 text-gray-700 hover:bg-gray-200';
            default:
                return 'bg-gray-200 text-gray-700 hover:bg-gray-200';
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1 bg-sky-600 hover:bg-sky-700 text-white border-0">
                <Users className="mr-2 h-4 w-4" />
                Applications
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Job Applications</DialogTitle>
                <DialogDescription className="text-gray-600">
                  View and manage applications for this job posting.
                </DialogDescription>
              </DialogHeader>
              {
                applications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        {loading ? "Loading applications..." : "No applications found."}
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto mt-4 space-y-3">
                        {
                            applications.map((app) => (
                                <div key={app.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-base">{app.studentRel.name}</h4>
                                            <p className="text-sm text-gray-600 mt-0.5">{app.studentRel.email}</p>
                                        </div>
                                        <Badge className={`${getStatusBadgeStyle(app.status)} rounded-md px-3 py-1 text-xs font-medium`}>
                                            {app.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm grid grid-cols-2 gap-3 text-gray-600">
                                        <div>
                                            <span className="font-medium text-gray-900">Branch:</span> {app.studentRel.branch}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Batch:</span> {app.studentRel.batch}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
              }
            </DialogContent>
        </Dialog>
    )
}

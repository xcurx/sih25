"use client"

import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  User,
  Users,
  XCircle,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Application {
  id: string
  status: string
  appliedAt: string
  studentRel: {
    id: string
    name: string
    email: string
    branch: string
    batch: number
    cgpa: number
  }
  interviewRel?: {
    id: string
    status: string
    scheduledAt: string
  }
}

interface Opportunity {
  id: string
  title: string
  description: string
  type: string
  location: string
  status: string
  salary: number
  postedAt: string
  applicationDeadline: string
  requirements: string[]
  eligibleDepartments: string[]
  skillsRequired: string[]
  additionalInfo?: string
  startDate: string
  endDate: string
  applications: Application[]
  companyRel?: {
    id: string
    name: string
    description?: string
    website?: string
    industry?: string
    location?: string
  }
  employerRel?: {
    id: string
    name: string
    position?: string
    email: string
    linkedin?: string
  }
  _count: {
    applications: number
  }
}

interface Stats {
  total: number
  shortlisted: number
  interviewed: number
  accepted: number
  rejected: number
  pending: number
}

export default function OpportunityDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOpportunity = async () => {
    try {
      const res = await axios.get(`/api/placementcell/opportunity/${params.id}`, {
        withCredentials: true,
      })
      if (res.status === 200) {
        setOpportunity(res.data.opportunity)
        setStats(res.data.stats)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch opportunity details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return
    fetchOpportunity()
  }, [status, params.id])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "placement-cell") {
    router.push("/")
    return null
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Opportunity not found</h1>
        <Button onClick={() => router.push("/job-postings")} variant="outline" className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job Postings
        </Button>
      </div>
    )
  }

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  const isExpired = daysUntilDeadline <= 0
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-700 border-blue-200"
      case "reviewed": return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "shortlisted": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "rejected": return "bg-red-100 text-red-700 border-red-200"
      case "accepted": return "bg-green-100 text-green-700 border-green-200"
      case "mentor_approval_needed": return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="relative p-6 max-w-6xl w-full mx-auto space-y-6">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-sky-100 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-blue-100 opacity-50 blur-3xl" />

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="rounded-full hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-5 shadow-sm">
                    <Building2 className="h-8 w-8 text-sky-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-2xl font-bold text-slate-900">
                        {opportunity.title}
                      </CardTitle>
                      <Badge className={`rounded-full capitalize ${
                        opportunity.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        opportunity.status === 'closed' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {opportunity.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-lg font-semibold text-slate-700">
                      {opportunity.companyRel?.name}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  className={`rounded-full px-4 py-2 ${
                    isExpired
                      ? "bg-red-100 text-red-700 border-red-200"
                      : isUrgent
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-sky-100 text-sky-700 border-sky-200"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Expired"}
                </Badge>
              </div>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  <span className="capitalize">{opportunity.type}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{opportunity.salary?.toLocaleString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">About the Role</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{opportunity.description}</p>
              </div>

              {/* Requirements */}
              {opportunity.requirements && opportunity.requirements.length > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-500" />
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Required */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-500" />
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skillsRequired.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full border-sky-200 bg-white text-sky-700 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Eligible Departments */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  Eligible Departments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.eligibleDepartments.map((dept, index) => (
                    <Badge
                      key={index}
                      className="rounded-full border-indigo-200 bg-indigo-100 text-indigo-700"
                    >
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              {opportunity.additionalInfo && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Additional Information</h4>
                  <p className="text-slate-600 leading-relaxed">{opportunity.additionalInfo}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Applications Section */}
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-600" />
                  Applications ({opportunity.applications.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {opportunity.applications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-4 w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600">No applications yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {opportunity.applications.map((app) => (
                    <Link key={app.id} href={`/applications/${app.id}`} className="block">
                      <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-200 hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-gradient-to-br from-sky-100 to-blue-100 p-3">
                              <User className="h-5 w-5 text-sky-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                                {app.studentRel.name}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span>{app.studentRel.branch}</span>
                                <span>•</span>
                                <span>Batch {app.studentRel.batch}</span>
                                <span>•</span>
                                <span>CGPA: {app.studentRel.cgpa}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`rounded-full capitalize ${getStatusColor(app.status)}`}>
                              {app.status.replace(/_/g, ' ')}
                            </Badge>
                            {app.interviewRel && (
                              <Badge className="rounded-full bg-sky-100 text-sky-700">
                                Interview Scheduled
                              </Badge>
                            )}
                            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-sky-600" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          {stats && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Application Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-4 text-center">
                    <div className="text-2xl font-bold text-sky-700">{stats.total}</div>
                    <div className="text-xs text-slate-600">Total</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center">
                    <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
                    <div className="text-xs text-slate-600">Pending</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-700">{stats.shortlisted}</div>
                    <div className="text-xs text-slate-600">Shortlisted</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-700">{stats.interviewed}</div>
                    <div className="text-xs text-slate-600">Interviewed</div>
                  </div>
                  <div className="rounded-2xl bg-green-100 p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{stats.accepted}</div>
                    <div className="text-xs text-slate-600">Accepted</div>
                  </div>
                  <div className="rounded-2xl bg-red-100 p-4 text-center">
                    <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
                    <div className="text-xs text-slate-600">Rejected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Card */}
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Posted: {new Date(opportunity.postedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                </div>
                {opportunity.startDate && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>Start: {new Date(opportunity.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {opportunity.endDate && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>End: {new Date(opportunity.endDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Card */}
          {opportunity.companyRel && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900">{opportunity.companyRel.name}</h4>
                  {opportunity.companyRel.industry && (
                    <p className="text-sm text-slate-600">{opportunity.companyRel.industry}</p>
                  )}
                </div>
                {opportunity.companyRel.description && (
                  <p className="text-sm text-slate-600 line-clamp-4">{opportunity.companyRel.description}</p>
                )}
                {opportunity.companyRel.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>{opportunity.companyRel.location}</span>
                  </div>
                )}
                {opportunity.companyRel.website && (
                  <a
                    href={opportunity.companyRel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recruiter Card */}
          {opportunity.employerRel && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Recruiter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-sky-100 to-blue-100 p-3">
                    <User className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{opportunity.employerRel.name}</h4>
                    {opportunity.employerRel.position && (
                      <p className="text-sm text-slate-600">{opportunity.employerRel.position}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${opportunity.employerRel.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                  {opportunity.employerRel.linkedin && (
                    <a
                      href={opportunity.employerRel.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import Loader from "@/components/loader/Loader"
import Status from "@/components/applications/Status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Linkedin,
  Mail,
  MapPin,
  User,
  Video,
  XCircle,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Application {
  id: string
  opportunityId: string
  studentId: string
  status: string
  appliedAt: string
  coverLetter?: string
  mentorApproved?: boolean
  opportunityRel: {
    id: string
    title: string
    description: string
    type: string
    location: string
    salary: number
    postedAt: string
    applicationDeadline: string
    requirements: string[]
    eligibleDepartments: string[]
    skillsRequired: string[]
    additionalInfo?: string
    startDate: string
    endDate: string
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
  }
  interviewRel?: {
    id: string
    scheduledAt: string
    interviewLink?: string
    status: string
    interviewDetails?: string
    remark?: string
  }
  internshipRel?: {
    id: string
    startDate: string
    endDate: string
    salary?: string
    performanceReview?: string
    certificateRel?: {
      id: string
      title: string
      issuer: string
      issueDate: string
      certificateUrl: string
    }
  }
}

export default function ApplicationDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchApplication = async () => {
    try {
      // Use different API based on user role
      const apiUrl = session?.user?.role === "student" 
        ? `/api/student/application/${params.id}`
        : `/api/placementcell/application/${params.id}`
      
      const res = await axios.get(apiUrl, {
        withCredentials: true,
      })
      if (res.status === 200) {
        setApplication(res.data.application)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch application details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return
    fetchApplication()
  }, [status, params.id, session?.user?.role])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Application not found</h1>
        <Button onClick={() => router.push("/applications")} variant="outline" className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "mentor_approval_needed":
        return <Clock className="h-4 w-4" />
      case "applied":
      case "reviewed":
        return <FileText className="h-4 w-4" />
      case "shortlisted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "mentor_approval_needed":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "applied":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "reviewed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "shortlisted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "interviewed":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  return (
    <div className="relative p-6 max-w-5xl w-full mx-auto space-y-6">
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
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">
                      {application.opportunityRel.title}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-slate-700">
                      {application.opportunityRel.companyRel?.name}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  className={`flex items-center gap-2 rounded-full px-4 py-2 ${getStatusColor(application.status)}`}
                >
                  {getStatusIcon(application.status)}
                  <span className="capitalize font-medium">
                    {application.status === "mentor_approval_needed"
                      ? "Mentor Approval Needed"
                      : application.status}
                  </span>
                </Badge>
              </div>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span>{application.opportunityRel.location}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  <span className="capitalize">{application.opportunityRel.type}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{application.opportunityRel.salary?.toLocaleString()}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status Progress */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-4">Application Progress</h4>
                <Status status={application.status as any} />
              </div>

              {/* Cover Letter */}
              {application.coverLetter && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Cover Letter
                  </h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {application.coverLetter}
                  </p>
                </div>
              )}

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">About the Role</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {application.opportunityRel.description}
                </p>
              </div>

              {/* Skills Required */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {application.opportunityRel.skillsRequired.map((skill, index) => (
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
            </CardContent>
          </Card>

          {/* Interview Card */}
          {application.interviewRel && (
            <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Video className="h-5 w-5 text-sky-600" />
                  Interview Scheduled
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Date & Time</p>
                    <p className="font-semibold text-slate-900">
                      {formatDateTime(application.interviewRel.scheduledAt).date}
                    </p>
                    <p className="text-sm text-slate-600">
                      {formatDateTime(application.interviewRel.scheduledAt).time}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <Badge
                      className={`rounded-full capitalize ${
                        application.interviewRel.status === "scheduled"
                          ? "bg-sky-100 text-sky-700"
                          : application.interviewRel.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : application.interviewRel.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {application.interviewRel.status}
                    </Badge>
                  </div>
                </div>

                {application.interviewRel.interviewDetails && (
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Details</p>
                    <p className="text-slate-700">{application.interviewRel.interviewDetails}</p>
                  </div>
                )}

                {application.interviewRel.interviewLink && (
                  <a
                    href={application.interviewRel.interviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700">
                      <Video className="h-4 w-4 mr-2" />
                      Join Interview
                    </Button>
                  </a>
                )}

                {application.interviewRel.remark && (
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Recruiter Remark</p>
                    <p className="text-slate-700">{application.interviewRel.remark}</p>
                  </div>
                )}

                <Link href={`/interviews/${application.interviewRel.id}`}>
                  <Button variant="outline" className="w-full rounded-full mt-2">
                    View Full Interview Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Internship Card */}
          {application.internshipRel && (
            <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Internship Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Duration</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(application.internshipRel.startDate).toLocaleDateString()} -{" "}
                      {new Date(application.internshipRel.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  {application.internshipRel.salary && (
                    <div className="rounded-2xl bg-white/80 p-4">
                      <p className="text-xs text-slate-500 mb-1">Stipend</p>
                      <p className="font-semibold text-emerald-700">
                        ₹{application.internshipRel.salary}
                      </p>
                    </div>
                  )}
                </div>

                {application.internshipRel.performanceReview && (
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Performance Review</p>
                    <p className="text-slate-700">{application.internshipRel.performanceReview}</p>
                  </div>
                )}

                {application.internshipRel.certificateRel && (
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs text-slate-500 mb-2">Certificate</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {application.internshipRel.certificateRel.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {application.internshipRel.certificateRel.issuer}
                        </p>
                      </div>
                      <a
                        href={application.internshipRel.certificateRel.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="rounded-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Application Summary */}
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span>
                    Deadline: {new Date(application.opportunityRel.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
                {application.mentorApproved !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    {application.mentorApproved ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-700">Mentor Approved</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-700">Awaiting Mentor Approval</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link href={`/jobs/${application.opportunityId}`}>
                <Button variant="outline" className="w-full rounded-full">
                  View Full Job Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Company Card */}
          {application.opportunityRel.companyRel && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {application.opportunityRel.companyRel.name}
                  </h4>
                  {application.opportunityRel.companyRel.industry && (
                    <p className="text-sm text-slate-600">
                      {application.opportunityRel.companyRel.industry}
                    </p>
                  )}
                </div>
                {application.opportunityRel.companyRel.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>{application.opportunityRel.companyRel.location}</span>
                  </div>
                )}
                {application.opportunityRel.companyRel.website && (
                  <a
                    href={application.opportunityRel.companyRel.website}
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
          {application.opportunityRel.employerRel && (
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
                    <h4 className="font-semibold text-slate-900">
                      {application.opportunityRel.employerRel.name}
                    </h4>
                    {application.opportunityRel.employerRel.position && (
                      <p className="text-sm text-slate-600">
                        {application.opportunityRel.employerRel.position}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${application.opportunityRel.employerRel.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                  {application.opportunityRel.employerRel.linkedin && (
                    <a
                      href={application.opportunityRel.employerRel.linkedin}
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

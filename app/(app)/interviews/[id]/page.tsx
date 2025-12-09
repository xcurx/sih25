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
  Mail,
  MapPin,
  Video,
  XCircle,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Interview {
  id: string
  scheduledAt: string
  interviewLink?: string
  status: string
  interviewDetails?: string
  remark?: string
  applicationRel: {
    id: string
    status: string
    appliedAt: string
    coverLetter?: string
    studentRel: {
      id: string
      name: string
      email: string
    }
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
  }
}

export default function InterviewDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchInterview = async () => {
    try {
      const res = await axios.get(`/api/student/interview/${params.id}`, {
        withCredentials: true,
      })
      if (res.status === 200) {
        setInterview(res.data.interview)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch interview details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return
    fetchInterview()
  }, [status, params.id])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Interview not found</h1>
        <Button onClick={() => router.push("/interviews")} variant="outline" className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Interviews
        </Button>
      </div>
    )
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const getTimeUntil = (dateString: string) => {
    const now = new Date()
    const interviewDate = new Date(dateString)
    const diffInMs = interviewDate.getTime() - now.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffInMs < 0) {
      return { text: "Interview completed", isPast: true, isUrgent: false }
    } else if (diffInDays > 0) {
      return { text: `${diffInDays} ${diffInDays === 1 ? "day" : "days"} to go`, isPast: false, isUrgent: diffInDays <= 1 }
    } else if (diffInHours > 0) {
      return { text: `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} to go`, isPast: false, isUrgent: true }
    } else if (diffInMinutes > 0) {
      return { text: `${diffInMinutes} minutes to go`, isPast: false, isUrgent: true }
    } else {
      return { text: "Starting now!", isPast: false, isUrgent: true }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return { color: "bg-sky-100 text-sky-700 border-sky-200", icon: <Clock className="h-4 w-4" /> }
      case "completed":
        return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: <CheckCircle className="h-4 w-4" /> }
      case "accepted":
        return { color: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle className="h-4 w-4" /> }
      case "rejected":
        return { color: "bg-red-100 text-red-700 border-red-200", icon: <XCircle className="h-4 w-4" /> }
      case "canceled":
        return { color: "bg-slate-100 text-slate-700 border-slate-200", icon: <XCircle className="h-4 w-4" /> }
      default:
        return { color: "bg-slate-100 text-slate-700 border-slate-200", icon: <Clock className="h-4 w-4" /> }
    }
  }

  const { date, time } = formatDateTime(interview.scheduledAt)
  const timeUntil = getTimeUntil(interview.scheduledAt)
  const statusBadge = getStatusBadge(interview.status)
  const opportunity = interview.applicationRel.opportunityRel

  return (
    <div className="relative p-6 max-w-5xl w-full mx-auto space-y-6 bg-white">

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
          {/* Interview Header Card */}
          <Card className={`rounded-3xl border-slate-200 shadow-lg overflow-hidden ${
            timeUntil.isUrgent && !timeUntil.isPast 
              ? "bg-gradient-to-br from-sky-50 to-blue-50 ring-2 ring-sky-200" 
              : "bg-white/90"
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-5 shadow-sm">
                    <Video className="h-8 w-8 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">
                      Interview for {opportunity.title}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-slate-700">
                      {opportunity.companyRel?.name}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`flex items-center gap-2 rounded-full px-4 py-2 ${statusBadge.color}`}>
                  {statusBadge.icon}
                  <span className="capitalize font-medium">{interview.status}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Countdown / Status Banner */}
              <div className={`rounded-2xl p-5 text-center ${
                timeUntil.isPast 
                  ? "bg-slate-100" 
                  : timeUntil.isUrgent 
                    ? "bg-gradient-to-r from-amber-100 to-orange-100" 
                    : "bg-gradient-to-r from-sky-100 to-blue-100"
              }`}>
                <p className="text-sm text-slate-600 mb-1">
                  {timeUntil.isPast ? "Interview Status" : "Time Remaining"}
                </p>
                <p className={`text-2xl font-bold ${
                  timeUntil.isPast 
                    ? "text-slate-700" 
                    : timeUntil.isUrgent 
                      ? "text-amber-700" 
                      : "text-sky-700"
                }`}>
                  {timeUntil.text}
                </p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-sky-600" />
                    <p className="text-sm text-slate-500">Date</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{date}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-sky-600" />
                    <p className="text-sm text-slate-500">Time</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{time}</p>
                </div>
              </div>

              {/* Interview Link */}
              {interview.interviewLink && interview.status === "scheduled" && (
                <a
                  href={interview.interviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 py-6 text-lg">
                    <Video className="h-5 w-5 mr-2" />
                    Join Interview
                  </Button>
                </a>
              )}

              {/* Interview Details */}
              {interview.interviewDetails && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Interview Details
                  </h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {interview.interviewDetails}
                  </p>
                </div>
              )}

              {/* Recruiter Remark */}
              {interview.remark && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-600" />
                    Recruiter Feedback
                  </h4>
                  <p className="text-amber-900 leading-relaxed">{interview.remark}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Details Card */}
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-600" />
                Position Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">
                  <MapPin className="h-4 w-4 text-sky-600" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">
                  <Briefcase className="h-4 w-4 text-sky-600" />
                  <span className="capitalize">{opportunity.type}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800">
                  <DollarSign className="h-4 w-4 text-sky-600" />
                  <span>₹{opportunity.salary?.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">{opportunity.description}</p>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <h5 className="text-sm font-semibold text-slate-700 mb-2">Required Skills</h5>
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

              <Link href={`/jobs/${opportunity.id}`}>
                <Button variant="outline" className="w-full rounded-full">
                  View Full Job Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 justify-around">
              <Link href={`/applications/${interview.applicationRel.id}`}>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-full justify-start gap-2 border-slate-300 text-slate-900 hover:border-sky-300 hover:bg-sky-50"
                >
                  <FileText className="h-4 w-4 text-sky-700" />
                  <span className="font-semibold">View Application</span>
                </Button>
              </Link>
              <Link href={`/jobs/${opportunity.id}`}>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-full justify-start gap-2 border-slate-300 text-slate-900 hover:border-sky-300 hover:bg-sky-50"
                >
                  <Briefcase className="h-4 w-4 text-sky-700" />
                  <span className="font-semibold">View Job Posting</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Interview Preparation Tips */}
          {interview.status === "scheduled" && !timeUntil.isPast && (
            <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Preparation Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Test your camera and microphone before the interview</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Join 5 minutes early to ensure everything works</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Have your resume and notes ready nearby</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Find a quiet, well-lit space for the interview</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Company Card */}
          {opportunity.companyRel && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-3">
                    <Building2 className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{opportunity.companyRel.name}</h4>
                    {opportunity.companyRel.industry && (
                      <p className="text-sm text-slate-600">{opportunity.companyRel.industry}</p>
                    )}
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  )
}

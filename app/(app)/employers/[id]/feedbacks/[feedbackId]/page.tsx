"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MessageSquare,
  Building2,
  Calendar,
  User,
  Briefcase,
  Mail,
  GraduationCap,
  MapPin,
  Clock,
  Award,
  Linkedin,
  Github,
  Phone,
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import Loader from "@/components/loader/Loader"
import Link from "next/link"

interface FeedbackDetails {
  id: string
  feedbackText: string
  description: string
  createdAt: string
  studentRel?: {
    id: string
    name: string
    email: string
    branch?: string | null
    batch?: number | null
    cgpa?: number | null
    phone?: string | null
    linkedin?: string | null
    github?: string | null
  }
  internshipRel?: {
    id: string
    startDate: string
    endDate: string
    salary?: string | null
    performanceReview?: string | null
    studentRel?: {
      id: string
      name: string
      email: string
      branch?: string | null
      batch?: number | null
      cgpa?: number | null
    }
    opportunityRel?: {
      id: string
      title: string
      type: string
      location: string
      description?: string
      companyRel?: {
        id: string
        name: string
        industry?: string | null
        location?: string | null
      }
      employerRel?: {
        id: string
        name: string
        email: string
        position?: string | null
      }
    }
    certificateRel?: {
      id: string
      title: string
      issuer: string
      issueDate: string
      certificateUrl: string
    } | null
  }
}

export default function FeedbackDetailsPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [feedback, setFeedback] = useState<FeedbackDetails | null>(null)
  const [loading, setLoading] = useState(true)

  const companyId = params.id as string
  const feedbackId = params.feedbackId as string

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/placementcell/feedback/${feedbackId}`, {
          withCredentials: true,
        })
        if (res.status === 200) {
          setFeedback(res.data.feedback || null)
        }
      } catch (error: any) {
        console.error("Error fetching feedback:", error)
        const message = error.response?.data?.message || "Failed to load feedback"
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "placement-cell") {
      fetchFeedback()
    }
  }, [status, session?.user?.role, feedbackId])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "placement-cell") {
    return (
      <div className="p-6">
        <div className="text-center py-12 rounded-xl border-2 border-red-300 bg-red-50">
          <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
          <p className="text-red-500 mt-2">This page is only accessible to placement cell members.</p>
        </div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <MessageSquare className="h-16 w-16 text-slate-300" />
        <h1 className="text-2xl font-bold text-slate-900">Feedback not found</h1>
        <Button
          onClick={() => router.push(`/employers/${companyId}/feedbacks`)}
          variant="outline"
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feedbacks
        </Button>
      </div>
    )
  }

  const student = feedback.studentRel
  const internship = feedback.internshipRel
  const opportunity = internship?.opportunityRel
  const company = opportunity?.companyRel
  const certificate = internship?.certificateRel

  return (
    <div className="relative p-6 max-w-5xl w-full mx-auto space-y-6">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-amber-100 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-sky-100 opacity-50 blur-3xl" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Feedback Card */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 via-white to-sky-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-amber-100 p-3">
              <MessageSquare className="h-6 w-6 text-amber-700" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{feedback.feedbackText}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Detailed Feedback</h2>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {feedback.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        {student && (
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5 text-sky-600" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border border-slate-200">
                  <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold">
                    {student.name?.slice(0, 2).toUpperCase() || "ST"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-900">{student.name}</h3>
                  <p className="text-sm text-slate-500">{student.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {student.branch && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    {student.branch}
                  </div>
                )}
                {student.batch && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Batch {student.batch}
                  </div>
                )}
                {student.cgpa && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Award className="h-4 w-4 text-slate-400" />
                    CGPA: {student.cgpa}
                  </div>
                )}
                {student.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {student.phone}
                  </div>
                )}
              </div>
              {(student.linkedin || student.github) && (
                <div className="flex items-center gap-3 pt-2">
                  {student.linkedin && (
                    <a
                      href={student.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {student.github && (
                    <a
                      href={student.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-slate-600 hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Internship Information */}
        {internship && opportunity && (
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Internship Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900">{opportunity.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  {company?.name || "Unknown Company"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {opportunity.location}
                </div>
                <Badge variant="outline" className="rounded-full w-fit">
                  {opportunity.type}
                </Badge>
                <div className="flex items-center gap-2 text-slate-600 col-span-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {new Date(internship.startDate).toLocaleDateString()} –{" "}
                  {new Date(internship.endDate).toLocaleDateString()}
                </div>
              </div>
              {internship.salary && (
                <Badge variant="secondary" className="rounded-full">
                  Stipend: {internship.salary}
                </Badge>
              )}
              {internship.performanceReview && (
                <div className="bg-emerald-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-emerald-700">Performance Review</p>
                  <p className="text-emerald-600 mt-1">{internship.performanceReview}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Certificate Information */}
      {certificate && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{certificate.title}</h3>
                <p className="text-sm text-slate-600">Issued by {certificate.issuer}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </p>
              </div>
              <a
                href={certificate.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="rounded-full text-sky-600 border-sky-300 hover:bg-sky-50">
                  View Certificate
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company & Employer Contact */}
      {company && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-slate-200">
                  <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                    {company.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-900">{company.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    {company.industry && <span>{company.industry}</span>}
                    {company.location && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>{company.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Link href={`/employers/${companyId}`}>
                <Button variant="outline" className="rounded-full text-sky-600 border-sky-300 hover:bg-sky-50">
                  View Company Profile
                </Button>
              </Link>
            </div>
            {opportunity?.employerRel && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                  Employer Contact
                </p>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span>{opportunity.employerRel.name}</span>
                  {opportunity.employerRel.position && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>{opportunity.employerRel.position}</span>
                    </>
                  )}
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {opportunity.employerRel.email}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

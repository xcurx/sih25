"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  MessageSquare,
  Building2,
  Calendar,
  User,
  Briefcase,
  Search,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import Loader from "@/components/loader/Loader"
import Link from "next/link"
import { CompanyFeedback, Company } from "@/lib/types"

export default function CompanyFeedbacksPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState<CompanyFeedback[]>([])
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const companyId = params.id as string

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/placementcell/feedback/company/${companyId}`, {
          withCredentials: true,
        })
        if (res.status === 200) {
          setFeedbacks(res.data.feedbacks || [])
          setCompany(res.data.company || null)
        }
      } catch (error: any) {
        console.error("Error fetching feedbacks:", error)
        const message = error.response?.data?.message || "Failed to load feedbacks"
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "placement-cell") {
      fetchFeedbacks()
    }
  }, [status, session?.user?.role, companyId])

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      feedback.feedbackText.toLowerCase().includes(searchLower) ||
      feedback.description.toLowerCase().includes(searchLower) ||
      feedback.studentRel?.name?.toLowerCase().includes(searchLower) ||
      feedback.internshipRel?.opportunityRel?.title?.toLowerCase().includes(searchLower)
    )
  })

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

  return (
    <div className="relative p-6 max-w-6xl w-full mx-auto space-y-6">
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

      {/* Company Info Card */}
      {company && (
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 via-white to-sky-50 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                <AvatarFallback className="bg-amber-100 text-amber-700 text-xl font-bold">
                  {company.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
                  <Badge variant="outline" className="rounded-full bg-amber-50 text-amber-700 border-amber-200">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {feedbacks.length} Feedback{feedbacks.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <p className="text-slate-600 mt-1">{company.description}</p>
                {company.industry && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <Building2 className="h-4 w-4" />
                    {company.industry}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Search Bar */}
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search feedbacks by student, opportunity, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-slate-300 focus:border-sky-500 rounded-lg transition"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feedbacks List */}
      {filteredFeedbacks.length === 0 ? (
        <Card className="rounded-2xl border-slate-200 p-8 text-center">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto" />
          <p className="text-lg font-medium text-slate-600 mt-3">
            {searchTerm ? "No feedbacks match your search" : "No feedbacks yet"}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Feedbacks will appear here when students submit them after completing internships."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <Card
              key={feedback.id}
              className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold">
                        {feedback.studentRel?.name?.slice(0, 2).toUpperCase() || "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {feedback.feedbackText}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-600 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <User className="h-4 w-4 text-slate-400" />
                          {feedback.studentRel?.name || "Unknown Student"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="h-4 w-4 text-slate-400" />
                          {feedback.internshipRel?.opportunityRel?.title || "Unknown Opportunity"}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-3 line-clamp-2">{feedback.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                        {feedback.studentRel?.branch && (
                          <Badge variant="outline" className="rounded-full text-xs">
                            {feedback.studentRel.branch}
                          </Badge>
                        )}
                        {feedback.studentRel?.batch && (
                          <Badge variant="outline" className="rounded-full text-xs">
                            Batch {feedback.studentRel.batch}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={`/employers/${companyId}/feedbacks/${feedback.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-sky-600 border-sky-300 hover:bg-sky-50 shrink-0"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Briefcase, Building2, MapPin, DollarSign, Clock, MessageSquarePlus, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Internship, Feedback } from "@/lib/types"
import Loader from "@/components/loader/Loader"
import FeedbackDialog from "@/components/feedback/FeedbackDialog"

export default function StudentInternshipsPage() {
  const { data: session, status } = useSession()
  const [internships, setInternships] = useState<Internship[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<{
    id: string
    opportunityTitle: string
    companyName: string
  } | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [internshipsRes, feedbacksRes] = await Promise.all([
        fetch("/api/student/internship/get-internships"),
        fetch("/api/student/feedback"),
      ])
      const internshipsData = await internshipsRes.json()
      const feedbacksData = await feedbacksRes.json()
      setInternships(internshipsData.internships || [])
      setFeedbacks(feedbacksData.feedbacks || [])
    } catch (e) {
      console.error(e)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === "student") {
      loadData()
    }
  }, [session?.user])

  const groupedByOpportunity = useMemo(() => {
    const map = new Map<string, { opportunity: Internship["opportunityRel"]; items: Internship[] }>()
    for (const it of internships) {
      const key = it.opportunityRel.id
      if (!map.has(key)) {
        map.set(key, { opportunity: it.opportunityRel, items: [] })
      }
      map.get(key)!.items.push(it)
    }
    return Array.from(map.values())
  }, [internships])

  const now = new Date()

  const getInternshipStatus = (start: Date, end: Date) => {
    if (start > now) return { label: "Not started", color: "bg-slate-100 text-slate-700" }
    if (end >= now) return { label: "Ongoing", color: "bg-green-100 text-green-700" }
    return { label: "Completed", color: "bg-sky-100 text-sky-700" }
  }

  const hasFeedback = (internshipId: string) => {
    return feedbacks.some((f) => f.internshipId === internshipId)
  }

  const handleAddFeedback = (internship: Internship) => {
    setSelectedInternship({
      id: internship.id,
      opportunityTitle: internship.opportunityRel.title,
      companyName: internship.opportunityRel.companyRel.name,
    })
    setFeedbackDialogOpen(true)
  }

  const handleFeedbackSuccess = () => {
    loadData()
  }

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "student") {
    redirect("/sign-in")
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Internship Tracker</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">My Internships</h1>
            <p className="mt-2 text-sm text-slate-600">
              Track your internship experiences grouped by opportunity
            </p>
          </div>
        </div>

        {/* Stats Cards inside gradient */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Internships</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                <Briefcase className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{internships.length}</div>
              <p className="text-xs text-slate-500">All experiences</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Ongoing</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">
                {internships.filter((it) => {
                  const start = new Date(it.startDate)
                  const end = new Date(it.endDate)
                  return start <= now && end >= now
                }).length}
              </div>
              <p className="text-xs text-slate-500">Active now</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Companies</CardTitle>
              <div className="rounded-full p-2 bg-blue-50 text-blue-600">
                <Building2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{groupedByOpportunity.length}</div>
              <p className="text-xs text-slate-500">Unique organizations</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Internships List */}
      {groupedByOpportunity.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Briefcase className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">No internships yet</h3>
          <p className="text-slate-500">
            Apply to opportunities and get accepted to see your internships here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByOpportunity.map(({ opportunity, items }) => {
            const company = opportunity.companyRel
            return (
              <Card key={opportunity.id} className="overflow-hidden rounded-xl border-slate-200 shadow-lg">
                {/* Opportunity Header */}
                <div className="bg-gradient-to-r from-white to-sky-50 p-5 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold">
                        {company.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{opportunity.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="h-4 w-4" /> {company.name}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {opportunity.location}
                        </span>
                        <span className="text-slate-300">•</span>
                        <Badge variant="outline" className="rounded-full">
                          {opportunity.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {/* Opportunity dates and salary */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {new Date(opportunity.startDate).toLocaleDateString()} – {new Date(opportunity.endDate).toLocaleDateString()}
                    </span>
                    {opportunity.salary && (
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        {opportunity.salary}
                      </span>
                    )}
                  </div>
                </div>

                {/* Internship Items */}
                <div className="divide-y divide-slate-100 bg-white">
                  {items.map((it) => {
                    const start = new Date(it.startDate)
                    const end = new Date(it.endDate)
                    const statusInfo = getInternshipStatus(start, end)
                    const isCompleted = end < now
                    const feedbackSubmitted = hasFeedback(it.id)
                    return (
                      <div key={it.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </div>
                          <div className="text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-4 w-4 text-slate-400" />
                              {start.toLocaleDateString()} – {end.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {it.salary && (
                            <Badge variant="secondary" className="rounded-full">
                              {it.salary}
                            </Badge>
                          )}
                          {it.performanceReview && (
                            <Badge variant="outline" className="rounded-full">
                              Review: {it.performanceReview}
                            </Badge>
                          )}
                          {/* Feedback button - only show for completed internships */}
                          {isCompleted && (
                            feedbackSubmitted ? (
                              <Badge variant="outline" className="rounded-full bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Feedback Submitted
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddFeedback(it)}
                                className="rounded-full text-sky-600 border-sky-300 hover:bg-sky-50"
                              >
                                <MessageSquarePlus className="h-4 w-4 mr-1" />
                                Add Feedback
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Feedback Dialog */}
      {selectedInternship && (
        <FeedbackDialog
          internshipId={selectedInternship.id}
          opportunityTitle={selectedInternship.opportunityTitle}
          companyName={selectedInternship.companyName}
          isOpen={feedbackDialogOpen}
          onClose={() => {
            setFeedbackDialogOpen(false)
            setSelectedInternship(null)
          }}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  )
}
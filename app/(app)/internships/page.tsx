"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Briefcase, Building2, MapPin, DollarSign, Clock, MessageSquarePlus, CheckCircle2, MessageSquare } from "lucide-react"
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
    <div className="p-6 max-w-6xl w-full mx-auto space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Internships</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">My Internships</h1>
          <p className="mt-2 text-sm text-slate-600">
            Track your internship experiences grouped by opportunity
          </p>
        </div>
    <br></br>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="rounded-2xl border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Internships</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{internships.length}</p>
        </Card>
        <Card className="rounded-2xl border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ongoing</p>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {internships.filter((it) => {
              const start = new Date(it.startDate)
              const end = new Date(it.endDate)
              return start <= now && end >= now
            }).length}
          </p>
        </Card>
        <Card className="rounded-2xl border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Companies</p>
          <p className="mt-2 text-3xl font-semibold text-sky-600">{groupedByOpportunity.length}</p>
        </Card>
      </div>
    
    </section>

      {/* Internships List */}
      {groupedByOpportunity.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Briefcase className="mx-auto h-16 w-16 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-900">No internships yet</p>
          <p className="mt-2 text-sm text-slate-600">Apply to opportunities and get accepted to see your internships here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByOpportunity.map(({ opportunity, items }) => {
            const company = opportunity.companyRel
            return (
              <div key={opportunity.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="bg-gradient-to-r from-white to-sky-50 p-6">
                {/* Opportunity Header */}
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
                <div className="divide-y divide-slate-100">
                  {items.map((it) => {
                    const start = new Date(it.startDate)
                    const end = new Date(it.endDate)
                    const statusInfo = getInternshipStatus(start, end)
                    const isCompleted = end < now
                    const feedbackSubmitted = hasFeedback(it.id)
                    return (
                      <div key={it.id} className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
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

                        {/* Employer Remarks - show for completed internships with remarks */}
                        {isCompleted && it.employerRemarks && (
                          <div className="mt-4 rounded-xl bg-amber-50/70 border border-amber-100 p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <MessageSquare className="h-4 w-4 text-amber-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">Employer Remarks</p>
                                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{it.employerRemarks}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
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
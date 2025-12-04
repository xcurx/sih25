"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Briefcase, Building2, MapPin, DollarSign, Clock } from "lucide-react"
import { toast } from "sonner"
import { Internship } from "@/lib/types"
import Loader from "@/components/loader/Loader"

export default function StudentInternshipsPage() {
  const { data: session, status } = useSession()
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/student/internship/get-internships")
        const data = await res.json()
        setInternships(data.internships || [])
      } catch (e) {
        console.error(e)
        toast.error("Failed to load internships")
      } finally {
        setLoading(false)
      }
    }
    if (session?.user?.role === "student") {
      load()
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

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "student") {
    redirect("/sign-in")
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* Hero Section */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-50 via-white to-sky-50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-sky-100 p-2 shadow-inner">
            <Briefcase className="h-5 w-5 text-sky-700" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">My Internships</h1>
            <p className="text-sm text-slate-600">Track your internship experiences grouped by opportunity</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Internships</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{internships.length}</p>
        </Card>
        <Card className="rounded-2xl border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ongoing</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {internships.filter((it) => {
              const start = new Date(it.startDate)
              const end = new Date(it.endDate)
              return start <= now && end >= now
            }).length}
          </p>
        </Card>
        <Card className="rounded-2xl border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Companies</p>
          <p className="mt-1 text-2xl font-semibold text-sky-600">{groupedByOpportunity.length}</p>
        </Card>
      </div>

      {/* Internships List */}
      {groupedByOpportunity.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-lg font-medium">No internships yet</p>
          <p className="mt-1 text-sm">Apply to opportunities and get accepted to see your internships here.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {groupedByOpportunity.map(({ opportunity, items }) => {
            const company = opportunity.companyRel
            return (
              <Card key={opportunity.id} className="overflow-hidden rounded-2xl border-slate-200">
                {/* Opportunity Header */}
                <div className="bg-gradient-to-r from-white to-sky-50 p-5">
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
    </div>
  )
}

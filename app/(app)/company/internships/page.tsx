"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, Calendar, Users, CheckCircle, MapPin, GraduationCap, Mail, Phone } from "lucide-react"
import { Internship } from "@/lib/types"
import axios from "axios"
import Loader from "@/components/loader/Loader"

export default function EmployerInternshipsPage() {
  const { data: session, status } = useSession()
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await axios.get("/api/employer/internship/get-internships", { withCredentials: true })
        if (res.status === 200) {
          setInternships(res.data.internships)
        }
      } catch (error) {
        console.error("Error fetching internships:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "employer") {
    redirect("/sign-in")
  }

  // Calculate stats
  const totalInterns = internships.length
  const activeInterns = internships.filter(i => new Date(i.endDate) >= new Date()).length
  const completedInterns = internships.filter(i => new Date(i.endDate) < new Date()).length

  // Group internships by opportunity
  const internshipsByOpportunity = internships.reduce((acc, intern) => {
    const oppId = intern.opportunityId
    if (!acc[oppId]) {
      acc[oppId] = {
        opportunity: intern.opportunityRel,
        interns: []
      }
    }
    acc[oppId].interns.push(intern)
    return acc
  }, {} as Record<string, { opportunity: Internship['opportunityRel'], interns: Internship[] }>)

  const uniqueOpportunities = Object.keys(internshipsByOpportunity).length

  const quickStats = [
    { label: "Total Interns", value: totalInterns, icon: Users, caption: "All internships" },
    { label: "Active Interns", value: activeInterns, icon: Briefcase, caption: "Currently working" },
    { label: "Completed", value: completedInterns, icon: CheckCircle, caption: "Finished internships" },
    { label: "Opportunities", value: uniqueOpportunities, icon: Calendar, caption: "With interns" },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const isActive = (startDate: string, endDate: string) => {
    if (new Date(startDate) >= new Date()) {
      return "Not started"
    } else if (new Date(endDate) <= new Date()) {
      return "Completed"  
    } else {
      return "Active"
    }
  }

  return (
    <div className="relative space-y-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.15),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.18),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.85),transparent)]"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Internship Manager</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Track and manage your company&apos;s interns</h1>
            <p className="mt-2 text-sm text-slate-600">
              View all interns working at your company across different opportunities.
            </p>
          </div>
          <div className="grid gap-4 rounded-[28px] border border-white/50 bg-white/85 p-6 sm:grid-cols-2">
            {quickStats.slice(0, 2).map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-slate-100 bg-white p-4 text-slate-800 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 bg-white/90 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
              <div className="rounded-full bg-sky-50 p-2 text-sky-600">
                <stat.icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Internships by Opportunity */}
      {Object.keys(internshipsByOpportunity).length === 0 ? (
        <Card className="border-slate-200 bg-white/90 shadow-lg">
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-lg font-medium text-slate-700">No interns yet</p>
              <p className="mt-1 text-sm text-slate-500">Once students are accepted for internships, they will appear here.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        Object.values(internshipsByOpportunity).map(({ opportunity, interns }) => (
          <Card key={opportunity.id} className="border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900">{opportunity.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {opportunity.location} · {opportunity.type}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full border-slate-200 text-slate-600">
                  {interns.length} intern{interns.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Duration: {new Date(opportunity.startDate).toLocaleDateString()} – {new Date(opportunity.endDate).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {interns.map((intern) => (
                <div key={intern.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-sky-100">
                      <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-white">
                        {getInitials(intern.studentRel.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{intern.studentRel.name}</h3>
                        <Badge 
                          variant={isActive(intern.startDate, intern.endDate) == "Active" ? "secondary" : "outline"} 
                          className={`rounded-full ${isActive(intern.startDate, intern.endDate) == "Active" ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}
                        >
                          {isActive(intern.startDate, intern.endDate)}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {intern.studentRel.email}
                        </span>
                        {intern.studentRel.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {intern.studentRel.phone}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        {intern.studentRel.branch && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5" />
                            {intern.studentRel.branch} {intern.studentRel.batch && `• Batch ${intern.studentRel.batch}`}
                          </span>
                        )}
                        {intern.studentRel.cgpa && (
                          <span>CGPA: {intern.studentRel.cgpa}</span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>
                          Internship: {new Date(intern.startDate).toLocaleDateString()} – {new Date(intern.endDate).toLocaleDateString()}
                        </span>
                        {intern.salary && (
                          <Badge variant="outline" className="rounded-full text-xs">
                            ₹{intern.salary}
                          </Badge>
                        )}
                      </div>
                      {intern.performanceReview && (
                        <div className="mt-3 rounded-lg bg-white/80 border border-slate-100 p-3">
                          <p className="text-xs font-medium text-slate-600 mb-1">Performance Review:</p>
                          <p className="text-sm text-slate-700">{intern.performanceReview}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

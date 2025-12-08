"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Briefcase, Calendar, CheckCircle, FileText } from "lucide-react"

import { Opportunity, Student } from "@/lib/types"
import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { redirect, useRouter } from "next/navigation"
import Loader from "@/components/loader/Loader"
import { useSession } from "next-auth/react"

export default function EmplyersApplicationsPage() {
  const { data: session, status } = useSession()
  const [students, setStudents] = useState<Student[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const getOpportunities = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/employer/get-company-opportunities", { withCredentials: true })
      if (res.status === 200) {
        setOpportunities(res.data.opportunities)
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOpportunities()
  }, [])

  if (status === "loading" || status === "unauthenticated" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "employer") {
    redirect("/")
  }

  const quickStats = [
    { label: "Active jobs", value: opportunities.length, icon: Briefcase, caption: "Live postings" },
    { label: "Applications", value: students.length, icon: FileText, caption: "Total received" },
    { label: "Interview queue", value: "0", icon: Calendar, caption: "Awaiting scheduling" },
    { label: "Offers released", value: "0", icon: CheckCircle, caption: "This quarter" },
  ]

  return (
    <div className="relative space-y-8">
      {/* <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.15),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.18),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.85),transparent)]"
        aria-hidden="true"
      /> */}

      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Applications desk</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Monitor opportunity performance and act fast.</h1>
            <p className="mt-2 text-sm text-slate-600">
              Every posting, candidate count, and next action is summarised right here.
            </p>
          </div>
          {/* <div className="grid gap-4 rounded-[28px] border border-white/50 bg-white/85 p-6 sm:grid-cols-2">
            {quickStats.slice(0, 2).map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-slate-100 bg-white p-4 text-slate-800 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.caption}</p>
              </div>
            ))}
          </div> */}
        </div>
      <br></br>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    {quickStats.map((stat) => (
        <Card 
            key={stat.label} 
            // MODIFIED: Changed shadow-sm to shadow-md to make the shadow visible before hover.
            className="border-slate-200 bg-white/90 shadow-md hover:shadow-xl transition-shadow"
        >
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
      </section>

      <Card className="border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900">Job performance</CardTitle>
              <CardDescription>Application statistics for your job postings</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full border-slate-200 text-slate-600">
              Updated moments ago
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.slice(0, 6).map((job) => (
            <div key={job.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-500">
                    {job.location} · {job.type}
                  </p>
                </div>
                <Badge variant={job.status === "active" ? "secondary" : "outline"} className="rounded-full">
                  {job.status}
                </Badge>
              </div>
              <div className="mt-4 grid gap-4 rounded-2xl border border-white bg-white/90 p-4 text-center sm:grid-cols-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{job._count.applications}</p>
                  <p className="text-xs text-slate-500">Applications</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">0</p>
                  <p className="text-xs text-slate-500">Shortlisted</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">0</p>
                  <p className="text-xs text-slate-500">Interviews</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">0</p>
                  <p className="text-xs text-slate-500">Offers</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">Remember to update shortlist decisions to unlock analytics.</p>
                <Button
                  className="rounded-full bg-sky-600 text-white hover:bg-sky-500"
                  onClick={() => {
                    router.push(`/company/applications/${job.id}`)
                  }}
                >
                  View applications
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
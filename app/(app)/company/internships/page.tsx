"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Briefcase, Calendar, Users, CheckCircle } from "lucide-react"
import { Opportunity } from "@/lib/types"
import axios from "axios"
import Loader from "@/components/loader/Loader"

export default function EmployerInternshipsPage() {
  const { data: session, status } = useSession()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
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
    load()
  }, [])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "employer") {
    redirect("/sign-in")
  }

  const quickStats = [
    { label: "Active Opportunities", value: opportunities.filter(o => o.status === "active").length, icon: Briefcase, caption: "Open positions" },
    { label: "Total Opportunities", value: opportunities.length, icon: Calendar, caption: "All postings" },
    { label: "With Interns", value: 0, icon: Users, caption: "Active internships" },
    { label: "Completed", value: 0, icon: CheckCircle, caption: "Finished internships" },
  ]

  return (
    <div className="relative space-y-8">
      {/* <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.15),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.18),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.85),transparent)]"
        aria-hidden="true"
      /> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Internship Manager</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Track and manage your company&apos;s interns</h1>
            <p className="mt-2 text-sm text-slate-600">
              Select an opportunity to view and manage the interns working under it.
            </p>
          </div>
          {/* <div className="grid gap-4 rounded-[28px] border border-white/50 bg-white/85 p-6 sm:grid-cols-2"> */}
            {/* {quickStats.slice(0, 2).map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-slate-100 bg-white p-4 text-slate-800 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.caption}</p>
              </div>
            ))} */}
          {/* </div> */}
        </div>
        <br></br>
  

      {/* Stats Grid */}
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    {quickStats.map((stat) => (
        <Card 
            key={stat.label} 
            // MODIFIED: Changed shadow-sm to shadow-md for better visibility, and added hover:shadow-xl and transition-shadow.
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

      {/* Opportunities List */}
      <Card className="border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900">Your Opportunities</CardTitle>
              <CardDescription>Select an opportunity to view its interns</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full border-slate-200 text-slate-600">
              {opportunities.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-8 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-lg font-medium text-slate-700">No opportunities yet</p>
              <p className="mt-1 text-sm text-slate-500">Post a job opportunity to start hiring interns.</p>
            </div>
          ) : (
            opportunities.map((job) => (
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
                <div className="mt-4 grid gap-4 rounded-2xl border border-white bg-white/90 p-4 text-center sm:grid-cols-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{job._count?.applications || 0}</p>
                    <p className="text-xs text-slate-500">Applications</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">–</p>
                    <p className="text-xs text-slate-500">Active Interns</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">–</p>
                    <p className="text-xs text-slate-500">Completed</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    Duration: {new Date(job.startDate).toLocaleDateString()} – {new Date(job.endDate).toLocaleDateString()}
                  </p>
                  <Button
                    className="rounded-full bg-sky-600 text-white hover:bg-sky-500"
                    onClick={() => router.push(`/company/internships/${job.id}`)}
                  >
                    View Interns
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

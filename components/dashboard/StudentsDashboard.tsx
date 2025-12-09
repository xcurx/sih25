"use client"

import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, Calendar, CheckCircle2, FileText, GraduationCap, Layers, MapPin, Sparkles, User, Briefcase, Award, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import Loader from "../loader/Loader"
import Link from "next/link"

interface Opportunity {
  id: string
  title: string
  type: string
  location: string
  company?: string
  companyRel?: {
    name: string
  }
}

interface UpcomingInterview {
  id: string
  date: string
  status: string
  opportunityTitle: string
  companyName: string
}

interface DashboardStats {
  student: {
    cgpa: number
    placed: boolean
  }
  profileCompleteness: number
  stats: {
    totalApplications: number
    scheduledInterviewsCount: number
  }
  upcomingInterviews: UpcomingInterview[]
  recentOpportunities: Opportunity[]
}

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/student/dashboard-stats", { withCredentials: true })
      if (res.status === 200) {
        setDashboardData(res.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
    }
  }, [status])

  // Profile score breakdown (static for now)
  const profileScore = {
    total: dashboardData?.profileCompleteness || 78,
    breakdown: [
      { label: "Basic Info", score: 100, icon: User },
      { label: "Resume", score: 85, icon: FileText },
      { label: "Skills", score: 70, icon: Briefcase },
      { label: "Projects", score: 60, icon: BookOpen },
      { label: "Certifications", score: 75, icon: Award },
    ]
  }

  // Derived data
  const opportunities = dashboardData?.recentOpportunities?.slice(0, 4) || []
  const upcomingInterviews = dashboardData?.upcomingInterviews || []
  const stats = {
    applications: dashboardData?.stats?.totalApplications || 0,
    interviews: dashboardData?.stats?.scheduledInterviewsCount || 0,
    cgpa: dashboardData?.student?.cgpa || 0,
  }

  const isPlaced = dashboardData?.student?.placed || false

  if (status === "loading" || loading) {
    return <Loader />
  }

  return (
    <div className="space-y-8">
      {/* Placed Banner */}
      {isPlaced && (
        <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Briefcase className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">You are already placed</h3>
              <p className="text-sm text-amber-700">
                You cannot apply to new opportunities. Check your internship details for next steps.
              </p>
            </div>
            <Link href="/internships">
              <Button className="rounded-full bg-amber-600 text-white hover:bg-amber-500">
                View Internship
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section with Stats */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">Student Dashboard</p>
            <p className="mt-2 text-sm text-slate-800">
              Track your placement journey and stay ahead of every deadline.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-sky-600 text-white hover:bg-sky-500"
            >
              <a href="/jobs">
                Explore matches
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
            >
              <a href="/profile">Update profile</a>
            </Button>
          </div>
        </div>

        {/* Stats Cards inside gradient */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800">Applications</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{stats.applications}</div>
              <p className="text-xs text-slate-700">Total submitted</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800">Interview Pipeline</CardTitle>
              <div className="rounded-full p-2 bg-cyan-50 text-cyan-600">
                <Calendar className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{stats.interviews}</div>
              <p className="text-xs text-slate-700">Scheduled</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800">Profile Score</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                <Sparkles className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{profileScore.total}%</div>
              <p className="text-xs text-slate-700">Complete your profile</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800">CGPA</CardTitle>
              <div className="rounded-full p-2 bg-blue-50 text-blue-600">
                <GraduationCap className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{stats.cgpa || "N/A"}</div>
              <p className="text-xs text-slate-700">Current semester</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Opportunity Radar & Interview Timeline */}
      <div className={`grid gap-3 ${upcomingInterviews.length > 0 ? "lg:grid-cols-[2fr,1fr]" : ""}`}>
        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-900">Opportunity radar</CardTitle>
                <CardDescription className="text-sm text-slate-800">Recent opportunities for you</CardDescription>
              </div>
              <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                Latest
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pt-5">
            {opportunities.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No opportunities available at the moment.
              </div>
            ) : (
              opportunities.map((job: Opportunity) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-sky-200 hover:bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-800">{job.company || job.companyRel?.name || "Company"}</p>
                    </div>
                    <Badge variant="secondary" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-800">
                    <div className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-emerald-700">
                      <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {job.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm" className="rounded-full bg-sky-600 text-white hover:bg-sky-500">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Interview Timeline - Only show when there are interviews */}
        {upcomingInterviews.length > 0 && (
          <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
            <CardHeader className="border-b border-slate-100 pb-0">
              <CardTitle className="text-lg text-slate-900">Interview timeline</CardTitle>
              <CardDescription className="text-sm text-slate-800">Your upcoming interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {upcomingInterviews.map((interview: UpcomingInterview) => (
                <div key={interview.id} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full border border-sky-200 bg-sky-100" />
                    <div className="mt-1 h-full w-px bg-slate-200" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{interview.opportunityTitle}</p>
                    <p className="text-xs text-slate-700">{interview.companyName}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-800">
                      <span>
                        {interview.date 
                          ? new Date(interview.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "TBD"
                        }
                      </span>
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                        Scheduled
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 text-sm text-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  Interview tip
                </div>
                <p className="mt-1 text-xs text-slate-700">
                  Prepare well and arrive 10 minutes early. Good luck!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Profile Score Section */}
      <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-slate-900">Profile Score</CardTitle>
              <CardDescription className="text-sm text-slate-800">Complete your profile to improve visibility</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-sky-600">{profileScore.total}%</span>
              <div className="h-12 w-12 rounded-full border-4 border-sky-200 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-sky-600" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {profileScore.breakdown.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-800">{item.label}</span>
                </div>
                <Progress
                  value={item.score}
                  className="h-2 rounded-full bg-slate-200 [&_[data-slot=progress-indicator]]:bg-sky-600"
                />
                <p className="mt-2 text-right text-xs text-slate-600">{item.score}%</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline" className="rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50">
              <a href="/profile">
                Complete Your Profile
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
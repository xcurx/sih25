"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  FileText,
  GraduationCap,
  Layers,
  MapPin,
  Sparkles,
  Award,
  FolderKanban,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

interface DashboardStats {
  student: {
    id: string
    name: string
    email: string
    branch: string | null
    batch: number | null
    cgpa: number | null
  }
  profileCompleteness: number
  stats: {
    applicationsThisMonth: number
    applicationsLastMonth: number
    applicationsDiff: number
    totalApplications: number
    shortlistedCount: number
    appliedCount: number
    acceptedCount: number
    rejectedCount: number
    totalInterviews: number
    scheduledInterviewsCount: number
    internshipsCount: number
    activeInternships: number
    certificatesCount: number
    projectsCount: number
    unreadNotifications: number
  }
  upcomingInterviews: {
    id: string
    title: string
    company: string
    scheduledAt: string
    status: string
    interviewLink: string
  }[]
  recentOpportunities: {
    id: string
    title: string
    company: string
    companyId: string
    type: string
    location: string
    salary: string | null
    applicationDeadline: string
    applied: boolean
    applicationsCount: number
  }[]
}

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/student/dashboard-stats")
        if (res.ok) {
          const data = await res.json()
          setDashboardData(data)
        } else {
          toast.error("Failed to load dashboard data")
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error)
        toast.error("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === "student") {
      fetchDashboardData()
    }
  }, [session?.user])

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Failed to load dashboard data</p>
      </div>
    )
  }

  const { student, profileCompleteness, stats, upcomingInterviews, recentOpportunities } = dashboardData

  const formatInterviewDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="relative space-y-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.15),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(37,99,235,0.2),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.8),transparent)]"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-600 via-sky-500 to-blue-500 p-8 text-white shadow-2xl">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative space-y-6">
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
              Student cockpit
            </Badge>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Good day, {student.name}
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                Track your placement journey and stay ahead of every deadline.
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="secondary"
                className="rounded-full bg-white/20 text-white hover:bg-white/30"
              >
                <Link href="/jobs">
                  Explore opportunities
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                <Link href="/profile">Update profile</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                  Applications this month
                </p>
                <p className="text-2xl font-semibold">{stats.applicationsThisMonth}</p>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  {stats.applicationsDiff >= 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3" />+{stats.applicationsDiff} vs last month
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3" />
                      {stats.applicationsDiff} vs last month
                    </>
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Interview pipeline</p>
                <p className="text-2xl font-semibold">{stats.totalInterviews}</p>
                <p className="text-xs text-white/80">{stats.scheduledInterviewsCount} scheduled</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Profile strength</p>
                <p className="text-2xl font-semibold">{profileCompleteness}%</p>
                <p className="text-xs text-white/80">
                  {profileCompleteness >= 80
                    ? "Great momentum"
                    : profileCompleteness >= 50
                    ? "Good progress"
                    : "Needs attention"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completeness Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Profile completeness</p>
              <h2 className="text-3xl font-bold text-slate-900">{profileCompleteness}%</h2>
            </div>
            <div className="rounded-full bg-sky-50 p-4">
              <Sparkles className="h-6 w-6 text-sky-600" aria-hidden="true" />
            </div>
          </div>
          <Progress value={profileCompleteness} className="mt-4 h-3 rounded-full bg-slate-100" />
          <p className="mt-3 text-sm text-slate-500">
            {profileCompleteness < 100
              ? "Complete your profile to unlock all opportunities and fast-track interviews."
              : "Your profile is complete! You're ready for all opportunities."}
          </p>
          <div className="mt-6 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Total Applications</p>
                  <p className="text-xs text-slate-500">{stats.shortlistedCount} shortlisted</p>
                </div>
              </div>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                {stats.totalApplications}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Internships</p>
                  <p className="text-xs text-slate-500">{stats.activeInternships} active</p>
                </div>
              </div>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                {stats.internshipsCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Certificates</p>
                  <p className="text-xs text-slate-500">Achievements earned</p>
                </div>
              </div>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                {stats.certificatesCount}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-slate-500">Total Applications</CardTitle>
            <div className="rounded-full p-2 bg-sky-50 text-sky-700">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{stats.totalApplications}</p>
            <p className="text-xs text-slate-500">
              {stats.shortlistedCount} shortlisted · {stats.appliedCount} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-slate-500">Interviews</CardTitle>
            <div className="rounded-full p-2 bg-cyan-50 text-cyan-700">
              <Calendar className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{stats.totalInterviews}</p>
            <p className="text-xs text-slate-500">{stats.scheduledInterviewsCount} upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-slate-500">CGPA</CardTitle>
            <div className="rounded-full p-2 bg-blue-50 text-blue-700">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">
              {student.cgpa?.toFixed(2) || "N/A"}
            </p>
            <p className="text-xs text-slate-500">{student.branch || "Branch not set"}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-slate-500">Projects</CardTitle>
            <div className="rounded-full p-2 bg-indigo-50 text-indigo-700">
              <FolderKanban className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{stats.projectsCount}</p>
            <p className="text-xs text-slate-500">Portfolio projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities and Interviews */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Recent Opportunities */}
        <Card className="border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900">Opportunity radar</CardTitle>
                <CardDescription>Roles matching your profile</CardDescription>
              </div>
              <Link href="/jobs">
                <Badge
                  variant="outline"
                  className="border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  View all
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOpportunities.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Briefcase className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p>No matching opportunities available</p>
                <p className="text-xs mt-1">Check back later for new openings</p>
              </div>
            ) : (
              recentOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-sky-200 hover:bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{opp.title}</h3>
                      <p className="text-sm text-slate-500">{opp.company}</p>
                    </div>
                    <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                      {opp.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                      <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {opp.location}
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                      <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      Deadline: {new Date(opp.applicationDeadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {opp.applied ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Applied
                      </Badge>
                    ) : (
                      <Link href={`/jobs/${opp.id}`}>
                        <Button
                          size="sm"
                          className="rounded-full bg-sky-600 text-white hover:bg-sky-500"
                        >
                          View & Apply
                        </Button>
                      </Link>
                    )}
                    <span className="text-xs text-slate-500">
                      {opp.applicationsCount} application{opp.applicationsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Interview timeline</CardTitle>
            <CardDescription>Stay synced with upcoming rounds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p>No upcoming interviews</p>
                <p className="text-xs mt-1">Apply to opportunities to get interviews</p>
              </div>
            ) : (
              upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full border border-sky-200 bg-sky-100" />
                    <div className="mt-1 h-full w-px bg-slate-200" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{interview.title}</p>
                    <p className="text-xs text-slate-500">{interview.company}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                      <span>{formatInterviewDate(interview.scheduledAt)}</span>
                      <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                        {interview.status}
                      </Badge>
                    </div>
                    {interview.interviewLink && (
                      <a
                        href={interview.interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-sky-600 hover:underline"
                      >
                        Join Interview
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                Quick tip
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Review the job description and prepare questions before each interview.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Status Summary */}
      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.appliedCount}</p>
              </div>
              <div className="rounded-full p-3 bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Shortlisted</p>
                <p className="text-2xl font-bold text-sky-600">{stats.shortlistedCount}</p>
              </div>
              <div className="rounded-full p-3 bg-sky-50">
                <Layers className="h-5 w-5 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Accepted</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.acceptedCount}</p>
              </div>
              <div className="rounded-full p-3 bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Internships</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeInternships}</p>
              </div>
              <div className="rounded-full p-3 bg-purple-50">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

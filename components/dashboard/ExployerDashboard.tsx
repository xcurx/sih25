import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Briefcase, Calendar, CheckCircle, FileText, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Opportunity, Student } from "@/lib/types"
import axios from "axios"
import Loader from "../loader/Loader"
import Link from "next/link"

interface DashboardStats {
  activeJobs: number
  totalApplications: number
  interviewsScheduled: number
  offers: number
  shortlisted: number
  thisWeekApplications: number
}

interface JobPipeline {
  id: string
  title: string
  totalApplications: number
  applied: number
  reviewed: number
  shortlisted: number
  rejected: number
  accepted: number
  status?: string
}

export default function EmployerDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pipeline, setPipeline] = useState<JobPipeline[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [loadingOpportunities, setLoadingOpportunities] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingPipeline, setLoadingPipeline] = useState(true)

  const getStudents = async () => {
    setLoadingStudents(true)
    try {
      const res = await axios.get("/api/employer/get-applied-students", { withCredentials: true })
      if (res.status === 200) {
        setStudents(res.data.applications.map((app: any) => app.studentRel))
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const getOpportunities = async () => {
    setLoadingOpportunities(true)
    try {
      const res = await axios.get("/api/employer/get-company-opportunities", { withCredentials: true })
      if (res.status === 200) {
        setOpportunities(res.data.opportunities)
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error)
    } finally {
      setLoadingOpportunities(false)
    }
  }

  const getStats = async () => {
    setLoadingStats(true)
    try {
      const res = await axios.get("/api/employer/dashboard/stats", { withCredentials: true })
      if (res.status === 200) {
        setStats(res.data.stats)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  const getPipeline = async () => {
    setLoadingPipeline(true)
    try {
      const res = await axios.get("/api/employer/dashboard/pipeline", { withCredentials: true })
      if (res.status === 200) {
        setPipeline(res.data.pipeline)
      }
    } catch (error) {
      console.error("Error fetching pipeline data:", error)
    } finally {
      setLoadingPipeline(false)
    }
  }

  useEffect(() => {
    getStudents()
    getOpportunities()
    getStats()
    getPipeline()
  }, [])

  // Filter to get unique students by ID
  const uniqueStudents = useMemo(() => {
    const seen = new Set<string>()
    return students.filter(student => {
      if (seen.has(student.id)) {
        return false
      }
      seen.add(student.id)
      return true
    })
  }, [students])

  const quickStats = useMemo(
    () => [
      { label: "Active jobs", value: stats?.activeJobs ?? 0, icon: Briefcase, caption: "Currently published" },
      { label: "Applications", value: stats?.totalApplications ?? 0, icon: FileText, caption: `${stats?.thisWeekApplications ?? 0} this week` },
      { label: "Interview queue", value: stats?.interviewsScheduled ?? 0, icon: Calendar, caption: "Schedule interviews" },
      { label: "Offers", value: stats?.offers ?? 0, icon: CheckCircle, caption: `${stats?.shortlisted ?? 0} shortlisted` },
    ],
    [stats],
  )

  const heroStats = quickStats

  return (
    <div className="relative space-y-8">
      {/* Global blue gradient removed as per previous request */}
      {/* <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.2),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.18),transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.9),transparent)]"
        aria-hidden="true"
      /> */}

      {/* MODIFIED SECTION: Using the new light gradient and structure */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          {/* LEFT CONTENT AREA: Updated to match the new text structure and colors */}
          <div className="space-y-4">
            {/* The old Badge and heading structure is replaced by the new text block */}
            
            {/* START OF NEW TEXT BLOCK */}
            <div> 
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Applications desk</p>
                {/* The title from the image is slightly different from the old title, keeping the old font size/weight */}
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Monitor opportunity performance and act fast.</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Every posting, candidate count, and next action is summarised right here.
                </p>
            </div>
            {/* END OF NEW TEXT BLOCK */}

            {/* Post New Job Button */}
            <Button asChild className="bg-sky-600 hover:bg-sky-700 rounded-full shadow-md">
              <Link href="/post-jobs-employer">
                <Plus className="mr-2 h-4 w-4" />
                Post New Job
              </Link>
            </Button>
          </div>
          
          {/* RIGHT STATS AREA: Styling updated to match the new light background aesthetic */}
        <div className="grid gap-4 rounded-[20px] p-0 sm:grid-cols-2">
</div>
        </div>
    <br></br>

      {/* The bottom row of quick stats (which duplicates the hero stats) is kept here but might be redundant after the hero change */}
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
        </section>

      <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <Card className="border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Candidate radar</CardTitle>
            <CardDescription>Latest applicants across your open roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingStudents && <Loader />}
            {!loadingStudents && uniqueStudents.length === 0 && (
              <p className="text-sm text-center text-slate-500">No applications yet.</p>
            )}
            {uniqueStudents.slice(0, 4).map((student) => (
              <div
                key={student.id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 transition hover:border-sky-200 hover:bg-white md:flex-row md:items-center"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-white">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-500">
                      {student.branch} · CGPA {student.cgpa}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-wrap gap-2">
                  {student.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="rounded-full border-sky-200 bg-white text-xs text-sky-700 hover:bg-sky-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Link href={`/students/${student.id}`}>
                  <Button size="sm" className="rounded-full bg-sky-600 text-white hover:bg-sky-700">
                    Profile
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Pipeline health</CardTitle>
            <CardDescription>Realtime view of your job postings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingPipeline && <Loader />}
            {!loadingPipeline && pipeline.length === 0 && (
              <p className="text-sm text-center text-slate-500">No job postings yet.</p>
            )}
            {pipeline.slice(0, 4).map((job) => {
              const status = job.status || "active"
              const statusLower = status.toLowerCase()
              const isActive = statusLower === "active"
              const isExpired = statusLower === "expired" || statusLower === "closed"
              return (
              <div key={job.id} className="rounded-2xl border-2 border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500">
                      {job.totalApplications} total applications
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`rounded-full px-4 py-1 text-sm ${
                      isActive 
                        ? "bg-emerald-100 text-emerald-800" 
                        : isExpired
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {status}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{job.applied + job.reviewed}</p>
                    <p className="text-xs text-slate-500">Applications</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{job.shortlisted}</p>
                    <p className="text-xs text-slate-500">Shortlisted</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{job.accepted}</p>
                    <p className="text-xs text-slate-500">Offers</p>
                  </div>
                </div>
                </div>
              )
            })}
            </CardContent>
          </Card>
        </div>

        {/* <Card className="border-slate-200 bg-gradient-to-r from-sky-100 via-white to-blue-50">
          <CardContent className="flex flex-col gap-4 p-6 text-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Next action</p>
              <h3 className="text-xl font-semibold text-slate-900">Publish your next cohort intake</h3>
              <p className="text-sm text-slate-600">Boost engagement by sharing preferred skills and locations.</p>
            </div>
            <Button className="rounded-full bg-sky-600 text-white hover:bg-sky-500">
              Launch posting
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card> */}
      </div>
    )
}
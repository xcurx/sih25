import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, BarChart3, Briefcase, Calendar, CheckCircle, FileText, MapPin, Sparkles, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Opportunity, Student } from "@/lib/types"
import axios from "axios"
import Loader from "../loader/Loader"

export default function EmployerDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [loadingOpportunities, setLoadingOpportunities] = useState(true)

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

  useEffect(() => {
    getStudents()
    getOpportunities()
  }, [])

  const quickStats = useMemo(
    () => [
      { label: "Active jobs", value: opportunities.length, icon: Briefcase, caption: "Currently published" },
      { label: "Applications", value: students.length, icon: FileText, caption: "Awaiting review" },
      { label: "Interview queue", value: "0", icon: Calendar, caption: "Schedule interviews" },
      { label: "Offers", value: "0", icon: CheckCircle, caption: "This campaign" },
    ],
    [opportunities.length, students.length],
  )

  const heroStats = quickStats

  return (
    <div className="relative space-y-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.2),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.18),transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.9),transparent)]"
        aria-hidden="true"
      />

      <section className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-600 p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -top-12 right-6 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
              Employer control room
            </Badge>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Hiring health overview</p>
              <h1 className="mt-2 text-3xl font-semibold">Orchestrate jobs, talent pipelines, and offers in one glance.</h1>
            </div>
            <div className="inline-flex flex-wrap gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Auto-ranked candidates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Users className="h-4 w-4" aria-hidden="true" /> Campus reach tracker
              </span>
            </div>
          </div>
          <div className="grid gap-4 rounded-[28px] border border-white/30 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-lg sm:grid-cols-2">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col rounded-2xl border border-white/40 bg-gradient-to-br from-white/20 to-white/5 px-5 py-4 text-white shadow-[0_15px_30px_rgba(15,23,42,0.15)]"
              >
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-white/70">{stat.label}</div>
                <div className="mt-2 text-3xl font-semibold">{stat.value}</div>
                <div className="mt-1 text-xs text-white/80">{stat.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <Card className="border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Candidate radar</CardTitle>
            <CardDescription>Latest applicants across your open roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingStudents && <Loader />}
            {!loadingStudents && students.length === 0 && (
              <p className="text-sm text-center text-slate-500">No applications yet.</p>
            )}
            {students.slice(0, 4).map((student, index) => (
              <div
                key={`${student.id}-${index}`}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-sky-200 hover:bg-white md:flex-row md:items-center"
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
                    <Badge key={index} variant="outline" className="rounded-full border-slate-200 text-xs text-slate-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="rounded-full text-slate-600 hover:bg-slate-100">
                    Profile
                  </Button>
                  <Button size="sm" className="rounded-full bg-sky-600 text-white hover:bg-sky-500">
                    Schedule
                  </Button>
                </div>
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
            {loadingOpportunities && <Loader />}
            {!loadingOpportunities && opportunities.length === 0 && (
              <p className="text-sm text-center text-slate-500">No job postings yet.</p>
            )}
            {opportunities.slice(0, 4).map((job) => (
              <div key={job.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500">
                      {job.location} · {job.type}
                    </p>
                  </div>
                  <Badge variant={job.status === "active" ? "secondary" : "outline"} className="rounded-full">
                    {job.status}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
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
                    <p className="text-xs text-slate-500">Offers</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Campus coverage</CardTitle>
          <CardDescription>Top institutes engaged this cycle</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.slice(0, 6).map((student, index) => (
            <div key={`${student.id}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">{student.institution ?? "Institute"}</p>
              <p className="text-xs text-slate-500">{student.branch}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-600">
                <MapPin className="h-3.5 w-3.5 text-sky-500" aria-hidden="true" />
                {student.city ?? "Across India"}
              </div>
            </div>
          ))}
          {!loadingStudents && students.length === 0 && (
            <p className="text-sm text-slate-500">Invite institutes to start capturing insights.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-gradient-to-r from-sky-100 via-white to-blue-50">
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
      </Card>
    </div>
  )
}

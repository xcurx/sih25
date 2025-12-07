import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, Calendar, CheckCircle2, FileText, GraduationCap, Layers, MapPin, Sparkles, Target, TrendingUp } from "lucide-react"
import { mockJobs, mockStudents } from "@/lib/mock-data"

export default function StudentDashboard() {
  const student = mockStudents[0]
  const recentJobs = mockJobs.slice(0, 4)

  const focusAreas = [
    { label: "Aptitude drills", progress: 72, status: "+12% this week" },
    { label: "System design", progress: 54, status: "Add 2 mock interviews" },
    { label: "Leadership stories", progress: 38, status: "Draft STAR responses" },
  ]

  const interviews = [
    { title: "Product Engineering Intern", company: "TechCorp", date: "21 Nov · 09:30 AM", stage: "Technical" },
    { title: "Data Insights Intern", company: "AnalyticsHub", date: "24 Nov · 02:00 PM", stage: "HR Round" },
  ]

  const actionItems = [
    { title: "Refresh resume headline", detail: "Add impact metric for latest hackathon", priority: "Today" },
    { title: "Share portfolio link", detail: "Update employer application #1423", priority: "Due tomorrow" },
    { title: "Submit preferences", detail: "Select winter internship window", priority: "Due Friday" },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section with Stats */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Student Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Good day, {student.name}</h1>
            <p className="mt-2 text-sm text-slate-600">
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
              className="rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              <a href="/profile">Update profile</a>
            </Button>
          </div>
        </div>

        {/* Stats Cards inside gradient */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Applications</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">12</div>
              <p className="text-xs text-slate-500">+3 vs last cycle</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Interview Pipeline</CardTitle>
              <div className="rounded-full p-2 bg-cyan-50 text-cyan-600">
                <Calendar className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">3</div>
              <p className="text-xs text-slate-500">2 scheduled</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Profile Strength</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                <Sparkles className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">85%</div>
              <p className="text-xs text-slate-500">Great momentum</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">CGPA</CardTitle>
              <div className="rounded-full p-2 bg-blue-50 text-blue-600">
                <GraduationCap className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{student.cgpa}</div>
              <p className="text-xs text-slate-500">Current semester</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Profile Completeness Card */}
      <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-slate-900">Profile completeness</CardTitle>
              <CardDescription className="text-sm mt-1">Complete remaining sections to unlock premium drives</CardDescription>
            </div>
            <div className="rounded-full bg-sky-50 p-3">
              <Sparkles className="h-5 w-5 text-sky-600" aria-hidden="true" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-slate-900">85%</h2>
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
              Great progress
            </Badge>
          </div>
          <Progress value={85} className="h-3 rounded-full bg-slate-100 mb-4" />
          <p className="text-sm text-slate-500 mb-6">
            Complete the remaining sections to unlock premium drives and fast-track interviews.
          </p>
          <div className="grid gap-3">
            {focusAreas.map((area) => (
              <div
                key={area.label}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">{area.label}</p>
                  <p className="text-xs text-slate-500">{area.status}</p>
                </div>
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                  {area.progress}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Insights Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Application momentum",
            value: "12",
            caption: "4 shortlisted · 3 pending",
            icon: FileText,
            accent: "bg-sky-50 text-sky-700",
          },
          {
            title: "Interview readiness",
            value: "3",
            caption: "Mock scores trending up",
            icon: Calendar,
            accent: "bg-cyan-50 text-cyan-700",
          },
          {
            title: "CGPA",
            value: student.cgpa.toString(),
            caption: "Current semester",
            icon: GraduationCap,
            accent: "bg-blue-50 text-blue-700",
          },
          {
            title: "Career focus",
            value: "Product Engineering",
            caption: "Primary preference",
            icon: Target,
            accent: "bg-indigo-50 text-indigo-700",
          },
        ].map((insight) => (
          <Card key={insight.title} className="border-slate-200 bg-white shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{insight.title}</CardTitle>
              <div className={`rounded-full p-2 ${insight.accent}`}>
                <insight.icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">{insight.value}</p>
              <p className="text-xs text-slate-500">{insight.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Opportunity Radar & Interview Timeline */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-900">Opportunity radar</CardTitle>
                <CardDescription className="text-sm">Curated roles aligned with your skills</CardDescription>
              </div>
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                Updated hourly
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-sky-200 hover:bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.companyId}</p>
                  </div>
                  <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                    {job.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                    <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    {job.location}
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                    <Layers className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    {"Technology"}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" className="rounded-full bg-sky-600 text-white hover:bg-sky-500">
                    Apply now
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full text-slate-600 hover:text-slate-900">
                    Save for later
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-900">Interview timeline</CardTitle>
            <CardDescription className="text-sm">Stay synced with upcoming rounds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {interviews.map((interview) => (
              <div key={interview.title} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full border border-sky-200 bg-sky-100" />
                  <div className="mt-1 h-full w-px bg-slate-200" />
                </div>
                <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{interview.title}</p>
                  <p className="text-xs text-slate-500">{interview.company}</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>{interview.date}</span>
                    <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                      {interview.stage}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                Mock interview tip
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Block 30 mins every evening to rehearse behavioural responses and share recordings with your mentor.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Readiness & Action Center */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-900">Skill readiness</CardTitle>
            <CardDescription className="text-sm">Personalised learning nudges</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6">
            {focusAreas.map((area) => (
              <div key={area.label}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">{area.label}</p>
                  <span className="text-xs text-slate-500">{area.status}</span>
                </div>
                <Progress value={area.progress} className="mt-2 h-2.5 rounded-full bg-slate-100" />
              </div>
            ))}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-600">
              <p className="flex items-center gap-2 text-slate-700">
                <TrendingUp className="h-4 w-4 text-sky-600" aria-hidden="true" />
                Weekly reflection
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Add at least two quantifiable impact stories to your portfolio to boost recruiter recall.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-900">Action center</CardTitle>
            <CardDescription className="text-sm">Keep your pipeline tidy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {actionItems.map((item) => (
              <div
                key={item.title}
                className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                  {item.priority}
                </Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full justify-between text-slate-600 hover:text-slate-900">
              View full task list
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
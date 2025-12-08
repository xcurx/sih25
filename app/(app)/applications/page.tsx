"use client"

import ApplicationCard from "@/components/applications/ApplicationCard"
import ApplicationDetailsDialog from "@/components/applications/ApplicationDetailsDialog"
import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Application } from "@/lib/types"
import axios from "axios"
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Sparkles,
  TrendingUp
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ApplicationsPage() {
  const { data:session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const [applications, setApplications] = useState<Application[]>([])
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const getApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/student/get-applications", { withCredentials: true });
      if (res.status === 200) {
        setApplications(res.data.applications);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.opportunityRel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.opportunityRel.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingApplications = filteredApplications.filter((app) => app.status === "applied")
  const interviewApplications = filteredApplications.filter((app) => app.status === "shortlisted")
  const completedApplications = filteredApplications.filter((app) =>
    ["approved", "rejected", "selected"].includes(app.status),
  )

  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") return;
    getApplications();
  }, [status]);

  if (status === "loading" || status === "unauthenticated" || loading) {
    return <Loader/>
  }

  if (session?.user?.role !== "student" && session?.user?.role !== "placement-cell") {
    router.push("/");
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              {session?.user?.role === "student" ? "Application Tracker" : "Applications Dashboard"}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              {session?.user?.role === "student" ? "My Applications" : "Student Applications"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {session?.user?.role === "student"
                ? "Track your journey from application to offer"
                : "Monitor and manage all student applications"}
            </p>
          </div>
        </div>

        {/* Stats Cards inside gradient */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Applications</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{filteredApplications.length}</div>
              <p className="text-xs text-slate-500">All time submissions</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pending Review</CardTitle>
              <div className="rounded-full p-2 bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{pendingApplications.length}</div>
              <p className="text-xs text-slate-500">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Interviews</CardTitle>
              <div className="rounded-full p-2 bg-cyan-50 text-cyan-600">
                <Calendar className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{interviewApplications.length}</div>
              <p className="text-xs text-slate-500">Shortlisted</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Success Rate</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">
                {applications.length > 0 ? Math.round((interviewApplications.length / applications.length) * 100) : 0}%
              </div>
              <p className="text-xs text-slate-500">Shortlist conversion</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search and Filter */}
      <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search applications by role or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-2xl border-slate-200 focus:border-sky-400 focus:ring-sky-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-52 h-12 rounded-full border-slate-200 bg-slate-50/60 hover:bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="rounded-full bg-slate-100 p-1 h-auto border border-slate-200">
          <TabsTrigger 
            value="all" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-6 py-2.5"
          >
            All 
            <Badge className="ml-2 bg-sky-100 text-sky-700 hover:bg-sky-100">
              {filteredApplications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="pending"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-6 py-2.5"
          >
            Pending 
            <Badge className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100">
              {pendingApplications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="interview"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-6 py-2.5"
          >
            Interviews 
            <Badge className="ml-2 bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
              {interviewApplications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-6 py-2.5"
          >
            Completed 
            <Badge className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {completedApplications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={setSelectedApplication}
              userRole={session?.user?.role}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={setSelectedApplication}
              userRole={session?.user?.role}
            />
          ))}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          {interviewApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={setSelectedApplication}
              userRole={session?.user?.role}
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={setSelectedApplication}
              userRole={session?.user?.role}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <ApplicationDetailsDialog
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        userRole={session?.user?.role}
      />
    </div>
  )
}
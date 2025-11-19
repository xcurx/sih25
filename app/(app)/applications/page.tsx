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
    <div className="relative p-6 max-w-7xl w-full mx-auto space-y-8">
      {/* Background gradient effect */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.15),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(37,99,235,0.2),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.8),transparent)]"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-600 via-sky-500 to-blue-500 p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative space-y-4">
          <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            {session?.user?.role === "student" ? "Application tracker" : "Applications dashboard"}
          </Badge>
          <div>
            <h1 className="text-3xl font-bold">
              {session?.user?.role === "student" ? "My Applications" : "Student Applications"}
            </h1>
            <p className="text-white/90 mt-2">
              {session?.user?.role === "student"
                ? "Track your journey from application to offer"
                : "Monitor and manage all student applications"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-200 bg-white/90 shadow-lg rounded-3xl overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700">Total Applications</CardTitle>
            <div className="rounded-full bg-sky-50 p-3 group-hover:bg-sky-100 transition-colors">
              <FileText className="h-5 w-5 text-sky-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{filteredApplications.length}</div>
            <p className="text-xs text-slate-500 mt-1">All time submissions</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-lg rounded-3xl overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700">Pending Review</CardTitle>
            <div className="rounded-full bg-amber-50 p-3 group-hover:bg-amber-100 transition-colors">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{pendingApplications.length}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting response</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-lg rounded-3xl overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700">Interviews</CardTitle>
            <div className="rounded-full bg-cyan-50 p-3 group-hover:bg-cyan-100 transition-colors">
              <Calendar className="h-5 w-5 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{interviewApplications.length}</div>
            <p className="text-xs text-slate-500 mt-1">Shortlisted</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-lg rounded-3xl overflow-hidden group hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700">Success Rate</CardTitle>
            <div className="rounded-full bg-emerald-50 p-3 group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {applications.length > 0 ? Math.round((interviewApplications.length / applications.length) * 100) : 0}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Shortlist conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-slate-200 bg-white/90 shadow-lg rounded-3xl">
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

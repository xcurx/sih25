"use client"

import Loader from "@/components/loader/Loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentProfile, StudentProfileStats } from "@/lib/types"
import axios from "axios"
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function StudentProfilePage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [stats, setStats] = useState<StudentProfileStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`/api/placementcell/get-student-profile/${params.id}`, {
        withCredentials: true,
      })
      if (res.status === 200) {
        setStudent(res.data.student)
        setStats(res.data.stats)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch student profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return
    fetchStudent()
  }, [status, params.id])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "placement-cell" && session?.user?.role !== "faculty") {
    router.push("/")
    return null
  }

  if (!student) {
    return (
      <div className="p-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Student not found</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-700 border-blue-200"
      case "reviewed": return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "shortlisted": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "rejected": return "bg-red-100 text-red-700 border-red-200"
      case "accepted": return "bg-green-100 text-green-700 border-green-200"
      case "mentor_approval_needed": return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getPlacementStatus = () => {
    if (student.applications.some((app) => app.status === "accepted")) {
      return { status: "Placed", color: "bg-green-100 text-green-700 border-green-200" }
    }
    if (student.applications.some((app) => ["pending", "interview", "shortlisted"].includes(app.status))) {
      return { status: "In Process", color: "bg-amber-100 text-amber-700 border-amber-200" }
    }
    return { status: "Unplaced", color: "bg-slate-100 text-slate-700 border-slate-200" }
  }

  const placementInfo = getPlacementStatus()

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Student Profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{student.name}</h1>
              <p className="mt-1 text-sm text-slate-600">
                Complete profile and application tracking
              </p>
            </div>
          </div>
          {student.resume && (
            <Button className="bg-sky-600 hover:bg-sky-700 rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          )}
        </div>
      </section>

      {/* Student Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-slate-200 bg-white shadow-sm rounded-2xl">
          <CardHeader className="text-center border-b border-slate-100">
            <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-slate-100">
              <AvatarImage src={"/placeholder.svg"} alt={student.name} />
              <AvatarFallback className="text-2xl bg-sky-50 text-sky-700">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-slate-900">{student.name}</CardTitle>
            <CardDescription className="text-slate-600">
              {student.branch} • Year {(student.batch as number) - new Date().getFullYear() + 5}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="text-center p-4 bg-sky-50 rounded-xl border border-sky-100">
              <div className="text-3xl font-bold text-sky-700">{student.cgpa}</div>
              <div className="text-sm text-slate-600">CGPA</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="break-all">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{student.phone}</span>
              </div>
              {student.github && (
                <div className="flex items-center gap-2 text-sm">
                  <Github className="h-4 w-4 text-slate-500" />
                  <a
                    href={student.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 hover:underline truncate"
                  >
                    GitHub Profile
                  </a>
                </div>
              )}
              {student.linkedin && (
                <div className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4 text-slate-500" />
                  <a
                    href={student.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 hover:underline truncate"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900">Academic Information</CardTitle>
            <CardDescription className="text-slate-600">Educational background and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Full Name</label>
                <p className="text-base text-slate-900">{student.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Email</label>
                <p className="text-base text-slate-900 break-all">{student.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Phone</label>
                <p className="text-base text-slate-900">{student.phone}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">CGPA</label>
                <p className="text-base font-semibold text-sky-700">{student.cgpa}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Department</label>
                <p className="text-base text-slate-900">{student.branch}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Batch Year</label>
                <p className="text-base text-slate-900">{student.batch}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900">Technical Skills</CardTitle>
          <CardDescription className="text-slate-600">Programming languages and technologies</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {student.skills && student.skills.length > 0 ? (
              student.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 rounded-full">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-500">No skills listed</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applications Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Applications</h2>
          <p className="text-slate-600">Track all job applications and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Applications</CardTitle>
              <div className="rounded-full p-2 bg-sky-50">
                <FileText className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{filteredApplications.length}</div>
              <p className="text-xs text-slate-500">All time</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
              <div className="rounded-full p-2 bg-amber-50">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{pendingApplications.length}</div>
              <p className="text-xs text-slate-500">Awaiting review</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Shortlisted</CardTitle>
              <div className="rounded-full p-2 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{shortlistedApplications.length}</div>
              <p className="text-xs text-slate-500">Interview stage</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Completed</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50">
                <Calendar className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{completedApplications.length}</div>
              <p className="text-xs text-slate-500">Final stage</p>
            </CardContent>
          </Card>

        {/* Search and Filter */}
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-sky-500 rounded-lg"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48 border-slate-200 focus:ring-sky-500 rounded-lg">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="mentor_approval_needed">Mentor Approval Needed</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 h-auto rounded-full">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900">
              All ({filteredApplications.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900">
              Pending ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="shortlisted" className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900">
              Shortlisted ({shortlistedApplications.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900">
              Completed ({completedApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={setSelectedApplication}
                  userRole="placement-cell"
                />
              ))
            ) : (
              <Card className="border-slate-200 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-500">No applications found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingApplications.length > 0 ? (
              pendingApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={setSelectedApplication}
                  userRole="placement-cell"
                />
              ))
            ) : (
              <Card className="border-slate-200 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-500">No pending applications</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="shortlisted" className="space-y-4">
            {shortlistedApplications.length > 0 ? (
              shortlistedApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={setSelectedApplication}
                  userRole="placement-cell"
                />
              ))
            ) : (
              <Card className="border-slate-200 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-500">No shortlisted applications</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedApplications.length > 0 ? (
              completedApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={setSelectedApplication}
                  userRole="placement-cell"
                />
              ))
            ) : (
              <Card className="border-slate-200 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <XCircle className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-500">No completed applications</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
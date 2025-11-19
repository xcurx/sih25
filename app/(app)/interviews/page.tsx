"use client"

import InterviewCard from "@/components/interviews/InterviewCard"
import InterviewDetailsDialog from "@/components/interviews/InterviewDetailsDialog"
import Loader from "@/components/loader/Loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InterviewApplication } from "@/lib/types"
import axios from "axios"
import {
    Calendar,
    CheckCircle,
    Clock,
    Search,
    Video
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"


export default function InterviewsPage() {
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<InterviewApplication | null>(null)
  const [applications, setApplications] = useState<InterviewApplication[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const getInterviews = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/${session?.user.role}/get-interviews`, { withCredentials: true })
      console.log(res.data)
      if (res.status === 200) {
        setApplications(res.data.applications || [])
      }
    } catch (error) {
      console.error("Error fetching interviews:", error)
      toast.error("Failed to fetch interviews")
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.opportunityRel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.opportunityRel.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Upcoming interviews (scheduled in the future)
  const upcomingInterviews = filteredApplications.filter((app) => {
    if (!app.interviewRel?.scheduledAt) return false
    return new Date(app.interviewRel.scheduledAt) > new Date()
  })

  // Completed interviews (scheduled in the past)
  const completedInterviews = filteredApplications.filter((app) => {
    if (!app.interviewRel?.scheduledAt) return false
    return new Date(app.interviewRel.scheduledAt) <= new Date()
  })

  // Sort by date (upcoming: nearest first, completed: most recent first)
  const sortedUpcoming = [...upcomingInterviews].sort((a, b) => {
    const dateA = new Date(a.interviewRel?.scheduledAt || 0).getTime()
    const dateB = new Date(b.interviewRel?.scheduledAt || 0).getTime()
    return dateA - dateB
  })

  const sortedCompleted = [...completedInterviews].sort((a, b) => {
    const dateA = new Date(a.interviewRel?.scheduledAt || 0).getTime()
    const dateB = new Date(b.interviewRel?.scheduledAt || 0).getTime()
    return dateB - dateA
  })

  useEffect(() => {
    if (status === "authenticated") {
      getInterviews()
    }
  }, [status])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || (session?.user?.role !== "student" && session?.user?.role !== "employer")) {
    router.replace("/")
    return null
  }

  return (
    <div className="relative p-6 max-w-7xl w-full mx-auto space-y-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.15),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(37,99,235,0.2),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.8),transparent)]"
        aria-hidden="true"
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-sky-700">
          {
            session?.user?.role === "employer" ? "Candidate Interviews" : "My Interviews"
          }
        </h1>
        <p className="text-slate-600">
          Manage your scheduled and completed interviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-slate-200 bg-white/90 shadow-lg hover:shadow-xl hover:border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Interviews</CardTitle>
            <Video className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">{filteredApplications.length}</div>
            <p className="text-xs text-slate-500">All time</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-lg hover:shadow-xl hover:border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">{upcomingInterviews.length}</div>
            <p className="text-xs text-slate-500">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-lg hover:shadow-xl hover:border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{completedInterviews.length}</div>
            <p className="text-xs text-slate-500">Finished</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white/90 shadow-lg hover:shadow-xl hover:border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">
              {applications.filter((app) => {
                if (!app.interviewRel?.scheduledAt) return false
                const weekFromNow = new Date()
                weekFromNow.setDate(weekFromNow.getDate() + 7)
                const interviewDate = new Date(app.interviewRel.scheduledAt)
                return interviewDate >= new Date() && interviewDate <= weekFromNow
              }).length}
            </div>
            <p className="text-xs text-slate-500">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-slate-200 bg-white/90 shadow-lg rounded-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-2xl border-slate-200 focus:border-sky-400 focus:ring-sky-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 rounded-2xl border-slate-200 hover:bg-sky-50 hover:border-sky-300">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interviews Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-100/60 rounded-2xl">
          <TabsTrigger value="all" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">Upcoming ({upcomingInterviews.length})</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">Completed ({completedInterviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length > 0 ? (
            <>
              {sortedUpcoming.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-sky-700">Upcoming Interviews</h3>
                  {sortedUpcoming.map((app) => (
                    <InterviewCard
                      key={app.id}
                      application={app}
                      onViewDetails={setSelectedApplication}
                    />
                  ))}
                </div>
              )}
              {sortedCompleted.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-600 mt-6">
                    Completed Interviews
                  </h3>
                  {sortedCompleted.map((app) => (
                    <InterviewCard
                      key={app.id}
                      application={app}
                      onViewDetails={setSelectedApplication}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card className="border-slate-200 bg-white/90 shadow-lg">
              <CardContent className="p-12 text-center">
                <Video className="h-12 w-12 mx-auto text-sky-400 mb-4" />
                <p className="text-slate-600">No interviews found</p>
                <p className="text-sm text-slate-500 mt-2">
                  Interviews will appear here once you're shortlisted
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {sortedUpcoming.length > 0 ? (
            sortedUpcoming.map((app) => (
              <InterviewCard
                key={app.id}
                application={app}
                onViewDetails={setSelectedApplication}
              />
            ))
          ) : (
            <Card className="border-slate-200 bg-white/90 shadow-lg">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-sky-400 mb-4" />
                <p className="text-slate-600">No upcoming interviews</p>
                <p className="text-sm text-slate-500 mt-2">
                  Your scheduled interviews will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {sortedCompleted.length > 0 ? (
            sortedCompleted.map((app) => (
              <InterviewCard
                key={app.id}
                application={app}
                onViewDetails={setSelectedApplication}
              />
            ))
          ) : (
            <Card className="border-slate-200 bg-white/90 shadow-lg">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
                <p className="text-slate-600">No completed interviews</p>
                <p className="text-sm text-slate-500 mt-2">
                  Completed interviews will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Interview Details Dialog */}
      <InterviewDetailsDialog
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  )
}

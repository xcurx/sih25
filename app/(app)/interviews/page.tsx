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
      const res = await axios.get("/api/get-interviews", { withCredentials: true })
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

  if (status === "unauthenticated" || session?.user?.role !== "student") {
    router.replace("/")
    return null
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">My Interviews</h1>
        <p className="text-muted-foreground">
          Manage your scheduled and completed interviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredApplications.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingInterviews.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInterviews.length}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter((app) => {
                if (!app.interviewRel?.scheduledAt) return false
                const weekFromNow = new Date()
                weekFromNow.setDate(weekFromNow.getDate() + 7)
                const interviewDate = new Date(app.interviewRel.scheduledAt)
                return interviewDate >= new Date() && interviewDate <= weekFromNow
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
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
        <TabsList>
          <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingInterviews.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedInterviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length > 0 ? (
            <>
              {sortedUpcoming.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Upcoming Interviews</h3>
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
                  <h3 className="text-lg font-semibold text-muted-foreground mt-6">
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
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No interviews found</p>
                <p className="text-sm text-muted-foreground mt-2">
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
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming interviews</p>
                <p className="text-sm text-muted-foreground mt-2">
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
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed interviews</p>
                <p className="text-sm text-muted-foreground mt-2">
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

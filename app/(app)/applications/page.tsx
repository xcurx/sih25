"use client"

import ApplicationCard from "@/components/applications/ApplicationCard"
import ApplicationDetailsDialog from "@/components/applications/ApplicationDetailsDialog"
import Loader from "@/components/loader/Loader"
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
  Search
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
      const res = await axios.get("/api/get-applications", { withCredentials: true });
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
    <div className="p-6 max-w-7xl w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          {session?.user?.role === "student" ? "My Applications" : "Student Applications"}
        </h1>
        <p className="text-muted-foreground">
          {session?.user?.role === "student"
            ? "Track your job applications and interview status"
            : "Manage and review student applications"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredApplications.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewApplications.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Interview conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
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
        <TabsList>
          <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="interview">Interviews ({interviewApplications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
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

"use client"

import { ApplicationApprovalCard } from "@/components/faculty/ApplicationApprovalCard"
import Loader from "@/components/loader/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { ApprovalApplication } from "@/lib/types"
import axios from "axios"
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Search,
  XCircle
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ApprovalPage() {
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [applications, setApplications] = useState<ApprovalApplication[]>([])
  const [selectedApplication, setSelectedApplication] = useState<ApprovalApplication | null>(null)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()

  const getApprovals = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/faculty/get-approvals", { withCredentials: true })
      if (res.status === 200) {
        setApplications(res.data.applications || [])
      }
    } catch (error) {
      console.error("Error fetching approvals:", error)
      toast.error("Failed to fetch approval requests")
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedApplication || !actionType) return

    setActionLoading(true)
    try {
      const res = await axios.patch(
        `/api/faculty/application-action/${selectedApplication.id}`,
        {
          action: actionType,
          remarks: remarks,
        },
        { withCredentials: true }
      )

      if (res.status === 200) {
        toast.success(`Application ${actionType === "approve" ? "approved" : "rejected"} successfully`)
        setApplications(prev => prev.map(app => app.id === selectedApplication.id? 
          { ...app, mentorApproved:actionType==="approve", status:"applied" } : app))
        setShowActionDialog(false)
        setSelectedApplication(null)
        setRemarks("")
        setActionType(null)
      }
    } catch (error) {
      console.error("Error processing action:", error)
      toast.error("Failed to process application action")
    } finally {
      setActionLoading(false)
    }
  }

  const openActionDialog = (app: ApprovalApplication, action: "approve" | "reject") => {
    setSelectedApplication(app)
    setActionType(action)
    setShowActionDialog(true)
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.opportunityRel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.opportunityRel.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentRel?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || (statusFilter === "applied" ? app.mentorApproved === false : app.mentorApproved === true)

    const matchesDepartment =
      departmentFilter === "all" || app.studentRel?.branch === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const pendingApplications = filteredApplications.filter((app) => app.mentorApproved === false)
  const reviewedApplications = filteredApplications.filter((app) => app.mentorApproved === true)

  const departments = Array.from(new Set(applications.map((app) => app.studentRel?.branch).filter(Boolean)))

  useEffect(() => {
    if (status === "authenticated") {
      getApprovals()
    }
  }, [status])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "faculty") {
    router.replace("/")
    return null
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
      {/* Hero Section with Stats - matching other dashboards */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Faculty Approvals</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Application Approvals</h1>
            <p className="mt-2 text-sm text-slate-600">
              Review and approve student applications before they reach employers
            </p>
          </div>
        </div>

        {/* Stats Cards inside gradient */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Pending */}
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Pending</CardTitle>
              <div className="rounded-full p-2 bg-red-50 text-red-600">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{pendingApplications.length}</div>
              <p className="text-xs text-red-600 font-medium">Awaiting review</p>
            </CardContent>
          </Card>
          
          {/* Card 2: Reviewed Applications */}
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Reviewed</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{reviewedApplications.length}</div>
              <p className="text-xs text-slate-500">Mentor approved</p>
            </CardContent>
          </Card>
          
          {/* Card 3: All Applications */}
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">All Applications</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{applications.length}</div>
              <p className="text-xs text-slate-500">Total received</p>
            </CardContent>
          </Card>
          
          {/* Card 4: Recent Submissions */}
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Recent</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                <Calendar className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">
                {applications.filter(app => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return new Date(app.appliedAt) > weekAgo
                }).length}
              </div>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search and Filter */}
      <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by student, company, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus:border-sky-600 rounded-lg transition"
              />
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full lg:w-48 h-10 border-slate-200 focus:ring-sky-600 rounded-lg">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept as string}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-40 h-10 border-slate-200 focus:ring-sky-600 rounded-lg">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 h-auto rounded-full">
          <TabsTrigger 
            value="all" 
            className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900"
          >
            All ({filteredApplications.length})
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900"
          >
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger 
            value="reviewed" 
            className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900"
          >
            Reviewed ({reviewedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <ApplicationApprovalCard
                key={app.id}
                application={app}
                onApprove={() => openActionDialog(app, "approve")}
                onReject={() => openActionDialog(app, "reject")}
              />
            ))
          ) : (
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-500">No applications found matching the filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.length > 0 ? (
            pendingApplications.map((app) => (
              <ApplicationApprovalCard
                key={app.id}
                application={app}
                onApprove={() => openActionDialog(app, "approve")}
                onReject={() => openActionDialog(app, "reject")}
              />
            ))
          ) : (
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                <p className="text-slate-500">No pending applications right now!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedApplications.length > 0 ? (
            reviewedApplications.map((app) => (
              <ApplicationApprovalCard
                key={app.id}
                application={app}
                onApprove={() => openActionDialog(app, "approve")}
                onReject={() => openActionDialog(app, "reject")}
              />
            ))
          ) : (
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                <p className="text-slate-500">No applications have been reviewed yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <ApplicationDetailsDialog
        application={selectedApplication}
        open={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false)
          setSelectedApplication(null)
        }}
        onApprove={() => openActionDialog(selectedApplication!, "approve")}
        onReject={() => openActionDialog(selectedApplication!, "reject")}
      />

      {/* Action Confirmation Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              {actionType === "approve" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-sky-600" />
                  Approve Application
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  Reject Application
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {actionType === "approve"
                ? "This application will be forwarded to the employer for further review."
                : "The student will be notified about the rejection."}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div 
                className={`p-4 rounded-lg border ${
                    actionType === "approve" 
                        ? "bg-sky-50 border-sky-200" 
                        : "bg-red-50 border-red-200" 
                }`}
              >
                <p className="text-sm font-medium text-slate-800">{selectedApplication.studentRel?.name}</p>
                <p className="text-sm text-slate-600">
                  {selectedApplication.opportunityRel.title} at {selectedApplication.opportunityRel.companyRel?.name}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-slate-700">
                  Remarks {actionType === "reject" ? "(Required)" : "(Optional)"}
                </Label>
                <Textarea
                  id="remarks"
                  placeholder={
                    actionType === "approve"
                      ? "Add any comments or recommendations..."
                      : "Please provide a reason for rejection..."
                  }
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  className="border-slate-200 focus:border-sky-600 focus:ring-sky-600 rounded-lg"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowActionDialog(false)
                setRemarks("")
                setActionType(null)
              }}
              disabled={actionLoading}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              className={actionType === "approve" ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"}
              onClick={handleAction}
              disabled={actionLoading || (actionType === "reject" && !remarks.trim())}
            >
              {actionLoading ? "Processing..." : actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
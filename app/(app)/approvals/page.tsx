"use client"

import { ApplicationApprovalCard } from "@/components/faculty/ApplicationApprovalCard"
import { ApplicationDetailsDialog } from "@/components/faculty/ApplicationDetailsDialog"
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
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
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
        // Remove the application from the list after action
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
    setShowDetailsDialog(false)
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.opportunityRel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.opportunityRel.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentRel?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Application Approvals</h1>
        <p className="text-slate-500">
          Review and approve student applications before they reach employers
        </p>
      </div>

      {/* Stats Cards - Dusty Blue/Slate Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Card 1: Total Pending (Red for attention) */}
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Pending</CardTitle>
            <div className="rounded-full p-2 bg-red-50 text-red-700">
                <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{pendingApplications.length}</div>
            <p className="text-xs text-red-600 font-medium">Awaiting review</p>
          </CardContent>
        </Card>
        
        {/* Card 2: Reviewed Applications (Dusty Blue accent) */}
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Reviewed</CardTitle>
            <div className="rounded-full p-2 bg-blue-100 text-blue-700"> {/* Dusty Blue */}
                <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{reviewedApplications.length}</div>
            <p className="text-xs text-slate-500">Mentors approved</p>
          </CardContent>
        </Card>
        
        {/* Card 3: All Applications (Indigo accent) */}
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">All Applications</CardTitle>
            <div className="rounded-full p-2 bg-indigo-50 text-indigo-700">
                <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{applications.length}</div>
            <p className="text-xs text-slate-500">Total received</p>
          </CardContent>
        </Card>
        
        {/* Card 4: Recent Submissions (Emerald accent) */}
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Recent</CardTitle>
            <div className="rounded-full p-2 bg-emerald-50 text-emerald-700">
                <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
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

      {/* Search and Filter */}
      <Card className="mb-6 border-slate-200 bg-white shadow-lg rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by student, company, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48 border-slate-300 focus:ring-blue-600 rounded-lg">
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
                <SelectTrigger className="w-40 border-slate-300 focus:ring-blue-600 rounded-lg">
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

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-blue-100/50 border border-slate-200"> {/* Slight blue background */}
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">Pending ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="reviewed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">Reviewed ({reviewedApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <ApplicationApprovalCard
                key={app.id}
                application={app}
                onViewDetails={() => {
                  setSelectedApplication(app)
                  setShowDetailsDialog(true)
                }}
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
                onViewDetails={() => {
                  setSelectedApplication(app)
                  setShowDetailsDialog(true)
                }}
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
                onViewDetails={() => {
                  setSelectedApplication(app)
                  setShowDetailsDialog(true)
                }}
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

      {/* Application Details Dialog (Assumes ApplicationDetailsDialog handles its own content styling) */}
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

      {/* Action Confirmation Dialog - UI Updated as requested */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              {actionType === "approve" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-blue-600" /> {/* Blue for Approval Icon */}
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
              {/* Target area updated to slight/dusty blue (bg-blue-100) */}
              <div 
                className={`p-4 rounded-lg border ${
                    actionType === "approve" 
                        ? "bg-blue-100 border-blue-200" // Dusty blue background for approval
                        : "bg-red-50 border-red-100" 
                }`}
              >
                <p className="text-sm font-medium text-slate-800">{selectedApplication.studentRel?.name}</p>
                <p className="text-sm text-slate-600">
                  {selectedApplication.opportunityRel.title} at **{selectedApplication.opportunityRel.companyRel?.name}** </p>
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
                  className="border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-lg"
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
              className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              Cancel
            </Button>
            <Button
              // Approve button updated to strong blue (bg-blue-600)
              className={actionType === "approve" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"}
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
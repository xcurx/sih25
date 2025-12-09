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
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"

export default function ApprovalPage() {
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [sortOption, setSortOption] = useState("date-latest")
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [applications, setApplications] = useState<ApprovalApplication[]>([])
  const [selectedApplication, setSelectedApplication] = useState<ApprovalApplication | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()
  const searchPopupRef = useRef<HTMLDivElement>(null)

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
        setApplications(prev => prev.map(app => {
          if (app.id !== selectedApplication.id) return app
          return {
            ...app,
            mentorApproved: actionType === "approve",
            status: actionType === "approve" ? "applied" : "rejected",
          }
        }))
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

  const filteredAndSortedApplications = applications
    .filter((app) => {
      const matchesSearch =
        app.opportunityRel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.opportunityRel.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentRel?.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTab = 
        activeTab === "all" || 
        (activeTab === "pending" && app.status === "mentor_approval_needed") ||
        (activeTab === "approved" && app.mentorApproved === true && app.status === "applied") ||
        (activeTab === "shortlisted" && app.status === "shortlisted") ||
        (activeTab === "rejected" && app.status === "rejected")

      const matchesDepartment =
        departmentFilter === "all" || app.studentRel?.branch === departmentFilter

      return matchesSearch && matchesTab && matchesDepartment
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "a-z":
          return (a.studentRel?.name || "").localeCompare(b.studentRel?.name || "")
        case "z-a":
          return (b.studentRel?.name || "").localeCompare(a.studentRel?.name || "")
        case "date-latest":
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        case "date-oldest":
          return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
        default:
          return 0
      }
    })

  const pendingApplications = applications.filter((app) => app.status === "mentor_approval_needed")
  const approvedApplications = applications.filter((app) => app.mentorApproved === true && app.status === "applied")
  const shortlistedApplications = applications.filter((app) => app.status === "shortlisted")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")

  const departments = Array.from(new Set(applications.map((app) => app.studentRel?.branch).filter(Boolean)))

  useEffect(() => {
    if (status === "authenticated") {
      getApprovals()
    }
  }, [status])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
        setSearchExpanded(false)
      }
    }

    if (searchExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [searchExpanded])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "faculty") {
    router.replace("/")
    return null
  }

  return (
    <div className="w-full">
      {/* Hero Section with Stats - matching other dashboards */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 space-y-6 max-w-7xl mx-auto">
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
          <Card className="border-slate-200 bg-white/90  rounded-xl ">
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
          <Card className="border-slate-200 bg-white/90  rounded-xl ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Approved</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{approvedApplications.length}</div>
              <p className="text-xs text-slate-500">Mentor approved</p>
            </CardContent>
          </Card>
          
          {/* Card 3: Shortlisted Applications */}
          <Card className="border-slate-200 bg-white/90 rounded-xl ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Shortlisted</CardTitle>
              <div className="rounded-full p-2 bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{shortlistedApplications.length}</div>
              <p className="text-xs text-slate-500">By employer</p>
            </CardContent>
          </Card>
          
          {/* Card 4: Rejected Applications */}
          <Card className="border-slate-200 bg-white/90 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Rejected</CardTitle>
              <div className="rounded-full p-2 bg-red-50 text-red-600">
                <XCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{rejectedApplications.length}</div>
              <p className="text-xs text-slate-500">Not selected</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Main Filter Row */}
          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center bg-slate-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "pending"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Pending ({pendingApplications.length})
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "approved"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Approved ({approvedApplications.length})
              </button>
              <button
                onClick={() => setActiveTab("shortlisted")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "shortlisted"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Shortlisted ({shortlistedApplications.length})
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  activeTab === "rejected"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Rejected ({rejectedApplications.length})
              </button>
            </div>

            {/* Circular Search Button */}
            <button
              onClick={() => setSearchExpanded(!searchExpanded)}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
                searchExpanded
                  ? "bg-sky-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Search className="h-4 w-4" />
            </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* Department Filter */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px] h-10 border-slate-200 focus:ring-sky-600 rounded-lg">
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

            {/* Sort Filter */}
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px] h-10 border-slate-200 focus:ring-sky-600 rounded-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-latest">Date: Latest First</SelectItem>
                <SelectItem value="date-oldest">Date: Oldest First</SelectItem>
                <SelectItem value="a-z">Name: A–Z</SelectItem>
                <SelectItem value="z-a">Name: Z–A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Popup - Appears Below Filter Row */}
          {searchExpanded && (
            <div 
              ref={searchPopupRef}
              className="mt-3 animate-in slide-in-from-top-2 duration-200"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by student, company, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="pl-10 pr-10 h-10 border-slate-200 focus:border-sky-600 rounded-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4 mt-6 max-w-7xl mx-auto px-6 pb-8">
        {filteredAndSortedApplications.length > 0 ? (
          filteredAndSortedApplications.map((app) => (
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
              <p className="text-slate-500">
                {activeTab === "pending" && pendingApplications.length === 0
                  ? "No pending applications right now!"
                  : activeTab === "approved" && approvedApplications.length === 0
                  ? "No approved applications yet."
                  : activeTab === "shortlisted" && shortlistedApplications.length === 0
                  ? "No shortlisted applications yet."
                  : activeTab === "rejected" && rejectedApplications.length === 0
                  ? "No rejected applications yet."
                  : "No applications found matching the filters"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

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
                className={`p-4 rounded-xl border ${
                    actionType === "approve" 
                        ? "bg-gradient-to-r from-sky-50 via-white to-blue-50 border-sky-200" 
                        : "bg-gradient-to-r from-rose-50 via-white to-red-50 border-rose-200" 
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
              className={
                actionType === "approve"
                  ? "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-sm"
                  : "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white shadow-sm"
              }
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

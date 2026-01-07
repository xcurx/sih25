"use client"

import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import type { Opportunity } from "@/lib/types"
import axios from "axios"
import {
  Building2,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  ArrowLeft,
  Eye,
  Check,
  X,
  Layers
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

interface OpportunityWithCompany extends Omit<Opportunity, 'companyRel' | 'employerRel'> {
  companyRel?: {
    id: string;
    name: string;
  };
  employerRel?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function OpportunityRequestsPage() {
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [opportunities, setOpportunities] = useState<OpportunityWithCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityWithCompany | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const router = useRouter()

  const getPendingOpportunities = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/placementcell/get-pending-opportunities")
      if (res.status === 200) {
        setOpportunities(res.data.opportunities)
      }
    } catch (error) {
      console.error("Error fetching pending opportunities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (opportunityId: string) => {
    setActionLoading(opportunityId)
    try {
      const res = await axios.post("/api/placementcell/opportunity-action", {
        opportunityId,
        action: "approve"
      })
      if (res.status === 200) {
        // Remove from list
        setOpportunities(prev => prev.filter(o => o.id !== opportunityId))
      }
    } catch (error) {
      console.error("Error approving opportunity:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!selectedOpportunity) return
    
    setActionLoading(selectedOpportunity.id)
    try {
      const res = await axios.post("/api/placementcell/opportunity-action", {
        opportunityId: selectedOpportunity.id,
        action: "reject",
        reason: rejectReason
      })
      if (res.status === 200) {
        // Remove from list
        setOpportunities(prev => prev.filter(o => o.id !== selectedOpportunity.id))
        setRejectDialogOpen(false)
        setRejectReason("")
        setSelectedOpportunity(null)
      }
    } catch (error) {
      console.error("Error rejecting opportunity:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const openRejectDialog = (opportunity: OpportunityWithCompany) => {
    setSelectedOpportunity(opportunity)
    setRejectDialogOpen(true)
  }

  const openDetailsDialog = (opportunity: OpportunityWithCompany) => {
    setSelectedOpportunity(opportunity)
    setDetailsDialogOpen(true)
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.employerRel?.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") return
    getPendingOpportunities()
  }, [status])

  if (status === "loading" || status === "unauthenticated" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "placement-cell") {
    router.replace("/")
    return null
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50 to-orange-50 p-8 space-y-6 max-w-7xl mx-auto">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.08),transparent_55%)]" />

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => router.push("/job-postings")}
                className="mb-2 -ml-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Job Postings
              </Button>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Pending Review</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Incoming Job Requests</h1>
              <p className="mt-2 text-sm text-slate-600">
                Review and approve or reject job posting requests from employers.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Card className="border-amber-200 bg-amber-50 shadow-sm rounded-xl px-6 py-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Pending Requests</p>
                    <p className="text-2xl font-bold text-amber-800">{opportunities.length}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by job title, company or employer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 focus:border-amber-500 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Requests List */}
      <div className="space-y-4 mt-6 max-w-7xl mx-auto px-6 pb-8">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="rounded-2xl border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-amber-100 p-3">
                      <Building2 className="h-7 w-7 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{opportunity.title}</h3>
                      <p className="text-base text-slate-700">{opportunity.companyRel?.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Submitted by: {opportunity.employerRel?.name} ({opportunity.employerRel?.email})
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span>{opportunity.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Briefcase className="h-4 w-4" />
                          <span className="capitalize">{opportunity.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <DollarSign className="h-4 w-4" />
                          <span>₹{opportunity.salary}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Skills Preview */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {opportunity.skillsRequired.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700">
                            {skill}
                          </Badge>
                        ))}
                        {opportunity.skillsRequired.length > 5 && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500">
                            +{opportunity.skillsRequired.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailsDialog(opportunity)}
                      className="rounded-lg"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(opportunity.id)}
                      disabled={actionLoading === opportunity.id}
                      className="bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {actionLoading === opportunity.id ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openRejectDialog(opportunity)}
                      disabled={actionLoading === opportunity.id}
                      className="rounded-lg"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
              <p className="text-lg font-medium text-slate-600">No pending requests!</p>
              <p className="text-sm text-slate-400">All job posting requests have been reviewed.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedOpportunity?.title}</DialogTitle>
            <DialogDescription>
              {selectedOpportunity?.companyRel?.name} • Submitted by {selectedOpportunity?.employerRel?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOpportunity && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Type</p>
                  <p className="font-medium capitalize">{selectedOpportunity.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-medium">{selectedOpportunity.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Salary</p>
                  <p className="font-medium">₹{selectedOpportunity.salary}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Application Deadline</p>
                  <p className="font-medium">{new Date(selectedOpportunity.applicationDeadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-500">Description</p>
                <p className="text-slate-700 whitespace-pre-wrap">{selectedOpportunity.description}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-500">Requirements</p>
                <ul className="list-disc list-inside text-slate-700">
                  {selectedOpportunity.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-500">Eligible Departments</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOpportunity.eligibleDepartments.map((dept) => (
                    <Badge key={dept} className="bg-sky-100 text-sky-700">{dept}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-500">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOpportunity.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              {selectedOpportunity.additionalInfo && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Additional Information</p>
                  <p className="text-slate-700">{selectedOpportunity.additionalInfo}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setDetailsDialogOpen(false)
                if (selectedOpportunity) handleApprove(selectedOpportunity.id)
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDetailsDialogOpen(false)
                if (selectedOpportunity) openRejectDialog(selectedOpportunity)
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject &quot;{selectedOpportunity?.title}&quot; from {selectedOpportunity?.companyRel?.name}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Reason for rejection (optional)</label>
              <Textarea
                placeholder="Provide a reason for rejecting this job posting..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => {
              setRejectDialogOpen(false)
              setRejectReason("")
              setSelectedOpportunity(null)
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading === selectedOpportunity?.id}
            >
              {actionLoading === selectedOpportunity?.id ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

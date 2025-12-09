"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ApprovalApplication } from "@/lib/types"
import {
    Building2,
    CheckCircle,
    FileText,
    User,
    XCircle
} from "lucide-react"

export function ApplicationDetailsDialog({
  application,
  open,
  onClose,
  onApprove,
  onReject,
}: {
  application: ApprovalApplication | null
  open: boolean
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}) {
  if (!application) return null

  const canTakeAction = application.status === "mentor_approval_needed"
  const statusLabel = application.status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Details
          </DialogTitle>
          <DialogDescription>
            Review the complete application information before taking action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={application.studentRel?.avatar || "/placeholder.svg"}
                    alt={application.studentRel?.name}
                  />
                  <AvatarFallback className="text-xl">
                    {application.studentRel?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="text-base">{application.studentRel?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-base break-all">{application.studentRel?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-base">{application.studentRel?.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                    <p className="text-base">{application.studentRel?.branch}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">CGPA</Label>
                    <p className="text-base font-semibold">{application.studentRel?.cgpa}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Year</Label>
                    <p className="text-base">
                      Year{" "}
                      {application.studentRel?.batch
                        ? (application.studentRel.batch as number) - new Date().getFullYear() + 5
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              {application.studentRel?.skills && application.studentRel.skills.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {application.studentRel.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company & Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company & Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                <p className="text-lg font-semibold">{application.opportunityRel.companyRel?.name}</p>
                {application.opportunityRel.companyRel?.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {application.opportunityRel.companyRel.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Job Title</Label>
                  <p className="text-base">{application.opportunityRel.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Job Type</Label>
                  <p className="text-base capitalize">{application.opportunityRel.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <p className="text-base">{application.opportunityRel.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Salary</Label>
                  <p className="text-base">₹{application.opportunityRel.salary.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Application Deadline</Label>
                  <p className="text-base">
                    {new Date(application.opportunityRel.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Applied On</Label>
                  <p className="text-base">{new Date(application.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{application.opportunityRel.description}</p>
              </div>
              {application.opportunityRel.skillsRequired &&
                application.opportunityRel.skillsRequired.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Required Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {application.opportunityRel.skillsRequired.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {!canTakeAction && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
              Actions disabled - current status: {statusLabel}
            </Badge>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {canTakeAction && (
              <>
                <Button variant="destructive" onClick={onReject}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={onApprove} className="bg-blue-500 hover:bg-blue-700 text-white">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

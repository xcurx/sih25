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
    Calendar,
    CheckCircle,
    FileText,
    MapPin,
    Mail,
    Phone,
    User,
    Briefcase,
    DollarSign,
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <FileText className="h-5 w-5 text-sky-600" />
            Application Details
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Review the complete application information before taking action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <User className="h-5 w-5 text-sky-600" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-20 w-20 border-2 border-sky-100">
                  <AvatarImage
                    src={application.studentRel?.avatar || "/placeholder.svg"}
                    alt={application.studentRel?.name}
                  />
                  <AvatarFallback className="text-xl bg-sky-50 text-sky-600 font-semibold">
                    {application.studentRel?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Name
                    </Label>
                    <p className="text-base font-medium text-slate-900 mt-1">{application.studentRel?.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </Label>
                    <p className="text-sm text-slate-700 break-all mt-1">{application.studentRel?.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      Phone
                    </Label>
                    <p className="text-base text-slate-900 mt-1">{application.studentRel?.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Department</Label>
                    <p className="text-base text-slate-900 mt-1">{application.studentRel?.branch}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">CGPA</Label>
                    <p className="text-base font-semibold text-sky-600 mt-1">{application.studentRel?.cgpa}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Year</Label>
                    <p className="text-base text-slate-900 mt-1">
                      Year{" "}
                      {application.studentRel?.batch
                        ? (application.studentRel.batch as number) - new Date().getFullYear() + 5
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              {application.studentRel?.skills && application.studentRel.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {application.studentRel.skills.map((skill, index) => (
                      <Badge key={index} className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company & Job Details */}
          <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Building2 className="h-5 w-5 text-sky-600" />
                Company & Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Company</Label>
                <p className="text-lg font-semibold text-slate-900 mt-1">{application.opportunityRel.companyRel?.name}</p>
                {application.opportunityRel.companyRel?.description && (
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {application.opportunityRel.companyRel.description}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    Job Title
                  </Label>
                  <p className="text-base font-medium text-slate-900 mt-1">{application.opportunityRel.title}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Job Type</Label>
                  <p className="text-base font-medium text-slate-900 mt-1 capitalize">{application.opportunityRel.type}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Location
                  </Label>
                  <p className="text-base text-slate-900 mt-1">{application.opportunityRel.location}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    Salary
                  </Label>
                  <p className="text-base font-semibold text-sky-600 mt-1">₹{application.opportunityRel.salary.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Application Deadline
                  </Label>
                  <p className="text-base text-slate-900 mt-1">
                    {new Date(application.opportunityRel.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Applied On
                  </Label>
                  <p className="text-base text-slate-900 mt-1">{new Date(application.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Description</Label>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">{application.opportunityRel.description}</p>
              </div>
              
              {application.opportunityRel.skillsRequired &&
                application.opportunityRel.skillsRequired.length > 0 && (
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Required Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {application.opportunityRel.skillsRequired.map((skill, index) => (
                        <Badge key={index} variant="outline" className="border-slate-300 text-slate-700">
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
            <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-900">Cover Letter</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{application.coverLetter}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} className="border-slate-200 text-slate-700 hover:bg-slate-50">
            Close
          </Button>
          <Button variant="destructive" onClick={onReject} className="bg-red-500 hover:bg-red-600">
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button onClick={onApprove} className="bg-sky-600 hover:bg-sky-700 text-white">
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { ApprovalApplication } from "@/lib/types"
import {
    Building2,
    Calendar,
    CheckCircle,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    XCircle
} from "lucide-react"

export function ApplicationApprovalCard({
  application,
  onViewDetails,
  onApprove,
  onReject,
}: {
  application: ApprovalApplication
  onViewDetails: () => void
  onApprove: () => void
  onReject: () => void
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-blue-500">Pending Review</Badge>
      case "reviewed":
        return <Badge className="bg-yellow-500">Under Review</Badge>
      case "shortlisted":
        return <Badge className="bg-green-500">Shortlisted</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "accepted":
        return <Badge className="bg-emerald-500">Accepted</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            {/* Student Info */}
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={application.studentRel?.avatar || "/placeholder.svg"}
                alt={application.studentRel?.name}
              />
              <AvatarFallback className="text-lg">
                {application.studentRel?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl truncate">{application.studentRel?.name}</CardTitle>
                  <CardDescription className="text-base">
                    {application.studentRel?.branch} • Year{" "}
                    {application.studentRel?.batch
                      ? (application.studentRel.batch as number) - new Date().getFullYear() + 5
                      : "N/A"}
                  </CardDescription>
                </div>
                {getStatusBadge(application.status.toString().split("_").map(w => w[0].toUpperCase()+w.slice(1)).join(" "))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>CGPA: {application.studentRel?.cgpa}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{application.studentRel?.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{application.studentRel?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job/Company Info */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{application.opportunityRel.title}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {application.opportunityRel.companyRel?.name}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{application.opportunityRel.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span className="capitalize">{application.opportunityRel.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {application.studentRel?.skills && application.studentRel.skills.length > 0 && (
          <div>
            <Label className="text-xs text-muted-foreground">Student Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {application.studentRel.skills.slice(0, 5).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {application.studentRel.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{application.studentRel.skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t gap-2">
          <Button variant="outline" onClick={onViewDetails} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            View Details
          </Button>
          {
            application.mentorApproved === true ? (
              <Button disabled className="flex-1">
                Approved
              </Button>
            ) : (
              <>
                <Button variant="destructive" onClick={onReject} className="flex-1">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button variant="default" onClick={onApprove} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )
          }
        </div>
      </CardContent>
    </Card>
  )
}
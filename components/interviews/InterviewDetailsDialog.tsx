"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Application, Interview } from "@/lib/types"
import {
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Video
} from "lucide-react"

interface InterviewApplication extends Application {
  interviewRel?: Interview
}

export default function InterviewDetailsDialog({
  application,
  onClose,
}: {
  application: InterviewApplication | null
  onClose: () => void
}) {
  if (!application) return null

  const isUpcoming = application.interviewRel?.scheduledAt
    ? new Date(application.interviewRel.scheduledAt) > new Date()
    : false

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const interviewDateTime = application.interviewRel?.scheduledAt
    ? formatDateTime(application.interviewRel.scheduledAt)
    : null

  return (
    <Dialog open={!!application} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Interview Details</span>
          </DialogTitle>
          <DialogDescription>
            {application.opportunityRel.title} at {application.opportunityRel.companyRel?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Interview Schedule */}
          {application.interviewRel && (
            <Card className={isUpcoming ? "border-primary/50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Interview Schedule
                  {isUpcoming && (
                    <Badge className="ml-2 bg-green-500">Upcoming</Badge>
                  )}
                  {!isUpcoming && (
                    <Badge className="ml-2" variant="secondary">Completed</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {interviewDateTime && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{interviewDateTime.date}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{interviewDateTime.time}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {application.interviewRel.interviewDetails && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Additional Details
                    </Label>
                    <p className="text-sm mt-1">{application.interviewRel.interviewDetails}</p>
                  </div>
                )}
                {application.interviewRel.interviewLink && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Interview Link
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant={isUpcoming ? "default" : "outline"}
                        className="w-full"
                        asChild
                      >
                        <a
                          href={application.interviewRel.interviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {isUpcoming ? "Join Interview" : "View Interview Link"}
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
                {application.interviewRel.remark && (
                  <div className="p-4 bg-muted rounded-lg">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Feedback / Remarks
                    </Label>
                    <p className="text-sm mt-2">{application.interviewRel.remark}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Job Details
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
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Position</Label>
                <p className="text-base">{application.opportunityRel.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {application.opportunityRel.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{application.opportunityRel.location}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Job Type</Label>
                  <p className="text-base capitalize">{application.opportunityRel.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Salary</Label>
                  <p className="text-base">₹{application.opportunityRel.salary.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Application Status</Label>
                  <Badge className="mt-1 capitalize">{application.status}</Badge>
                </div>
              </div>
              {application.opportunityRel.skillsRequired &&
                application.opportunityRel.skillsRequired.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Required Skills
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {application.opportunityRel.skillsRequired.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              {application.opportunityRel.requirements &&
                application.opportunityRel.requirements.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Requirements
                    </Label>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      {application.opportunityRel.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Application Information */}
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Applied On</Label>
                  <p className="text-base">{new Date(application.appliedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className="mt-1 capitalize">{application.status}</Badge>
                </div>
              </div>
              {application.coverLetter && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cover Letter</Label>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {application.interviewRel?.interviewLink && isUpcoming && (
            <Button asChild>
              <a
                href={application.interviewRel.interviewLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Join Interview
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

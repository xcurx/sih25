"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Application } from "@/lib/types"
import {
    Building2,
    CheckCircle,
    XCircle
} from "lucide-react"
import { useState } from "react"

export default function ApplicationDetailsDialog({
  application,
  onClose,
  userRole,
}: {
  application: Application | null
  onClose: () => void
  userRole?: string
}) {
  const [feedback, setFeedback] = useState("")

  if (!application) return null

  return (
    <Dialog open={!!application} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>
              {application.opportunityRel.title} - {application.opportunityRel.companyRel?.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Application submitted on {new Date(application.appliedAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information (for non-student users) */}
          {/* {userRole !== "student" && application.student && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={application.student.avatar || "/placeholder.svg"}
                      alt={application.student.name}
                    />
                    <AvatarFallback className="text-lg">
                      {application.student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{application.student.name}</h3>
                    <p className="text-muted-foreground">
                      {application.student.department} • Year {application.student.year}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Email</Label>
                        <p className="text-sm">{application.student.email}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="text-sm">{application.student.phone}</p>
                      </div>
                      <div>
                        <Label>CGPA</Label>
                        <p className="text-sm font-medium">{application.student.cgpa}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {application.student.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{application.opportunityRel.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <p className="text-sm">{application.opportunityRel.location}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm capitalize">{application.opportunityRel.type}</p>
                </div>
                <div>
                  <Label>Salary Range</Label>
                  <p className="text-sm">
                    ₹{application.opportunityRel.salary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>Deadline</Label>
                  <p className="text-sm">{new Date(application.opportunityRel.applicationDeadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label>Required Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {application.opportunityRel.skillsRequired.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
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

          {/* Interview Details */}
          {/* {application.interviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.interviews.map((interview) => (
                  <div key={interview.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Interview #{interview.id}</h4>
                      <Badge variant={interview.status === "scheduled" ? "default" : "secondary"}>
                        {interview.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Date & Time</Label>
                        <p>
                          {new Date(interview.date).toLocaleDateString()} at {interview.time}
                        </p>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <p className="capitalize">{interview.type}</p>
                      </div>
                      {interview.location && (
                        <div>
                          <Label>Location</Label>
                          <p>{interview.location}</p>
                        </div>
                      )}
                      {interview.meetingLink && (
                        <div>
                          <Label>Meeting Link</Label>
                          <Button variant="outline" size="sm" asChild>
                            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                              Join Meeting
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                    {interview.feedback && (
                      <div className="mt-4">
                        <Label>Feedback</Label>
                        <p className="text-sm text-muted-foreground mt-1">{interview.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )} */}

          {/* Actions for non-student users */}
          {userRole !== "student" && userRole !== "placement-cell" && application.status === "applied" && (
            <Card>
              <CardHeader>
                <CardTitle>Review Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback (Optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Add your feedback or comments..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Application
                  </Button>
                  <Button className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve for Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
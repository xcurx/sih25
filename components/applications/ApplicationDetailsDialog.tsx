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
    XCircle,
    MapPin,
    Briefcase,
    DollarSign,
    Calendar,
    FileText,
    Layers
} from "lucide-react"
import { useState } from "react"
import Status from "./Status"

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-sm">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-slate-900">
                {application.opportunityRel.title}
              </DialogTitle>
              <DialogDescription className="text-base font-semibold text-slate-700 mt-1">
                {application.opportunityRel.companyRel?.name}
              </DialogDescription>
              <div className="flex items-center gap-2 mt-3">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Application Status Progress */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Application Progress</h4>
            <Status status={application.status}/>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
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
          <Card className="border-slate-200 rounded-3xl shadow-lg bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Briefcase className="h-5 w-5 text-sky-600" />
                Opportunity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <Label className="text-sm font-semibold text-slate-700">Description</Label>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{application.opportunityRel.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="rounded-full bg-slate-100 p-2">
                    <MapPin className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Location</Label>
                    <p className="text-sm font-medium text-slate-900">{application.opportunityRel.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="rounded-full bg-slate-100 p-2">
                    <Briefcase className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Type</Label>
                    <p className="text-sm font-medium text-slate-900 capitalize">{application.opportunityRel.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="rounded-full bg-emerald-100 p-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <Label className="text-xs text-emerald-600">Salary</Label>
                    <p className="text-sm font-semibold text-emerald-900">
                      ₹{application.opportunityRel.salary.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="rounded-full bg-slate-100 p-2">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Deadline</Label>
                    <p className="text-sm font-medium text-slate-900">{new Date(application.opportunityRel.applicationDeadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4 text-slate-500" />
                  Required Skills
                </Label>
                <div className="flex flex-wrap gap-2">
                  {application.opportunityRel.skillsRequired.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card className="border-slate-200 rounded-3xl shadow-lg bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <FileText className="h-5 w-5 text-sky-600" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{application.coverLetter}</p>
                </div>
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
            <Card className="border-slate-200 rounded-3xl shadow-lg bg-gradient-to-br from-slate-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <CheckCircle className="h-5 w-5 text-sky-600" />
                  Review Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-sm font-semibold text-slate-700">
                    Feedback (Optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Add your feedback or comments..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="rounded-2xl border-slate-200 focus:border-sky-400 focus:ring-sky-400"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-full border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Application
                  </Button>
                  <Button 
                    className="flex-1 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md"
                  >
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
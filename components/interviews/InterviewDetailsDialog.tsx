"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Application, Interview } from "@/lib/types"
import axios from "axios"
import { useEffect, useState } from "react"
import {
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Video,
  DollarSign,
  Layers,
  Briefcase,
  FileText
} from "lucide-react"

interface InterviewApplication extends Application {
  interviewRel?: Interview
}

type QuestionAnswer = {
  question: string
  answer: string
}

export default function InterviewDetailsDialog({
  application,
  onClose,
}: {
  application: InterviewApplication | null
  onClose: () => void
}) {
  const [prepQA, setPrepQA] = useState<QuestionAnswer[] | null>(null)
  const [generatingPrep, setGeneratingPrep] = useState(false)
  const [prepError, setPrepError] = useState<string | null>(null)

  useEffect(() => {
    setPrepQA(null)
    setPrepError(null)
    setGeneratingPrep(false)
  }, [application?.id])

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

  const handleGeneratePrep = async () => {
    setGeneratingPrep(true)
    setPrepError(null)
    try {
      const payload = {
        jobTitle: application.opportunityRel.title,
        companyName: application.opportunityRel.companyRel?.name,
        jobDescription: application.opportunityRel.description,
        skills: application.opportunityRel.skillsRequired || [],
        requirements: application.opportunityRel.requirements || [],
      }
      const res = await axios.post("/api/interview/generate-qa", payload, { withCredentials: true })
      setPrepQA(res.data.questions ?? [])
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to generate interview prep."
      setPrepError(message)
    } finally {
      setGeneratingPrep(false)
    }
  }

  return (
    <Dialog open={!!application} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-sm">
              <Video className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-slate-900">
                Interview Details
              </DialogTitle>
              <DialogDescription className="text-base font-semibold text-slate-700 mt-1">
                {application.opportunityRel.title} at {application.opportunityRel.companyRel?.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Interview Schedule */}
          {application.interviewRel && (
            <Card className={`border-slate-200 rounded-3xl shadow-lg bg-white/90 ${isUpcoming ? "ring-2 ring-sky-200" : ""}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Calendar className="h-5 w-5 text-sky-600" />
                  Interview Schedule
                  {isUpcoming && (
                    <Badge className="ml-2 rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">
                      Upcoming
                    </Badge>
                  )}
                  {!isUpcoming && (
                    <Badge className="ml-2 rounded-full bg-slate-100 text-slate-700 border-slate-200">
                      Completed
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interviewDateTime && (
                    <>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <div className="rounded-full bg-slate-100 p-2">
                          <Calendar className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">Date</Label>
                          <p className="text-sm font-medium text-slate-900">{interviewDateTime.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <div className="rounded-full bg-slate-100 p-2">
                          <Clock className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">Time</Label>
                          <p className="text-sm font-medium text-slate-900">{interviewDateTime.time}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {application.interviewRel.interviewDetails && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Additional Details
                    </Label>
                    <p className="text-sm text-slate-600 leading-relaxed">{application.interviewRel.interviewDetails}</p>
                  </div>
                )}
                {application.interviewRel.interviewLink && (
                  <div>
                    <Button
                      className={`w-full rounded-full ${isUpcoming ? "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-md" : "border-slate-200 hover:bg-slate-50"}`}
                      variant={isUpcoming ? "default" : "outline"}
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
                )}
                {application.interviewRel.remark && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <Label className="text-sm font-semibold text-emerald-700 mb-2 block">
                      Feedback / Remarks
                    </Label>
                    <p className="text-sm text-emerald-900 leading-relaxed">{application.interviewRel.remark}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                <Label className="text-sm font-semibold text-slate-700">Company</Label>
                <p className="text-lg font-bold text-slate-900 mt-1">{application.opportunityRel.companyRel?.name}</p>
                {application.opportunityRel.companyRel?.description && (
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {application.opportunityRel.companyRel.description}
                  </p>
                )}
              </div>
              
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <Label className="text-sm font-semibold text-slate-700">Position</Label>
                <p className="text-base font-medium text-slate-900 mt-1">{application.opportunityRel.title}</p>
              </div>
              
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <Label className="text-sm font-semibold text-slate-700">Description</Label>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {application.opportunityRel.description}
                </p>
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
                    <Label className="text-xs text-slate-500">Job Type</Label>
                    <p className="text-sm font-medium text-slate-900 capitalize">{application.opportunityRel.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="rounded-full bg-emerald-100 p-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <Label className="text-xs text-emerald-600">Salary</Label>
                    <p className="text-sm font-semibold text-emerald-900">₹{application.opportunityRel.salary.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="rounded-full bg-slate-100 p-2">
                    <FileText className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Status</Label>
                    <Badge className="mt-1 rounded-full bg-sky-100 text-sky-700 border-sky-200 capitalize">
                      {application.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {application.opportunityRel.skillsRequired &&
                application.opportunityRel.skillsRequired.length > 0 && (
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
                )}
              {application.opportunityRel.requirements &&
                application.opportunityRel.requirements.length > 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <Label className="text-sm font-semibold text-slate-700 mb-3 block">
                      Requirements
                    </Label>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {application.opportunityRel.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* AI Interview Prep */}
          {isUpcoming && (
            <Card className="border-slate-200 rounded-3xl shadow-lg bg-white/90">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Building2 className="h-5 w-5 text-sky-600" />
                  AI Interview Prep
                </CardTitle>
                <Button
                  onClick={handleGeneratePrep}
                  disabled={generatingPrep}
                  className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                >
                  {generatingPrep ? "Generating..." : prepQA ? "Regenerate Questions" : "Generate Questions"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {prepError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100 p-3">
                    {prepError}
                  </p>
                )}
                {prepQA ? (
                  <div className="space-y-4">
                    {prepQA.map((qa, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                      >
                        <p className="text-xs font-semibold text-slate-500 mb-1">Question {index + 1}</p>
                        <p className="text-sm font-semibold text-slate-900 mb-2">{qa.question}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    Generate five targeted questions with model answers tailored to this role's description.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Application Information */}
          <Card className="border-slate-200 rounded-3xl shadow-lg bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <FileText className="h-5 w-5 text-sky-600" />
                Application Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="rounded-full bg-slate-100 p-2">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Applied On</Label>
                    <p className="text-sm font-medium text-slate-900">{new Date(application.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="rounded-full bg-slate-100 p-2">
                    <FileText className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Status</Label>
                    <Badge className="mt-1 rounded-full bg-sky-100 text-sky-700 border-sky-200 capitalize">
                      {application.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {application.coverLetter && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <Label className="text-sm font-semibold text-slate-700 mb-2 block">Cover Letter</Label>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {application.coverLetter}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-full border-slate-200 hover:bg-slate-50"
          >
            Close
          </Button>
          {application.interviewRel?.interviewLink && isUpcoming && (
            <Button 
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md"
              asChild
            >
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

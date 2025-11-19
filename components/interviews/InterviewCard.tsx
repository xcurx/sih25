"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Application, Interview, InterviewApplication } from "@/lib/types"
import {
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  MapPin,
  Video
} from "lucide-react"



export default function InterviewCard({
  application,
  onViewDetails,
}: {
  application: InterviewApplication
  onViewDetails: (application: InterviewApplication) => void
}) {
  const isUpcoming = application.interviewRel?.scheduledAt
    ? new Date(application.interviewRel.scheduledAt) > new Date()
    : false

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "shortlisted":
        return <Badge className="bg-emerald-500">Shortlisted</Badge>
      case "interviewed":
        return <Badge className="bg-blue-500">Interviewed</Badge>
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
    return { date: dateStr, time: timeStr }
  }

  const getTimeUntil = (dateString: string) => {
    const now = new Date()
    const interviewDate = new Date(dateString)
    const diffInHours = Math.floor((interviewDate.getTime() - now.getTime()) / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
      return `in ${diffInDays} ${diffInDays === 1 ? "day" : "days"}`
    } else if (diffInHours > 0) {
      return `in ${diffInHours} ${diffInHours === 1 ? "hour" : "hours"}`
    } else if (diffInHours === 0) {
      return "starting soon"
    } else {
      return "completed"
    }
  }

  const interviewDateTime = application.interviewRel?.scheduledAt
    ? formatDateTime(application.interviewRel.scheduledAt)
    : null

  return (
    <Card className={`group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200 ${isUpcoming ? "ring-2 ring-sky-200" : ""}`}>
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
      
      <CardHeader className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-sm flex-shrink-0">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col space-y-2 mb-2">
                <CardTitle className="text-xl font-bold text-slate-900">
                  {application.opportunityRel.title}
                </CardTitle>
                <CardDescription className="text-base font-semibold text-slate-700">
                  {application.opportunityRel.companyRel?.name}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{application.opportunityRel.location}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  <span className="capitalize">{application.opportunityRel.type}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(application.status)}
            {isUpcoming && (
              <Badge className="rounded-full border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100">
                <Clock className="h-3 w-3 mr-1" />
                {application.interviewRel?.scheduledAt &&
                  getTimeUntil(application.interviewRel.scheduledAt)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Interview Schedule */}
        {application.interviewRel && (
          <div className={`rounded-2xl p-4 ${isUpcoming ? "border-2 border-sky-200 bg-sky-50/60" : "border border-slate-200 bg-slate-50/60"}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`rounded-full p-2 ${isUpcoming ? "bg-sky-100" : "bg-slate-100"}`}>
                <Video className={`h-5 w-5 ${isUpcoming ? "text-sky-600" : "text-slate-600"}`} />
              </div>
              <h4 className="font-semibold text-slate-900">
                {isUpcoming ? "Scheduled Interview" : "Interview Completed"}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interviewDateTime && (
                <>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                    <div className="rounded-full bg-slate-100 p-2">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-sm font-medium text-slate-900">{interviewDateTime.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                    <div className="rounded-full bg-slate-100 p-2">
                      <Clock className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="text-sm font-medium text-slate-900">{interviewDateTime.time}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {application.interviewRel.interviewDetails && (
              <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">Details</p>
                <p className="text-sm text-slate-600 leading-relaxed">{application.interviewRel.interviewDetails}</p>
              </div>
            )}
            {application.interviewRel.remark && !isUpcoming && (
              <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-700 mb-2">Feedback</p>
                <p className="text-sm text-emerald-900">{application.interviewRel.remark}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200">
          <Button 
            variant="outline" 
            onClick={() => onViewDetails(application)} 
            className="flex-1 w-full rounded-full border-slate-200 hover:bg-slate-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          {application.interviewRel?.interviewLink && isUpcoming && application.status === "shortlisted" && (
            <Button
              className="flex-1 w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md"
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
      </CardContent>
    </Card>
  )
}

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
    <Card className={`hover:shadow-lg transition-shadow ${isUpcoming ? "border-primary/50" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl truncate">
                    {application.opportunityRel.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-foreground">
                    {application.opportunityRel.companyRel?.name}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(application.status)}
                  {isUpcoming && (
                    <Badge variant="outline" className="border-primary text-primary">
                      <Clock className="h-3 w-3 mr-1" />
                      {application.interviewRel?.scheduledAt &&
                        getTimeUntil(application.interviewRel.scheduledAt)}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{application.opportunityRel.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span className="capitalize">{application.opportunityRel.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Interview Schedule */}
        {application.interviewRel && (
          <div className={`p-4 rounded-lg ${isUpcoming ? "bg-primary/5 border border-primary/20" : "bg-muted"}`}>
            <div className="flex items-center gap-2 mb-3">
              <Video className={`h-5 w-5 ${isUpcoming ? "text-primary" : "text-muted-foreground"}`} />
              <h4 className="font-semibold">
                {isUpcoming ? "Scheduled Interview" : "Interview Completed"}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviewDateTime && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{interviewDateTime.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{interviewDateTime.time}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {application.interviewRel.interviewDetails && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Details</p>
                <p className="text-sm">{application.interviewRel.interviewDetails}</p>
              </div>
            )}
            {application.interviewRel.remark && !isUpcoming && (
              <div className="mt-3 p-3 bg-background rounded border">
                <p className="text-xs text-muted-foreground mb-1">Feedback</p>
                <p className="text-sm">{application.interviewRel.remark}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onViewDetails(application)} className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          {application.interviewRel?.interviewLink && isUpcoming && application.status === "shortlisted" && (
            <Button
              className="flex-1"
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

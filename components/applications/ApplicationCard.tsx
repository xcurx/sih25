"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Application, ApplicationStatus } from "@/lib/types"
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    ExternalLink,
    Eye,
    FileText,
    XCircle
} from "lucide-react"
import Link from "next/link"
import Status from "./Status"

export default function ApplicationCard({
  application,
  onViewDetails,
  userRole,
}: {
  application: Application
  onViewDetails: React.Dispatch<React.SetStateAction<Application | null>>
  userRole?: string
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "mentor_approval_needed":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "interview":
        return <Calendar className="h-4 w-4" />
      case "selected":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: ApplicationStatus) => {
      switch (status) {
        case "mentor_approval_needed":
          return "bg-yellow-400"
        case "applied":
          return "bg-blue-400"
        case "reviewed":
          return "bg-indigo-400"
        case "shortlisted":
          return "bg-emerald-500"
        case "interviewed":
          return "bg-amber-500"
        case "rejected":
          return "bg-rose-500"
        case "accepted":
          return "bg-green-500"
        default:
          return "secondary"
      }
  }

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
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
                <CardTitle className="text-xl font-bold text-slate-900">{application.opportunityRel.title}</CardTitle>
                <CardDescription className="text-base font-semibold text-slate-700">
                  {application.opportunityRel.companyRel?.name}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  <span className="capitalize">{application.opportunityRel.type}</span>
                </div>
              </div>
              {/* Status Progress Indicator */}
              <div className="mt-4">
                <Status status={application.status}/>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`flex items-center gap-2 rounded-full px-4 py-1 text-sm ${getStatusColor(application.status)} text-white border-none shadow-sm`}>
              {getStatusIcon(application.status)}
              <span className="capitalize font-medium">
                {application.status === "mentor_approval_needed"
                  ? "Mentor Approval Needed"
                  : application.status}
              </span>
            </Badge>
            {userRole !== "student" && application.studentId && (
              <div className="flex items-center space-x-3">
                {/* Student info can be added here */}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {application.coverLetter && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              Cover Letter
            </h4>
            <p className="text-slate-600 line-clamp-2 leading-relaxed">{application.coverLetter}</p>
          </div>
        )}

        {/* {application.interviews.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Upcoming Interviews:</h4>
            {application.interviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">{new Date(interview.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {interview.time} • {interview.type}
                    </p>
                  </div>
                </div>
                {interview.meetingLink && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )} */}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            {application.opportunityRel.skillsRequired.slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
              >
                {skill}
              </Badge>
            ))}
            {application.opportunityRel.skillsRequired.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs rounded-full border-slate-300 bg-slate-100 text-slate-700"
              >
                +{application.opportunityRel.skillsRequired.length - 3} more
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(application)}
              className="rounded-full border-slate-200 hover:bg-slate-50"
            >
              <Eye className="mr-2 h-4 w-4" />
              Quick View
            </Button>
            <Link href={`/applications/${application.id}`}>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full border-sky-200 text-sky-700 hover:bg-sky-50"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Full Details
              </Button>
            </Link>
            {(userRole !== "student" && userRole !== "placement-cell") && application.status === "applied" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full border-red-200 text-red-700 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
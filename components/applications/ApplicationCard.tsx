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
    Eye,
    FileText,
    XCircle
} from "lucide-react"
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex w-full items-center space-x-2 mb-1 justify-between">
                <CardTitle className="text-xl">{application.opportunityRel.title}</CardTitle>
                <div className="flex items-center space-x-1">
                  <Status status={application.status}/>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="capitalize">{
                      application.status === "mentor_approval_needed"?
                      "Mentor Approval Needed" : application.status
                    }</span>
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-lg font-medium text-foreground">
                {application.opportunityRel.companyRel?.name}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>{application.opportunityRel.type}</span>
                </div>
              </div>
            </div>
          </div>
          {userRole !== "student" && application.studentId && (
            <div className="flex items-center space-x-3">
              {/* <Avatar className="h-10 w-10">
                <AvatarImage src={application.student.avatar || "/placeholder.svg"} alt={application.student.name} />
                <AvatarFallback>
                  {application.student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar> */}
              {/* <div>
                <p className="font-medium">{application.student.name}</p>
                <p className="text-sm text-muted-foreground">CGPA: {application.student.cgpa}</p>
              </div> */}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {application.coverLetter && (
          <div>
            <h4 className="font-medium mb-2">Cover Letter:</h4>
            <p className="text-muted-foreground line-clamp-2">{application.coverLetter}</p>
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

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {application.opportunityRel.skillsRequired.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {application.opportunityRel.skillsRequired.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{application.opportunityRel.skillsRequired.length - 3} more
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(application)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            {userRole !== "student" && application.status === "applied" && (
              <>
                <Button variant="outline" size="sm">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button size="sm">
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
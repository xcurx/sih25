"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { mockJobs, mockStudents } from "@/lib/mock-data"
import type { Application, Job, Student } from "@/lib/types"
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  User,
  Building2,
} from "lucide-react"

// Extended mock data for applications
const extendedApplications: (Application & { job: Job; student?: Student })[] = [
  {
    id: "1",
    jobId: "1",
    studentId: "1",
    status: "pending",
    appliedDate: "2024-11-15",
    coverLetter:
      "I am excited to apply for this internship position at TechCorp Inc. My experience with React and Node.js makes me a perfect fit for this role.",
    interviews: [],
    job: mockJobs[0],
    student: mockStudents[0],
  },
  {
    id: "2",
    jobId: "2",
    studentId: "1",
    status: "interview",
    appliedDate: "2024-11-10",
    coverLetter: "I am passionate about data science and would love to contribute to your team.",
    interviews: [
      {
        id: "1",
        applicationId: "2",
        date: "2024-11-25",
        time: "14:00",
        type: "online",
        meetingLink: "https://meet.google.com/abc-def-ghi",
        status: "scheduled",
      },
    ],
    job: mockJobs[1],
    student: mockStudents[0],
  },
  {
    id: "3",
    jobId: "3",
    studentId: "1",
    status: "rejected",
    appliedDate: "2024-11-05",
    coverLetter: "I believe my full-stack development skills align perfectly with your requirements.",
    interviews: [],
    job: mockJobs[2],
    student: mockStudents[0],
  },
]

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<(typeof extendedApplications)[0] | null>(null)

  const applications =
    user?.role === "student" ? extendedApplications.filter((app) => app.studentId === user.id) : extendedApplications

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "interview":
        return "default"
      case "selected":
        return "default"
      default:
        return "secondary"
    }
  }

  const pendingApplications = filteredApplications.filter((app) => app.status === "pending")
  const interviewApplications = filteredApplications.filter((app) => app.status === "interview")
  const completedApplications = filteredApplications.filter((app) =>
    ["approved", "rejected", "selected"].includes(app.status),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          {user?.role === "student" ? "My Applications" : "Student Applications"}
        </h1>
        <p className="text-muted-foreground">
          {user?.role === "student"
            ? "Track your job applications and interview status"
            : "Manage and review student applications"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredApplications.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewApplications.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">Interview conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="interview">Interviews ({interviewApplications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={setSelectedApplication}
              userRole={user?.role}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={setSelectedApplication}
              userRole={user?.role}
            />
          ))}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          {interviewApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={setSelectedApplication}
              userRole={user?.role}
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={setSelectedApplication}
              userRole={user?.role}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <ApplicationDetailsDialog
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        userRole={user?.role}
      />
    </div>
  )
}

function ApplicationCard({
  application,
  onViewDetails,
  userRole,
}: {
  application: (typeof extendedApplications)[0]
  onViewDetails: (app: (typeof extendedApplications)[0]) => void
  userRole?: string
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "interview":
        return "default"
      case "selected":
        return "default"
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
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-xl">{application.job.title}</CardTitle>
                <Badge variant={getStatusColor(application.status)} className="flex items-center gap-1">
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{application.status}</span>
                </Badge>
              </div>
              <CardDescription className="text-lg font-medium text-foreground">
                {application.job.company}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>{application.job.type}</span>
                </div>
              </div>
            </div>
          </div>
          {userRole !== "student" && application.student && (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={application.student.avatar || "/placeholder.svg"} alt={application.student.name} />
                <AvatarFallback>
                  {application.student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{application.student.name}</p>
                <p className="text-sm text-muted-foreground">CGPA: {application.student.cgpa}</p>
              </div>
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

        {application.interviews.length > 0 && (
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
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {application.job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {application.job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{application.job.skills.length - 3} more
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(application)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            {userRole !== "student" && application.status === "pending" && (
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

function ApplicationDetailsDialog({
  application,
  onClose,
  userRole,
}: {
  application: (typeof extendedApplications)[0] | null
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
              {application.job.title} - {application.job.company}
            </span>
          </DialogTitle>
          <DialogDescription>
            Application submitted on {new Date(application.appliedDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information (for non-student users) */}
          {userRole !== "student" && application.student && (
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
          )}

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{application.job.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <p className="text-sm">{application.job.location}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm capitalize">{application.job.type}</p>
                </div>
                <div>
                  <Label>Salary Range</Label>
                  <p className="text-sm">
                    ₹{application.job.salary.min.toLocaleString()} - ₹{application.job.salary.max.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>Deadline</Label>
                  <p className="text-sm">{new Date(application.job.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label>Required Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {application.job.skills.map((skill, index) => (
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
          {application.interviews.length > 0 && (
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
          )}

          {/* Actions for non-student users */}
          {userRole !== "student" && application.status === "pending" && (
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

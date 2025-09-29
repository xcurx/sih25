
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Briefcase, Calendar, CheckCircle, Clock, FileText, GraduationCap, TrendingUp } from "lucide-react"
import { Progress } from "../ui/progress"

import { mockJobs, mockStudents } from "@/lib/mock-data"

export default function StudentDashboard() {
  const student = mockStudents[0]
  const recentJobs = mockJobs.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CGPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.cgpa}</div>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Latest opportunities matching your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.companyId}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="outline">{job.location}</Badge>
                  </div>
                </div>
                <Button size="sm">Apply</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Track your application progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Software Development Intern</h3>
                <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Data Science Intern</h3>
                <p className="text-sm text-muted-foreground">DataTech Solutions</p>
              </div>
              <Badge variant="default">Interview</Badge>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Frontend Developer</h3>
                <p className="text-sm text-muted-foreground">WebCorp</p>
              </div>
              <Badge variant="destructive">Rejected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
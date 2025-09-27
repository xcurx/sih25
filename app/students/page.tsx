"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { mockStudents } from "@/lib/mock-data"
import type { Student } from "@/lib/types"
import {
  Search,
  Download,
  Eye,
  MessageSquare,
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react"

// Extended mock data for students
const extendedStudents: Student[] = [
  ...mockStudents,
  {
    id: "2",
    name: "Alice Johnson",
    email: "alice.johnson@college.edu",
    phone: "+1234567891",
    department: "Information Technology",
    year: 4,
    cgpa: 9.1,
    avatar: "/diverse-students-studying.png",
    skills: ["Java", "Spring Boot", "MySQL", "Angular", "Docker"],
    projects: [
      {
        id: "3",
        title: "Hospital Management System",
        description: "Complete hospital management system with patient records and appointment scheduling",
        technologies: ["Java", "Spring Boot", "MySQL", "Angular"],
        githubUrl: "https://github.com/alice/hospital-system",
        startDate: "2024-01-01",
        endDate: "2024-05-15",
      },
    ],
    certifications: [
      {
        id: "2",
        name: "Oracle Java Certification",
        issuer: "Oracle",
        issueDate: "2024-02-15",
      },
    ],
    preferences: {
      jobTypes: ["full-time"],
      locations: ["Bangalore", "Hyderabad"],
      salaryRange: { min: 400000, max: 900000 },
      industries: ["Healthcare", "Fintech"],
    },
    applications: [],
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob.wilson@college.edu",
    phone: "+1234567892",
    department: "Electronics and Communication",
    year: 3,
    cgpa: 7.8,
    avatar: "/diverse-students-studying.png",
    skills: ["C++", "Embedded Systems", "Arduino", "MATLAB", "PCB Design"],
    projects: [
      {
        id: "4",
        title: "IoT Weather Station",
        description: "Smart weather monitoring system using IoT sensors",
        technologies: ["Arduino", "C++", "IoT", "Sensors"],
        startDate: "2024-03-01",
        endDate: "2024-06-30",
      },
    ],
    certifications: [],
    preferences: {
      jobTypes: ["internship", "full-time"],
      locations: ["Chennai", "Bangalore"],
      salaryRange: { min: 250000, max: 600000 },
      industries: ["Electronics", "Automotive"],
    },
    applications: [],
  },
]

export default function StudentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [placementStatus, setPlacementStatus] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  if (user?.role !== "placement_cell" && user?.role !== "faculty") {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to placement cell and faculty.</p>
        </div>
      </div>
    )
  }

  const filteredStudents = extendedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter
    const matchesYear = yearFilter === "all" || student.year.toString() === yearFilter

    return matchesSearch && matchesDepartment && matchesYear
  })

  const departments = Array.from(new Set(extendedStudents.map((s) => s.department)))
  const years = Array.from(new Set(extendedStudents.map((s) => s.year.toString()))).sort()

  const placedStudents = filteredStudents.filter((s) => s.applications.some((app) => app.status === "selected"))
  const activeStudents = filteredStudents.filter((s) =>
    s.applications.some((app) => ["pending", "interview"].includes(app.status)),
  )
  const unplacedStudents = filteredStudents.filter(
    (s) => s.applications.length === 0 || s.applications.every((app) => app.status === "rejected"),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Student Management</h1>
          <p className="text-muted-foreground">Manage student profiles and track placement progress</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStudents.length}</div>
            <p className="text-xs text-muted-foreground">Eligible for placement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{placedStudents.length}</div>
            <p className="text-xs text-muted-foreground">Successfully placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Process</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents.length}</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unplaced</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unplacedStudents.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      Year {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Students ({filteredStudents.length})</TabsTrigger>
          <TabsTrigger value="placed">Placed ({placedStudents.length})</TabsTrigger>
          <TabsTrigger value="active">In Process ({activeStudents.length})</TabsTrigger>
          <TabsTrigger value="unplaced">Unplaced ({unplacedStudents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="placed" className="space-y-4">
          <div className="grid gap-4">
            {placedStudents.map((student) => (
              <StudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeStudents.map((student) => (
              <StudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unplaced" className="space-y-4">
          <div className="grid gap-4">
            {unplacedStudents.map((student) => (
              <StudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Student Details Dialog */}
      <StudentDetailsDialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  )
}

function StudentCard({
  student,
  onViewDetails,
}: {
  student: Student
  onViewDetails: (student: Student) => void
}) {
  const getPlacementStatus = (student: Student) => {
    if (student.applications.some((app) => app.status === "selected")) {
      return { status: "Placed", color: "default" }
    }
    if (student.applications.some((app) => ["pending", "interview"].includes(app.status))) {
      return { status: "In Process", color: "secondary" }
    }
    return { status: "Unplaced", color: "destructive" }
  }

  const placementInfo = getPlacementStatus(student)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
              <AvatarFallback className="text-lg">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-xl">{student.name}</CardTitle>
                <Badge variant={placementInfo.color as any}>{placementInfo.status}</Badge>
              </div>
              <CardDescription className="text-base">
                {student.department} • Year {student.year}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{student.cgpa}</div>
            <div className="text-xs text-muted-foreground">CGPA</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {student.skills.slice(0, 6).map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
            {student.skills.length > 6 && <Badge variant="outline">+{student.skills.length - 6} more</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-bold">{student.projects.length}</div>
            <div className="text-muted-foreground">Projects</div>
          </div>
          <div>
            <div className="font-bold">{student.certifications.length}</div>
            <div className="text-muted-foreground">Certificates</div>
          </div>
          <div>
            <div className="font-bold">{student.applications.length}</div>
            <div className="text-muted-foreground">Applications</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Prefers: {student.preferences.locations.slice(0, 2).join(", ")}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button size="sm" onClick={() => onViewDetails(student)}>
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StudentDetailsDialog({
  student,
  onClose,
}: {
  student: Student | null
  onClose: () => void
}) {
  if (!student) return null

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>{student.name} - Student Profile</span>
          </DialogTitle>
          <DialogDescription>
            {student.department} • Year {student.year} • CGPA: {student.cgpa}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="text-xl">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{student.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p>{student.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p>{student.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year</label>
                    <p>Year {student.year}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects ({student.projects.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {project.startDate} - {project.endDate || "Present"}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Certifications */}
          {student.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications ({student.certifications.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{cert.name}</h3>
                      <p className="text-muted-foreground">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground">Issued: {cert.issueDate}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Job Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Job Types</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.preferences.jobTypes.map((type, index) => (
                      <Badge key={index} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferred Locations</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.preferences.locations.map((location, index) => (
                      <Badge key={index} variant="secondary">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Salary Range</label>
                <p>
                  ₹{student.preferences.salaryRange.min.toLocaleString()} - ₹
                  {student.preferences.salaryRange.max.toLocaleString()} per annum
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Preferred Industries</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {student.preferences.industries.map((industry, index) => (
                    <Badge key={index} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

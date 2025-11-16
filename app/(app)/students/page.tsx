"use client"

import Loader from "@/components/loader/Loader"
import StudentCard from "@/components/students/StudentCard"
import StudentDetailsDialog from "@/components/students/StudentDetailsDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Student } from "@/lib/types"
import axios from "axios"
import {
  Award,
  Briefcase,
  Download,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function StudentsPage() {
  const { data:session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [placementStatus, setPlacementStatus] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const getStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/placementcell/get-students", { withCredentials: true });
        if (res.status === 200) {
          setStudents(res.data.students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDepartment = departmentFilter === "all" || student.branch == departmentFilter
    const matchesYear = yearFilter === "all" || (`${4-(student.batch-2025)}`) === yearFilter

    return matchesSearch && matchesDepartment && matchesYear
  })

  const departments = Array.from(new Set(students.map((s) => s.branch)))
  const years = Array.from(new Set(students.map((s) => `${4-(s.batch-2025)}`))).sort()

  const placedStudents = filteredStudents.filter((s) => s.applications.some((app) => app.status === "accepted"))
  const activeStudents = filteredStudents.filter((s) =>
    s.applications.some((app) => ["applied", "shortlisted"].includes(app.status)),
  )
  const unplacedStudents = filteredStudents.filter(
    (s) => s.applications.length === 0 || s.applications.every((app) => app.status === "rejected"),
  )

  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") return;
    getStudents();
  }, [status])

  if (status === "loading" || status === "unauthenticated" || loading) {
    return <Loader/>
  }

  if (session?.user?.role !== "placement-cell" && session?.user?.role !== "faculty") {
    router.replace("/")
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto">
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


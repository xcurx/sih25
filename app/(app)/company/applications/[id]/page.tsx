"use client"

import AppliedStudentCard from "@/components/emplyer/AppliedStudentsCard"
import Loader from "@/components/loader/Loader"
import StudentDetailsDialog from "@/components/students/StudentDetailsDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Student } from "@/lib/types"
import axios from "axios"
import {
  Download,
  Search
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AppliedStudentsPage() {
  const { data:session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [placementStatus, setPlacementStatus] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { id } = useParams();

  const getStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/get-applied-students-for-opportunity/${id}`, { withCredentials: true });
        if (res.status === 200) {
          setStudents(res.data.applications.map((app: any) => app.studentRel));
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

  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") return;
    getStudents();
  }, [status])

  if (status === "loading" || status === "unauthenticated" || loading) {
    return <Loader/>
  }

  if (session?.user?.role !== "employer") {
    router.replace("/")
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Application Management</h1>
          <p className="text-muted-foreground">Manage student applications</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
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
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredStudents.map((student) => (
              <AppliedStudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
            ))}
            {
              !loading && filteredStudents.length === 0 && <p className="text-sm text-center text-muted-foreground">No students found.</p>
            }
          </div>
        </TabsContent>
      </Tabs>

      {/* Student Details Dialog */}
      <StudentDetailsDialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  )
}


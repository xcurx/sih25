"use client"

import Loader from "@/components/loader/Loader"
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
  ExternalLink,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  CheckCircle2,
  Users,
  AlertCircle,
  FileText
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface CustomStudentCardProps {
    student: Student;
    onViewDetails: (student: Student) => void;
}

const CustomStudentCard = ({ student, onViewDetails }: CustomStudentCardProps) => {
    const isPlaced = student.applications.some((app) => app.status === "accepted");
    const isInProcess = student.applications.some((app) => ["applied", "shortlisted"].includes(app.status)) && !isPlaced;
    const isUnplaced = !isPlaced && !isInProcess;

    const statusBadge = () => {
        if (isPlaced) return <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-full">Placed</Badge>;
        if (isInProcess) return <Badge className="bg-sky-600 hover:bg-sky-600 text-white rounded-full">In Process</Badge>;
        return <Badge className="bg-amber-600 hover:bg-amber-600 text-white rounded-full">Unplaced</Badge>;
    };

    const getYear = (batch: number) => {
        return 4 - (batch - 2025);
    };

    const skills = student.skills || ["JS", "Python", "SQL"]; 
    const applicationsCount = student.applications?.length || 0;

    return (
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl transition hover:shadow-md hover:border-sky-200">
            <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex space-x-4 items-start">
                        <Avatar className="h-12 w-12 border-2 border-slate-100">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback className="bg-sky-50 text-sky-700 text-base font-semibold">
                                {student.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-base font-semibold text-slate-900">{student.name}</h3>
                                {statusBadge()}
                            </div>
                            <p className="text-sm text-slate-600">
                                {student.branch} • Year {getYear(student.batch)}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {student.email}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {student.phone}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-2xl font-semibold text-slate-900">
                            {student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">CGPA</p>
                    </div>
                </div>
                
                <hr className="border-slate-100" />

                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 6).map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-slate-50 text-slate-700 rounded-full border-slate-200 text-xs">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 pt-1 flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="font-medium text-slate-700">{applicationsCount}</span> Total Applications
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                    <Button variant="ghost" size="sm" className="rounded-full text-slate-600 hover:bg-slate-100 text-xs">
                        <Mail className="h-3.5 w-3.5 mr-1.5" />
                        Contact
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(student)} className="rounded-full text-sky-600 hover:bg-sky-50 text-xs">
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        Quick View
                    </Button>
                    <Link href={`/students/${student.id}`}>
                        <Button size="sm" className="rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs">
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            View Profile
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};


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
      <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
        {/* Hero Section with Stats - matching employer dashboard style */}
        <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
          <div className="relative space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Student Management</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Student Talent Pool</h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage student profiles and track placement progress across all departments.
              </p>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="outline" className="rounded-full border-sky-600 text-sky-600 hover:bg-sky-50 hover:text-sky-700">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Stats Cards inside gradient */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle>
                <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">{filteredStudents.length}</div>
                <p className="text-xs text-slate-500">Eligible for placement</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Placed</CardTitle>
                <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                  <Award className="h-4 w-4" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">{placedStudents.length}</div>
                <p className="text-xs text-slate-500">Successfully secured offers</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">In Process</CardTitle>
                <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                  <Briefcase className="h-4 w-4" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">{activeStudents.length}</div>
                <p className="text-xs text-slate-500">Active applications/interviews</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Unplaced</CardTitle>
                <div className="rounded-full p-2 bg-amber-50 text-amber-600">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">{unplacedStudents.length}</div>
                <p className="text-xs text-slate-500">Require immediate attention</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Search and Filter Card */}
        <Card className="shadow-lg border-slate-200 rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search students by name, email, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-slate-200 focus:border-sky-500 rounded-lg transition"
                />
              </div>
              <div className="flex gap-4 w-full lg:w-auto">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full lg:w-48 h-10 border-slate-200 focus:ring-sky-500 rounded-lg">
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
                  <SelectTrigger className="w-full lg:w-32 h-10 border-slate-200 focus:ring-sky-500 rounded-lg">
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

        {/* Tabs Section */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 h-auto rounded-full">
            <TabsTrigger 
                value="all" 
                className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900"
            >
                All Students ({filteredStudents.length})
            </TabsTrigger>
            <TabsTrigger 
                value="placed" 
                className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900"
            >
                Placed ({placedStudents.length})
            </TabsTrigger>
            <TabsTrigger 
                value="active" 
                className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900"
            >
                In Process ({activeStudents.length})
            </TabsTrigger>
            <TabsTrigger 
                value="unplaced" 
                className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900"
            >
                Unplaced ({unplacedStudents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredStudents.map((student) => (
                <CustomStudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="placed" className="space-y-4">
            <div className="grid gap-4">
              {placedStudents.map((student) => (
                <CustomStudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activeStudents.map((student) => (
                <CustomStudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unplaced" className="space-y-4">
            <div className="grid gap-4">
              {unplacedStudents.map((student) => (
                <CustomStudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <StudentDetailsDialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      </div>
    )
}
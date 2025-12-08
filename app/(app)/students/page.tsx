"use client"

import Loader from "@/components/loader/Loader"
import StudentDetailsDialog from "@/components/students/StudentDetailsDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Phone,
  Search,
  AlertCircle,
  FileText,
  XCircle,
  MapPin,
  Star,
  Clock,
  Users,
  Calendar,
  Layers
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

interface CustomStudentCardProps {
    student: Student;
    onViewDetails: (student: Student) => void;
}

const CustomStudentCard = ({ student, onViewDetails }: CustomStudentCardProps) => {
    const isPlaced = student.applications.some((app) => app.status === "accepted");
    const isInProcess = student.applications.some((app) => ["applied", "shortlisted"].includes(app.status)) && !isPlaced;
    const isUnplaced = !isPlaced && !isInProcess;

    const statusBadge = () => {
        if (isPlaced) return <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white rounded-full border-0 px-3 py-0.5 text-xs font-medium">Placed</Badge>;
        if (isInProcess) return <Badge className="bg-sky-500 hover:bg-sky-500 text-white rounded-full border-0 px-3 py-0.5 text-xs font-medium">In Process</Badge>;
        return <Badge className="bg-amber-500 hover:bg-amber-500 text-white rounded-full border-0 px-3 py-0.5 text-xs font-medium">Unplaced</Badge>;
    };

    const getYear = (batch: number) => {
        return 4 - (batch - 2025);
    };

    const skills = student.skills || ["JS", "Python", "SQL"]; 
    const applicationsCount = student.applications?.length || 0;

    return (
        <Card className="border-slate-200 bg-white shadow-sm rounded-3xl transition hover:shadow-md">
            <CardContent className="p-5">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="h-14 w-14 rounded-2xl">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 text-xl font-semibold">
                                {student.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        
                        {/* Name and Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-semibold text-slate-900">{student.name}</h3>
                                {statusBadge()}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                                {student.branch} • Year {getYear(student.batch)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span>{student.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span>{student.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CGPA */}
                    <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900">
                            {student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">CGPA</div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 6).map((skill, index) => (
                            <Badge 
                                key={index} 
                                variant="outline" 
                                className="rounded-full border-slate-300 bg-slate-50 text-slate-700 px-3 py-1 text-xs font-normal"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Total Applications */}
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{applicationsCount}</span>
                    <span className="text-sm text-slate-500">Total Applications</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        className="text-slate-700 hover:bg-slate-50"
                    >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => onViewDetails(student)}
                        className="border-sky-600 text-sky-600 hover:bg-sky-50"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Quick View
                    </Button>
                    <Link href={`/students/${student.id}`} className="ml-auto">
                        <Button 
                            className="rounded-full bg-sky-500 text-white hover:bg-sky-600"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Profile
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

// Job Card Component
interface JobCardProps {
    job?: any;
}

const JobCard = ({ job }: JobCardProps) => {
    return (
        <Card className="border-slate-200 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 shadow-sm rounded-3xl">
            <CardContent className="p-8">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-start gap-4">
                        {/* Company Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-7 h-7 text-blue-600" />
                        </div>
                        
                        {/* Title and Company */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">SWE INTERN</h2>
                            <p className="text-base text-slate-600">Microsoft</p>
                        </div>
                    </div>

                    {/* Right Side Info */}
                    <div className="flex items-start gap-6">
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Gujarat, IND</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Internship</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-bold text-blue-600">₹30000</span>
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3 mb-8">
                    <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
                        <Star className="w-5 h-5 text-slate-400" />
                    </button>
                    <Badge className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-4 py-1.5 font-medium text-sm hover:bg-amber-50">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        3 days left
                    </Badge>
                    <Badge className="rounded-full bg-slate-50 text-slate-700 border border-slate-200 px-4 py-1.5 font-medium text-sm hover:bg-slate-50">
                        <Users className="w-3.5 h-3.5 mr-1.5" />
                        1 applicant
                    </Badge>
                </div>

                {/* Skills and Departments Section */}
                <div className="grid grid-cols-2 gap-12 mb-8">
                    {/* Required Skills */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-slate-400" />
                            Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge 
                                variant="outline"
                                className="rounded-full border-blue-200 bg-blue-50 text-blue-600 px-3 py-1 text-sm font-normal hover:bg-blue-50"
                            >
                                JavaScript
                            </Badge>
                            <Badge 
                                variant="outline"
                                className="rounded-full border-blue-200 bg-blue-50 text-blue-600 px-3 py-1 text-sm font-normal hover:bg-blue-50"
                            >
                                Python
                            </Badge>
                        </div>
                    </div>

                    {/* Eligible Departments */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            Eligible Departments
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge 
                                variant="outline"
                                className="rounded-full border-purple-200 bg-purple-50 text-purple-600 px-3 py-1 text-sm font-normal hover:bg-purple-50"
                            >
                                Computer Science
                            </Badge>
                            <Badge 
                                variant="outline"
                                className="rounded-full border-purple-200 bg-purple-50 text-purple-600 px-3 py-1 text-sm font-normal hover:bg-purple-50"
                            >
                                Information Technology
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Dates Section */}
                <div className="grid grid-cols-2 gap-12 mb-8">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Posted on</p>
                            <p className="text-sm font-medium text-slate-700">12/9/2025</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Apply by</p>
                            <p className="text-sm font-medium text-slate-700">12/11/2025</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        className="rounded-xl text-blue-600 hover:bg-blue-50 px-5 h-10"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                    </Button>
                    <Button 
                        variant="ghost"
                        className="rounded-xl text-blue-500 hover:bg-blue-50 px-5 h-10"
                    >
                        Send Mentor Approval
                    </Button>
                    <Button 
                        className="rounded-xl bg-blue-500 text-white hover:bg-blue-600 px-8 h-10 ml-auto"
                    >
                        Apply Now
                    </Button>
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
    const [activeTab, setActiveTab] = useState("all")
    const [searchExpanded, setSearchExpanded] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [students, setStudents] = useState<Student[]>([])
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const searchPopupRef = useRef<HTMLDivElement>(null)

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

      const isPlaced = student.applications.some((app) => app.status === "accepted")
      const isInProcess = student.applications.some((app) => ["applied", "shortlisted"].includes(app.status)) && !isPlaced
      const isUnplaced = !isPlaced && !isInProcess

      const matchesTab = 
        activeTab === "all" ||
        (activeTab === "placed" && isPlaced) ||
        (activeTab === "active" && isInProcess) ||
        (activeTab === "unplaced" && isUnplaced)

      return matchesSearch && matchesDepartment && matchesYear && matchesTab
    })

    const departments = Array.from(new Set(students.map((s) => s.branch)))
    const years = Array.from(new Set(students.map((s) => `${4-(s.batch-2025)}`))).sort()

    const placedStudents = students.filter((s) => s.applications.some((app) => app.status === "accepted"))
    const activeStudents = students.filter((s) =>
      s.applications.some((app) => ["applied", "shortlisted"].includes(app.status)),
    )
    const unplacedStudents = students.filter(
      (s) => s.applications.length === 0 || s.applications.every((app) => app.status === "rejected"),
    )

    useEffect(() => {
      if (status === "unauthenticated" || status === "loading") return;
      getStudents();
    }, [status])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
          setSearchExpanded(false)
        }
      }

      if (searchExpanded) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [searchExpanded])

    if (status === "loading" || status === "unauthenticated" || loading) {
      return <Loader/>
    }

    if (session?.user?.role !== "placement-cell" && session?.user?.role !== "faculty") {
      router.replace("/")
    }

    return (
      <div className="w-full">
        {/* Hero Section with Stats */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 space-y-6 max-w-7xl mx-auto">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
          <div className="relative space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Student Management</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Student Talent Pool</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Manage student profiles and track placement progress across all departments.
                </p>
              </div>
              <Button variant="outline" className="rounded-full border-sky-600 text-sky-600 hover:bg-sky-50">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle>
                <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">{students.length}</div>
                <p className="text-xs text-slate-500">Eligible for placement</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Placed</CardTitle>
                <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                  <Award className="h-4 w-4" />
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
                  <Briefcase className="h-4 w-4" />
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
                  <AlertCircle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">{unplacedStudents.length}</div>
                <p className="text-xs text-slate-500">Require immediate attention</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            {/* Main Filter Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Tabs */}
                <div className="flex items-center bg-slate-100 rounded-full p-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeTab === "all"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    All ({students.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("placed")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeTab === "placed"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    Placed ({placedStudents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeTab === "active"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    In Process ({activeStudents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("unplaced")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeTab === "unplaced"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    Unplaced ({unplacedStudents.length})
                  </button>
                </div>

                {/* Circular Search Button */}
                <button
                  onClick={() => setSearchExpanded(!searchExpanded)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
                    searchExpanded
                      ? "bg-sky-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Department Filter */}
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px] h-10 border-slate-200 focus:ring-sky-600 rounded-lg">
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

                {/* Year Filter */}
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[180px] h-10 border-slate-200 focus:ring-sky-600 rounded-lg">
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

            {/* Search Popup - Appears Below Filter Row */}
            {searchExpanded && (
              <div 
                ref={searchPopupRef}
                className="mt-3 animate-in slide-in-from-top-2 duration-200"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search students by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="pl-10 pr-10 h-10 border-slate-200 focus:border-sky-600 rounded-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4 mt-6 max-w-7xl mx-auto px-6 pb-8">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <CustomStudentCard key={student.id} student={student} onViewDetails={setSelectedStudent} />
            ))
          ) : (
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardContent className="p-12 text-center">
                <GraduationCap className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-500">No students found matching the filters</p>
              </CardContent>
            </Card>
          )}
        </div>

        <StudentDetailsDialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      </div>
    )
}
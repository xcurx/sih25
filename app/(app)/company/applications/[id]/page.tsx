"use client"

import AppliedStudentCard from "@/components/employer/AppliedStudentsCard"
import Loader from "@/components/loader/Loader"
import StudentDetailsDialog from "@/components/students/StudentDetailsDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ApplicationStatus, Student } from "@/lib/types"
import axios from "axios"
import {
  Download,
  Search,
  Users,
  UserCheck,
  Clock,
  Briefcase
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AppliedStudentsPage() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [applications, setApplications] = useState<{ student: Student, status: ApplicationStatus, id: string }[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { id } = useParams();

  const getStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/employer/get-applied-students-for-opportunity/${id}`, { withCredentials: true });
      if (res.status === 200) {
        setApplications(res.data.applications.map((app: any) => {
          return { student: app.studentRel, status: app.status, id: app.id };
        }));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = applications.filter(({ student, status: appStatus }) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDepartment = departmentFilter === "all" || student.branch === departmentFilter
    const matchesYear = yearFilter === "all" || (`${4 - (student.batch - 2025)}`) === yearFilter
    const matchesStatus = statusFilter === "all" || appStatus === statusFilter

    return matchesSearch && matchesDepartment && matchesYear && matchesStatus
  })

  const departments = Array.from(new Set(applications.map(({ student }) => student.branch)))
  const years = Array.from(new Set(applications.map(({ student }) => `${4 - (student.batch - 2025)}`))).sort()

  // Stats
  const totalApplications = applications.length
  const appliedCount = applications.filter(a => a.status === "applied").length
  const reviewedCount = applications.filter(a => a.status === "reviewed").length
  const shortlistedCount = applications.filter(a => a.status === "shortlisted").length

  const quickStats = [
    { label: "Total Applications", value: totalApplications, icon: Users, caption: "All applicants" },
    { label: "Pending Review", value: appliedCount, icon: Clock, caption: "Awaiting review" },
    { label: "Reviewed", value: reviewedCount, icon: UserCheck, caption: "Applications reviewed" },
    { label: "Shortlisted", value: shortlistedCount, icon: Briefcase, caption: "Ready for interview" },
  ]

  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") return;
    getStudents();
  }, [status])

  if (status === "loading" || status === "unauthenticated" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "employer") {
    router.replace("/")
  }

  return (
    <div className="relative space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Application Manager</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Manage Student Applications</h1>
            <p className="mt-2 text-sm text-slate-600">
              Review, shortlist, and schedule interviews with applicants.
            </p>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 bg-white/90 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
              <div className="rounded-full bg-sky-50 p-2 text-sky-600">
                <stat.icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      </section>


      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search students by name, email, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48 rounded-xl border-slate-200">
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
            <SelectTrigger className="w-32 rounded-xl border-slate-200">
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 rounded-xl border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Applications</h2>
          <Badge variant="outline" className="rounded-full border-slate-200 text-slate-600">
            {filteredStudents.length} result{filteredStudents.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {filteredStudents.length === 0 ? (
          <Card className="border-slate-200 bg-white/90 shadow-lg rounded-3xl">
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-3 text-lg font-medium text-slate-700">No applications found</p>
                <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredStudents.map(({ student, status, id }) => (
              <AppliedStudentCard key={id} student={student} status={status} id={id} onViewDetails={setSelectedStudent} />
            ))}
          </div>
        )}
      </div>

      {/* Student Details Dialog */}
      <StudentDetailsDialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  )
}


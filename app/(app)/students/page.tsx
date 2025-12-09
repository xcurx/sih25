"use client"

import Loader from "@/components/loader/Loader"
import StudentCard from "@/components/students/StudentCard"
import StudentDetailsDialog from "@/components/students/StudentDetailsDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Student } from "@/lib/types"
import axios from "axios"
import { Filter, RefreshCcw, Search, Target, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

type PlacementState = "placed" | "in-process" | "unplaced"
type PlacementFilter = PlacementState | "all"

const allowedRoles = new Set(["placement-cell", "faculty"])

const derivePlacementKey = (student: Student): PlacementState => {
  const applications = student.applications ?? []

  if (applications.some((app) => app.status === "accepted")) {
    return "placed"
  }

  if (
    applications.some((app) =>
      ["pending", "reviewed", "shortlisted", "mentor_approval_needed", "interview"].includes(
        app.status,
      ),
    )
  ) {
    return "in-process"
  }

  return "unplaced"
}

export default function StudentsDirectoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [branchFilter, setBranchFilter] = useState<string>("all")
  const [placementFilter, setPlacementFilter] = useState<PlacementFilter>("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/placementcell/get-students", { withCredentials: true })
      setStudents(res.data.students || [])
    } catch (error) {
      console.error("Failed to load students", error)
      toast.error("Unable to load students right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user || !allowedRoles.has(session.user.role)) {
      router.push("/dashboard")
      return
    }

    fetchStudents()
  }, [status, session, router, fetchStudents])

  const isFaculty = session?.user?.role === "faculty"

  const branchOptions = useMemo(() => {
    const set = new Set<string>()
    students.forEach((student) => {
      if (student.branch) {
        set.add(student.branch)
      }
    })
    return Array.from(set).sort()
  }, [students])

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return students.filter((student) => {
      const skills = student.skills || []
      const matchesSearch =
        term.length === 0 ||
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.branch?.toLowerCase().includes(term) ||
        skills.some((skill) => skill.toLowerCase().includes(term))

      const matchesBranch = branchFilter === "all" || student.branch === branchFilter
      const placementKey = derivePlacementKey(student)
      const matchesPlacement = placementFilter === "all" || placementFilter === placementKey

      return matchesSearch && matchesBranch && matchesPlacement
    })
  }, [students, searchTerm, branchFilter, placementFilter])

  const placementStats = useMemo(() => {
    return students.reduce(
      (stats, student) => {
        const key = derivePlacementKey(student)
        stats[key] += 1
        return stats
      },
      { placed: 0, "in-process": 0, unplaced: 0 } as Record<PlacementState, number>,
    )
  }, [students])

  if (status === "loading" || (loading && students.length === 0)) {
    return <Loader />
  }

  if (!session?.user || !allowedRoles.has(session.user.role)) {
    return null
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-sky-100 text-sky-700">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              {isFaculty ? "Your Advisees" : "Student Directory"}
            </h1>
            <p className="text-sm text-slate-600">
              {isFaculty
                ? "Students assigned to you for mentoring and approvals."
                : "Track student readiness, placement progress, and dive into detailed profiles."}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, skills, or branch"
                className="pl-9 rounded-2xl border-slate-200"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col sm:flex-row gap-4">
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="rounded-2xl border-slate-200">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All branches</SelectItem>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={placementFilter}
              onValueChange={(value) => setPlacementFilter(value as PlacementFilter)}
            >
              <SelectTrigger className="rounded-2xl border-slate-200">
                <SelectValue placeholder="Placement status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="in-process">In process</SelectItem>
                <SelectItem value="unplaced">Unplaced</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={fetchStudents}
              disabled={loading}
              className="rounded-2xl border-slate-200"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-sky-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">{students.length}</p>
            <Users className="h-6 w-6 text-slate-400" />
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Placed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-3xl font-semibold text-emerald-700">{placementStats["placed"]}</p>
            <Target className="h-6 w-6 text-emerald-400" />
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">In Process</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-3xl font-semibold text-amber-600">{placementStats["in-process"]}</p>
            <Target className="h-6 w-6 text-amber-400" />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing <span className="font-semibold text-slate-900">{filteredStudents.length}</span>{" "}
            students
          </p>
        </div>

        {filteredStudents.length === 0 ? (
          <Card className="rounded-3xl border-slate-200 bg-white/90">
            <CardContent className="py-16 flex flex-col items-center text-center gap-3">
              <Users className="h-10 w-10 text-slate-300" />
              <p className="text-slate-600">
                {isFaculty
                  ? "No assigned students found. Once students add your mentor code, they will appear here."
                  : "No students match your filters."}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setBranchFilter("all")
                  setPlacementFilter("all")
                }}
              >
                Reset filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewDetails={(stud) => setSelectedStudent(stud)}
              />
            ))}
          </div>
        )}
      </section>

      <StudentDetailsDialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  )
}

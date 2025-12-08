"use client"

import Loader from "@/components/loader/Loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Student } from "@/lib/generated/prisma"
import type { StudentResume } from "@/lib/types"
import {
  Award,
  ArrowLeft,
  Code,
  Download,
  Mail,
  MessageSquare,
  Phone,
  User,
  GraduationCap,
  Star,
  Briefcase
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

type ReviewStudent = Student & {
  resumes: StudentResume[]
}

export default function StudentReviewPage() {
  const { data: session, status } = useSession()
  const [student, setStudent] = useState<ReviewStudent | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { id } = useParams()

  const getStudent = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/employer/student-profile/${id}`, { withCredentials: true })
      if (res.status === 200) {
        setStudent(res.data.student)
      }
    } catch (error) {
      console.error("Error fetching student:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      getStudent()
    }
  }, [status, id])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "employer") {
    router.replace("/")
    return null
  }

  if (!student) {
    return (
      <div className="relative p-6 max-w-6xl w-full mx-auto">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.15),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.18),transparent_45%)]"
          aria-hidden="true"
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Student not found</p>
        </div>
      </div>
    )
  }


  const primaryResume = student.resumes && student.resumes.length > 0 ? student.resumes[0].resumeUrl : null

  return (
    <div className="relative space-y-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.15),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.18),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.85),transparent)]"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-500 via-blue-500 to-blue-600 p-8 shadow-lg">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),transparent_50%)]" />
        
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between pt-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-white/30 ring-offset-2 ring-offset-sky-500">
              <AvatarImage src={"/placeholder.svg"} alt={student.name} />
              <AvatarFallback className="bg-white/20 text-white text-3xl font-semibold backdrop-blur-sm">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70 mb-1">Candidate Profile</p>
              <h1 className="text-3xl font-semibold text-white">{student.name}</h1>
              <div className="mt-2 flex items-center gap-2 text-white/80">
                <GraduationCap className="h-4 w-4" />
                <span>{student.branch}</span>
                <span className="text-white/50">•</span>
                <span>Year {(student.batch as number) - new Date().getFullYear() + 5}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-4">
              <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
              <div>
                <p className="text-2xl font-bold text-white">{student.cgpa}</p>
                <p className="text-xs text-white/70">CGPA</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-4">
              <Briefcase className="h-6 w-6 text-white" />
              <div>
                <p className="text-2xl font-bold text-white">{student.skills?.length || 0}</p>
                <p className="text-xs text-white/70">Skills</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative mt-6 flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/40 backdrop-blur-sm"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </Button>
          {primaryResume && (
            <Button className="rounded-full bg-white text-sky-600 hover:bg-white/90" asChild>
              <a href={primaryResume} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/90 border border-slate-200 p-1.5 shadow-sm">
          <TabsTrigger 
            value="overview" 
            className="rounded-xl px-5 py-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <User className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="projects"
            className="rounded-xl px-5 py-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <Code className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="certifications"
            className="rounded-xl px-5 py-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <Award className="mr-2 h-4 w-4" />
            Certificates
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Card */}
            <Card className="lg:col-span-1 rounded-3xl border-slate-200 bg-white/90 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="p-2 rounded-full bg-sky-50">
                      <Mail className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="p-2 rounded-full bg-sky-50">
                      <Phone className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-700">{student.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Info Card */}
            <Card className="lg:col-span-2 rounded-3xl border-slate-200 bg-white/90 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">Academic Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">Full Name</p>
                    <p className="text-sm font-medium text-slate-700">{student.name}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">Department</p>
                    <p className="text-sm font-medium text-slate-700">{student.branch}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">Batch Year</p>
                    <p className="text-sm font-medium text-slate-700">{student.batch}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
                    <p className="text-xs text-sky-600 mb-1">CGPA</p>
                    <p className="text-lg font-semibold text-sky-700">{student.cgpa}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{student.email}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">Phone</p>
                    <p className="text-sm font-medium text-slate-700">{student.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Card */}
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills && student.skills.length > 0 ? (
                  student.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200 rounded-full px-4 py-1.5 text-sm font-medium hover:from-sky-100 hover:to-blue-100 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Code className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Projects Coming Soon</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Project information is not available in this view. Contact the student for more details about their projects.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Award className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Certifications Coming Soon</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Certification information is not available in this view. Contact the student for more details about their certifications.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}




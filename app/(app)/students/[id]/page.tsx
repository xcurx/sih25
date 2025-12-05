"use client"

import Loader from "@/components/loader/Loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentProfile, StudentProfileStats } from "@/lib/types"
import axios from "axios"
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function StudentProfilePage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [stats, setStats] = useState<StudentProfileStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`/api/placementcell/get-student-profile/${params.id}`, {
        withCredentials: true,
      })
      if (res.status === 200) {
        setStudent(res.data.student)
        setStats(res.data.stats)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch student profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return
    fetchStudent()
  }, [status, params.id])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "placement-cell" && session?.user?.role !== "faculty") {
    router.push("/")
    return null
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Student not found</h1>
        <Button onClick={() => router.push("/students")} variant="outline" className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-700 border-blue-200"
      case "reviewed": return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "shortlisted": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "rejected": return "bg-red-100 text-red-700 border-red-200"
      case "accepted": return "bg-green-100 text-green-700 border-green-200"
      case "mentor_approval_needed": return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getPlacementStatus = () => {
    if (student.applications.some((app) => app.status === "accepted")) {
      return { status: "Placed", color: "bg-green-100 text-green-700 border-green-200" }
    }
    if (student.applications.some((app) => ["pending", "interview", "shortlisted"].includes(app.status))) {
      return { status: "In Process", color: "bg-amber-100 text-amber-700 border-amber-200" }
    }
    return { status: "Unplaced", color: "bg-slate-100 text-slate-700 border-slate-200" }
  }

  const placementInfo = getPlacementStatus()

  return (
    <div className="relative p-6 max-w-6xl w-full mx-auto space-y-6">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-sky-100 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-blue-100 opacity-50 blur-3xl" />

      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="rounded-full hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <Avatar className="h-24 w-24 rounded-2xl border-4 border-white shadow-lg">
                  <AvatarImage src={student.resume || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-700 text-2xl font-bold">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl font-bold text-slate-900">{student.name}</CardTitle>
                    <Badge className={`rounded-full ${placementInfo.color}`}>
                      {placementInfo.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg font-medium text-slate-600 mb-4">
                    {student.branch} • Batch {student.batch} • Year {student.batch ? `${4 - (student.batch - 2025)}` : '-'}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span>{student.email}</span>
                    </div>
                    {student.phone && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 px-6 py-4 text-center">
                  <div className="text-3xl font-bold text-sky-700">{student.cgpa || '-'}</div>
                  <div className="text-sm text-slate-600">CGPA</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {student.github && (
                  <a href={student.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                  </a>
                )}
                {student.linkedin && (
                  <a href={student.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="rounded-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </a>
                )}
                {student.resume && (
                  <a href={student.resume} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="rounded-full bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                      <FileText className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  </a>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full border-sky-200 bg-white text-sky-700 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-600" />
                Applications ({student.applications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.applications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-4 w-fit mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600">No applications yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {student.applications.map((app) => (
                    <Link key={app.id} href={`/applications/${app.id}`} className="block">
                      <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-200 hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-gradient-to-br from-sky-100 to-blue-100 p-3">
                              <Building2 className="h-5 w-5 text-sky-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                                {app.opportunityRel.title}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {app.opportunityRel.companyRel?.name} • {app.opportunityRel.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`rounded-full capitalize ${getStatusColor(app.status)}`}>
                              {app.status.replace(/_/g, ' ')}
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-sky-600" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {student.projects && student.projects.length > 0 && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  Projects ({student.projects.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.projects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{project.title}</h4>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                              <Github className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="rounded-full text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {student.certificates && student.certificates.length > 0 && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-slate-600" />
                  Certifications ({student.certificates.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.certificates.map((cert) => (
                  <div key={cert.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{cert.title}</h4>
                      <p className="text-sm text-slate-600">{cert.issuer} • {new Date(cert.issueDate).toLocaleDateString()}</p>
                    </div>
                    {cert.certificateUrl && (
                      <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="rounded-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {stats && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-4 text-center">
                    <div className="text-2xl font-bold text-sky-700">{stats.totalApplications}</div>
                    <div className="text-xs text-slate-600">Applications</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center">
                    <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
                    <div className="text-xs text-slate-600">Pending</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-700">{stats.interviews}</div>
                    <div className="text-xs text-slate-600">Interviews</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-700">{stats.internships}</div>
                    <div className="text-xs text-slate-600">Internships</div>
                  </div>
                  <div className="rounded-2xl bg-green-100 p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{stats.accepted}</div>
                    <div className="text-xs text-slate-600">Accepted</div>
                  </div>
                  <div className="rounded-2xl bg-red-100 p-4 text-center">
                    <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
                    <div className="text-xs text-slate-600">Rejected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href={`mailto:${student.email}`}>
                <Button variant="outline" className="w-full rounded-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </a>
              {student.resume && (
                <a href={student.resume} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full rounded-full justify-start mt-3">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          {student.internships && student.internships.length > 0 && (
            <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  Internships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.internships.map((internship) => (
                  <div key={internship.id} className="rounded-2xl bg-white/80 p-4">
                    <h4 className="font-semibold text-slate-900">{internship.opportunityRel.title}</h4>
                    <p className="text-sm text-slate-600">{internship.opportunityRel.companyRel?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

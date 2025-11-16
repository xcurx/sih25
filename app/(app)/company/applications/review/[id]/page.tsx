"use client"

import Loader from "@/components/loader/Loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Student } from "@/lib/generated/prisma"
import {
  Award,
  ArrowLeft,
  Code,
  Download,
  Mail,
  MessageSquare,
  Phone,
  User
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

export default function StudentReviewPage() {
  const { data: session, status } = useSession()
  const [student, setStudent] = useState<Student | null>(null)
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
      <div className="p-6 max-w-6xl w-full mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Student not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Student Profile</h1>
            <p className="text-muted-foreground">Review candidate information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </Button>
          {student.resume && (
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={"/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="text-2xl">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>
                  {student.branch} • Year {(student.batch as number) - new Date().getFullYear() + 5}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{student.cgpa}</div>
                  <div className="text-sm text-muted-foreground">CGPA</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="break-all">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Educational background and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-base">{student.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-base break-all">{student.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-base">{student.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">CGPA</label>
                    <p className="text-base font-semibold">{student.cgpa}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-base">{student.branch}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Batch Year</label>
                    <p className="text-base">{student.batch}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
              <CardDescription>Programming languages and technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.skills && student.skills.length > 0 ? (
                  student.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Projects</h2>
              <p className="text-muted-foreground">Student's work and achievements</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Project information is not available in this view</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Contact the student for more details about their projects
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Certifications</h2>
              <p className="text-muted-foreground">Professional certifications and achievements</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Certification information is not available in this view</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Contact the student for more details about their certifications
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

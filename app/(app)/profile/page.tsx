"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import axios from "axios"
import Loader from "@/components/loader/Loader"
import Certificates from "@/components/profileTabs/Certificates"
import Resume from "@/components/profileTabs/Resume"
import Overview from "@/components/profileTabs/Overview"
import Preferences from "@/components/profileTabs/Preferences"
import Projects from "@/components/profileTabs/Projects"
import Settings from "@/components/profileTabs/Settings"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Briefcase,
  Code,
  FileText,
  Edit,
  Settings as SettingsIcon,
  User
} from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [resume, setResume] = useState<string | null>(null)
  const [loadingResume, setLoadingResume] = useState(true)

  useEffect(() => {
    async function fetchStudentResume() {
      try {
        const res = await axios.get("/api/student/resume", { withCredentials: true })
        setResume(res.data?.resume || null)
      } catch (error) {
        // If API fails, just set null
        setResume(null)
      } finally {
        setLoadingResume(false)
      }
    }

    if (session?.user?.role === "student") {
      fetchStudentResume()
    }
  }, [session?.user])

  if (status === "loading") {
    return <Loader />
  }

  if (session?.user?.role !== "student") {
    redirect("/")
  }

  return (
    <div className="relative p-6 max-w-6xl w-full mx-auto space-y-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.15),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(37,99,235,0.2),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.8),transparent)]"
        aria-hidden="true"
      />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-sky-700">My Profile</h1>
          <p className="text-slate-600">Manage your academic and professional information</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} className="rounded-full bg-sky-600 hover:bg-sky-700 text-white">
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-100/60 rounded-2xl">
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
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <Overview isEditing={isEditing} />
        <Projects />
        <Certificates />
        <Preferences isEditing />
        <Resume resume={resume} onResumeUpdate={setResume} />
        <Settings />
      </Tabs>
    </div>
  )
}

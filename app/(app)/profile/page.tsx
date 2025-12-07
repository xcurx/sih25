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
    <div className="p-6 max-w-6xl w-full mx-auto space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Student Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">My Profile</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your academic and professional information
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} className="rounded-full bg-sky-600 hover:bg-sky-500 text-white">
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-100 rounded-full p-1 h-auto border border-slate-200">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
          >
            <User className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
          >
            <Code className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="certifications" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
          >
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
          >
            <Briefcase className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
          >
            <Download className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
          >
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
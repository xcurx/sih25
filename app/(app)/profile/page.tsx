"use client"

import { useEffect, useRef, useState } from "react"
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
import Experience from "@/components/profileTabs/Experience"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StudentResume } from "@/lib/types"
import {
  Award,
  Briefcase,
  Code,
  FileText,
  Edit,
  Settings as SettingsIcon,
  User,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [resumes, setResumes] = useState<StudentResume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [tabValue, setTabValue] = useState("overview")
  const tabsScrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    async function fetchStudentResume() {
      try {
        const res = await axios.get("/api/student/resume", { withCredentials: true })
        setResumes(res.data?.resumes || [])
      } catch (error) {
        setResumes([])
      } finally {
        setLoadingResumes(false)
      }
    }

    if (session?.user?.role === "student") {
      fetchStudentResume()
    }
  }, [session?.user])

  useEffect(() => {
    const el = tabsScrollerRef.current
    if (!el) return

    const update = () => {
      const { scrollLeft, clientWidth, scrollWidth } = el
      setCanScrollLeft(scrollLeft > 4)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
    }

    requestAnimationFrame(update)
    el.addEventListener("scroll", update)
    window.addEventListener("resize", update)
    return () => {
      el.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const scrollTabs = (direction: "left" | "right") => {
    const el = tabsScrollerRef.current
    if (!el) return
    const delta = (el.clientWidth || 320) * 0.7
    el.scrollBy({ left: direction === "left" ? -delta : delta, behavior: "smooth" })
  }

  if (status === "loading") {
    return <Loader />
  }

  if (session?.user?.role !== "student") {
    redirect("/")
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-6 sm:p-8 shadow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Student Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">My Profile</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your academic and professional information
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} className="self-start sm:self-auto rounded-full bg-sky-600 hover:bg-sky-500 text-white">
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>
      </section>

      {/* Tabs */}
      <Tabs value={tabValue} onValueChange={setTabValue} className="space-y-4">
        {/* Mobile dropdown */}
        <div className="md:hidden">
          <label className="sr-only" htmlFor="profile-tab-select">Select section</label>
          <select
            id="profile-tab-select"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
            value={tabValue}
            onChange={(e) => setTabValue(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="experience">Experience</option>
            <option value="projects">Projects</option>
            <option value="certifications">Certificates</option>
            <option value="preferences">Preferences</option>
            <option value="documents">Resume</option>
            <option value="settings">Settings</option>
          </select>
        </div>

        {/* Desktop tab list with horizontal scroll and arrows */}
        <div className="relative hidden md:block">
          <TabsList className="flex w-full items-center gap-2 bg-slate-100 rounded-full p-1 h-auto border border-slate-200 overflow-x-auto whitespace-nowrap scroll-smooth [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden" ref={tabsScrollerRef}>
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
            >
              <User className="h-4 w-4 shrink-0" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="experience" 
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
            >
              <Briefcase className="h-4 w-4 shrink-0" />
              Experience
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
            >
              <Code className="h-4 w-4 shrink-0" />
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="certifications" 
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
            >
              <Award className="h-4 w-4 shrink-0" />
              Certificates
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
            >
              <FileText className="h-4 w-4 shrink-0" />
              Preferences
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
            >
              <FileText className="h-4 w-4 shrink-0" />
              Resume
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md px-4 py-2.5"
            >
              <SettingsIcon className="h-4 w-4 shrink-0" />
              Settings
            </TabsTrigger>
          </TabsList>

          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollTabs("left")}
              className="absolute left-1 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/70 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-sky-700 md:flex"
            >
              <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollTabs("right")}
              className="absolute right-1 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/70 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-sky-700 md:flex"
            >
              <ChevronsRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <Overview isEditing={isEditing} />
        <Experience />
        <Projects />
        <Certificates />
        <Preferences isEditing />
        <Resume
          resumes={resumes}
          onResumesChange={setResumes}
          isLoading={loadingResumes}
        />
        <Settings />
      </Tabs>
    </div>
  )
}
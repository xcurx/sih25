"use client"

import Certificates from "@/components/profileTabs/Certificates"
import Documents from "@/components/profileTabs/Documents"
import Overview from "@/components/profileTabs/Overview"
import Preferences from "@/components/profileTabs/Preferences"
import Projects from "@/components/profileTabs/Projects"
import Settings from "@/components/profileTabs/Settings"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockStudents } from "@/lib/mock-data"
import type { Student } from "@/lib/types"
import {
  Award,
  Briefcase,
  Code,
  Download,
  Edit,
  Settings as SettingsIcon,
  User
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function ProfilePage() {
  const { data:session } = useSession()
  const [student, setStudent] = useState<Student>(mockStudents[0])
  const [isEditing, setIsEditing] = useState(false)

  if (session?.user?.role !== "student") {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to students.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground">Manage your academic and professional information</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
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
            <Download className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <Overview isEditing={isEditing} />
        <Projects/>
        <Certificates/>
        <Preferences isEditing />
        <Documents/>
        <Settings/>
       
      </Tabs>
    </div>
  )
}

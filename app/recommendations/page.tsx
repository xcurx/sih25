"use client"

import { useAuth } from "@/contexts/auth-context"
import { mockStudents } from "@/lib/mock-data"
// import { JobRecommendations } from "@/components/matching/job-recommendations"

export default function RecommendationsPage() {
  const { user } = useAuth()

  if (user?.role !== "student") {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to students.</p>
        </div>
      </div>
    )
  }

  const student = mockStudents[0] // In real app, get current student data

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Job Recommendations</h1>
        <p className="text-muted-foreground">Personalized job matches based on your profile, skills, and preferences</p>
      </div>

      {/* <JobRecommendations student={student} /> */}
    </div>
  )
}

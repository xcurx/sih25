"use client"
import StudentDashboard from "@/components/dashboard/StudentsDashboard"
import FacultyDashboard from "@/components/dashboard/FacultyDashboard"
import PlacementCellDashboard from "@/components/dashboard/PlacementCellDashboard"
import EmployerDashboard from "@/components/dashboard/ExployerDashboard"
import { useSession } from "next-auth/react"



export default function DashboardPage() {
  const { data:session } = useSession()
  const user = session?.user

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="px-2 sm:px-3 lg:px-4 py-3 sm:py-4 max-w-6xl w-full mx-auto">
      <div className="mb-2.5 sm:mb-4 lg:mb-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">Welcome back, {user.name}!</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">
          Here's what's happening with your {user.role.replace("_", " ")} account today.
        </p>
      </div>

      {user.role === "student" && <StudentDashboard />}
      {user.role === "faculty" && <FacultyDashboard />}
      {user.role === "placement-cell" && <PlacementCellDashboard />}
      {user.role === "employer" && <EmployerDashboard />}
    </div>
  )
}

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
    <div className="p-6 max-w-7xl w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your {user.role.replace("_", " ")} account today.
        </p>
      </div>

      {user.role === "student" && <StudentDashboard />}
      {/* {user.role === "faculty" && <FacultyDashboard />} */}
      {user.role === "placement-cell" && <PlacementCellDashboard />}
      {user.role === "employer" && <EmployerDashboard />}
    </div>
  )
}

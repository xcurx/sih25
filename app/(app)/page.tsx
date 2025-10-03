"use client"

import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { useSession } from "next-auth/react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex overflow-auto">{children}</main>
    </div>
  )
}

export default function HomePage() {
  const {data:session} = useSession()

  if (!session) {
    
  }

  return (
    // <DashboardLayout>
      <div className="p-6 mx-auto">
        <div className="mx-auto">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Campus Placement Portal</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your comprehensive platform for internships and placements
            </p>
            <div className="bg-card p-8 rounded-lg border">
              <p className="text-muted-foreground">
                Navigate using the sidebar to access different features based on your role. This is a comprehensive
                frontend demo showcasing all the key features of a campus placement system.
              </p>
            </div>
          </div>
        </div>
      </div>
    // </DashboardLayout>
  )
}

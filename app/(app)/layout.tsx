import type React from "react"
import { DashboardLayout } from "./dashboard-layout"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardLayout>{children}</DashboardLayout>
}

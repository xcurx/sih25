"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react"
import { Notifications } from "./notifications"

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Browse Jobs", href: "/jobs", icon: Briefcase },
    { name: "Recommendations", href: "/recommendation", icon: Sparkles },
    { name: "My Applications", href: "/applications", icon: FileText },
    { name: "Internships", href: "/internships", icon: Briefcase },
    { name: "Profile", href: "/profile", icon: Users },
    { name: "Interviews", href: "/interviews", icon: Calendar },
  ],
  faculty: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Students", href: "/students", icon: GraduationCap },
    { name: "Approvals", href: "/approvals", icon: UserCheck },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ],
  "placement-cell": [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Job Postings", href: "/job-postings", icon: Briefcase },
    { name: "Students", href: "/students", icon: GraduationCap },
    { name: "Employers", href: "/employers", icon: Building2 },
    { name: "Manage", href: "/manage", icon: UserPlus },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  employer: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Applications", href: "/company/applications", icon: FileText },
    { name: "Internships", href: "/company/internships", icon: Briefcase },
    { name: "Interviews", href: "/interviews", icon: Calendar },
  ],
}

export function TopNavigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session?.user) {
    return null
  }

  const navItems = navigationItems[session.user.role] || []

  return (
    <header className="sticky w-full flex justify-center top-0 z-50 border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full items-center gap-4 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-900">
          <div className="rounded-full bg-sky-100 p-2 shadow-inner shadow-white/60">
            <ShieldCheck className="h-5 w-5 text-sky-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Placement Mission</p>
            <p className="text-sm font-semibold text-slate-900">Unified Operations</p>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 rounded-full bg-white/70 p-1 shadow-inner md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-center rounded-full text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-slate-900 ${
                    isActive ? "bg-white text-sky-700 shadow-sm" : ""
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Notifications for student, employer, and faculty */}
          {(session.user.role === "student" || session.user.role === "employer" || session.user.role === "faculty") && (
            <Notifications />
          )}
          
          <div className="hidden text-right sm:flex sm:flex-col">
            <span className="text-sm font-semibold text-slate-900">{session.user.name}</span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {session.user.role.replace("-", " ")}
            </span>
          </div>
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarImage src="/placeholder.svg" alt={session.user.name} />
            <AvatarFallback>
              {session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="hidden border-slate-200 text-slate-600 hover:bg-slate-100 sm:inline-flex"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="border border-slate-200 md:hidden">
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      href={item.href}
                      className={`flex w-full items-center gap-2 text-sm ${
                        isActive ? "text-sky-700" : "text-slate-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/sign-in" })}>
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

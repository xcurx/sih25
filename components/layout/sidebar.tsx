"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Building2,
  UserCheck,
  BarChart3,
} from "lucide-react"
import { useSession } from "next-auth/react"

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Browse Jobs", href: "/jobs", icon: Briefcase },
    { name: "My Applications", href: "/applications", icon: FileText },
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
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  employer: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Applications", href: "/company/applications", icon: FileText },
    { name: "Interviews", href: "/interviews", icon: Calendar },
  ],
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data:session } = useSession()
  const pathname = usePathname()
  const router = useRouter();

  if (!session) return null

  console.log("User Role:", session.user) // Debugging line

  const navItems = navigationItems[session?.user.role] || []

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">Campus Portal</h2>
            <p className="text-xs text-muted-foreground capitalize">{session.user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={"/placeholder.svg"} alt={session.user.name} />
            <AvatarFallback>
              {session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{session.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
        </div>
        <Button
         variant="outline" size="sm" className="w-full bg-transparent"
         onClick={async () => {
          await axios.post("/api/sign-out");
          router.push("/sign-in");
         }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

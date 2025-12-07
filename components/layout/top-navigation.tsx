"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
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
  ChevronsLeft,
  ChevronsRight,
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
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const activeItemRef = useRef<HTMLButtonElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const navItems = navigationItems[session?.user?.role as keyof typeof navigationItems] || []

  const updateScrollState = () => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, clientWidth, scrollWidth } = el
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const delta = (el.clientWidth || 300) * 0.7
    el.scrollBy({ left: direction === "left" ? -delta : delta, behavior: "smooth" })
  }

  const handleWheelScroll: React.WheelEventHandler<HTMLDivElement> = (event) => {
    const el = scrollerRef.current
    if (!el) return
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault()
      const delta = event.deltaY
      el.scrollBy({ left: delta, behavior: "smooth" })
    }
  }

  useEffect(() => {
    // measure after paint to detect overflow
    requestAnimationFrame(updateScrollState)
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState)
    window.addEventListener("resize", updateScrollState)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [navItems.length, pathname])

  useEffect(() => {
    const el = activeItemRef.current
    if (el && scrollerRef.current) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [pathname, navItems.length])

  if (!session?.user) {
    return null
  }

  return (
    <header className="sticky w-full flex justify-center top-0 z-50 border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full items-center gap-4 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-900">
          <Image
            src="./Logo_Saksham.png"
            alt="Saksham"
            width={36}
            height={36}
            priority
            className="rounded-full object-cover shadow-inner shadow-white/60"
          />

          <div>
            <p className="text-sm font-semibold text-slate-900">Saksham</p>
            <p className="text-xs font-medium text-slate-500">National Internship & Placement Mission</p>
          </div>
        </Link>

        <nav className="relative hidden min-w-0 flex-1 items-center rounded-full bg-white/70 p-1 shadow-inner md:flex">
          <div className="relative w-full overflow-hidden">
            <div
              ref={scrollerRef}
              onWheel={handleWheelScroll}
              className="flex w-full items-center gap-1 overflow-x-auto scroll-smooth whitespace-nowrap px-1 [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href} className="flex-none min-w-[120px]">
                    <Button
                      variant="ghost"
                      ref={isActive ? activeItemRef : undefined}
                      className={`group relative w-full justify-center rounded-full border border-transparent text-sm font-medium text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:text-slate-900 ${
                        isActive ? "bg-white text-sky-700 shadow-sm border-slate-200" : ""
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span
                        className={`relative inline-flex items-center after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[1px] after:origin-left after:scale-x-0 after:bg-sky-600 after:transition-transform after:duration-300 ${
                          isActive ? "after:scale-x-100" : "group-hover:after:scale-x-100"
                        }`}
                      >
                        {item.name}
                      </span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByAmount("left")}
              className="absolute left-0.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/60 bg-white/85 text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-sky-700"
            >
              <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByAmount("right")}
              className="absolute right-0.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/60 bg-white/85 text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-sky-700"
            >
              <ChevronsRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
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

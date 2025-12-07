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
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react"
import { Notifications } from "./notifications"
import { useCallback, useEffect, useRef, useState } from "react"

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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  // Get nav items - use empty array if no session to avoid errors
  const navItems = session?.user?.role ? (navigationItems[session.user.role] || []) : []

  // Check scroll position and update arrow visibility
  const checkScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const { scrollLeft, scrollWidth, clientWidth } = container
    
    // Use a small threshold to account for rounding errors
    const threshold = 1
    setShowLeftArrow(scrollLeft > threshold)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - threshold)
  }, [])

  // Scroll handler
  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 200
    const currentScroll = scrollContainerRef.current.scrollLeft
    const targetScroll = direction === "left" 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth"
    })
  }, [])

  // Initialize and update on resize/scroll
  useEffect(() => {
    // Only set up scroll listeners if user is logged in
    if (!session?.user) return

    // Multiple checks to ensure accurate state after DOM updates
    const checkMultipleTimes = () => {
      checkScrollButtons()
      // Check again after a short delay to account for any layout shifts
      setTimeout(checkScrollButtons, 50)
      setTimeout(checkScrollButtons, 200)
    }
    
    const timeoutId = setTimeout(checkMultipleTimes, 100)
    
    const container = scrollContainerRef.current
    if (!container) {
      clearTimeout(timeoutId)
      return
    }

    container.addEventListener("scroll", checkScrollButtons)
    window.addEventListener("resize", checkScrollButtons)
    
    // Use ResizeObserver for more accurate size change detection
    const resizeObserver = new ResizeObserver(() => {
      checkScrollButtons()
    })
    resizeObserver.observe(container)

    return () => {
      clearTimeout(timeoutId)
      container.removeEventListener("scroll", checkScrollButtons)
      window.removeEventListener("resize", checkScrollButtons)
      resizeObserver.disconnect()
    }
  }, [navItems, checkScrollButtons, session?.user])

  if (!session?.user) {
    return null
  }

  // Determine if we have fewer items (4 or less) - center and expand them
  const hasFewerItems = navItems.length <= 4

  return (
    <header className="sticky w-full flex justify-center top-0 z-50 bg-gradient-to-r from-white via-sky-50 to-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full items-center gap-4 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-900 flex-shrink-0">
          <div className="rounded-full bg-sky-100 p-2 shadow-inner shadow-white/60">
            <ShieldCheck className="h-5 w-5 text-sky-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Placement Mission</p>
            <p className="text-sm font-semibold text-slate-900">Unified Operations</p>
          </div>
        </Link>

        {/* Navigation with horizontal scroll or centered expanded layout */}
        <div className="hidden md:flex flex-1 items-center relative min-w-0 mx-2">
          {hasFewerItems ? (
            /* Centered, expanded layout for fewer items */
            <nav 
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white/70 p-1.5 shadow-inner min-w-0 max-w-full"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href} className="flex-1 min-w-0">
                    <Button
                      variant="ghost"
                      className={`w-full whitespace-nowrap justify-center rounded-full text-base font-semibold text-slate-600 transition-all hover:bg-white hover:text-slate-900 px-6 py-2.5 ${
                        isActive ? "bg-white text-sky-700 shadow-sm border-2 border-sky-600" : "hover:border border-sky-200"
                      }`}
                    >
                      <Icon className="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          ) : (
            /* Scrollable layout for more items */
            <>
              {/* Left Arrow Button */}
              {showLeftArrow && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 rounded-full bg-white/90 hover:bg-white border border-sky-200 shadow-sm z-10 mr-1"
                  onClick={() => scroll("left")}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4 text-sky-600" />
                </Button>
              )}

              {/* Scrollable Navigation Container */}
              <nav 
                ref={scrollContainerRef}
                className="flex-1 flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-inner overflow-x-auto scrollbar-hide min-w-0 max-w-full"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="flex items-center gap-1 flex-nowrap h-full">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    const Icon = item.icon
                    return (
                      <Link key={item.name} href={item.href} className="flex-shrink-0 inline-flex">
                        <Button
                          variant="ghost"
                          className={`whitespace-nowrap justify-center rounded-full text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-slate-900 px-4 w-auto ${
                            isActive ? "bg-white text-sky-700 shadow-sm border border-sky-200" : ""
                          }`}
                        >
                          <Icon className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                          <span className="whitespace-nowrap">{item.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </nav>

              {/* Right Arrow Button */}
              {showRightArrow && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 rounded-full bg-white/90 hover:bg-white border border-sky-200 shadow-sm z-10 ml-1"
                  onClick={() => scroll("right")}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4 text-sky-600" />
                </Button>
              )}
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
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

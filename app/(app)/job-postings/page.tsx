"use client"

import JobPostingCard from "@/components/jobs/JobPostingsCard"
import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Opportunity } from "@/lib/types"
import axios from "axios"
import {
    Building2,
    Plus,
    Search,
    Clock,
    CheckCircle2,
    FileText,
    Briefcase,
    XCircle
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

export default function JobPostingsPage() {
    const { data:session, status } = useSession() 
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortOption, setSortOption] = useState("date-latest")
    const [jobs, setJobs] = useState<Opportunity[]>([])
    const [activeTab, setActiveTab] = useState("all")
    const [searchExpanded, setSearchExpanded] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const searchPopupRef = useRef<HTMLDivElement>(null)

    const getOpportunities = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/placementcell/get-opportunities")
        console.log(res.data)
        if (res.status === 200) {
          setJobs(res.data.opportunities)
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    
    const filteredJobs = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTab = 
        activeTab === "all" || 
        job.status === activeTab
      
      const matchesStatus = statusFilter === "all" || job.status === statusFilter
      return matchesSearch && matchesTab && matchesStatus
    }).sort((a, b) => {
      switch (sortOption) {
        case "title-a-z":
          return a.title.localeCompare(b.title)
        case "title-z-a":
          return b.title.localeCompare(a.title)
        case "company-a-z":
          return (a.companyRel?.name || "").localeCompare(b.companyRel?.name || "")
        case "company-z-a":
          return (b.companyRel?.name || "").localeCompare(a.companyRel?.name || "")
        // case "date-latest":
        //   return new Date(b.updatedAt || b.id).getTime() - new Date(a.updatedAt || a.id).getTime()
        // case "date-oldest":
        //   return new Date(a.updatedAt || a.id).getTime() - new Date(b.updatedAt || b.id).getTime()
        default:
          return 0
      }
    })

    const activeJobs = jobs.filter((job) => job.status === "active")
    const draftJobs = jobs.filter((job) => job.status === "draft")
    const closedJobs = jobs.filter((job) => job.status === "closed")

    // Logic for total applications count (assuming applications property exists on Opportunity or must be calculated)
    const totalApplicationsCount = jobs.reduce((sum, job) => sum + (job._count?.applications || 0), 0);
    
    // UI STATS (Used in the new header card layout)
    const uiStats = [
        { title: "Total Postings", value: jobs?.length, caption: "All time opportunities", icon: Briefcase, accent: "bg-sky-50 text-sky-700" },
        { title: "Active Jobs", value: activeJobs.length, caption: "Currently accepting applications", icon: CheckCircle2, accent: "bg-emerald-50 text-emerald-700" },
        { title: "Drafts", value: draftJobs.length, caption: "Pending review or publication", icon: Clock, accent: "bg-amber-50 text-amber-700" },
        { title: "Total Applications", value: totalApplicationsCount, caption: "Total received across all jobs", icon: FileText, accent: "bg-indigo-50 text-indigo-700" },
    ];

    useEffect(() => {
      if (status === "unauthenticated" || status === "loading") return
      getOpportunities();
    }, [status])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
          setSearchExpanded(false)
        }
      }

      if (searchExpanded) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [searchExpanded])

    if (status === "loading" || status === "unauthenticated" || loading) {
      return <Loader/>
    }

    if (session?.user?.role !== "placement-cell") {
      router.replace("/")
    }

    return (
      <div className="w-full">
        {/* NEW GRADIENT HEADER SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 space-y-6 max-w-7xl mx-auto">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />

            <div className="relative space-y-6">
                {/* HEADER TEXT AND CTA BUTTON */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Job Management Desk</p>
                        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Oversee all job opportunities.</h1>
                        <p className="mt-2 text-sm text-slate-600">
                           Manage active, draft, and closed job postings for students.
                        </p>
                    </div>
                    <Button asChild className="bg-sky-600 hover:bg-sky-700 rounded-full shadow-md shrink-0 transition duration-200">
                        <a href="/post-jobs">
                            <Plus className="mr-2 h-4 w-4" />
                            Post New Job
                        </a>
                    </Button>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {uiStats.map((stat) => (
                        <Card 
                            key={stat.title} 
                            className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                                <div className={`rounded-full p-2 ${stat.accent}`}>
                                    <stat.icon className="h-4 w-4" aria-hidden="true" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                                <p className="text-xs text-slate-500">{stat.caption}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            {/* Main Filter Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Tabs */}
                <div className="flex items-center bg-slate-100 rounded-full p-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeTab === "all"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    All ({jobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeTab === "active"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    Active ({activeJobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("draft")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeTab === "draft"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    Drafts ({draftJobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("closed")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      activeTab === "closed"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    Closed ({closedJobs.length})
                  </button>
                </div>

                {/* Circular Search Button */}
                <button
                  onClick={() => setSearchExpanded(!searchExpanded)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
                    searchExpanded
                      ? "bg-sky-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] h-10 border-slate-200 focus:ring-sky-600 rounded-lg">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Filter */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px] h-10 border-slate-200 focus:ring-sky-600 rounded-lg">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-latest">Date: Latest First</SelectItem>
                    <SelectItem value="date-oldest">Date: Oldest First</SelectItem>
                    <SelectItem value="title-a-z">Title: A–Z</SelectItem>
                    <SelectItem value="title-z-a">Title: Z–A</SelectItem>
                    <SelectItem value="company-a-z">Company: A–Z</SelectItem>
                    <SelectItem value="company-z-a">Company: Z–A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Popup - Appears Below Filter Row */}
            {searchExpanded && (
              <div 
                ref={searchPopupRef}
                className="mt-3 animate-in slide-in-from-top-2 duration-200"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search jobs or companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="pl-10 pr-10 h-10 border-slate-200 focus:border-sky-600 rounded-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4 mt-6 max-w-7xl mx-auto px-6 pb-8">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobPostingCard key={job.id} job={job} />
            ))
          ) : (
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardContent className="p-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-lg font-medium text-slate-600">No jobs found matching your criteria.</p>
                <p className="text-sm text-slate-400">Try adjusting your search term or status filter.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
}
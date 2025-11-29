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
  Users,
  CheckCircle2,
  FileText,
  Clock,
  Briefcase
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function JobPostingsPage() {
    const { data:session, status } = useSession() 
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [jobs, setJobs] = useState<Opportunity[]>([])
    const router = useRouter()
    const [loading, setLoading] = useState(true);

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
      const matchesStatus = statusFilter === "all" || job.status === statusFilter
      return matchesSearch && matchesStatus
    })

    const activeJobs = jobs.filter((job) => job.status === "active")
    const draftJobs = jobs.filter((job) => job.status === "draft")
    const closedJobs = jobs.filter((job) => job.status === "closed")

    // Logic for total applications count (assuming applications property exists on Opportunity or must be calculated)
    const totalApplicationsCount = jobs.reduce((sum, job) => sum + (job._count?.applications || 0), 0);


    useEffect(() => {
      if (status === "unauthenticated" || status === "loading") return
      getOpportunities();
    }, [status])

    if (status === "loading" || status === "unauthenticated" || loading) {
      return <Loader/>
    }

    if (session?.user?.role !== "placement-cell") {
      router.replace("/")
    }

    return (
      <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
        
        {/* Header and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Job Postings Management</h1>
            <p className="text-base text-slate-500 mt-1">Oversee and manage all active, draft, and closed job opportunities for students.</p>
          </div>
          <Button asChild className="bg-sky-600 hover:bg-sky-700 rounded-full shadow-lg transition duration-200">
            <a href="/post-jobs">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </a>
          </Button>
        </div>

        {/* Stats Cards - Updated UI with Blue Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Jobs */}
          <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Postings</CardTitle>
              <div className={`rounded-full p-2 bg-sky-50 text-sky-700`}>
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{jobs?.length}</div>
              <p className="text-xs text-slate-500">All time opportunities</p>
            </CardContent>
          </Card>

          {/* Active Jobs */}
          <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Active Jobs</CardTitle>
              <div className={`rounded-full p-2 bg-emerald-50 text-emerald-700`}>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{activeJobs.length}</div>
              <p className="text-xs text-slate-500">Currently accepting applications</p>
            </CardContent>
          </Card>

          {/* Draft Jobs */}
          <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Drafts</CardTitle>
              <div className={`rounded-full p-2 bg-amber-50 text-amber-700`}>
                <Clock className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{draftJobs.length}</div>
              <p className="text-xs text-slate-500">Pending review or publication</p>
            </CardContent>
          </Card>

          {/* Total Applications */}
          <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Applications</CardTitle>
              <div className={`rounded-full p-2 bg-indigo-50 text-indigo-700`}>
                <FileText className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              {/* Using the calculated total applications count */}
              <div className="text-3xl font-bold text-slate-900">{totalApplicationsCount}</div>
              <p className="text-xs text-slate-500">Total received across all jobs</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter - Updated UI */}
        <Card className="shadow-lg border-slate-100 rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-slate-300 focus:border-sky-500 rounded-lg transition"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 h-10 border-slate-300 focus:ring-sky-500 rounded-lg">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings with Tabs - Updated Tabs UI */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 h-auto rounded-full">
            <TabsTrigger 
                value="all" 
                className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-md transition text-slate-700 hover:text-slate-900"
            >
                All Jobs ({filteredJobs.length})
            </TabsTrigger>
            <TabsTrigger 
                value="active" 
                className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-md transition text-slate-700 hover:text-slate-900"
            >
                Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger 
                value="draft" 
                className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-md transition text-slate-700 hover:text-slate-900"
            >
                Drafts ({draftJobs.length})
            </TabsTrigger>
            <TabsTrigger 
                value="closed" 
                className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-md transition text-slate-700 hover:text-slate-900"
            >
                Closed ({closedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                    // JobPostingCard is an external component, keeping its usage
                    <JobPostingCard key={job.id} job={job} />
                ))
            ) : (
                <div className="text-center py-10 border border-slate-200 rounded-xl bg-slate-50">
                    <Briefcase className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-600">No jobs found matching your criteria.</p>
                    <p className="text-sm text-slate-400">Try adjusting your search term or status filter.</p>
                </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeJobs.map((job) => (
              <JobPostingCard key={job.id} job={job} />
            ))}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {draftJobs.map((job) => (
              <JobPostingCard key={job.id} job={job} />
            ))}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            {closedJobs.map((job) => (
              <JobPostingCard key={job.id} job={job} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    )
}
"use client"

import JobPostingCard from "@/components/jobs/JobPostingsCard"
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
  Users
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

  const getOpportunities = async () => {
    axios.get("/api/get-opportunities").then((response) => {
      console.log(response.data)
      setJobs(response.data.opportunities)
    })
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

  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") return
    getOpportunities();
  }, [status])

  if (status === "loading" || status === "unauthenticated") {
    return <div className="p-6">Loading...</div>
  }

  if (session?.user?.role !== "placement-cell") {
    router.replace("/")
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Job Postings</h1>
          <p className="text-muted-foreground">Manage all job postings and internship opportunities</p>
        </div>
        <Button asChild>
          <a href="/post-jobs">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </a>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs?.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Badge variant="default" className="h-4 w-4 rounded-full p-0"></Badge>
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{activeJobs.length}</div> */}
            <p className="text-xs text-muted-foreground">Currently accepting applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Jobs</CardTitle>
            <Badge variant="secondary" className="h-4 w-4 rounded-full p-0"></Badge>
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{draftJobs.length}</div> */}
            <p className="text-xs text-muted-foreground">Pending publication</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Total received</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
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

      {/* Job Listings */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Jobs ({filteredJobs.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({draftJobs.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredJobs.map((job) => (
            <JobPostingCard key={job.id} job={job} />
          ))}
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


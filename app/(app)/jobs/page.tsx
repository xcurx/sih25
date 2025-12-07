"use client"

import JobCard from "@/components/jobs/JobCard"
import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Opportunity } from "@/lib/types"
import axios from "axios"
import { Briefcase, Filter, Search, Sparkles, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export default function JobsPage() {
  const { data:session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [loading ,setLoading] = useState(true);

  const [jobs, setJobs] = useState<Opportunity[]>([])
  const router = useRouter();

  const allSkills = Array.from(new Set(jobs.flatMap((job) => job.skillsRequired)))
  const allDepartments = Array.from(new Set(jobs.flatMap((job) => job.eligibleDepartments)))
  const allLocations = Array.from(new Set(jobs.map((job) => job.location)))

  const getOpportunities = async () => {
    try {
      const res = await axios("/api/student/get-opportunities", { withCredentials: true });
      if (res.status === 200) {
        setJobs(res.data.opportunities);
        setLoading(false);
      }
    } catch (error) { 
      console.log(error);
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = !selectedDepartment || job.eligibleDepartments.includes(selectedDepartment)
      const matchesType = !selectedType || job.type === selectedType
      const matchesLocation = !selectedLocation || job.location === selectedLocation
      const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((skill) => job.skillsRequired.includes(skill))

      return matchesSearch && matchesDepartment && matchesType && matchesLocation && matchesSkills
    })
  }, [searchTerm, selectedDepartment, selectedType, selectedLocation, selectedSkills, jobs])

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDepartment("")
    setSelectedType("")
    setSelectedLocation("")
    setSelectedSkills([])
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return;
    getOpportunities();
  },[status, loading])

  if (status === "loading" || loading) {
    return <Loader/>
  }

  if (session?.user?.role !== "student") {
    router.replace("/");
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Opportunity Hub</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Discover Your Next Career Move</h1>
            <p className="mt-2 text-sm text-slate-600">
              Browse through {jobs.length} carefully curated opportunities from top companies
            </p>
          </div>
        </div>

        {/* Stats Cards inside gradient */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Opportunities</p>
              <p className="text-2xl font-semibold text-slate-900">{jobs.length}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active Applications</p>
              <p className="text-2xl font-semibold text-slate-900">{jobs.filter(j => j.applied).length}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">New This Week</p>
              <p className="text-2xl font-semibold text-slate-900">
                {jobs.filter(j => {
                  const daysDiff = Math.ceil((new Date().getTime() - new Date(j.postedAt).getTime()) / (1000 * 60 * 60 * 24));
                  return daysDiff <= 7;
                }).length}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-2xl border-slate-200 focus:border-sky-400 focus:ring-sky-400"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-full border-slate-200 hover:bg-sky-50 hover:border-sky-300"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(selectedDepartment || selectedType || selectedLocation || selectedSkills.length > 0) && (
                  <Badge className="ml-1 h-5 w-5 rounded-full bg-sky-500 p-0 flex items-center justify-center text-xs">
                    {[selectedDepartment, selectedType, selectedLocation, ...selectedSkills].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              {(searchTerm || selectedDepartment || selectedType || selectedLocation || selectedSkills.length > 0) && (
                <Button variant="outline" onClick={clearFilters} className="rounded-full border-slate-200 hover:bg-red-50 hover:border-red-300">
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50/60 hover:bg-white">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {allDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Job Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50/60 hover:bg-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="rounded-2xl border-slate-200 bg-slate-50/60 hover:bg-white">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {allLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Skills</Label>
                  <div className="max-h-32 overflow-y-auto space-y-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
                    {allSkills.slice(0, 6).map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                          className="data-[state=checked]:bg-sky-600"
                        />
                        <Label htmlFor={skill} className="text-sm text-slate-700 cursor-pointer">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-sky-100 p-2">
            <TrendingUp className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Showing {filteredJobs.length} of {jobs.length} opportunities
            </p>
            <p className="text-xs text-slate-500">
              {filteredJobs.length === jobs.length ? "All results displayed" : "Filters applied"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sort" className="text-sm text-slate-700">Sort by:</Label>
          <Select defaultValue="recent">
            <SelectTrigger className="w-44 rounded-full border-slate-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} setJobs={setJobs}/>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Briefcase className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">No opportunities found</h3>
          <p className="text-slate-500">
            Try adjusting your search criteria or filters to discover more opportunities.
          </p>
          <Button 
            onClick={clearFilters} 
            variant="outline" 
            className="mt-6 rounded-full border-slate-200 hover:bg-sky-50 hover:border-sky-300"
          >
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  )
}
"use client"

import JobCard from "@/components/jobs/JobCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Opportunity } from "@/lib/generated/prisma"
import { mockJobs } from "@/lib/mock-data"
import axios from "axios"
import { Briefcase, Filter, Search } from "lucide-react"
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

  const allSkills = Array.from(new Set(mockJobs.flatMap((job) => job.skills)))
  const allDepartments = Array.from(new Set(mockJobs.flatMap((job) => job.department)))
  const allLocations = Array.from(new Set(mockJobs.map((job) => job.location)))

  const getOpportunities = async () => {
    try {
      const res = await axios("/api/get-opportunities", { withCredentials: true });
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
        //@ts-expect-error
        job.companyRel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  console.log(filteredJobs);

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return;
    getOpportunities();
  },[status, loading])

  if (status === "loading" || loading) {
    return <div className="p-6 max-w-7xl mx-auto">Loading...</div>
  }

  if (session?.user?.role !== "student") {
    router.replace("/");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Browse Jobs</h1>
        <p className="text-muted-foreground">Discover internships and full-time opportunities</p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
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
                  <Label>Job Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
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
                  <Label>Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
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
                  <Label>Skills</Label>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {allSkills.slice(0, 6).map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill} className="text-sm">
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
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
        <div className="flex items-center gap-2">
          <Label htmlFor="sort">Sort by:</Label>
          <Select defaultValue="recent">
            <SelectTrigger className="w-40">
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
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} setJobs={setJobs}/>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  )
}



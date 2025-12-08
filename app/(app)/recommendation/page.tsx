"use client"

import JobCard from "@/components/jobs/JobCard"
import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Opportunity } from "@/lib/types"
import axios from "axios"
import { Sparkles, Search, Filter, Award, Layers, TrendingUp, CheckCircle2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

interface RecommendedOpportunity {
  score: number;
  composite_score: number;
  s_vec: number;
  s_skill: number;
  highlights: {
    skills: string[];
    department: string;
    batch: string;
    requirements: string[];
  };
  opportunity: Opportunity;
}

export default function RecommendationPage() {
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<RecommendedOpportunity[]>([])
  const router = useRouter()

  const allLocations = Array.from(new Set(recommendations.map((rec) => rec.opportunity.location)))

  const getRecommendations = async () => {
    try {
      const res = await axios.get("/api/student/get-recommendations", { withCredentials: true })
      if (res.status === 200) {
        setRecommendations(res.data)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((rec) => {
      const job = rec.opportunity
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyRel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = !selectedType || job.type === selectedType
      const matchesLocation = !selectedLocation || job.location === selectedLocation

      return matchesSearch && matchesType && matchesLocation
    })
  }, [searchTerm, selectedType, selectedLocation, recommendations])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedType("")
    setSelectedLocation("")
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return
    getRecommendations()
  }, [status])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "student") {
    router.replace("/")
    return null
  }

  return (
    <div className="relative p-6 max-w-7xl w-full mx-auto space-y-8">
      {/* Background gradient effect */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.15),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(37,99,235,0.2),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.8),transparent)]"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-600 via-sky-500 to-blue-500 p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative space-y-4">
          <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Recommendations
          </Badge>
          <div>
            <h1 className="text-3xl font-bold">Opportunities Tailored For You</h1>
            <p className="text-white/90 mt-2">
              Discover {recommendations.length} personalized opportunities matched to your profile and preferences
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Perfect Matches", value: recommendations.filter(r => r.composite_score > 0.8).length.toString(), icon: Award },
              { label: "Good Fits", value: recommendations.filter(r => r.composite_score > 0.6 && r.composite_score <= 0.8).length.toString(), icon: TrendingUp },
              { label: "Total Recommendations", value: recommendations.length.toString(), icon: Layers },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 flex items-start gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-slate-200 bg-white/90 shadow-lg rounded-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search recommended opportunities..."
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
                {(selectedType || selectedLocation) && (
                  <Badge className="ml-1 h-5 w-5 rounded-full bg-sky-500 p-0 flex items-center justify-center text-xs">
                    {[selectedType, selectedLocation].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              {(searchTerm || selectedType || selectedLocation) && (
                <Button variant="outline" onClick={clearFilters} className="rounded-full border-slate-200 hover:bg-red-50 hover:border-red-300">
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <Label className="text-sm font-semibold text-slate-700">Match Quality</Label>
                  <div className="flex gap-2 pt-2">
                    <Badge variant="secondary" className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Perfect: {recommendations.filter(r => r.composite_score > 0.8).length}
                    </Badge>
                    <Badge variant="secondary" className="rounded-full bg-sky-50 text-sky-700 border-sky-200">
                      Good: {recommendations.filter(r => r.composite_score > 0.6 && r.composite_score <= 0.8).length}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-sky-600" />
            {filteredRecommendations.length} Recommended {filteredRecommendations.length === 1 ? "Match" : "Matches"}
          </h2>
          <p className="text-slate-600 mt-1">
            Sorted by match score • Updated based on your profile
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid gap-6">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((rec) => (
            <RecommendationCard key={rec.opportunity.id} recommendation={rec} setRecommendations={setRecommendations} />
          ))
        ) : (
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="rounded-full bg-slate-100 p-4 w-fit mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No matches found</h3>
              <p className="text-slate-600">Try adjusting your filters to see more recommendations</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function RecommendationCard({ 
  recommendation, 
  setRecommendations 
}: { 
  recommendation: RecommendedOpportunity;
  setRecommendations: React.Dispatch<React.SetStateAction<RecommendedOpportunity[]>>;
}) {
  const { opportunity: job, highlights, composite_score, s_skill, s_vec } = recommendation
  
  // Determine match level
  const getMatchLevel = (score: number) => {
    if (score > 0.8) return { label: "Perfect Match", color: "emerald", bgColor: "bg-emerald-50", textColor: "text-emerald-700", borderColor: "border-emerald-200" }
    if (score > 0.6) return { label: "Good Match", color: "sky", bgColor: "bg-sky-50", textColor: "text-sky-700", borderColor: "border-sky-200" }
    return { label: "Potential Match", color: "slate", bgColor: "bg-slate-50", textColor: "text-slate-700", borderColor: "border-slate-200" }
  }

  const matchLevel = getMatchLevel(composite_score)

  // Helper function to update jobs within recommendations
  const updateJobInRecommendations: React.Dispatch<React.SetStateAction<Opportunity[]>> = (value) => {
    setRecommendations(prevRecs => {
      // Handle both function and direct value
      const updatedJobs = typeof value === 'function' 
        ? value([job]) // Pass current job as array to the function
        : value

      return prevRecs.map(rec => {
        const updatedJob = updatedJobs.find(j => j.id === rec.opportunity.id)
        return updatedJob ? { ...rec, Opportunity: updatedJob } : rec
      })
    })
  }

  return (
    <div className="relative">
      {/* Match Score Badge */}
      <div className="absolute -top-3 right-6 z-10">
        <Badge className={`${matchLevel.bgColor} ${matchLevel.textColor} ${matchLevel.borderColor} border-2 rounded-full px-4 py-1.5 shadow-lg font-semibold`}>
          <Award className="h-3.5 w-3.5 mr-1.5" />
          {matchLevel.label} • {Math.round(composite_score * 100)}%
        </Badge>
      </div>

      <Card className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
        {/* Job Card */}
        <div className="p-6">
          <JobCard job={job} setJobs={updateJobInRecommendations} />
        </div>

        {/* Highlights Section */}
        <div className="border-t border-slate-100 bg-gradient-to-br from-sky-50/50 to-transparent p-6">
          <div className="flex items-start gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-sky-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Why This Matches You</h4>
              <p className="text-xs text-slate-600">Based on your profile and preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skill Matches */}
            {highlights.skills.length > 0 && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-900">Matching Skills ({highlights.skills.length})</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {highlights.skills.slice(0, 5).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="rounded-full bg-white text-emerald-700 border-emerald-200 text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {highlights.skills.length > 5 && (
                    <Badge variant="secondary" className="rounded-full bg-white text-emerald-700 border-emerald-200 text-xs">
                      +{highlights.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Department & Batch Match */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-sky-600" />
                <p className="text-xs font-semibold text-sky-900">Eligibility Match</p>
              </div>
              <div className="space-y-1.5">
                {highlights.department && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <p className="text-xs text-sky-700">
                      <span className="font-medium">Department:</span> {highlights.department}
                    </p>
                  </div>
                )}
                {highlights.batch && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <p className="text-xs text-sky-700">
                      <span className="font-medium">Batch:</span> {highlights.batch}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Match Scores */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:col-span-2">
              <p className="text-xs font-semibold text-slate-900 mb-3">Match Analysis</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-600">Skills Match</p>
                    <p className="text-xs font-semibold text-slate-900">{Math.round(s_skill * 100)}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all"
                      style={{ width: `${s_skill * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-600">Profile Match</p>
                    <p className="text-xs font-semibold text-slate-900">{Math.round(s_vec * 100)}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all"
                      style={{ width: `${s_vec * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

"use client"

import Loader from "@/components/loader/Loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyProfile, CompanyProfileStats } from "@/lib/types"
import axios from "axios"
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Star,
  Users,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function EmployerProfilePage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [stats, setStats] = useState<CompanyProfileStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCompany = async () => {
    try {
      const res = await axios.get(`/api/placementcell/company/${params.id}`, {
        withCredentials: true,
      })
      if (res.status === 200) {
        setCompany(res.data.company)
        setStats(res.data.stats)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch company profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return
    fetchCompany()
  }, [status, params.id])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (session?.user?.role !== "placement-cell" && session?.user?.role !== "faculty") {
    router.push("/")
    return null
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Company not found</h1>
        <Button onClick={() => router.push("/employers")} variant="outline" className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employers
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "closed": return "bg-red-100 text-red-700 border-red-200"
      case "draft": return "bg-slate-100 text-slate-700 border-slate-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="relative p-6 max-w-6xl w-full mx-auto space-y-6">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-sky-100 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-blue-100 opacity-50 blur-3xl" />

      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="rounded-full hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg overflow-hidden">
            <div className="h-4 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <Avatar className="h-24 w-24 rounded-2xl border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder.svg" alt={company.name} />
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-700 text-2xl font-bold">
                    {company.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-amber-700">4.0</span>
                    </div>
                  </div>
                  {company.industry && (
                    <Badge className="rounded-full bg-sky-100 text-sky-700 border-sky-200 font-medium mb-4">
                      {company.industry}
                    </Badge>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    {company.location && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-sky-100 hover:text-sky-700 transition-colors">
                          <Globe className="h-4 w-4 text-slate-500" />
                          <span>Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.description && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    About Company
                  </h4>
                  <p className="text-slate-600">{company.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-600" />
                Job Postings ({company.opportunities.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {company.opportunities.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-4 w-fit mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600">No job postings yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {company.opportunities.map((opportunity) => (
                    <Link key={opportunity.id} href={`/job-postings/${opportunity.id}`} className="block">
                      <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-200 hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gradient-to-br from-sky-100 to-blue-100 p-3">
                              <Briefcase className="h-5 w-5 text-sky-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                                {opportunity.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Badge variant="outline" className="rounded-full text-xs capitalize">
                                  {opportunity.type}
                                </Badge>
                                <span>•</span>
                                <span>{opportunity.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`rounded-full capitalize ${getStatusColor(opportunity.status)}`}>
                              {opportunity.status}
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-sky-600" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{opportunity.applications.length} applications</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {stats && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-4 text-center">
                    <div className="text-2xl font-bold text-sky-700">{stats.totalOpportunities}</div>
                    <div className="text-xs text-slate-600">Total Postings</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-700">{stats.activeOpportunities}</div>
                    <div className="text-xs text-slate-600">Active</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-700">{stats.totalApplications}</div>
                    <div className="text-xs text-slate-600">Applications</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center">
                    <div className="text-2xl font-bold text-amber-700">{stats.pendingApplications}</div>
                    <div className="text-xs text-slate-600">Pending</div>
                  </div>
                  <div className="rounded-2xl bg-green-100 p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{stats.acceptedApplications}</div>
                    <div className="text-xs text-slate-600">Accepted</div>
                  </div>
                  <div className="rounded-2xl bg-blue-100 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">{stats.recruiters}</div>
                    <div className="text-xs text-slate-600">Recruiters</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {company.employees.length > 0 && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-600" />
                  Recruiters ({company.employees.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.employees.map((employee) => (
                  <div key={employee.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-xl border border-white shadow-sm">
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{employee.name}</p>
                        {employee.position && (
                          <p className="text-xs text-slate-500 truncate">{employee.position}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <a href={`mailto:${employee.email}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Mail className="h-4 w-4 text-slate-500" />
                          </Button>
                        </a>
                        {employee.linkedin && (
                          <a href={employee.linkedin} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <Linkedin className="h-4 w-4 text-blue-600" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.employees[0]?.email && (
                <a href={`mailto:${company.employees[0].email}`}>
                  <Button variant="outline" className="w-full rounded-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Recruiter
                  </Button>
                </a>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full rounded-full justify-start mt-3">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

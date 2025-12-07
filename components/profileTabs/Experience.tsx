"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Award,
  MessageSquare,
  ExternalLink,
  Clock
} from "lucide-react"
import { Internship } from "@/lib/types"
import { Button } from "@/components/ui/button"

const Experience = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
      const res = await axios.get("/api/student/internship/get-internships", { withCredentials: true })
      if (res.data?.internships) {
        setInternships(res.data.internships)
      }
    } catch (error) {
      console.error("Error fetching internships:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInternshipStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start > now) return { label: "Upcoming", color: "bg-amber-100 text-amber-700 border-amber-200" }
    if (end >= now) return { label: "Ongoing", color: "bg-green-100 text-green-700 border-green-200" }
    return { label: "Completed", color: "bg-sky-100 text-sky-700 border-sky-200" }
  }

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
    return months === 1 ? "1 month" : `${months} months`
  }

  const isPdfUrl = (url: string) => {
    return url.toLowerCase().includes('.pdf') || url.includes('/raw/')
  }

  const handleViewCertificate = (url: string) => {
    if (isPdfUrl(url)) {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
      window.open(viewerUrl, "_blank")
    } else {
      window.open(url, "_blank")
    }
  }

  // Sort internships by start date (most recent first)
  const sortedInternships = [...internships].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  return (
    <TabsContent value="experience">
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-sky-100 p-2">
              <Briefcase className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-900">Work Experience</CardTitle>
              <CardDescription className="text-slate-600">
                Your internship history and professional experience
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
            </div>
          ) : sortedInternships.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-lg font-medium text-slate-700">No experience yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Your internship experience will appear here once you complete internships.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl bg-sky-50 p-4 text-center">
                  <p className="text-2xl font-semibold text-sky-700">{internships.length}</p>
                  <p className="text-xs text-slate-600">Total Internships</p>
                </div>
                <div className="rounded-2xl bg-green-50 p-4 text-center">
                  <p className="text-2xl font-semibold text-green-700">
                    {internships.filter(i => {
                      const now = new Date()
                      return new Date(i.startDate) <= now && new Date(i.endDate) >= now
                    }).length}
                  </p>
                  <p className="text-xs text-slate-600">Ongoing</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 text-center">
                  <p className="text-2xl font-semibold text-slate-700">
                    {internships.filter(i => new Date(i.endDate) < new Date()).length}
                  </p>
                  <p className="text-xs text-slate-600">Completed</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 text-center">
                  <p className="text-2xl font-semibold text-amber-700">
                    {new Set(internships.map(i => i.opportunityRel.companyRel.id)).size}
                  </p>
                  <p className="text-xs text-slate-600">Companies</p>
                </div>
              </div>

              {/* Experience Timeline */}
              <div className="relative space-y-6 pl-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-200">
                {sortedInternships.map((internship) => {
                  const status = getInternshipStatus(internship.startDate, internship.endDate)
                  const company = internship.opportunityRel.companyRel
                  const opportunity = internship.opportunityRel
                  const isCompleted = new Date(internship.endDate) < new Date()

                  return (
                    <div key={internship.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-6 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-sky-300">
                        <div className="h-2 w-2 rounded-full bg-sky-500" />
                      </div>

                      <Card className="overflow-hidden rounded-2xl border-slate-200 hover:shadow-md transition-shadow">
                        <div className="p-5">
                          {/* Header */}
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border border-slate-200">
                              <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-semibold">
                                {company.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-900">{opportunity.title}</h3>
                                  <p className="text-sm text-slate-600 flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    {company.name}
                                  </p>
                                </div>
                                <Badge variant="outline" className={`rounded-full ${status.color}`}>
                                  {status.label}
                                </Badge>
                              </div>

                              {/* Details */}
                              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {opportunity.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(internship.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} – {new Date(internship.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatDuration(internship.startDate, internship.endDate)}
                                </span>
                              </div>

                              {/* Type Badge */}
                              <div className="mt-3">
                                <Badge variant="secondary" className="rounded-full">
                                  {opportunity.type}
                                </Badge>
                                {internship.salary && (
                                  <Badge variant="outline" className="rounded-full ml-2">
                                    ₹{internship.salary}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Certificate (if completed and has certificate) */}
                          {isCompleted && internship.certificateRel && (
                            <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                  <Award className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">Certificate Received</p>
                                  <p className="text-xs text-slate-500">{internship.certificateRel.title}</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-emerald-200 hover:bg-emerald-50"
                                onClick={() => handleViewCertificate(internship.certificateRel!.certificateUrl)}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          )}

                          {/* Employer Remarks (if completed and has remarks) */}
                          {isCompleted && internship.employerRemarks && (
                            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                  <MessageSquare className="h-4 w-4 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-900">Employer Remarks</p>
                                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{internship.employerRemarks}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default Experience

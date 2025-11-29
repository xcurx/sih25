"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect, useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Briefcase, Calendar, MapPin, User, Mail, Phone, GraduationCap, Clock } from "lucide-react"
import { Internship } from "@/lib/types"
import axios from "axios"
import Loader from "@/components/loader/Loader"

export default function EmployerInternshipDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const opportunityId = params.id as string
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await axios.get(`/api/employer/internship/get-internships/${opportunityId}`, { withCredentials: true })
        if (res.status === 200) {
          setInternships(res.data.internships || [])
        }
      } catch (error) {
        console.error("Error fetching internships:", error)
      } finally {
        setLoading(false)
      }
    }
    if (opportunityId) {
      load()
    }
  }, [opportunityId])

  const now = new Date()

  const getInternshipStatus = (start: Date, end: Date) => {
    if (start > now) return { label: "Not started", color: "bg-slate-100 text-slate-700" }
    if (end >= now) return { label: "Ongoing", color: "bg-green-100 text-green-700" }
    return { label: "Completed", color: "bg-sky-100 text-sky-700" }
  }

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "employer") {
    redirect("/sign-in")
  }

  const opportunity = internships[0]?.opportunityRel

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4 rounded-full text-slate-600 hover:bg-slate-100"
        onClick={() => router.push("/company/internships")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Opportunities
      </Button>

      {/* Hero Section */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-50 via-white to-sky-50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-sky-100 p-2 shadow-inner">
            <Briefcase className="h-5 w-5 text-sky-700" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-slate-900">
              {opportunity?.title || "Opportunity"} – Interns
            </h1>
            {opportunity && (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {opportunity.location}
                </span>
                <span className="text-slate-300">•</span>
                <Badge variant="outline" className="rounded-full">{opportunity.type}</Badge>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(opportunity.startDate).toLocaleDateString()} – {new Date(opportunity.endDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Interns</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{internships.length}</p>
        </Card>
        <Card className="rounded-2xl border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ongoing</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {internships.filter((it) => {
              const start = new Date(it.startDate)
              const end = new Date(it.endDate)
              return start <= now && end >= now
            }).length}
          </p>
        </Card>
        <Card className="rounded-2xl border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-sky-600">
            {internships.filter((it) => new Date(it.endDate) < now).length}
          </p>
        </Card>
      </div>

      {/* Interns List */}
      {internships.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          <User className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-lg font-medium">No interns yet</p>
          <p className="mt-1 text-sm">Accepted applications will appear here as internships.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {internships.map((internship) => {
            const student = internship.studentRel
            const start = new Date(internship.startDate)
            const end = new Date(internship.endDate)
            const statusInfo = getInternshipStatus(start, end)

            return (
              <Card key={internship.id} className="overflow-hidden rounded-2xl border-slate-200">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Student Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold">
                        {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{student.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-4 w-4" /> {student.email}
                        </span>
                        {student.phone && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-4 w-4" /> {student.phone}
                            </span>
                          </>
                        )}
                      </div>
                      {(student.branch || student.batch || student.cgpa) && (
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          {student.branch && (
                            <span className="inline-flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" /> {student.branch}
                            </span>
                          )}
                          {student.batch && (
                            <Badge variant="outline" className="rounded-full text-xs">
                              Batch {student.batch}
                            </Badge>
                          )}
                          {student.cgpa && (
                            <Badge variant="secondary" className="rounded-full text-xs">
                              CGPA: {student.cgpa}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <div className={`rounded-full px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {start.toLocaleDateString()} – {end.toLocaleDateString()}
                      </span>
                    </div>
                    {internship.salary && (
                      <Badge variant="secondary" className="rounded-full">
                        {internship.salary}
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 rounded-full"
                      onClick={() => router.replace(`/company/applications/review/${student.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
                {internship.performanceReview && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Performance Review</p>
                    <p className="mt-1 text-sm text-slate-700">{internship.performanceReview}</p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

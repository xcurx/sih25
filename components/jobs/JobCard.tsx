"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { JobCardProps } from "@/lib/props"
import axios from "axios"
import { Briefcase, Building2, Calendar, Clock, ExternalLink, Layers, MapPin, Star, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function JobCard({ job, setJobs }: JobCardProps) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendingApproval, setSendingApproval] = useState(false)

  const daysUntilDeadline = Math.ceil((new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isExpired = daysUntilDeadline <= 0
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0

  const handleApproval = async () => {
    if (sendingApproval) return
    setSendingApproval(true)
    try {
      console.log("Sending mentor approval for job id:", job.id)
      await axios.post(`/api/student/send-mentor-approval/${job.id}`, { withCredentials: true })
      // Update the job state to reflect the application (defensive update)
      setJobs(prevJobs => prevJobs.map(j => j.id === job.id ? { ...j, applied: true, _count: { applications: (j._count?.applications ?? 0) + 1 } } : j))
      toast.success("Mentor approval request sent successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to send mentor approval request")
    } finally {
      setSendingApproval(false)
    }
  }

  const handleApply = () => {
    if (isExpired || job.applied) return
    setLoading(true)
    router.push(`/jobs/${job.id}?apply=1`)
    toast.info("Select a resume on the job page to complete your application")
    setLoading(false)
  }

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />

      <CardHeader className="relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-sm">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0">
                  <CardTitle className="text-xl font-bold text-slate-900 truncate">{job.title}</CardTitle>
                  <CardDescription className="text-base font-semibold text-slate-700">
                    {job.companyRel?.name}
                  </CardDescription>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-sm text-sky-700 border border-sky-100">
                      <MapPin className="h-3.5 w-3.5 text-sky-600" />
                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-sm text-sky-700 border border-sky-100">
                      <Briefcase className="h-3.5 w-3.5 text-sky-600" />
                      <span className="capitalize">{job.type}</span>
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700 border border-sky-100">
                      <span>₹{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBookmarked(prev => !prev)}
                      className="rounded-full h-9 w-9 p-0 hover:bg-yellow-50"
                    >
                      <Star className={`h-4 w-4 ${isBookmarked ? "fill-yellow-500 text-yellow-500" : "text-slate-400"}`} />
                    </Button>

                    <Badge
                      variant={isExpired ? "destructive" : isUrgent ? "default" : "secondary"}
                      className={`rounded-full px-3 py-1 flex items-center gap-2 ${
                        isExpired ? "bg-red-100 text-red-700 border-red-200" :
                        isUrgent ? "bg-amber-100 text-amber-700 border-amber-200" :
                        "bg-sky-100 text-sky-700 border-sky-200"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Expired"}</span>
                    </Badge>

                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/60 px-3 py-1.5">
                      <Users className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {job._count?.applications ?? 0} {(job._count?.applications ?? 0) === 1 ? 'applicant' : 'applicants'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Short description or one-liner can go here if needed */}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-600" />
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {(job.skillsRequired ?? []).map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-600" />
              Eligible Departments
            </h4>
            <div className="flex flex-wrap gap-2">
              {(job.eligibleDepartments ?? []).map((dept, index) => (
                <Badge key={index} className="rounded-full border-indigo-200 bg-indigo-100 text-indigo-700">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-slate-50/60 px-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3">
              <Calendar className="h-4 w-4 text-slate-600" />
              <div>
                <p className="text-xs text-slate-600">Posted on</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(job.postedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3">
              <Clock className="h-4 w-4 text-slate-600" />
              <div>
                <p className="text-xs text-slate-600">Apply by</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Link href={`/jobs/${job.id}`}>
                <Button variant="outline" className="rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>

              {!job.applied && (
                <Button
                  disabled={isExpired || sendingApproval}
                  className="rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200"
                  onClick={handleApproval}
                >
                  {sendingApproval ? "Sending..." : "Send Mentor Approval"}
                </Button>
              )}

              <Button
                disabled={isExpired || job.applied || loading}
                className={`rounded-full ${job.applied ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-sky-600 text-white hover:bg-sky-700"}`}
                variant={job.applied ? "outline" : "default"}
                onClick={handleApply}
              >
                {loading ? "Applying..." : (job.applied ? "✓ Applied" : "Apply Now")}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

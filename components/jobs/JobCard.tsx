
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Opportunity } from "@/lib/generated/prisma"
import { JobCardProps } from "@/lib/props"
import axios from "axios"
import { Briefcase, Building2, Calendar, Clock, ExternalLink, Layers, MapPin, Star, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export default function JobCard({ job, setJobs }: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false);
  const [sendingApproval, setSendingApproval] = useState(false);

  const daysUntilDeadline = Math.ceil((new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isExpired = daysUntilDeadline <= 0
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0

  const handleApproval = async () => {
    setSendingApproval(true);
    try {
        console.log("Sending mentor approval for job id:", job.id);
        const res = await axios.post(`/api/student/send-mentor-approval/${job.id}`, { withCredentials: true });
        // Update the job state to reflect the application
        setJobs(prevJobs => prevJobs.map(j => j.id === job.id ? { ...j, applied: true, _count: { applications: j._count.applications + 1 } } : j));
        setSendingApproval(false);
        toast.success("Mentor approval request sent successfully");
    } catch (error) {
        toast.error("Failed to send mentor approval request");   
    } finally {
        setSendingApproval(false);
    }
  }

  const handleApply = async () => {
    setLoading(true);
    try {
        const res = await axios.post(`/api/student/apply/${job.id}`, { withCredentials: true });
        // Update the job state to reflect the application
        setJobs(prevJobs => prevJobs.map(j => j.id === job.id ? { ...j, applied: true, _count: { applications: j._count.applications + 1 } } : j));
        setLoading(false);
        toast.success("Application submitted successfully");
    } catch (error) {
        setLoading(false);
        toast.error("Failed to submit application");   
    } finally {
        setLoading(false);
    }
  } 

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
      
      <CardHeader className="relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-sm">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <CardTitle className="text-xl font-bold text-slate-900">{job.title}</CardTitle>
              </div>
              <CardDescription className="text-base font-semibold text-slate-700 mb-3">{
                job.companyRel?.name
              }</CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{job.location}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  <span className="capitalize">{job.type}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  
                  <span>₹{job.salary}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:flex-col md:items-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="rounded-full h-9 w-9 p-0 hover:bg-yellow-50"
            >
              <Star className={`h-4 w-4 ${isBookmarked ? "fill-yellow-500 text-yellow-500" : "text-slate-400"}`} />
            </Button>
            <Badge 
              variant={isExpired ? "destructive" : isUrgent ? "default" : "secondary"}
              className={`rounded-full px-3 py-1 ${
                isExpired ? "bg-red-100 text-red-700 border-red-200" : 
                isUrgent ? "bg-amber-100 text-amber-700 border-amber-200" : 
                "bg-sky-100 text-sky-700 border-sky-200"
              }`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Expired"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <p className="text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500" />
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, index) => (
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
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-500" />
              Eligible Departments
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.eligibleDepartments.map((dept, index) => (
                <Badge 
                  key={index} 
                  className="rounded-full border-indigo-200 bg-indigo-100 text-indigo-700"
                >
                  {dept}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
              <Calendar className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Posted on</p>
                <p className="text-sm font-medium text-slate-700">{new Date(job.postedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
              <Clock className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Apply by</p>
                <p className="text-sm font-medium text-slate-700">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              {job._count.applications} {job._count.applications === 1 ? 'applicant' : 'applicants'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link href={`/jobs/${job.id}`}>
              <Button 
                variant="outline" 
                className="rounded-full border-slate-200 hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            {!job.applied && (
              <Button 
                disabled={isExpired || sendingApproval}
                className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 border border-sky-200"
                variant="outline"
                onClick={handleApproval}
              >
                {sendingApproval ? "Sending..." : "Send Mentor Approval"}
              </Button>
            )}
            <Button 
              disabled={isExpired || job.applied || loading}
              className={`rounded-full ${
                job.applied 
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                  : "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
              }`}
              variant={job.applied ? "outline" : "default"}
              onClick={handleApply}
            >
              {loading ? "Applying..." : (job.applied ? "✓ Applied" : "Apply Now")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
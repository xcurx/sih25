"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, CheckCircle, FileText, TrendingUp } from "lucide-react"

import { Opportunity, Student } from "@/lib/types"
import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { redirect, useRouter } from "next/navigation"
import Loader from "@/components/loader/Loader"
import { useSession } from "next-auth/react"

export default function EmplyersApplicationsPage() {
    const { data:session,status } = useSession()
    const [students, setStudents] = useState<Student[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const getOpportunities = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/employer/get-company-opportunities", { withCredentials: true });
        if (res.status === 200) {
          setOpportunities(res.data.opportunities);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setLoading(false);
      }
    }

    useEffect(() => {
      getOpportunities();
    }, []);

    if (status == "loading" || status == "unauthenticated" || loading) {
      return <Loader/>
    }

    if (session?.user?.role !== "employer") {
      redirect("/");
    }
      

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-600">Manage and track all job applications across your postings</p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Active Jobs", value: opportunities.length, caption: "Currently hiring", icon: Briefcase, accent: "bg-sky-50 text-sky-600" },
            { title: "Applications", value: students.length, caption: "Total received", icon: FileText, accent: "bg-sky-50 text-sky-600" },
            { title: "Interviews", value: 0, caption: "Scheduled", icon: Calendar, accent: "bg-sky-50 text-sky-600" },
            { title: "Hired", value: 0, caption: "This semester", icon: CheckCircle, accent: "bg-emerald-50 text-emerald-600" },
          ].map((stat) => (
            <Card key={stat.title} className="border-slate-200 bg-white shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`rounded-full p-2.5 ${stat.accent}`}>
                  <stat.icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.caption}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Performance Section */}
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Job Performance</CardTitle>
            <CardDescription className="text-slate-600">Application statistics for your job postings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunities.length === 0 ? (
              <div className="py-8 text-center">
                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-2">No active job postings yet.</p>
                <Button asChild className="rounded-full bg-sky-600 text-white hover:bg-sky-700 mt-2">
                  <a href="/jobs/post">Post Your First Job</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-5 border border-slate-100 bg-slate-50/50 rounded-xl hover:border-sky-200 hover:bg-sky-50/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-medium ${job.status === "active" ? "bg-sky-100 text-sky-700 border-sky-200" : "bg-slate-200 text-slate-700"}`}
                      >
                        {job.status === "active" ? "ACTIVE" : job.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {job.location} • {job.type}
                    </p>
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-sky-600">{job._count.applications}</div>
                        <div className="text-xs text-slate-500 mt-1">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">0</div> 
                        <div className="text-xs text-slate-500 mt-1">Shortlisted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">0</div>
                        <div className="text-xs text-slate-500 mt-1">Hired</div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        className="rounded-full bg-sky-600 text-white hover:bg-sky-700 shadow-sm" 
                        onClick={() => {router.push(`/company/applications/${job.id}`)}}
                      >
                        View Applications
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Hiring Tip Box */}
            {opportunities.length > 0 && (
              <div className="rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 p-4 mt-4">
                <p className="flex items-center gap-2 text-sky-900 font-medium text-sm mb-2">
                  <TrendingUp className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  Hiring Tip
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Review and interview your first five candidates within 48 hours to boost candidate engagement and acceptance rate.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
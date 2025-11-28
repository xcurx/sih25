import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, CheckCircle2, FileText, UserCheck, TrendingUp, Users } from "lucide-react"

// Assuming you have a type for Opportunity that includes an 'applications' count, and a Student type
import { Opportunity, Student } from "@/lib/types" 
import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "../loader/Loader"


export default function EmployerDashboard() {
    const [students, setStudents] = useState<Student[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingOpportunities, setLoadingOpportunities] = useState(true);

    const getStudents = async () => {
      setLoadingStudents(true);
      try {
        // Fetch applied students (used for total applications count and recent applications list)
        const res = await axios.get("/api/employer/get-applied-students", { withCredentials: true });
        if (res.status === 200) {
          // Flatten the applications array to just the student data for the recent applications list
          setStudents(res.data.applications.map((app: any) => ({ ...app.studentRel, applicationStatus: app.status }))); 
        }
        setLoadingStudents(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoadingStudents(false);
      }
    }

    const getOpportunities = async () => {
      setLoadingOpportunities(true);
      try {
        // Fetch company opportunities (used for active jobs count and job performance stats)
        const res = await axios.get("/api/employer/get-company-opportunities", { withCredentials: true });
        if (res.status === 200) {
          setOpportunities(res.data.opportunities);
        }
        setLoadingOpportunities(false);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setLoadingOpportunities(false);
      }
    }

    useEffect(() => {
      getStudents();
      getOpportunities();
    }, []);

    // Helper to calculate statistics
    const totalApplications = students.length;
    const totalInterviewsScheduled = 0; // Assuming this data needs to be fetched separately, defaulting to 0
    const totalHired = 0; // Assuming this data needs to be fetched separately, defaulting to 0
    const activeJobs = opportunities.filter(job => job.status === 'active').length; 

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Adopted Student Dashboard's Blue Gradient Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-600 via-sky-500 to-blue-500 p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative space-y-4">
          {/* <Badge variant="outline" className="border-white/40 bg-white/10 text-white">
            Employer Control Panel
          </Badge> */}
          <h1 className="text-3xl font-semibold">
            Welcome back, Tanishq!
          </h1>
          <p className="text-sm text-white/90">
            Monitor your hiring pipeline and manage your active job postings.
          </p>
          {/* Quick Action Buttons - Replaced by relevant actions */}
          <div className="flex flex-wrap gap-3 pt-2">
             <Button 
                asChild 
                variant="secondary" 
                className="rounded-full bg-white/20 text-white hover:bg-white/30"
             >
               <a href="/jobs/post">
                 Post New Job
               </a>
             </Button>
             <Button
                asChild
                className="rounded-full bg-white text-slate-900 hover:bg-slate-100"
             >
               <a href="/applications">View All Applications</a>
             </Button>
          </div>
        </div>
      </div>
      
      {/* 4 Main Stats - Adopted Student Dashboard's detailed card style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Jobs", value: opportunities.length, caption: "Currently hiring", icon: Briefcase, accent: "bg-sky-50 text-sky-700" },
          { title: "Applications", value: totalApplications, caption: "Total received", icon: FileText, accent: "bg-cyan-50 text-cyan-700" },
          { title: "Interviews", value: totalInterviewsScheduled, caption: "Scheduled", icon: Calendar, accent: "bg-blue-50 text-blue-700" },
          { title: "Hired", value: totalHired, caption: "This semester", icon: UserCheck, accent: "bg-emerald-50 text-emerald-700" },
        ].map((stat) => (
          <Card key={stat.title} className="border-slate-200 bg-white/90 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.accent}`}>
                <stat.icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applications & Job Performance - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications Card - Updated UI */}
        <Card className="border-slate-200 bg-white/90 shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-xl text-slate-900">Recent Applications</CardTitle>
            <CardDescription>Latest candidate applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {loadingStudents ? (
              <Loader/>
            ) : students.length === 0 ? (
              <div className="py-6 text-center">
                <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No applications received yet.</p>
                <Button variant="link" asChild className="text-sky-600 px-0 mt-2">
                  <a href="/jobs/post">Post your first job</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {students.slice(0, 5).map((student: any) => (
                  <div 
                    key={student.id} 
                    className="flex items-center justify-between gap-4 rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback className="bg-sky-50 text-sky-700 font-medium text-sm">
                          {student.name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-800 truncate">{student.name}</h3>
                        <p className="text-xs text-slate-500 truncate">
                          {student.branch} • CGPA: <span className="font-medium text-slate-700">{student.cgpa}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 shrink-0 items-center">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-medium uppercase ${
                          student.applicationStatus === "PENDING" ? "bg-amber-100 text-amber-700" :
                          student.applicationStatus === "REVIEWED" ? "bg-blue-100 text-blue-700" :
                          student.applicationStatus === "INTERVIEW" ? "bg-purple-100 text-purple-700" :
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {student.applicationStatus}
                      </Badge>
                      <Button size="sm" variant="ghost" className="rounded-full text-slate-600 hover:bg-sky-50 hover:text-sky-700 p-2 h-8 w-8">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">View Application</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Action button to view all applications - Updated UI */}
            {students.length > 0 && (
                <Button asChild variant="outline" className="w-full mt-4 justify-center rounded-full border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400">
                  <a href="/applications" className="flex items-center gap-2">
                      View All Applications 
                      <Users className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
            )}
          </CardContent>
        </Card>

        {/* Job Performance Card - Updated UI */}
        <Card className="border-slate-200 bg-white/90 shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-xl text-slate-900">Job Performance</CardTitle>
            <CardDescription>Application statistics for your job postings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            {loadingOpportunities ? (
              <Loader/>
            ) : opportunities.length === 0 ? (
              <div className="py-6 text-center">
                <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No active job postings.</p>
                <Button variant="link" asChild className="text-sky-600 px-0 mt-2">
                  <a href="/jobs/post">Start hiring now</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.slice(0, 3).map((job: any) => (
                  <div key={job.id} className="p-4 border border-slate-200 bg-slate-50/60 rounded-xl transition hover:border-sky-300">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 truncate">{job.title}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs uppercase font-medium ml-4 shrink-0 ${job.status === "active" ? "bg-sky-100 text-sky-700" : "bg-slate-200 text-slate-700"}`}
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {job.location} • {job.type}
                    </p>
                    <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-3">
                      <div className="p-1 text-center">
                        <div className="text-2xl font-bold text-sky-600">{job._count.applications}</div>
                        <div className="text-xs text-slate-500">Applications</div>
                      </div>
                      <div className="p-1 text-center">
                        <div className="text-2xl font-bold text-blue-600">0</div> 
                        <div className="text-xs text-slate-500">Shortlisted</div>
                      </div>
                      <div className="p-1 text-center">
                        <div className="text-2xl font-bold text-emerald-600">0</div>
                        <div className="text-xs text-slate-500">Hired</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Weekly Insights Card - Adopting a similar helper box from Student Dashboard */}
            <div className="rounded-xl border-2 border-sky-300/50 bg-sky-50/40 p-4 text-sm text-slate-600 shadow-inner">
              <p className="flex items-center gap-2 text-sky-800 font-semibold">
                <TrendingUp className="h-4 w-4 text-sky-600" aria-hidden="true" />
                Quick Tip
              </p>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Review and interview your first five candidates within 48 hours to boost candidate engagement and acceptance rate. Active jobs attract better talent!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, CheckCircle, FileText } from "lucide-react"

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
        const res = await axios.get("/api/get-company-opportunities", { withCredentials: true });
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
    <div className="p-6 max-w-7xl w-full mx-auto">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground">Currently hiring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Total received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="">
        <Card>
          <CardHeader>
            <CardTitle>Job Performance</CardTitle>
            <CardDescription>Application statistics for your job postings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunities.slice(0, 3).map((job) => (
              <div key={job.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{job.title}</h3>
                  <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {job.location} • {job.type}
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">{job._count.applications}</div>
                    <div className="text-xs text-muted-foreground">Applications</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">0</div>
                    <div className="text-xs text-muted-foreground">Shortlisted</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">0</div>
                    <div className="text-xs text-muted-foreground">Hired</div>
                  </div>
                </div>
                <div className="text-end mt-6">
                    <Button className="cursor-pointer" onClick={() => {router.push(`/company/applications/${job.id}`)}}>
                        View Applications
                    </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
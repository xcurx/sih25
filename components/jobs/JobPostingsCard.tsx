"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Opportunity, StudentApplication } from "@/lib/types"
import {
    Building2,
    Calendar,
    DollarSign,
    Edit,
    Eye,
    MapPin,
    MoreHorizontal,
    Trash2,
    Users
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useEffect, useState } from "react"
import axios from "axios"

export default function JobPostingCard({ job }: { job: Opportunity }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "closed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const daysUntilDeadline = Math.ceil((new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-xl">{job.title}</CardTitle>
                {/* <Badge variant={getStatusColor(job.status)}>{job.status}</Badge> */}
              </div>
              <CardDescription className="text-lg font-medium text-foreground">{
                job?.companyRel?.name
              }</CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    ₹{job.salary}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                View Applications
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-muted-foreground line-clamp-2 mb-4">{job.description}</p>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Skills: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.skillsRequired.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skillsRequired.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skillsRequired.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="font-medium">Departments: </span>
                <span className="text-muted-foreground">{job.eligibleDepartments.join(", ")}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{job._count.applications}</div>
                <div className="text-xs text-muted-foreground">Applications</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">0</div>
                <div className="text-xs text-muted-foreground">Shortlisted</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <ApplicationsDialog id={job.id}/>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ApplicationsDialog = ({ id }:{ id:string }) => {
    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [loading, setLoading] = useState(false);

    const getApplications = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/get-applications-for-opportunity/${id}`);
            if (res.status === 200) {
                setApplications(res.data.applications);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);   
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!id) return;
        getApplications();
    }, [id]);

    return (
        <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                Applications
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Job Applications</DialogTitle>
                <DialogDescription>
                  View and manage applications for this job posting.
                </DialogDescription>
              </DialogHeader>
              {
                applications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                        {loading ? "Loading applications..." : "No applications found."}
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto mt-4">
                        {
                            applications.map((app) => (
                                <div key={app.id} className="border rounded-md p-4 mb-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium">{app.studentRel.name}</h4>
                                            <p className="text-sm text-muted-foreground">{app.studentRel.email}</p>
                                        </div>
                                        <Badge variant={app.status === 'applied' ? 'secondary' : app.status === 'accepted' ? 'default' : 'destructive'}>
                                            {app.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="font-medium">Branch:</span> {app.studentRel.branch}
                                        </div>
                                        <div>
                                            <span className="font-medium">Batch:</span> {app.studentRel.batch}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
              }
            </DialogContent>
        </Dialog>
    )
}

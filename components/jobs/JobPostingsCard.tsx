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
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-sky-50 rounded-lg">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-xl text-gray-900">{job.title}</CardTitle>
                {/* <Badge variant={getStatusColor(job.status)}>{job.status}</Badge> */}
              </div>
              <CardDescription className="text-base font-normal text-gray-600">{
                job?.companyRel?.name
              }</CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
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
            <p className="text-gray-600 line-clamp-2 mb-4">{job.description}</p>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-900">Skills: </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {job.skillsRequired.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-700 bg-white">
                      {skill}
                    </Badge>
                  ))}
                  {job.skillsRequired.length > 4 && (
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-white">
                      +{job.skillsRequired.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900">Departments: </span>
                <span className="text-gray-600">{job.eligibleDepartments.join(", ")}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xl font-bold text-gray-900">{job._count.applications}</div>
                <div className="text-xs text-gray-500 mt-1">Applications</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500 mt-1">Shortlisted</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <ApplicationsDialog id={job.id}/>
              <Button variant="outline" size="sm" className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
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
            const res = await axios.get(`/api/placementcell/get-applications-for-opportunity/${id}`);
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

    const getStatusBadgeStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'bg-gray-900 text-white hover:bg-gray-900';
            case 'reviewed':
                return 'bg-red-600 text-white hover:bg-red-600';
            case 'shortlisted':
                return 'bg-red-600 text-white hover:bg-red-600';
            case 'applied':
                return 'bg-gray-200 text-gray-700 hover:bg-gray-200';
            default:
                return 'bg-gray-200 text-gray-700 hover:bg-gray-200';
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1 bg-sky-600 hover:bg-sky-700 text-white border-0">
                <Users className="mr-2 h-4 w-4" />
                Applications
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Job Applications</DialogTitle>
                <DialogDescription className="text-gray-600">
                  View and manage applications for this job posting.
                </DialogDescription>
              </DialogHeader>
              {
                applications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        {loading ? "Loading applications..." : "No applications found."}
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto mt-4 space-y-3">
                        {
                            applications.map((app) => (
                                <div key={app.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-base">{app.studentRel.name}</h4>
                                            <p className="text-sm text-gray-600 mt-0.5">{app.studentRel.email}</p>
                                        </div>
                                        <Badge className={`${getStatusBadgeStyle(app.status)} rounded-md px-3 py-1 text-xs font-medium`}>
                                            {app.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm grid grid-cols-2 gap-3 text-gray-600">
                                        <div>
                                            <span className="font-medium text-gray-900">Branch:</span> {app.studentRel.branch}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Batch:</span> {app.studentRel.batch}
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
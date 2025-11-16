
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Opportunity } from "@/lib/generated/prisma"
import { JobCardProps } from "@/lib/props"
import axios from "axios"
import { Briefcase, Building2, Calendar, Clock, DollarSign, MapPin, Star, Users } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function JobCard({ job, setJobs }: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false);
  const [sendingApproval, setSendingApproval] = useState(false);

  const daysUntilDeadline = Math.ceil((new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground">{
                job.companyRel?.name
              }</CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="capitalize">{job.type}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    ₹{job.salary}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
              <Star className={`h-4 w-4 ${isBookmarked ? "fill-current text-yellow-500" : ""}`} />
            </Button>
            <Badge variant={daysUntilDeadline <= 7 ? "destructive" : "secondary"}>
              {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Expired"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2">{job.description}</p>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Eligible Departments:</h4>
            <div className="flex flex-wrap gap-2">
              {job.eligibleDepartments.map((dept, index) => (
                <Badge key={index} variant="secondary">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Posted: {new Date(job.postedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{
                job._count.applications
              } applicants</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">View Details</Button>
            <Button disabled={
                daysUntilDeadline <= 0 || job.applied
            }
            className={`${job.applied ? "cursor-not-allowed hidden" : ""}`}
            onClick={handleApproval}
            >
              {
                sendingApproval ? "Sending..." :
                (
                  "Send Mentor Approval"
                )
              }
            </Button>
            <Button disabled={
                daysUntilDeadline <= 0 || job.applied
            }
            onClick={handleApply}
            >
            {
                loading ? "Applying..." :
                (
                    job.applied ? "Applied" : "Apply Now"
                )
            }
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
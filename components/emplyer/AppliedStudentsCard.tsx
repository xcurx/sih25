"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApplicationStatus, Student } from "@/lib/types"
import axios from "axios"
import {
    Eye,
    Mail,
    MessageSquare,
    MousePointerClick,
    Phone
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function AppliedStudentCard({
  student,
  status,
  id,
  onViewDetails,
}: {
  student: Student
  status: ApplicationStatus
  id: string
  onViewDetails: (student: Student) => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apStatus, setApStatus] = useState<ApplicationStatus>(status);

  const handleReview = () => {
    if (status === "applied") {
      const res = axios.patch(`/api/application/review`, {apId: id}, { withCredentials: true })
    }

    router.push(`/company/applications/review/${student.id}`)
  }

  const handleShortlist = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(`/api/application/shortlist`, {apId: id}, { withCredentials: true })
      if (res.status === 200) {
        toast.success("Student shortlisted successfully.");
        setApStatus("shortlisted");
      } else {
        toast.error("Failed to shortlist student.");
      }
    } catch (error) {
      toast.error("Failed to shortlist student.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
              <AvatarFallback className="text-lg">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-xl">{student.name}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {student.branch} • Year {`${4-(student.batch-2025)}`}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{student.cgpa}</div>
            <div className="text-xs text-muted-foreground">CGPA</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {student.skills.slice(0, 6).map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
            {student.skills.length > 6 && <Badge variant="outline">+{student.skills.length - 6} more</Badge>}
          </div>
        </div>

        {/* <div className="grid grid-cols-3 gap-4 text-center text-sm"> */}
        <div className="text-sm">
          {/* <div>
            <div className="font-bold">{student.projects.length}</div>
            <div className="text-muted-foreground">Projects</div>
          </div> */}
          {/* <div>
            <div className="font-bold">{student.certifications.length}</div>
            <div className="text-muted-foreground">Certificates</div>
          </div> */}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Prefers: {student.preferences.locations.slice(0, 2).join(", ")}</span>
          </div> */}
          <div className="w-full flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(student)}
              >
                Quick View
              </Button>
              <Button 
                size="sm" 
                onClick={handleReview}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Full Profile
              </Button>
            </div>
            <div>
              <Button disabled={apStatus !== "applied" && apStatus !== "reviewed"} onClick={handleShortlist}>
                <MousePointerClick className="mr-2 h-4 w-4" />
                {
                  loading ? "Shortlisting..." : 
                  apStatus === "applied" || apStatus === "reviewed" ? "Shortlist" : 
                  apStatus.charAt(0).toUpperCase() + apStatus.slice(1)
                }
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
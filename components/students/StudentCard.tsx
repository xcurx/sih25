"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "@/lib/types"
import {
    Eye,
    Mail,
    MessageSquare,
    Phone
} from "lucide-react"

export default function StudentCard({
  student,
  onViewDetails,
}: {
  student: Student
  onViewDetails: (student: Student) => void
}) {
  const getPlacementStatus = (student: Student) => {
    if (student.applications.some((app) => app.status === "accepted")) {
      return { status: "Placed", color: "default" }
    }
    if (student.applications.some((app) => ["pending", "interview"].includes(app.status))) {
      return { status: "In Process", color: "secondary" }
    }
    return { status: "Unplaced", color: "destructive" }
  }

  const placementInfo = getPlacementStatus(student)

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
                <Badge variant={placementInfo.color as any}>{placementInfo.status}</Badge>
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
          <div className="flex gap-2">
            <div className="font-bold">{student.applications.length}</div>
            <div className="text-muted-foreground">Applications</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Prefers: {student.preferences.locations.slice(0, 2).join(", ")}</span>
          </div> */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button size="sm" onClick={() => onViewDetails(student)}>
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
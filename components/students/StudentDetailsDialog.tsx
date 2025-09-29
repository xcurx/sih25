"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Student } from "@/lib/types"
import {
  GraduationCap
} from "lucide-react"

export default function StudentDetailsDialog({
  student,
  onClose,
}: {
  student: Student | null
  onClose: () => void
}) {
  if (!student) return null

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>{student.name} - Student Profile</span>
          </DialogTitle>
          <DialogDescription>
            {student.branch} • Year {`${4-(student.batch-2025)}`} • CGPA: {student.cgpa}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={"/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="text-xl">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{student.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p>{student.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p>{student.branch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year</label>
                    <p>Year {`${4-(student.batch-2025)}`}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Projects ({student.projects.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {project.startDate} - {project.endDate || "Present"}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card> */}

          {/* Certifications */}
          {/* {student.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications ({student.certifications.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{cert.name}</h3>
                      <p className="text-muted-foreground">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground">Issued: {cert.issueDate}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )} */}

          {/* Job Preferences */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Job Types</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.preferences.jobTypes.map((type, index) => (
                      <Badge key={index} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferred Locations</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.preferences.locations.map((location, index) => (
                      <Badge key={index} variant="secondary">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Salary Range</label>
                <p>
                  ₹{student.preferences.salaryRange.min.toLocaleString()} - ₹
                  {student.preferences.salaryRange.max.toLocaleString()} per annum
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Preferred Industries</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {student.preferences.industries.map((industry, index) => (
                    <Badge key={index} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

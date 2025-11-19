"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { mockStudents } from "@/lib/mock-data"
import type { Student } from "@/lib/types"
import {
    Calendar,
    Code,
    Edit,
    ExternalLink,
    Plus
} from "lucide-react"
import { useState } from "react"

const Projects = () => {
    const [student, setStudent] = useState<Student>(mockStudents[0])

  return (
    <TabsContent value="projects" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-600">Showcase your work and achievements</p>
        </div>
        <Button className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-6">
        {student.projects.map((project) => (
          <Card key={project.id} className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
            {/* Subtle gradient overlay on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
            
            <CardHeader className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    {project.title}
                    {project.liveUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-full hover:bg-sky-50"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 text-sky-600" />
                        </a>
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      {project.startDate} - {project.endDate || "Present"}
                    </div>
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full border-slate-200 hover:bg-slate-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <p className="text-slate-600 leading-relaxed">{project.description}</p>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4 text-slate-500" />
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="rounded-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              {project.githubUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full border-slate-200 hover:bg-slate-50"
                  asChild
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Code className="mr-2 h-4 w-4" />
                    View Code
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  )
}

export default Projects

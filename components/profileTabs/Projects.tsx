"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Code,
  Edit,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
  X,
  Save,
  Github
} from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string | null
  link: string | null
  technologies: string[]
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [techInput, setTechInput] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    link: "",
    technologies: [] as string[]
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/student/project", { withCredentials: true })
      if (res.data?.projects) {
        setProjects(res.data.projects)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      link: "",
      technologies: []
    })
    setTechInput("")
    setEditingProject(null)
    setShowForm(false)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
      link: project.link || "",
      technologies: project.technologies || []
    })
    setShowForm(true)
  }

  const handleAddTech = () => {
    const tech = techInput.trim()
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }))
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTech()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.startDate) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.technologies.length === 0) {
      toast.error("Please add at least one technology")
      return
    }

    setSubmitting(true)
    try {
      if (editingProject) {
        // Update existing project
        await axios.patch("/api/student/project", {
          projectId: editingProject.id,
          title: formData.title,
          description: formData.description,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          link: formData.link || null,
          technologies: formData.technologies
        })
        toast.success("Project updated successfully!")
      } else {
        // Create new project
        await axios.post("/api/student/project", {
          title: formData.title,
          description: formData.description,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          link: formData.link || null,
          technologies: formData.technologies
        })
        toast.success("Project added successfully!")
      }

      resetForm()
      fetchProjects()
    } catch (error) {
      console.error("Submit error:", error)
      toast.error(editingProject ? "Failed to update project" : "Failed to add project")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await axios.delete("/api/student/project", {
        data: { projectId: id }
      })
      setProjects(prev => prev.filter(p => p.id !== id))
      toast.success("Project deleted successfully!")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete project")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <TabsContent value="projects" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-600">Showcase your work and achievements</p>
        </div>
        <Button 
          className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </>
          )}
        </Button>
      </div>

      {/* Add/Edit Project Form */}
      {showForm && (
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900">
              {editingProject ? "Edit Project" : "Add New Project"}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {editingProject ? "Update your project details" : "Add a new project to your portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., E-commerce Platform"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its features, and your role..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-xl min-h-[100px]"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (leave empty if ongoing)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Project Link (GitHub, Live URL, etc.)</Label>
                <Input
                  id="link"
                  placeholder="https://github.com/username/project"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="rounded-xl"
                />
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <Label>Technologies Used *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., React, Node.js, PostgreSQL"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="rounded-xl flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={handleAddTech}
                  >
                    Add
                  </Button>
                </div>
                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.technologies.map((tech, index) => (
                      <Badge 
                        key={index} 
                        className="bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200 rounded-full px-3 py-1 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                        onClick={() => handleRemoveTech(tech)}
                      >
                        {tech}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingProject ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingProject ? "Update Project" : "Add Project"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <Code className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">No Projects Yet</h3>
            <p className="text-sm text-slate-500 text-center max-w-md mb-4">
              Start building your portfolio by adding your first project. 
              Showcase your skills and experience to potential employers.
            </p>
            <Button
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Projects List */
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                      {project.title}
                      {project.link && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-full hover:bg-sky-50"
                          asChild
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            {project.link.includes('github') ? (
                              <Github className="h-4 w-4 text-slate-700" />
                            ) : (
                              <ExternalLink className="h-4 w-4 text-sky-600" />
                            )}
                          </a>
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full border-slate-200 hover:bg-slate-50"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                    >
                      {deletingId === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
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
                {project.link && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full border-slate-200 hover:bg-slate-50"
                    asChild
                  >
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link.includes('github') ? (
                        <>
                          <Github className="mr-2 h-4 w-4" />
                          View Repository
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Project
                        </>
                      )}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  )
}

export default Projects

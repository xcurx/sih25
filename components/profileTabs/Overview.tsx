"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TabsContent } from "@/components/ui/tabs"
import { Student } from "@/lib/generated/prisma"
import { Plus, Mail, Phone, GraduationCap, X, ChevronDown, Check } from "lucide-react"
import axios from "axios"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Checkbox } from "../ui/checkbox"

const commonSkills = [
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "NestJS",
  "GraphQL",
  "Apollo",
  "Redux",
  "React Query",
  "TypeScript",
  "Angular",
  "Vue.js",
  "Svelte",
  "Tailwind CSS",
  "HTML/CSS",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "Kafka",
  "RabbitMQ",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Azure",
  "CI/CD",
  "Git",
  "Linux",
  "Machine Learning",
  "Data Analysis",
  "Pandas",
  "NumPy",
  "TensorFlow",
  "PyTorch",
  "OpenCV",
  "Testing",
  "Jest",
  "Cypress",
  "Playwright",
  "Security",
  "Performance Optimization",
  "System Design",
]

const Overview = ({isEditing}: {isEditing:boolean}) => {
    const [student, setStudent] = useState<Student>();

    const getStudent = async () => {
        try {
            const student = await axios.get('/api/student/profile/overview', { withCredentials: true })
            console.log(student)
            setStudent(student.data)
        } catch (error) {
            
        }
    }

    useEffect(() => {
        getStudent()
    }, [])

    if (!student) {
        return <div>Loading...</div>;
    }

  return (
    <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-sky-100">
                  <AvatarImage src={"/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-sky-600 to-blue-600 text-white">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-slate-900">{student.name}</CardTitle>
                <CardDescription className="text-slate-600">
                  {student.branch} • Year {student.batch as number - new Date().getFullYear() + 1}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 p-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">{student.cgpa}</div>
                  <div className="text-sm text-slate-600 font-medium">CGPA</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <div className="rounded-full bg-sky-100 p-2">
                      <Mail className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500 font-medium">Email</div>
                      <div className="text-sm text-slate-900 truncate">{student.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <div className="rounded-full bg-sky-100 p-2">
                      <Phone className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 font-medium">Phone</div>
                      <div className="text-sm text-slate-900">{student.phone}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900">Personal Information</CardTitle>
                <CardDescription className="text-slate-600">Update your basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={student.name}
                      disabled={true}
                      className="rounded-full border-slate-200 bg-white disabled:bg-slate-50"
                      onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={student.email}
                      disabled={true}
                      className="rounded-full border-slate-200 bg-white disabled:bg-slate-50"
                      onChange={(e) => setStudent({ ...student, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">Phone</Label>
                    <Input
                      id="phone"
                      value={student.phone ?? ""}
                      disabled={true}
                      className="rounded-full border-slate-200 bg-white disabled:bg-slate-50"
                      onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cgpa" className="text-slate-700 font-medium">CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.1"
                      value={student.cgpa ?? ""}
                      disabled={true}
                      className="rounded-full border-slate-200 bg-white disabled:bg-slate-50"
                      onChange={(e) => setStudent({ ...student, cgpa: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-sky-100 p-2">
                    <GraduationCap className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900">Skills</CardTitle>
                    <CardDescription className="text-slate-600">Your technical and professional skills</CardDescription>
                  </div>
                </div>
                {isEditing && (
                  <AddSkillDropdown skills={student.skills || []} setStudent={setStudent}/>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {student.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(student, setStudent, skill)}
                        className="rounded-full p-0.5 hover:bg-white/20"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

const removeSkill = (student: Student | undefined, setStudent: React.Dispatch<React.SetStateAction<Student | undefined>>, skillToRemove: string) => {
  if (!student) return
  const updatedSkills = student.skills?.filter(s => s !== skillToRemove) || []
  setStudent({ ...student, skills: updatedSkills })
  axios.post('/api/student/profile/skills', { skills: updatedSkills }, { withCredentials: true }).catch(error => {
    console.error('Error removing skill:', error)
  })
}

const AddSkillDropdown = ({ 
    skills, 
    setStudent 
}: { 
    skills: string[], 
    setStudent: React.Dispatch<React.SetStateAction<Student | undefined>> 
}) => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>(skills || [])
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState("")
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const toggleSkill = (skill: string) => {
      setSelectedSkills((prevSkills) =>
        prevSkills.includes(skill)
          ? prevSkills.filter((s) => s !== skill)
          : [...prevSkills, skill]
      )
    }

    const handleSave = async () => {
      try {
        const response = await axios.post('/api/student/profile/skills', { skills: selectedSkills }, { withCredentials: true })
        setStudent(prev => ({...prev, skills: response.data.user.skills} as Student))
        setOpen(false)
      } catch (error) {
        console.error('Error updating skills:', error)
      }
    }

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border-sky-200 text-sky-700 hover:bg-sky-50 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Skill
            <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : "rotate-0"}`} />
          </Button>

          {open && (
            <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-slate-100">
              <div className="p-2 border-b border-slate-100">
                <Input
                  autoFocus
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Type to filter skills..."
                  className="h-9 rounded-md border-slate-300"
                />
              </div>
              <div className="max-h-56 overflow-y-auto p-2 space-y-1">
                {commonSkills
                  .filter((skill) => skill.toLowerCase().includes(filter.toLowerCase()))
                  .map((skill) => {
                    const selected = selectedSkills.includes(skill)
                    return (
                      <div
                        key={skill}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleSkill(skill)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") toggleSkill(skill)
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-200 ${
                          selected ? "bg-sky-50 text-sky-800" : "text-slate-700 hover:bg-sky-50"
                        }`}
                      >
                        <span className="text-left">{skill}</span>
                        {selected && <Check className="h-4 w-4 text-sky-600" aria-hidden="true" />}
                      </div>
                    )
                  })}
                {commonSkills.filter((skill) => skill.toLowerCase().includes(filter.toLowerCase())).length === 0 && (
                  <p className="px-2 py-2 text-sm text-slate-500">No matches</p>
                )}
              </div>
              <div className="border-t border-slate-100 p-2">
                <Button
                  type="button"
                  onClick={handleSave}
                  className="w-full bg-sky-600 hover:bg-sky-700 rounded-lg text-white text-sm"
                >
                  Save Skills
                </Button>
              </div>
            </div>
          )}
        </div>
    )
}

export default Overview

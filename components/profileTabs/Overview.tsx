"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TabsContent } from "@/components/ui/tabs"
import { Student } from "@/lib/generated/prisma"
import { Plus, Mail, Phone, GraduationCap } from "lucide-react"
import axios from "axios"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Checkbox } from "../ui/checkbox"

const commonSkills = [
  "JavaScript",
  "Python",
  "Java",
  "React.js",
  "Node.js",
  "SQL",
  "MongoDB",
  "Machine Learning",
  "Data Analysis",
  "AWS",
  "Docker",
  "Git",
  "HTML/CSS",
  "TypeScript",
  "Angular",
  "Vue.js",
  "Spring Boot",
  "Django",
  "Flask",
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
                      value={student.phone as string}
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
                      value={student.cgpa as number}
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
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-sky-100 p-2">
                  <GraduationCap className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Skills</CardTitle>
                  <CardDescription className="text-slate-600">Your technical and professional skills</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.skills?.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="rounded-full border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                  >
                    {skill}
                  </Badge>
                ))}
                {isEditing && (
                  <AddSkillDiaglog skills={student.skills} setStudent={setStudent}/>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

const AddSkillDiaglog = ({ 
    skills, 
    setStudent 
}: { 
    skills:string[], 
    setStudent: React.Dispatch<React.SetStateAction<Student | undefined>> 
}) => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>(skills || []);
    const [open, setOpen] = useState(false);

    const toggleSkill = (skill: string) => {
      setSelectedSkills((prevSkills) =>
        prevSkills.includes(skill)
          ? prevSkills.filter((s) => s !== skill)
          : [...prevSkills, skill]
      )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full border-sky-200 hover:bg-sky-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Choose your skills</DialogTitle>
              <DialogDescription className="text-slate-600">
                Select the skills that best represent your expertise and experience.    
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
              {commonSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                    className="border-slate-300 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                  />
                  <Label htmlFor={skill} className="text-sm text-slate-700">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
            {selectedSkills?.length > 0 && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <Label className="text-slate-700 font-medium">Selected Skills:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="outline"
                      className="rounded-full border-sky-200 bg-white text-sky-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter className="w-full">
                <Button 
                 className="w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                 onClick={async () => {
                    // if (selectedSkills)
                    try {
                        const student = await axios.post('/api/student/profile/skills', { skills: selectedSkills }, { withCredentials: true })
                        console.log(student)    
                        setStudent(prev => ({...prev, skills: student.data.user.skills} as Student))
                        setOpen(false)
                    } catch (error) {
                        
                    }
                 }}
                >
                    Add Skills
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
}

export default Overview

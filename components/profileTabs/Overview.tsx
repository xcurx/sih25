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
import { Plus } from "lucide-react"
import axios from "axios"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Checkbox } from "../ui/checkbox"

const commonSkills = [
  "JavaScript",
  "Python",
  "Java",
  "React",
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
            const student = await axios.get('/api/profile/overview', { withCredentials: true })
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
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={"/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="text-2xl">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>
                  {student.branch} • Year {student.batch as number - new Date().getFullYear() + 1}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{student.cgpa}</div>
                  <div className="text-sm text-muted-foreground">CGPA</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span className="text-sm">{student.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={student.name}
                      disabled={true}
                      onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={student.email}
                      disabled={true}
                      onChange={(e) => setStudent({ ...student, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={student.phone as string}
                      disabled={true}
                      onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.1"
                      value={student.cgpa as number}
                      disabled={true}
                      onChange={(e) => setStudent({ ...student, cgpa: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Your technical and professional skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
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
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose yours skills</DialogTitle>
              <DialogDescription>
                Select the skills that best represent your expertise and experience.    
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {commonSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                  />
                  <Label htmlFor={skill} className="text-sm">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
            {skills?.length > 0 && (
              <div className="mt-4">
                <Label>Selected Skills:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter className="w-full">
                <Button 
                 className="w-full"
                 onClick={async () => {
                    // if (selectedSkills)
                    try {
                        const student = await axios.post('/api/profile/skills', { skills: selectedSkills }, { withCredentials: true })
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

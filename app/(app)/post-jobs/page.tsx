"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save, Send, Building2 } from "lucide-react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Company } from "@/lib/generated/prisma"
import { useRouter } from "next/navigation"

const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics and Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Mathematics",
  "Physics",
  "Chemistry",
]

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

export default function PostJobsPage() {
  const {data:session, status} = useSession();
  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    description: "",
    type: "internship" as "internship" | "full-time",
    location: "",
    salary: "",
    requirements: [] as string[],
    applicationDeadline: "",
    eligibleDepartments: [] as string[],
    skillsRequired: [] as string[],
    additionalInfo: "",
    employerId: "",
  })
  const [companies, setCompanies] = useState<Company[]>([]);

  const [newRequirement, setNewRequirement] = useState("")
  const [isDraft, setIsDraft] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCompanies = async () => {
    await axios.get('/api/get-companies').then((res) => {
      setCompanies(res.data.companies);
    }).catch((err) => {
      console.log(err);
    });
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const toggleDepartment = (dept: string) => {
    setFormData((prev) => ({
      ...prev,
      eligibleDepartments : prev.eligibleDepartments.includes(dept)
        ? prev.eligibleDepartments.filter((d) => d !== dept)
        : [...prev.eligibleDepartments, dept],
    }))
  }

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.includes(skill) ? prev.skillsRequired.filter((s) => s !== skill) : [...prev.skillsRequired, skill],
    }))
  }   

  const handleSubmit = async (draft = false) => {
    setIsDraft(draft)
    setLoading(true);
    // Here you would typically send the data to your backend
    console.log("Job posting:", { ...formData, status: draft ? "draft" : "active" })
    try {
      const res = await axios.post("/api/post-opportunity", {...formData});
      console.log(res);
      if (res.status === 200) {
        setPosted(true);
        setLoading(false);
      } else {
        setError("Failed to post the job. Please try again.");
      }
    } catch (error) {
      setError("Failed to post the job. Please try again.");
      console.error("Error posting job:", error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
    // alert(draft ? "Job saved as draft!" : "Job posted successfully!")
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return;
    getCompanies();
  },[status, posted])

  if (status === "loading") {
    return <div className="p-6 max-w-4xl mx-auto">Loading...</div>
  }

  if (session?.user?.role !== "placement-cell") {
    router.replace("/");
  }

  return !posted? (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Post a Job</h1>
        <p className="text-muted-foreground">Create a new job posting for students</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(false)
        }}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Enter the basic details about the job position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Software Development Intern"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                {/* <Input
                  id="company"
                  placeholder="e.g., TechCorp Inc."
                  value={formData.companyId}
                  onChange={(e) => handleInputChange("companyId", e.target.value)}
                  required
                /> */}
                <Select value={formData.companyId} onValueChange={(value) => {
                    //@ts-expect-error
                    formData.employerId = companies.find((c) => c.id === value)?.employees[0]?.id || ""
                    handleInputChange("companyId", value)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company"/>
                  </SelectTrigger>
                  <SelectContent>
                    {
                      companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Bangalore, Remote"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
            <CardDescription>Specify the salary or stipend range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary/Stipend (₹) *</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="25000"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>List the key requirements and qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a requirement..."
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.requirements.length > 0 && (
              <div className="space-y-2">
                <Label>Current Requirements:</Label>
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span>{req}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Eligible Departments */}
        <Card>
          <CardHeader>
            <CardTitle>Eligible Departments</CardTitle>
            <CardDescription>Select which departments can apply for this position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {departments.map((dept) => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox
                    id={dept}
                    checked={formData.eligibleDepartments.includes(dept)}
                    onCheckedChange={() => toggleDepartment(dept)}
                  />
                  <Label htmlFor={dept} className="text-sm">
                    {dept}
                  </Label>
                </div>
              ))}
            </div>
            {formData.eligibleDepartments.length > 0 && (
              <div className="mt-4">
                <Label>Selected Departments:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.eligibleDepartments.map((dept) => (
                    <Badge key={dept} variant="secondary">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Required Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
            <CardDescription>Select the technical skills required for this position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {commonSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skillsRequired.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                  />
                  <Label htmlFor={skill} className="text-sm">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
            {formData.skillsRequired.length > 0 && (
              <div className="mt-4">
                <Label>Selected Skills:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Any additional details about the position</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Include any additional information such as benefits, work culture, growth opportunities, etc."
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => handleSubmit(true)}>
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button type="submit" disabled={loading}>
            {
              loading ? "Posting..." : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Job
                </>
              )
            }
          </Button>
        </div>
      </form>
    </div>
  ) : (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Job posted successfully!</h2>
      <Button onClick={() => router.push("/job-postings")}>Go to Job Listings</Button>
    </div>
  )
}

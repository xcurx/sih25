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
import { Plus, X, Save, Send, Building2, DollarSign, ListChecks, Users, Code, CheckCircle } from "lucide-react"
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
    await axios.get('/api/placementcell/get-companies').then((res) => {
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
      const res = await axios.post("/api/placementcell/post-opportunity", {...formData});
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
    return <div className="p-6 max-w-4xl mx-auto text-lg text-slate-500">Loading...</div>
  }

  if (session?.user?.role !== "placement-cell") {
    router.replace("/");
  }

  return !posted? (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-4xl font-extrabold text-slate-800">Post a New Job</h1>
        <p className="text-lg text-slate-500 mt-1">Fill out the details to create a new job posting for students.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(false)
        }}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card className="border-slate-200 shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl text-sky-700">
              <Building2 className="h-6 w-6 text-sky-600" />
              Basic Information
            </CardTitle>
            <CardDescription>Enter the basic details about the job position and company.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base text-slate-700">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Software Development Intern"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="border-slate-300 focus:border-sky-500 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-base text-slate-700">Company Name *</Label>
                <Select value={formData.companyId} onValueChange={(value) => {
                    //@ts-expect-error
                    formData.employerId = companies.find((c) => c.id === value)?.employees[0]?.id || ""
                    handleInputChange("companyId", value)
                }}>
                  <SelectTrigger className="border-slate-300 focus:ring-sky-500 rounded-lg">
                    <SelectValue placeholder="Select Partner Company"/>
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
              <Label htmlFor="description" className="text-base text-slate-700">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={5}
                required
                className="border-slate-300 focus:border-sky-500 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-base text-slate-700">Job Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="border-slate-300 focus:ring-sky-500 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base text-slate-700">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Bangalore, Remote"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                  className="border-slate-300 focus:border-sky-500 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-base text-slate-700">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                  required
                  className="border-slate-300 focus:border-sky-500 rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compensation & Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-lg rounded-xl">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl text-sky-700">
                        <DollarSign className="h-5 w-5 text-sky-600" />
                        Compensation
                    </CardTitle>
                    <CardDescription>Specify the minimum expected salary or stipend (CTC/LPA or per month).</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="salaryMin" className="text-base text-slate-700">Minimum Salary/Stipend (₹) *</Label>
                        <Input
                            id="salaryMin"
                            type="number"
                            placeholder="e.g., 25000 (per month) or 600000 (LPA)"
                            value={formData.salary}
                            onChange={(e) => handleInputChange("salary", e.target.value)}
                            required
                            className="border-slate-300 focus:border-sky-500 rounded-lg"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="border-slate-200 shadow-lg rounded-xl">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl text-sky-700">
                        <ListChecks className="h-5 w-5 text-sky-600" />
                        Key Requirements
                    </CardTitle>
                    <CardDescription>List the key qualifications or eligibility criteria.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add requirement (e.g., Minimum CGPA 7.5)..."
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                            className="border-slate-300 focus:border-sky-500 rounded-lg"
                        />
                        <Button type="button" onClick={addRequirement} className="bg-sky-600 hover:bg-sky-700 rounded-lg p-3">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {formData.requirements.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Current Requirements:</Label>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {formData.requirements.map((req, index) => (
                                    <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg transition hover:bg-slate-100">
                                        <span className="text-sm text-slate-700">{req}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)} className="h-7 w-7 p-0 text-red-500 hover:bg-red-50">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Eligible Departments */}
        <Card className="border-slate-200 shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl text-sky-700">
              <Users className="h-6 w-6 text-sky-600" />
              Eligible Departments
            </CardTitle>
            <CardDescription>Select which departments can apply for this position.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {departments.map((dept) => (
                <div key={dept} className="flex items-center space-x-3 p-2 border border-slate-200 rounded-lg hover:bg-sky-50/50 transition">
                  <Checkbox
                    id={dept}
                    checked={formData.eligibleDepartments.includes(dept)}
                    onCheckedChange={() => toggleDepartment(dept)}
                    className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 border-slate-300"
                  />
                  <Label htmlFor={dept} className="text-sm font-medium text-slate-700 cursor-pointer">
                    {dept}
                  </Label>
                </div>
              ))}
            </div>
            {formData.eligibleDepartments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Label className="text-sm font-medium text-slate-700">Selected Departments:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.eligibleDepartments.map((dept) => (
                    <Badge key={dept} variant="default" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full transition">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Required Skills */}
        <Card className="border-slate-200 shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl text-sky-700">
              <Code className="h-6 w-6 text-sky-600" />
              Required Skills
            </CardTitle>
            <CardDescription>Select the technical skills and proficiencies required for this position.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {commonSkills.map((skill) => (
                  <Badge 
                    key={skill} 
                    onClick={() => toggleSkill(skill)}
                    variant={formData.skillsRequired.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer transition duration-150 ease-in-out select-none 
                        ${formData.skillsRequired.includes(skill) 
                            ? "bg-sky-600 hover:bg-sky-700 text-white border-sky-600" 
                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                        } rounded-full px-3 py-1 text-sm font-medium`}
                  >
                    {skill}
                    {formData.skillsRequired.includes(skill) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
              ))}
            </div>
            {formData.skillsRequired.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Label className="text-sm font-medium text-slate-700">Selected Skills:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-700 rounded-full">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border-slate-200 shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-2xl text-slate-700">Additional Information</CardTitle>
            <CardDescription>Any final details about the position (optional).</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Include any additional information such as benefits, work culture, growth opportunities, etc."
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
              rows={4}
              className="border-slate-300 focus:border-sky-500 rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSubmit(true)}
            className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100"
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 rounded-full shadow-md"
          >
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
    <div className="p-10 max-w-xl mx-auto text-center rounded-xl border-2 border-emerald-400 bg-emerald-50 shadow-2xl mt-20 space-y-4">
      <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
      <h2 className="text-3xl font-bold text-slate-800">Job Posted Successfully!</h2>
      <p className="text-lg text-slate-600">The new job opportunity is now visible to eligible students.</p>
      <Button 
        onClick={() => router.push("/job-postings")}
        className="mt-4 bg-sky-600 hover:bg-sky-700 rounded-full"
      >
        Go to Job Listings
      </Button>
    </div>
  )
}
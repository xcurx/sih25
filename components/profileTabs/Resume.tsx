"use client"

import { useRef, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { uploader } from "@/lib/uploader"
import { StudentResume } from "@/lib/types"
import {
  Download,
  Upload,
  FileText,
  Trash2,
  Loader2,
  ExternalLink,
  Sparkles,
  Check,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Mail,
  Phone,
  Linkedin,
  Github,
} from "lucide-react"

interface ResumeProps {
  resumes?: StudentResume[]
  onResumesChange?: (resumes: StudentResume[]) => void
  isLoading?: boolean
}

interface ResumeData {
  name: string
  email: string
  phone: string | null
  branch: string | null
  batch: number | null
  cgpa: number | null
  skills: string[]
  linkedin: string | null
  github: string | null
  summary: string
  projects: {
    title: string
    description: string
    technologies: string[]
    link: string | null
    startDate: string
    endDate: string | null
  }[]
  internships: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  certificates: {
    title: string
    issuer: string
    issueDate: string
    description: string
  }[]
}

const Resume = ({ resumes = [], onResumesChange, isLoading = false }: ResumeProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [resumeList, setResumeList] = useState<StudentResume[]>(resumes)

  // AI Builder state
  const [generating, setGenerating] = useState(false)
  const [aiResumeData, setAiResumeData] = useState<ResumeData | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [aiUploading, setAiUploading] = useState(false)
  const [aiUploaded, setAiUploaded] = useState(false)

  useEffect(() => {
    setResumeList(resumes || [])
  }, [resumes])

  const updateResumes = (next: StudentResume[]) => {
    setResumeList(next)
    onResumesChange?.(next)
  }

  const getUniqueDisplayName = (fileName: string) => {
    const baseName = fileName.replace(/\.[^/.]+$/, "") || "Resume"
    if (!resumeList.some((item) => item.name === baseName)) {
      return baseName
    }

    let counter = 1
    let candidate = `${baseName} (${counter})`
    while (resumeList.some((item) => item.name === candidate)) {
      counter += 1
      candidate = `${baseName} (${counter})`
    }
    return candidate
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setUploading(true)
    try {
      const result = await uploader(file, "resumes")

      if (!result) {
        throw new Error("Upload failed")
      }

      const displayName = getUniqueDisplayName(file.name)
      const response = await axios.post("/api/student/resume", { url: result.url, name: displayName })

      if (!response.data?.resume) {
        throw new Error("Resume metadata missing")
      }

      const updated = [response.data.resume as StudentResume, ...resumeList]
      updateResumes(updated)
      toast.success("Resume uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload resume")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async (resumeId: string) => {
    setDeletingId(resumeId)
    try {
      await axios.delete("/api/student/resume", { data: { resumeId } })
      const updated = resumeList.filter((resume) => resume.id !== resumeId)
      updateResumes(updated)
      toast.success("Resume deleted successfully!")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete resume")
    } finally {
      setDeletingId(null)
    }
  }

  const handleView = (url: string) => {
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    window.open(viewerUrl, "_blank")
  }

  const handleDownload = (url: string) => {
    window.open(url, "_blank")
  }

  // AI Resume Builder handlers
  const handleGenerateAI = async () => {
    setGenerating(true)
    setAiResumeData(null)
    setPdfBlob(null)
    setAiUploaded(false)

    try {
      const contentRes = await axios.post("/api/student/resume-builder")
      const data = contentRes.data.resume as ResumeData

      if (!data) {
        throw new Error("No resume data returned")
      }

      setAiResumeData(data)

      const pdfRes = await axios.post(
        "/api/student/resume-builder/generate-pdf",
        { resume: data },
        { responseType: "blob" }
      )

      setPdfBlob(pdfRes.data)
      toast.success("Resume generated successfully!")
    } catch (error) {
      console.error("Generation error:", error)
      toast.error("Failed to generate resume. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadAI = () => {
    if (!pdfBlob || !aiResumeData) return

    try {
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${aiResumeData.name.replace(/\s+/g, "_")}_Resume.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Resume downloaded!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download resume")
    }
  }

  const handleUploadAI = async () => {
    if (!pdfBlob || !aiResumeData) return

    setAiUploading(true)
    try {
      const file = new File(
        [pdfBlob],
        `${aiResumeData.name.replace(/\s+/g, "_")}_Resume.pdf`,
        { type: "application/pdf" }
      )

      const result = await uploader(file, "resumes")

      if (!result) {
        throw new Error("Upload failed")
      }

      const response = await axios.post("/api/student/resume", {
        url: result.url,
        name: "AI Generated Resume",
      })

      if (!response.data?.resume) {
        throw new Error("Resume metadata missing")
      }

      const updatedResumes = [response.data.resume as StudentResume, ...resumeList]
      updateResumes(updatedResumes)

      setAiUploaded(true)
      toast.success("Resume uploaded to your profile!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload resume")
    } finally {
      setAiUploading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <TabsContent value="documents" className="space-y-6">
      {/* Upload Resume Card */}
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900">Resumes</CardTitle>
          <CardDescription className="text-slate-600">
            Upload and manage your resumes (PDF format only, max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-sky-200 rounded-3xl p-8 text-center bg-sky-50/30 hover:bg-sky-50/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div className="rounded-full bg-gradient-to-br from-sky-100 to-blue-100 p-4 w-fit mx-auto mb-4">
              {uploading ? (
                <Loader2 className="h-8 w-8 text-sky-600 animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-sky-600" />
              )}
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              {resumeList.length > 0 ? "Add another resume" : "Upload Resume"}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {uploading ? "Uploading your resume..." : "Upload your latest resume in PDF format"}
            </p>
            <Button
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Choose File"
              )}
            </Button>
          </div>

          {/* Current Resumes */}
          {isLoading ? (
            <div className="text-center py-4 text-sm text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              Loading resumes...
            </div>
          ) : resumeList.length > 0 ? (
            <div className="space-y-3">
              {resumeList.map((resume) => (
                <div
                  key={resume.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border border-slate-200 rounded-2xl bg-slate-50/60"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{resume.name}</p>
                      <p className="text-xs text-slate-500">
                        Uploaded {new Date(resume.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-slate-200 hover:bg-slate-50"
                      onClick={() => handleView(resume.resumeUrl)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-slate-200 hover:bg-slate-50"
                      onClick={() => handleDownload(resume.resumeUrl)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(resume.id)}
                      disabled={deletingId === resume.id}
                    >
                      {deletingId === resume.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      {deletingId === resume.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500">No resumes uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Resume Builder Card */}
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-sky-100 p-2">
              <Sparkles className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <CardTitle className="text-slate-900">AI Resume Builder</CardTitle>
              <CardDescription className="text-slate-600">
                Generate a professional resume using your profile data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Preview */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-600" />
              Professional Template
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-sky-500" />
                Header with name & contact info
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-sky-500" />
                Education section
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" />
                AI-generated professional summary
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-sky-500" />
                Technical skills showcase
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-sky-500" />
                Experience/Internships
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-sky-500" />
                Projects & Certifications
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateAI}
              disabled={generating}
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Resume Preview */}
      {aiResumeData && (
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Resume Generated
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Preview your generated resume below
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadAI}
                  disabled={!pdfBlob}
                  className="rounded-full border-slate-200 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleUploadAI}
                  disabled={aiUploading || aiUploaded || !pdfBlob}
                  className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                >
                  {aiUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : aiUploaded ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Uploaded!
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload to Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resume Preview Content */}
            <div className="border border-slate-200 bg-white shadow-sm p-8 max-w-[210mm] mx-auto min-h-[297mm] text-slate-900 font-serif">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide text-black mb-2">{aiResumeData.name}</h1>
                <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-800">
                  {aiResumeData.phone && (
                    <span className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" /> {aiResumeData.phone}
                      <span className="mx-2 text-slate-400">|</span>
                    </span>
                  )}
                  <span className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" /> {aiResumeData.email}
                  </span>
                  {aiResumeData.linkedin && (
                    <>
                      <span className="mx-2 text-slate-400">|</span>
                      <a href={aiResumeData.linkedin} className="hover:underline flex items-center">
                        <Linkedin className="h-3 w-3 mr-1" /> LinkedIn
                      </a>
                    </>
                  )}
                  {aiResumeData.github && (
                    <>
                      <span className="mx-2 text-slate-400">|</span>
                      <a href={aiResumeData.github} className="hover:underline flex items-center">
                        <Github className="h-3 w-3 mr-1" /> GitHub
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-4">
                <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Professional Summary</h2>
                <p className="text-sm text-slate-800 leading-normal">{aiResumeData.summary}</p>
              </div>

              {/* Education */}
              <div className="mb-4">
                <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Education</h2>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-base">University</span>
                  <span className="text-sm">{aiResumeData.batch ? `Sep. ${aiResumeData.batch - 4} – May ${aiResumeData.batch}` : "Present"}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="italic text-sm">{aiResumeData.branch || "Bachelor of Engineering"}</span>
                  <span className="italic text-sm">CGPA: {aiResumeData.cgpa || "N/A"}</span>
                </div>
              </div>

              {/* Experience */}
              {aiResumeData.internships.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Experience</h2>
                  {aiResumeData.internships.map((internship, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-base">{internship.company}</span>
                        <span className="text-sm">{internship.duration}</span>
                      </div>
                      <div className="italic text-sm mb-1">{internship.title}</div>
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-800 space-y-1">
                        {internship.description.split('.').filter(s => s.trim().length > 10).map((sentence, i) => (
                          <li key={i}>{sentence.trim()}.</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {aiResumeData.projects.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Projects</h2>
                  {aiResumeData.projects.map((project, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-sm">{project.title}</span>
                          {project.technologies.length > 0 && (
                            <span className="italic text-xs text-slate-600 border-l border-slate-400 pl-2">
                              {project.technologies.slice(0, 4).join(", ")}
                            </span>
                          )}
                        </div>
                        <span className="text-sm">
                          {formatDate(project.startDate)}
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-800 space-y-1">
                        {project.description.split('.').filter(s => s.trim().length > 10).map((sentence, i) => (
                          <li key={i}>{sentence.trim()}.</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Skills */}
              {aiResumeData.skills.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Technical Skills</h2>
                  <div className="text-sm text-slate-800">
                    <div className="flex mb-1">
                      <span className="font-bold w-32 shrink-0">Languages/Tools:</span>
                      <span>{aiResumeData.skills.join(", ")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Certifications */}
              {aiResumeData.certificates.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Certifications</h2>
                  {aiResumeData.certificates.map((cert, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-sm">{cert.title}</span>
                        <span className="text-sm">{formatDate(cert.issueDate)}</span>
                      </div>
                      <div className="italic text-sm text-slate-600">{cert.issuer}</div>
                      {cert.description && (
                        <ul className="list-disc list-outside ml-4 text-sm text-slate-800 mt-1">
                          {cert.description.split('.').filter(s => s.trim().length > 10).map((sentence, i) => (
                            <li key={i}>{sentence.trim()}.</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  )
}

export default Resume

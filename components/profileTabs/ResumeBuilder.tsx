"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { uploader } from "@/lib/uploader"
import { StudentResume } from "@/lib/types"
import {
    Sparkles,
    Download,
    Upload,
    FileText,
    Loader2,
    Check,
    User,
    Mail,
    Phone,
    GraduationCap,
    Briefcase,
    Code,
    Award,
    Linkedin,
    Github,
    ExternalLink,
} from "lucide-react"

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
        description: string | null
    }[]
    certificates: {
        title: string
        issuer: string
        issueDate: string
    }[]
}

interface ResumeBuilderProps {
    onResumesChange?: (resumes: StudentResume[]) => void
    resumes?: StudentResume[]
}

const ResumeBuilder = ({ onResumesChange, resumes = [] }: ResumeBuilderProps) => {
    const [generating, setGenerating] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [resumeData, setResumeData] = useState<ResumeData | null>(null)
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
    const [uploaded, setUploaded] = useState(false)

    const handleGenerate = async () => {
        setGenerating(true)
        setResumeData(null)
        setPdfBlob(null)
        setUploaded(false)

        try {
            // Step 1: Generate resume content
            const contentRes = await axios.post("/api/student/resume-builder")
            const data = contentRes.data.resume as ResumeData

            if (!data) {
                throw new Error("No resume data returned")
            }

            setResumeData(data)

            // Step 2: Generate PDF
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

    const handleDownload = () => {
        if (!pdfBlob || !resumeData) return

        setDownloading(true)
        try {
            const url = URL.createObjectURL(pdfBlob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast.success("Resume downloaded!")
        } catch (error) {
            console.error("Download error:", error)
            toast.error("Failed to download resume")
        } finally {
            setDownloading(false)
        }
    }

    const handleUpload = async () => {
        if (!pdfBlob || !resumeData) return

        setUploading(true)
        try {
            // Convert blob to file
            const file = new File(
                [pdfBlob],
                `${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`,
                { type: "application/pdf" }
            )

            // Upload to storage
            const result = await uploader(file, "resumes")

            if (!result) {
                throw new Error("Upload failed")
            }

            // Save to database
            const response = await axios.post("/api/student/resume", {
                url: result.url,
                name: "AI Generated Resume",
            })

            if (!response.data?.resume) {
                throw new Error("Resume metadata missing")
            }

            // Update resumes list
            const updatedResumes = [response.data.resume as StudentResume, ...resumes]
            onResumesChange?.(updatedResumes)

            setUploaded(true)
            toast.success("Resume uploaded to your profile!")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload resume")
        } finally {
            setUploading(false)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    }

    return (
        <TabsContent value="resume-builder" className="space-y-6">
            {/* Template Preview Card */}
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg overflow-hidden">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="rounded-full bg-sky-100 p-2">
                            <Sparkles className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <CardTitle className="text-slate-900">AI Resume Builder</CardTitle>
                            <CardDescription className="text-slate-600">
                                Generate a professional resume using your profile data and AI
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
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
                            onClick={handleGenerate}
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
            {resumeData && (
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
                                    onClick={handleDownload}
                                    disabled={downloading || !pdfBlob}
                                    className="rounded-full border-slate-200 hover:bg-slate-50"
                                >
                                    {downloading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    Download PDF
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploading || uploaded || !pdfBlob}
                                    className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : uploaded ? (
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
                        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-inner space-y-6">
                            {/* Header */}
                            <div className="border-b-2 border-sky-500 pb-4">
                                <h1 className="text-2xl font-bold text-slate-900">{resumeData.name}</h1>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3.5 w-3.5" />
                                        {resumeData.email}
                                    </span>
                                    {resumeData.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3.5 w-3.5" />
                                            {resumeData.phone}
                                        </span>
                                    )}
                                    {resumeData.linkedin && (
                                        <a
                                            href={resumeData.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sky-600 hover:underline"
                                        >
                                            <Linkedin className="h-3.5 w-3.5" />
                                            LinkedIn
                                        </a>
                                    )}
                                    {resumeData.github && (
                                        <a
                                            href={resumeData.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sky-600 hover:underline"
                                        >
                                            <Github className="h-3.5 w-3.5" />
                                            GitHub
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                                    Professional Summary
                                </h2>
                                <p className="text-sm text-slate-700">{resumeData.summary}</p>
                            </div>

                            {/* Education */}
                            <div>
                                <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                                    Education
                                </h2>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-slate-900">{resumeData.branch || "Engineering"}</p>
                                        <p className="text-sm text-slate-600">
                                            {resumeData.batch && `Year ${resumeData.batch - new Date().getFullYear() + 1}`} • CGPA: {resumeData.cgpa || "N/A"}
                                        </p>
                                    </div>
                                    {resumeData.batch && (
                                        <span className="text-sm text-slate-500">Expected {resumeData.batch}</span>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            {resumeData.skills.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                                        Technical Skills
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {resumeData.internships.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                                        Experience
                                    </h2>
                                    <div className="space-y-3">
                                        {resumeData.internships.map((internship, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-start">
                                                    <p className="font-semibold text-slate-900">{internship.company}</p>
                                                    <span className="text-xs text-slate-500">{internship.duration}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 italic">{internship.title}</p>
                                                {internship.description && (
                                                    <p className="text-sm text-slate-600 mt-1">{internship.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            {resumeData.projects.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                                        Projects
                                    </h2>
                                    <div className="space-y-3">
                                        {resumeData.projects.map((project, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-start">
                                                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                                                        {project.title}
                                                        {project.link && (
                                                            <a
                                                                href={project.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sky-600 hover:text-sky-700"
                                                            >
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                        )}
                                                    </p>
                                                    <span className="text-xs text-slate-500">
                                                        {formatDate(project.startDate)}
                                                        {project.endDate ? ` - ${formatDate(project.endDate)}` : " - Present"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600">{project.description}</p>
                                                {project.technologies.length > 0 && (
                                                    <p className="text-xs text-sky-600 mt-1">
                                                        {project.technologies.join(" • ")}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certifications */}
                            {resumeData.certificates.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-sky-600 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                                        Certifications
                                    </h2>
                                    <div className="space-y-2">
                                        {resumeData.certificates.map((cert, index) => (
                                            <div key={index} className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{cert.title}</p>
                                                    <p className="text-sm text-slate-600">{cert.issuer}</p>
                                                </div>
                                                <span className="text-xs text-slate-500">{formatDate(cert.issueDate)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
    )
}

export default ResumeBuilder

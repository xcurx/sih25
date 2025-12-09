"use client"

import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OpportunityDetail, StudentResume } from "@/lib/types"
import { uploader } from "@/lib/uploader"
import axios from "axios"
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  
  ExternalLink,
  FileText,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Star,
  Upload,
  User,
  Users,
  Loader2,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export default function OpportunityDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [sendingApproval, setSendingApproval] = useState(false)
  const [resumes, setResumes] = useState<StudentResume[]>([])
  const [resumesLoading, setResumesLoading] = useState(false)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [studentCgpa, setStudentCgpa] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isStudent = session?.user?.role === "student"
  const isStaff = session?.user?.role === "faculty" || session?.user?.role === "placement-cell"
  const selectedResumeDetails = selectedResume ? resumes.find((resume) => resume.id === selectedResume) : null
  const meetsCgpaRequirement = !opportunity?.cgpa || (studentCgpa ?? 0) >= (opportunity?.cgpa ?? 0)

  const fetchOpportunity = async () => {
    try {
      const apiUrl = isStaff
        ? `/api/placementcell/opportunity/${params.id}`
        : `/api/student/opportunity/${params.id}`
      
      const res = await axios.get(apiUrl, {
        withCredentials: true,
      })
      if (res.status === 200) {
        setOpportunity(res.data.opportunity)
        setStudentCgpa(res.data.studentCgpa ?? null)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch opportunity details")
    } finally {
      setLoading(false)
    }
  }

  const fetchResumes = async () => {
    if (!isStudent) return
    setResumesLoading(true)
    try {
      const res = await axios.get("/api/student/resume", { withCredentials: true })
      const list: StudentResume[] = res.data?.resumes || []
      setResumes(list)
      if (!selectedResume && list.length > 0) {
        setSelectedResume(list[0].id)
      } else if (selectedResume && !list.some((resume) => resume.id === selectedResume)) {
        setSelectedResume(list[0]?.id ?? null)
      } else if (list.length === 0) {
        setSelectedResume(null)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load resumes")
    } finally {
      setResumesLoading(false)
    }
  }

  const handleResumeFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB")
      event.target.value = ""
      return
    }

    setUploadingResume(true)
    try {
      const uploadResult = await uploader(file, "resumes")
      if (!uploadResult?.url) {
        throw new Error("Upload failed")
      }

      const displayName = file.name.replace(/\.[^/.]+$/, "") || "Resume"
      const response = await axios.post(
        "/api/student/resume",
        { url: uploadResult.url, name: displayName },
        { withCredentials: true }
      )
      const newResume: StudentResume | undefined = response.data?.resume
      if (!newResume) {
        throw new Error("Resume metadata missing")
      }

      setResumes((prev) => [newResume, ...prev])
      setSelectedResume(newResume.id)
      toast.success("Resume uploaded successfully")
    } catch (error: any) {
      console.error(error)
      const errorMessage = error?.message || "Failed to upload resume"
      toast.error(errorMessage)
    } finally {
      setUploadingResume(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleApply = async () => {
    if (!opportunity) return
    if (!selectedResume) {
      toast.error("Please select a resume before applying")
      return
    }
    if (opportunity.cgpa && (studentCgpa ?? 0) < opportunity.cgpa) {
      toast.error(`Minimum CGPA of ${opportunity.cgpa} is required to apply`)
      return
    }
    const resumeDetails = resumes.find((resume) => resume.id === selectedResume)
    setApplying(true)
    try {
      const res = await axios.post(
        `/api/student/apply/${opportunity.id}`,
        { resumeId: selectedResume },
        { withCredentials: true }
      )
      const application = res.data?.application
      setOpportunity((prev) =>
        prev
          ? {
              ...prev,
              applied: true,
              userApplication: {
                id: application?.id ?? prev.userApplication?.id ?? "",
                status: application?.status ?? "applied",
                appliedAt: application?.appliedAt ?? new Date().toISOString(),
                resume: resumeDetails,
              },
              _count: { applications: (prev._count?.applications || 0) + 1 },
            }
          : null
      )
      toast.success("Application submitted successfully")
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to submit application"
      toast.error(message)
    } finally {
      setApplying(false)
    }
  }

  const handleApproval = async () => {
    if (!opportunity) return
     if (opportunity.cgpa && (studentCgpa ?? 0) < opportunity.cgpa) {
      toast.error(`Minimum CGPA of ${opportunity.cgpa} is required to request approval`)
      return
    }
    setSendingApproval(true)
    try {
      await axios.post(
        `/api/student/send-mentor-approval/${opportunity.id}`,
        {},
        { withCredentials: true }
      )
      setOpportunity((prev) => (prev ? { ...prev, applied: true } : null))
      toast.success("Mentor approval request sent successfully")
    } catch (error) {
      toast.error("Failed to send mentor approval request")
    } finally {
      setSendingApproval(false)
    }
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return
    fetchOpportunity()
  }, [status, params.id])

  useEffect(() => {
    if (status !== "authenticated" || !isStudent) return
    fetchResumes()
  }, [status, isStudent])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Opportunity not found</h1>
        <Button onClick={() => router.push("/jobs")} variant="outline" className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </div>
    )
  }

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  const isExpired = daysUntilDeadline <= 0
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0

  return (
    <div className="relative p-6 max-w-5xl w-full mx-auto space-y-6 bg-white">

      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="rounded-full hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card
            className={`rounded-3xl border-slate-200 shadow-lg overflow-hidden ${
              isUrgent && !isExpired ? "bg-gradient-to-br from-sky-50 to-blue-50 ring-2 ring-sky-200" : "bg-white/90"
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-5 shadow-sm">
                    <Building2 className="h-8 w-8 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-1">
                      {opportunity.title}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-slate-700">
                      {opportunity.companyRel?.name}
                    </CardDescription>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  <span className="capitalize">{opportunity.type}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                
                  <span>₹{opportunity.salary?.toLocaleString()}</span>
                </div>
                <Badge
                  className={`rounded-full px-4 py-2 ${
                    isExpired
                      ? "bg-red-100 text-red-700 border-red-200"
                      : isUrgent
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-sky-100 text-sky-700 border-sky-200"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Expired"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">About the Role</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{opportunity.description}</p>
              </div>

              {opportunity.requirements && opportunity.requirements.length > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-500" />
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-500" />
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skillsRequired.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full border-sky-200 bg-white text-sky-700 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  Eligible Departments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.eligibleDepartments.map((dept, index) => (
                    <Badge
                      key={index}
                      className="rounded-full border-indigo-200 bg-indigo-100 text-indigo-700"
                    >
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>

              {opportunity.additionalInfo && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Additional Information</h4>
                  <p className="text-slate-600 leading-relaxed">{opportunity.additionalInfo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {isStudent && opportunity.userApplication && (
            <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge
                  className={`rounded-full px-4 py-2 capitalize ${
                    opportunity.userApplication.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : opportunity.userApplication.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : opportunity.userApplication.status === "shortlisted"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {opportunity.userApplication.status.replace(/_/g, " ")}
                </Badge>
                <p className="text-sm text-slate-600">
                  Applied on {new Date(opportunity.userApplication.appliedAt).toLocaleDateString()}
                </p>
                <Link href={`/applications/${opportunity.userApplication.id}`}>
                  <Button variant="outline" className="w-full rounded-full mt-2">
                    View Application
                  </Button>
                </Link>
                {opportunity.userApplication.resume && (
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 mt-2 flex flex-wrap items-start gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 break-words">
                        {opportunity.userApplication.resume.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Uploaded {new Date(opportunity.userApplication.resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-full shrink-0">
                      <a
                        href={opportunity.userApplication.resume.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {isStaff && (
            <Card className="rounded-3xl border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Opportunity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
                  <Users className="h-4 w-4 text-sky-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {opportunity._count?.applications || 0}{" "}
                    {(opportunity._count?.applications || 0) === 1 ? "applicant" : "applicants"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>Posted: {new Date(opportunity.postedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                  {isExpired ? (
                    <Badge className="rounded-full bg-red-100 text-red-700 border-red-200">
                      Expired
                    </Badge>
                  ) : isUrgent ? (
                    <Badge className="rounded-full bg-amber-100 text-amber-700 border-amber-200">
                      {daysUntilDeadline} days left
                    </Badge>
                  ) : (
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">
                      Active
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {isStudent && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Apply Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleResumeFileChange}
                />
                <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {opportunity._count?.applications || 0}{" "}
                    {(opportunity._count?.applications || 0) === 1 ? "applicant" : "applicants"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>Posted: {new Date(opportunity.postedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
                    <Star className="h-5 w-5 text-sky-600" />
                    <div>
                      <p className="text-xs text-slate-500">Your CGPA</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {studentCgpa !== null && studentCgpa !== undefined ? studentCgpa.toFixed(2) : "N/A"}
                      </p>
                    </div>
                  </div>
                  {opportunity.cgpa && (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
                      <Star className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-500">Minimum Required</p>
                        <p className="text-lg font-semibold text-slate-900">{opportunity.cgpa.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {!meetsCgpaRequirement && opportunity.cgpa && (
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      You need a CGPA of at least {opportunity.cgpa.toFixed(2)} to apply for this opportunity.
                    </span>
                  </div>
                )}

                {!opportunity.applied && (
                  <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Resume</p>
                        <p className="text-xs text-slate-500">Select the resume you want to attach</p>
                      </div>
                      {resumesLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
                    </div>

                    {resumes.length > 0 ? (
                      <>
                        <Label className="text-xs uppercase tracking-wide text-slate-400">Choose resume</Label>
                        <Select value={selectedResume ?? undefined} onValueChange={setSelectedResume}>
                          <SelectTrigger className="rounded-2xl border-slate-200 bg-white">
                            <SelectValue placeholder="Select resume" />
                          </SelectTrigger>
                          <SelectContent>
                            {resumes.map((resume) => (
                              <SelectItem key={resume.id} value={resume.id}>
                                {resume.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2">
                          {selectedResumeDetails && (
                            <Button asChild variant="outline" size="sm" className="rounded-full border-slate-200">
                              <a
                                href={selectedResumeDetails.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Selected
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-sky-200 text-sky-700 hover:bg-sky-50"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingResume}
                          >
                            {uploadingResume ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload New
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-center">
                        <p className="text-sm text-slate-600 mb-3">Upload a resume to apply for this role.</p>
                        <Button
                          variant="outline"
                          className="rounded-full border-sky-200 text-sky-700 hover:bg-sky-50"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingResume}
                        >
                          {uploadingResume ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Resume
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {!opportunity.applied && !selectedResume && !resumesLoading && (
                  <p className="text-xs text-amber-600">
                    Select or upload a resume to enable the apply button.
                  </p>
                )}

                <div className="space-y-2 pt-2">
                  {!opportunity.applied && (
                    <Button
                      disabled={isExpired || sendingApproval || !meetsCgpaRequirement}
                      className="w-full rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 border border-sky-200"
                      variant="outline"
                      onClick={handleApproval}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sendingApproval ? "Sending..." : "Send Mentor Approval"}
                    </Button>
                  )}
                  <Button
                    disabled={
                      isExpired ||
                      opportunity.applied ||
                      applying ||
                      !meetsCgpaRequirement ||
                      !selectedResume ||
                      resumesLoading
                    }
                    className={`w-full rounded-full ${
                      opportunity.applied
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                    }`}
                    variant={opportunity.applied ? "outline" : "default"}
                    onClick={handleApply}
                  >
                    {applying ? "Applying..." : opportunity.applied ? "✓ Applied" : "Apply Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {opportunity.companyRel && (
            <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">About the Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900">{opportunity.companyRel.name}</h4>
                  {opportunity.companyRel.industry && (
                    <p className="text-sm text-slate-600">{opportunity.companyRel.industry}</p>
                  )}
                </div>
                {opportunity.companyRel.description && (
                  <p className="text-sm text-slate-600 line-clamp-4">{opportunity.companyRel.description}</p>
                )}
                {opportunity.companyRel.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>{opportunity.companyRel.location}</span>
                  </div>
                )}
                {opportunity.companyRel.website && (
                  <a
                    href={opportunity.companyRel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}

"use client"

import { useRef, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { uploader } from "@/lib/uploader"
import {
  Download,
  Upload,
  FileText,
  Trash2,
  Loader2,
  ExternalLink
} from "lucide-react"

interface ResumeProps {
  resume?: string | null
  onResumeUpdate?: (url: string | null) => void
}

const Resume = ({ resume, onResumeUpdate }: ResumeProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [currentResume, setCurrentResume] = useState<string | null>(resume || null)

  useEffect(() => {
    setCurrentResume(resume || null)
  }, [resume])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only")
      return
    }

    // validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setUploading(true)
    try {
      const result = await uploader(file, 'resumes')

      if (!result) {
        throw new Error("Upload failed")
      }

      await axios.put("/api/student/resume", { url: result.url })

      setCurrentResume(result.url)
      onResumeUpdate?.(result.url)
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

  const handleDelete = async () => {
    if (!currentResume) return

    setDeleting(true)
    try {
      await axios.delete("/api/student/resume")
      setCurrentResume(null)
      onResumeUpdate?.(null)
      toast.success("Resume deleted successfully!")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete resume")
    } finally {
      setDeleting(false)
    }
  }

  const handleView = () => {
    if (currentResume) {
      // google gocs viewer to display pdf inline
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(currentResume)}&embedded=true`
      window.open(viewerUrl, "_blank")
    }
  }

  const handleDownload = () => {
    if (currentResume) {
      window.open(currentResume, "_blank")
    }
  }

  return (
    <TabsContent value="documents" className="space-y-6">
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900">Resume</CardTitle>
          <CardDescription className="text-slate-600">
            Upload and manage your resume (PDF format only, max 5MB)
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
              {currentResume ? "Replace Resume" : "Upload Resume"}
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

          {/* Current Resume */}
          {currentResume && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border border-slate-200 rounded-2xl bg-slate-50/60">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Current Resume</p>
                  <p className="text-sm text-slate-600">PDF Document</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-slate-200 hover:bg-slate-50"
                  onClick={handleView}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-slate-200 hover:bg-slate-50"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}

          {/* No Resume State */}
          {!currentResume && (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500">No resume uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default Resume

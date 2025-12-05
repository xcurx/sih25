"use client"

import { useRef, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploader } from "@/lib/uploader"
import {
  Award,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  Loader2,
  X,
  Download,
  FileText,
  Image as ImageIcon
} from "lucide-react"

interface Certificate {
  id: string
  title: string
  issuer: string
  issueDate: string
  certificateUrl: string
}

const Certificates = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: ""
  })

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("/api/student/certificate", { withCredentials: true })
      if (res.data?.certificates) {
        setCertificates(res.data.certificates)
      }
    } catch (error) {
      console.error("Error fetching certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type (PDF or image)
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or image file (JPEG, PNG, WebP)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    if (!formData.title || !formData.issuer || !formData.issueDate) {
      toast.error("Please fill in all fields")
      return
    }

    setUploading(true)
    try {
      // Upload file to Cloudinary
      const result = await uploader(selectedFile, 'certificates')

      if (!result) {
        throw new Error("Upload failed")
      }

      // Save certificate to database
      await axios.post("/api/student/certificate/upload", {
        title: formData.title,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        url: result.url
      })

      toast.success("Certificate uploaded successfully!")
      
      // Reset form
      setFormData({ title: "", issuer: "", issueDate: "" })
      setSelectedFile(null)
      setShowForm(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Refresh certificates list
      fetchCertificates()
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload certificate")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await axios.delete(`/api/student/certificate/${id}`)
      setCertificates(prev => prev.filter(cert => cert.id !== id))
      toast.success("Certificate deleted successfully!")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete certificate")
    } finally {
      setDeletingId(null)
    }
  }

  const handleView = (url: string, isPdf: boolean) => {
    if (isPdf) {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
      window.open(viewerUrl, "_blank")
    } else {
      window.open(url, "_blank")
    }
  }

  const isPdfUrl = (url: string) => {
    return url.toLowerCase().includes('.pdf') || url.includes('/raw/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <TabsContent value="certifications" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Certifications</h2>
          <p className="text-slate-600">Your professional certifications and achievements</p>
        </div>
        <Button 
          className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </>
          )}
        </Button>
      </div>

      {/* Add Certificate Form */}
      {showForm && (
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900">Add New Certificate</CardTitle>
            <CardDescription className="text-slate-600">
              Upload a certificate (PDF or image, max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Certificate Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., AWS Solutions Architect"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuing Organization</Label>
                  <Input
                    id="issuer"
                    placeholder="e.g., Amazon Web Services"
                    value={formData.issuer}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    className="rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                  className="rounded-xl"
                  required
                />
              </div>

              {/* File Upload Area */}
              <div className="space-y-2">
                <Label>Certificate File</Label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer
                    ${selectedFile 
                      ? 'border-emerald-300 bg-emerald-50/30' 
                      : 'border-sky-200 bg-sky-50/30 hover:bg-sky-50/50'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className={`rounded-full p-3 w-fit mx-auto mb-3 ${
                    selectedFile 
                      ? 'bg-gradient-to-br from-emerald-100 to-emerald-50' 
                      : 'bg-gradient-to-br from-sky-100 to-blue-100'
                  }`}>
                    {selectedFile ? (
                      selectedFile.type === 'application/pdf' 
                        ? <FileText className="h-6 w-6 text-emerald-600" />
                        : <ImageIcon className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Upload className="h-6 w-6 text-sky-600" />
                    )}
                  </div>
                  {selectedFile ? (
                    <>
                      <p className="font-medium text-slate-900">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-slate-700">Click to upload file</p>
                      <p className="text-sm text-slate-500 mt-1">PDF, JPEG, PNG or WebP (max 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ title: "", issuer: "", issueDate: "" })
                    setSelectedFile(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Certificate
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Certificates List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </div>
      ) : certificates.length === 0 ? (
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
          <CardContent className="py-12">
            <div className="text-center">
              <Award className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-lg font-medium text-slate-700">No certificates yet</p>
              <p className="mt-1 text-sm text-slate-500">Add your professional certifications to showcase your skills.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id} className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
              
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl">
                      {isPdfUrl(cert.certificateUrl) ? (
                        <FileText className="h-6 w-6 text-sky-600" />
                      ) : (
                        <Award className="h-6 w-6 text-sky-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900">{cert.title}</h3>
                      <p className="text-slate-600 font-medium mt-1">{cert.issuer}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          Issued: {formatDate(cert.issueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full border-sky-200 hover:bg-sky-50"
                      onClick={() => handleView(cert.certificateUrl, isPdfUrl(cert.certificateUrl))}
                    >
                      <ExternalLink className="h-4 w-4 text-sky-600" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full border-slate-200 hover:bg-slate-50"
                      onClick={() => window.open(cert.certificateUrl, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(cert.id)}
                      disabled={deletingId === cert.id}
                    >
                      {deletingId === cert.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  )
}

export default Certificates

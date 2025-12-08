"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react"

type CompanyRequest = {
  id: string
  name: string
  description: string
  website: string | null
  industry: string | null
  type: string | null
  location: string | null
  contactName: string
  contactEmail: string
  contactPhone: string | null
  message: string | null
  status: "pending" | "approved" | "rejected"
  createdAt: string
  reviewedAt: string | null
  reviewNote: string | null
}

const statusColors: Record<CompanyRequest["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
}

export default function CompanyRequestDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [request, setRequest] = useState<CompanyRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null)
  const [actionNote, setActionNote] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const id = params?.id

  const fetchRequest = async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await fetch(`/api/placementcell/company-requests/${id}`)
      const data = await response.json()
      if (!response.ok) {
        setFeedback({ type: "error", message: data.error || "Unable to load request." })
        return
      }
      setRequest(data.request)
    } catch (error) {
      console.error(error)
      setFeedback({ type: "error", message: "Network error loading request." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "placement-cell") {
      fetchRequest()
    } else if (status === "authenticated" && session?.user?.role !== "placement-cell") {
      router.replace("/dashboard")
    }
  }, [status, session, router])

  const handleAction = async (action: "approve" | "reject") => {
    if (!id) return
    setActionLoading(action)
    setFeedback(null)
    try {
      const response = await fetch(`/api/placementcell/company-requests/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: actionNote }),
      })
      const data = await response.json()
      if (!response.ok) {
        setFeedback({ type: "error", message: data.error || "Unable to process request." })
        return
      }
      setRequest(data.request)
      setFeedback({ type: "success", message: data.message || "Action completed." })
      setActionNote("")
      router.refresh()
    } catch (error) {
      console.error(error)
      setFeedback({ type: "error", message: "Network error. Please try again." })
    } finally {
      setActionLoading(null)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-sm text-slate-500">
        <ShieldAlert className="h-5 w-5 text-slate-400" />
        Unable to locate this company request.
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <section className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Company dossier</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{request.name}</h1>
            <p className="mt-1 text-sm text-slate-600">Submitted on {new Date(request.createdAt).toLocaleString()}</p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/manage/requests">
              <ArrowLeft className="h-4 w-4" />
              Back to requests
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900">Organization overview</CardTitle>
                <CardDescription className="text-slate-600">{request.description}</CardDescription>
              </div>
              <Badge className={`rounded-full ${statusColors[request.status]}`}>{request.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-slate-700">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Industry</p>
                <p className="mt-1 text-base text-slate-900">{request.industry || "Not specified"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Type</p>
                <p className="mt-1 text-base text-slate-900">{request.type || "Not specified"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Location</p>
                <p className="mt-1 flex items-center gap-2 text-base text-slate-900">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {request.location || "Not specified"}
                </p>
              </div>
            </div>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <a
                  href={request.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 underline underline-offset-2"
                >
                  {request.website || "Website not provided"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" />
                <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {request.message && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Message to placement cell</p>
                <p className="mt-2 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-slate-800">{request.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Primary contact</CardTitle>
            <CardDescription className="text-slate-600">Verify the point of contact before approving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-base text-slate-900">
                <User className="h-4 w-4 text-slate-500" />
                {request.contactName}
              </div>
              <div className="mt-2 flex items-center gap-2 break-all">
                <Mail className="h-4 w-4 text-slate-500" />
                {request.contactEmail}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                {request.contactPhone || "Not provided"}
              </div>
            </div>

            {request.reviewNote && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Previous note</p>
                <p className="mt-2 text-slate-800">{request.reviewNote}</p>
              </div>
            )}

            {request.status === "pending" ? (
              <>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Decision note
                </label>
                <Textarea
                  placeholder="Add context for approval or rejection (optional)"
                  value={actionNote}
                  onChange={(event) => setActionNote(event.target.value)}
                />
                {feedback && (
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      feedback.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    className="gap-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                    disabled={actionLoading === "approve"}
                    onClick={() => handleAction("approve")}
                  >
                    {actionLoading === "approve" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Approve and create company
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50"
                    disabled={actionLoading === "reject"}
                    onClick={() => handleAction("reject")}
                  >
                    {actionLoading === "reject" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Reject request
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <ShieldAlert className="h-4 w-4 text-slate-500" />
                  Decision recorded
                </div>
                <p className="mt-2">Reviewed on {request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : "—"}</p>
                {request.reviewNote && <p className="mt-1 text-slate-600">Note: {request.reviewNote}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

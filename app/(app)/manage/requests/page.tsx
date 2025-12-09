"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Building2, Mail, Phone, Filter, CheckCircle, Clock, XCircle } from "lucide-react"

type CompanyRequest = {
  id: string
  name: string
  description: string
  industry: string | null
  type: string | null
  location: string | null
  contactName: string
  contactEmail: string
  contactPhone: string | null
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

const statusOptions: Array<CompanyRequest["status"]> = ["pending", "approved", "rejected"]

const statusColor: Record<CompanyRequest["status"], string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
  rejected: "bg-rose-50 text-rose-600 border-rose-200",
}

const statusIcons: Record<CompanyRequest["status"], any> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
}

const statusIconColors: Record<CompanyRequest["status"], string> = {
  pending: "text-amber-500",
  approved: "text-emerald-500",
  rejected: "text-rose-500",
}

export default function CompanyRequestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<CompanyRequest[]>([])
  const [filter, setFilter] = useState<CompanyRequest["status"]>("pending")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summaryCounts, setSummaryCounts] = useState({ pending: 0, approved: 0, rejected: 0 })

  const isPlacementCell = session?.user?.role === "placement-cell"

  useEffect(() => {
    if (status === "authenticated" && isPlacementCell) {
      fetchRequests(filter)
    } else if (status === "authenticated" && !isPlacementCell) {
      router.replace("/dashboard")
    }
  }, [status, isPlacementCell, filter, router])

  const fetchRequests = async (currentFilter: CompanyRequest["status"]) => {
    setLoading(true)
    setError(null)
    try {
      const [listRes, summaryRes] = await Promise.all([
        fetch(`/api/placementcell/company-requests?status=${currentFilter}`),
        fetch("/api/placementcell/company-requests?summary=1"),
      ])
      const listData = await listRes.json()
      const summaryData = await summaryRes.json()
      if (!listRes.ok) {
        setError(listData.error || "Unable to load requests.")
        return
      }
      setRequests(listData.requests || [])
      if (summaryRes.ok) {
        setSummaryCounts({
          pending: summaryData.pendingCount ?? 0,
          approved: summaryData.approvedCount ?? 0,
          rejected: summaryData.rejectedCount ?? 0,
        })
      }
    } catch (err) {
      console.error(err)
      setError("Network error loading requests.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    )
  }

  if (!isPlacementCell) {
    return null
  }

  const totalRequests = summaryCounts.pending + summaryCounts.approved + summaryCounts.rejected

  return (
  
      <div className="space-y-8 p-6">
        <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/50 to-blue-50/50 p-8 shadow-sm">
          <div className="relative z-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Partners Inbox
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                  Company access requests
                </h1>
                <p className="mt-1 text-slate-600">
                  Review submissions from employers who wish to onboard to the unified placement portal.
                </p>
              </div>
              <Button variant="outline" className="gap-2 shrink-0 rounded-full" asChild>
                <Link href="/manage">
                  <ArrowLeft className="h-4 w-4" />
                  Back to manage
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <Card className="border-sky-100 bg-white/80 backdrop-blur-sm shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Total Requests
                    </CardDescription>
                    <Building2 className="h-5 w-5 text-sky-500" />
                  </div>
                  <CardTitle className="text-4xl font-semibold text-slate-900">{totalRequests}</CardTitle>
                  <p className="text-xs text-slate-500">All time submissions</p>
                </CardHeader>
              </Card>

              {statusOptions.map((option) => {
                const Icon = statusIcons[option]
                return (
                  <Card key={option} className="border-sky-100 bg-white/80 backdrop-blur-sm shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          {option}
                        </CardDescription>
                        <Icon className={`h-5 w-5 ${statusIconColors[option]}`} />
                      </div>
                      <CardTitle className="text-4xl font-semibold text-slate-900">
                        {summaryCounts[option]}
                      </CardTitle>
                      <p className="text-xs text-slate-500">
                        {option === "pending" && "Awaiting review"}
                        {option === "approved" && "Currently active"}
                        {option === "rejected" && "Not approved"}
                      </p>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        <Card className="border-slate-200 bg-white/95 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              {statusOptions.map((option) => (
                <Button
                  key={option}
                  variant={filter === option ? "default" : "outline"}
                  size="sm"
                  className={
                    filter === option
                      ? "rounded-full bg-sky-600 text-white hover:bg-sky-700"
                      : "rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
                  }
                  onClick={() => setFilter(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)} ({summaryCounts[option]})
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Fetching latest submissions...
              </div>
            )}

            {!loading && requests.length === 0 && (
              <div className="py-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">No {filter} requests right now.</p>
              </div>
            )}

            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-900">{request.name}</CardTitle>
                        <CardDescription className="text-slate-600">{request.description}</CardDescription>
                      </div>
                      <Badge className={`rounded-full border ${statusColor[request.status]}`}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">Industry</p>
                        <p className="text-slate-900">{request.industry || "—"}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">Type</p>
                        <p className="text-slate-900">{request.type || "—"}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">Location</p>
                        <p className="text-slate-900">{request.location || "—"}</p>
                      </div>
                    </div>

                    <div className="h-px w-full bg-slate-200" />

                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>{new Date(request.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{request.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{request.contactPhone || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>Contact:</span>
                        <span className="font-medium text-slate-900">{request.contactName}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button size="sm" className="rounded-full bg-sky-600 text-white hover:bg-sky-700" asChild>
                        <Link href={`/manage/requests/${request.id}`}>View details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    
  )
}
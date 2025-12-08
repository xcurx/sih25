"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Building2, Mail, Phone, Filter } from "lucide-react"

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
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
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

  return (
    <div className="space-y-8 p-6">
      <section className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Partners inbox</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Company access requests</h1>
            <p className="mt-1 text-sm text-slate-600">
              Review submissions from employers who wish to onboard to the unified placement portal.
            </p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/manage">
              <ArrowLeft className="h-4 w-4" />
              Back to manage
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {statusOptions.map((option) => (
            <Card key={option} className="border-slate-200 bg-slate-50/80">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.4em] text-slate-400">
                  <Filter className="h-4 w-4 text-slate-500" />
                  {option}
                </CardDescription>
                <CardTitle className="text-2xl text-slate-900">{summaryCounts[option]}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Filter by status</p>
            <p className="text-xs text-slate-500">Switch between pending, approved, or rejected submissions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Button
                key={option}
                variant={filter === option ? "default" : "outline"}
                size="sm"
                className={
                  filter === option
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }
                onClick={() => setFilter(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Fetching latest submissions...
          </div>
        )}

        {!loading && requests.length === 0 && (
          <p className="text-sm text-slate-500">No {filter} requests right now.</p>
        )}

        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="border-slate-200 bg-white/95 shadow-sm transition hover:border-sky-200">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900">{request.name}</CardTitle>
                  <CardDescription className="text-slate-600">{request.description}</CardDescription>
                </div>
                <Badge className={`rounded-full ${statusColor[request.status]}`}>{request.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Industry</p>
                    <p className="text-slate-800">{request.industry || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Type</p>
                    <p className="text-slate-800">{request.type || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Location</p>
                    <p className="text-slate-800">{request.location || "—"}</p>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-100" />
                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    {new Date(request.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {request.contactEmail}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    {request.contactPhone || "—"}
                  </div>
                  <div className="flex items-center gap-2">
                    Contact: <span className="font-medium text-slate-800">{request.contactName}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Button size="sm" className="rounded-full bg-sky-600 text-white hover:bg-sky-500" asChild>
                    <Link href={`/manage/requests/${request.id}`}>View details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

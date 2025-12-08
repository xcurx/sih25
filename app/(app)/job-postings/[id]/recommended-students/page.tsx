"use client"

import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import {
  ArrowLeft,
  Check,
  Circle,
  Sparkles,
  X,
  Users,
  GraduationCap,
  Mail,
  Send,
  Loader2,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface MatchedStudent {
  id: string
  studentId: string
  opportunityId: string
  status: "pending" | "accepted" | "rejected"
  emailSent: boolean
  student: {
    id: string
    name: string
    email: string
    branch: string | null
    batch: number | null
    cgpa: number | null
    skills: string[]
  }
}

interface OpportunityInfo {
  id: string
  title: string
  companyRel?: {
    name: string
  }
}

export default function RecommendedStudentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id: opportunityId } = useParams()
  const [matchedStudents, setMatchedStudents] = useState<MatchedStudent[]>([])
  const [opportunity, setOpportunity] = useState<OpportunityInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingEmails, setSendingEmails] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch matched students
      const matchRes = await axios.get(`/api/placementcell/matched-students/${opportunityId}`)
      if (matchRes.status === 200) {
        setMatchedStudents(matchRes.data.matchedStudents)
      }

      // Fetch opportunity details
      const oppRes = await axios.get(`/api/placementcell/get-opportunities`)
      if (oppRes.status === 200) {
        const opp = oppRes.data.opportunities.find((o: OpportunityInfo) => o.id === opportunityId)
        setOpportunity(opp || null)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmails = async () => {
    setSendingEmails(true)
    try {
      const res = await axios.post(`/api/placementcell/matched-students/${opportunityId}/send-emails`)
      if (res.status === 200) {
        toast.success(`Emails sent to ${res.data.sentCount} students!`)
        fetchData() // Refresh to update emailSent status
      }
    } catch (error) {
      console.error("Error sending emails:", error)
      toast.error("Failed to send emails. Please try again.")
    } finally {
      setSendingEmails(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && opportunityId) {
      fetchData()
    }
  }, [status, opportunityId])

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (status === "unauthenticated" || session?.user?.role !== "placement-cell") {
    router.replace("/")
    return null
  }

  const getStatusIcon = (matchStatus: string) => {
    switch (matchStatus) {
      case "accepted":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-500">
            <Check className="h-4 w-4 text-emerald-600" />
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 border-2 border-red-500">
            <X className="h-4 w-4 text-red-600" />
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300">
            <Circle className="h-4 w-4 text-slate-400" />
          </div>
        )
    }
  }

  const getStatusBadge = (matchStatus: string) => {
    switch (matchStatus) {
      case "accepted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const acceptedCount = matchedStudents.filter(m => m.status === "accepted").length
  const rejectedCount = matchedStudents.filter(m => m.status === "rejected").length
  const pendingCount = matchedStudents.filter(m => m.status === "pending").length
  const pendingEmailCount = matchedStudents.filter(m => m.status === "pending" && !m.emailSent).length

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full hover:bg-slate-100"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Recommended Students</h1>
              <p className="text-slate-600">
                {opportunity?.title} • {opportunity?.companyRel?.name}
              </p>
            </div>
          </div>
        </div>
        
        {/* Send Emails Button */}
        <Button
          onClick={handleSendEmails}
          disabled={sendingEmails || pendingEmailCount === 0}
          className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          {sendingEmails ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending Emails...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Emails ({pendingEmailCount})
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{matchedStudents.length}</p>
                <p className="text-xs text-slate-500">Total Recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{acceptedCount}</p>
                <p className="text-xs text-slate-500">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-50">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{rejectedCount}</p>
                <p className="text-xs text-slate-500">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-50">
                <Circle className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                <p className="text-xs text-slate-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Matched Students
          </CardTitle>
          <CardDescription className="text-slate-600">
            Students recommended by the AI matching engine for this opportunity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {matchedStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-purple-50 p-4 w-fit mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-slate-600 font-medium">No recommended students yet.</p>
              <p className="text-sm text-slate-500 mt-1">
                The recommendation engine hasn&apos;t found any matches for this opportunity.
              </p>
            </div>
          ) : (
            matchedStudents.map((match) => (
              <div
                key={match.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-purple-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/students/${match.studentId}`}
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                  >
                    <div className="rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 h-14 w-14 flex items-center justify-center text-purple-700 font-bold text-xl">
                      {match.student?.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg text-slate-900 group-hover:text-purple-700 transition-colors">
                        {match.student?.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {match.student?.branch} • Batch {match.student?.batch}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {match.student?.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="rounded-full bg-sky-50 border-sky-200 text-sky-700">
                          CGPA: {match.student?.cgpa}
                        </Badge>
                        {match.student?.skills && match.student.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {match.student.skills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {match.student.skills.length > 4 && (
                              <span className="text-xs text-slate-500">
                                +{match.student.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 ml-4">
                    {/* Email status indicator */}
                    {match.emailSent ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <Mail className="h-3 w-3" />
                        <span>Email Sent</span>
                      </div>
                    ) : match.status === "pending" ? (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Mail className="h-3 w-3" />
                        <span>Not Sent</span>
                      </div>
                    ) : null}
                    <Badge className={`rounded-full capitalize px-4 py-1 ${getStatusBadge(match.status)}`}>
                      {match.status}
                    </Badge>
                    {getStatusIcon(match.status)}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

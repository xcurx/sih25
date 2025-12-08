"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Application, Interview, InterviewApplication, InterviewStatus } from "@/lib/types"
import {
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  MapPin,
  Video,
  CheckCircle2,
  XCircle
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"



export default function InterviewCard({
  application,
  onViewDetails,
}: {
  application: InterviewApplication
  onViewDetails: (application: InterviewApplication) => void
}) {
  const { data: session } = useSession()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"completed" | "accepted" | "rejected" | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const iStatus: InterviewStatus = application.interviewRel?.status ?? "scheduled"
  const isUpcoming = application.interviewRel?.scheduledAt
    ? new Date(application.interviewRel.scheduledAt) > new Date()
    : false

  const getStatusBadge = (status: InterviewStatus) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-sky-500">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "canceled":
        return <Badge className="bg-slate-400">Canceled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
    return { date: dateStr, time: timeStr }
  }

  const getTimeUntil = (dateString: string) => {
    const now = new Date()
    const interviewDate = new Date(dateString)
    const diffInHours = Math.floor((interviewDate.getTime() - now.getTime()) / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
      return `in ${diffInDays} ${diffInDays === 1 ? "day" : "days"}`
    } else if (diffInHours > 0) {
      return `in ${diffInHours} ${diffInHours === 1 ? "hour" : "hours"}`
    } else if (diffInHours === 0) {
      return "starting soon"
    } else {
      return "completed"
    }
  }

  const interviewDateTime = application.interviewRel?.scheduledAt
    ? formatDateTime(application.interviewRel.scheduledAt)
    : null

  const isEmployer = session?.user?.role === "employer"
  const isPast = application.interviewRel?.scheduledAt
    ? new Date(application.interviewRel.scheduledAt) <= new Date()
    : false

  const handleAction = async (action: "completed" | "accepted" | "rejected") => {
    setPendingAction(action)
    setConfirmOpen(true)
  }

  const onConfirm = async () => {
    if (!pendingAction || !application.interviewRel?.id) return
    setSubmitting(true)
    try {
      const res = await axios.patch(`/api/employer/interview/action/${application.interviewRel.id}`, { action: pendingAction }, { withCredentials: true })
      if (res.status === 200) {
        toast.success(`Interview ${pendingAction} successfully`)
        // Optimistic UI: update local interview status
        if (application.interviewRel) {
          (application as any).interviewRel.status = pendingAction
        }
      } else {
        toast.error(res.data?.message || "Failed to update interview")
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update interview"
      toast.error(message)
    } finally {
      setSubmitting(false)
      setConfirmOpen(false)
      setPendingAction(null)
    }
  }

  return (
    <Card className={`group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200 ${isUpcoming ? "ring-2 ring-sky-200" : ""}`}>
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
      
      <CardHeader className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-sm flex-shrink-0">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col space-y-2 mb-2">
                <CardTitle className="text-xl font-bold text-slate-900">
                  {application.opportunityRel.title}
                </CardTitle>
                <CardDescription className="text-base font-semibold text-slate-700">
                  {application.opportunityRel.companyRel?.name}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{application.opportunityRel.location}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  <span className="capitalize">{application.opportunityRel.type}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(iStatus)}
            {isUpcoming && (
              <Badge className="rounded-full border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100">
                <Clock className="h-3 w-3 mr-1" />
                {application.interviewRel?.scheduledAt &&
                  getTimeUntil(application.interviewRel.scheduledAt)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Interview Schedule */}
        {application.interviewRel && (
          <div className={`rounded-2xl p-4 ${isUpcoming ? "border-2 border-sky-200 bg-sky-50/60" : "border border-slate-200 bg-slate-50/60"}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`rounded-full p-2 ${isUpcoming ? "bg-sky-100" : "bg-slate-100"}`}>
                <Video className={`h-5 w-5 ${isUpcoming ? "text-sky-600" : "text-slate-600"}`} />
              </div>
              <h4 className="font-semibold text-slate-900">
                {iStatus === "scheduled" && (isUpcoming ? "Scheduled Interview" : "Interview")}
                {iStatus === "completed" && "Interview Completed"}
                {iStatus === "accepted" && "Candidate Accepted"}
                {iStatus === "rejected" && "Candidate Rejected"}
                {iStatus === "canceled" && "Interview Canceled"}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interviewDateTime && (
                <>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                    <div className="rounded-full bg-slate-100 p-2">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-sm font-medium text-slate-900">{interviewDateTime.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                    <div className="rounded-full bg-slate-100 p-2">
                      <Clock className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="text-sm font-medium text-slate-900">{interviewDateTime.time}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {application.interviewRel.interviewDetails && (
              <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">Details</p>
                <p className="text-sm text-slate-600 leading-relaxed">{application.interviewRel.interviewDetails}</p>
              </div>
            )}
            {application.interviewRel.remark && !isUpcoming && (
              <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-700 mb-2">Feedback</p>
                <p className="text-sm text-emerald-900">{application.interviewRel.remark}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200">
          <Button 
            variant="outline" 
            onClick={() => onViewDetails(application)} 
            className="flex-1 w-full rounded-full border-slate-200 hover:bg-slate-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            Quick View
          </Button>
          {application.interviewRel && (
            <Link href={`/interviews/${application.interviewRel.id}`} className="flex-1 w-full">
              <Button 
                variant="outline"
                className="w-full rounded-full border-sky-200 text-sky-700 hover:bg-sky-50"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Full Details
              </Button>
            </Link>
          )}
          {application.interviewRel?.interviewLink && isUpcoming && iStatus === "scheduled" && (
            <Button
              className="flex-1 w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md"
              asChild
            >
              <a
                href={application.interviewRel.interviewLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Join Interview
              </a>
            </Button>
          )}
          {/* Employer-only actions after scheduled time */}
          {(iStatus !== "accepted" && iStatus !== "rejected" && iStatus !== "canceled") && isEmployer && isPast && (
            <div className="flex-1 flex w-full gap-2">
              {iStatus === "scheduled" && (
                <Button 
                  disabled={submitting}
                  onClick={() => handleAction("completed")}
                  className="flex-1 w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark Done
                </Button>
              )}
              {iStatus === "completed" && (
                <>
                  <Button 
                    disabled={submitting}
                    onClick={() => handleAction("accepted")}
                    className="flex-1 w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                  >
                    Accept
                  </Button>
                  <Button 
                    disabled={submitting}
                    onClick={() => handleAction("rejected")}
                    variant="outline"
                    className="flex-1 w-full rounded-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              {pendingAction === "completed" && "Mark interview as completed?"}
              {pendingAction === "accepted" && "Accept this candidate?"}
              {pendingAction === "rejected" && "Reject this candidate?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">
            {pendingAction === "completed" && "This will mark the interview as done. You can then accept or reject the candidate."}
            {pendingAction === "accepted" && "This will mark the application as accepted. The candidate will be notified."}
            {pendingAction === "rejected" && "This will mark the application as rejected. The candidate will be notified."}
          </p>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmOpen(false)}
              className="rounded-full border-slate-200"
            >
              Cancel
            </Button>
            <Button 
              disabled={submitting}
              onClick={onConfirm}
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import type { Application, Interview, InterviewApplication, InterviewStatus } from "@/lib/types"
// import {
//   Building2,
//   Calendar,
//   Clock,
//   ExternalLink,
//   Eye,
//   MapPin,
//   Video,
//   CheckCircle2,
//   XCircle
// } from "lucide-react"
// import axios from "axios"
// import Link from "next/link"
// import { useSession } from "next-auth/react"
// import { useState } from "react"
// import { toast } from "sonner"

// export default function InterviewCard({
//   application,
//   onViewDetails,
// }: {
//   application: InterviewApplication
//   onViewDetails: (application: InterviewApplication) => void
// }) {
//   const { data: session } = useSession()
//   const [confirmOpen, setConfirmOpen] = useState(false)
//   const [pendingAction, setPendingAction] = useState<"completed" | "accepted" | "rejected" | null>(null)
//   const [submitting, setSubmitting] = useState(false)
//   const iStatus: InterviewStatus = application.interviewRel?.status ?? "scheduled"
//   const isUpcoming = application.interviewRel?.scheduledAt
//     ? new Date(application.interviewRel.scheduledAt) > new Date()
//     : false

//   const getStatusBadge = (status: InterviewStatus) => {
//     switch (status) {
//       case "scheduled":
//         return <Badge className="bg-sky-500">Scheduled</Badge>
//       case "completed":
//         return <Badge className="bg-blue-500">Completed</Badge>
//       case "accepted":
//         return <Badge className="bg-green-500">Accepted</Badge>
//       case "rejected":
//         return <Badge className="bg-red-500">Rejected</Badge>
//       case "canceled":
//         return <Badge className="bg-slate-400">Canceled</Badge>
//       default:
//         return <Badge variant="secondary">{status}</Badge>
//     }
//   }

//   const formatDateTime = (dateString: string) => {
//     const date = new Date(dateString)
//     const dateStr = date.toLocaleDateString("en-US", {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//     const timeStr = date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//     return { date: dateStr, time: timeStr }
//   }

//   const getTimeUntil = (dateString: string) => {
//     const now = new Date()
//     const interviewDate = new Date(dateString)
//     const diffInHours = Math.floor((interviewDate.getTime() - now.getTime()) / (1000 * 60 * 60))
//     const diffInDays = Math.floor(diffInHours / 24)

//     if (diffInDays > 0) {
//       return `in ${diffInDays} ${diffInDays === 1 ? "day" : "days"}`
//     } else if (diffInHours > 0) {
//       return `in ${diffInHours} ${diffInHours === 1 ? "hour" : "hours"}`
//     } else if (diffInHours === 0) {
//       return "starting soon"
//     } else {
//       return "completed"
//     }
//   }

//   const interviewDateTime = application.interviewRel?.scheduledAt
//     ? formatDateTime(application.interviewRel.scheduledAt)
//     : null

//   const isEmployer = session?.user?.role === "employer"
//   const isPast = application.interviewRel?.scheduledAt
//     ? new Date(application.interviewRel.scheduledAt) <= new Date()
//     : false

//   const handleAction = async (action: "completed" | "accepted" | "rejected") => {
//     setPendingAction(action)
//     setConfirmOpen(true)
//   }

//   const onConfirm = async () => {
//     if (!pendingAction || !application.interviewRel?.id) return
//     setSubmitting(true)
//     try {
//       const res = await axios.patch(
//         `/api/employer/interview/action/${application.interviewRel.id}`,
//         { action: pendingAction },
//         { withCredentials: true }
//       )
//       if (res.status === 200) {
//         toast.success(`Interview ${pendingAction} successfully`)
//         // Optimistic UI: update local interview status
//         if (application.interviewRel) {
//           ;(application as any).interviewRel.status = pendingAction
//         }
//       } else {
//         toast.error(res.data?.message || "Failed to update interview")
//       }
//     } catch (error: any) {
//       const message = error?.response?.data?.message || "Failed to update interview"
//       toast.error(message)
//     } finally {
//       setSubmitting(false)
//       setConfirmOpen(false)
//       setPendingAction(null)
//     }
//   }

//   return (
//     <Card className={`group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200 ${isUpcoming ? "ring-2 ring-sky-200" : ""}`}>
//       {/* Subtle gradient overlay on hover */}
//       <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
      
//       <CardHeader className="relative">
//         <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//           <div className="flex items-start space-x-4 flex-1">
//             <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-sm flex-shrink-0">
//               <Building2 className="h-6 w-6 text-sky-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex flex-col space-y-2 mb-2">
//                 <CardTitle className="text-xl font-bold text-slate-900">
//                   {application.opportunityRel.title}
//                 </CardTitle>
//                 <CardDescription className="text-base font-semibold text-slate-700">
//                   {application.opportunityRel.companyRel?.name}
//                 </CardDescription>
//               </div>
//               <div className="flex flex-wrap items-center gap-2">
//                 <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
//                   <MapPin className="h-3.5 w-3.5 text-slate-500" />
//                   <span>{application.opportunityRel.location}</span>
//                 </div>
//                 <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
//                   <Building2 className="h-3.5 w-3.5 text-slate-500" />
//                   <span className="capitalize">{application.opportunityRel.type}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col items-end gap-2">
//             {getStatusBadge(iStatus)}
//             {isUpcoming && (
//               <Badge className="rounded-full border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100">
//                 <Clock className="h-3 w-3 mr-1" />
//                 {application.interviewRel?.scheduledAt &&
//                   getTimeUntil(application.interviewRel.scheduledAt)}
//               </Badge>
//             )}
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="relative space-y-4">
//         {/* Interview Schedule */}
//         {application.interviewRel && (
//           <div className={`rounded-2xl p-4 ${isUpcoming ? "border-2 border-sky-200 bg-sky-50/60" : "border border-slate-200 bg-slate-50/60"}`}>
//             <div className="flex items-center gap-2 mb-4">
//               <div className={`rounded-full p-2 ${isUpcoming ? "bg-sky-100" : "bg-slate-100"}`}>
//                 <Video className={`h-5 w-5 ${isUpcoming ? "text-sky-600" : "text-slate-600"}`} />
//               </div>
//               <h4 className="font-semibold text-slate-900">
//                 {iStatus === "scheduled" && (isUpcoming ? "Scheduled Interview" : "Interview")}
//                 {iStatus === "completed" && "Interview Completed"}
//                 {iStatus === "accepted" && "Candidate Accepted"}
//                 {iStatus === "rejected" && "Candidate Rejected"}
//                 {iStatus === "canceled" && "Interview Canceled"}
//               </h4>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {interviewDateTime && (
//                 <>
//                   <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
//                     <div className="rounded-full bg-slate-100 p-2">
//                       <Calendar className="h-4 w-4 text-slate-600" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Date</p>
//                       <p className="text-sm font-medium text-slate-900">{interviewDateTime.date}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
//                     <div className="rounded-full bg-slate-100 p-2">
//                       <Clock className="h-4 w-4 text-slate-600" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Time</p>
//                       <p className="text-sm font-medium text-slate-900">{interviewDateTime.time}</p>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//             {application.interviewRel.interviewDetails && (
//               <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-3">
//                 <p className="text-xs font-semibold text-slate-700 mb-2">Details</p>
//                 <p className="text-sm text-slate-600 leading-relaxed">{application.interviewRel.interviewDetails}</p>
//               </div>
//             )}
//             {application.interviewRel.remark && !isUpcoming && (
//               <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
//                 <p className="text-xs font-semibold text-emerald-700 mb-2">Feedback</p>
//                 <p className="text-sm text-emerald-900">{application.interviewRel.remark}</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200">
//           <Button 
//             variant="outline" 
//             onClick={() => onViewDetails(application)} 
//             className="flex-1 w-full rounded-full border-slate-200 hover:bg-slate-50"
//           >
//             <Eye className="mr-2 h-4 w-4" />
//             Quick View
//           </Button>

//           {/* 🔹 New Schedule button with Apps Script link */}
//           <Button
//             className="flex-1 w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md"
//             asChild
//           >
//             <a
//               href="https://script.google.com/macros/s/AKfycbxD9Xt09sqDaclqL1ery72oRDiL8HYg0QzMYygw6H3wly0JmsDRggNflmpcy50hPV7hFQ/exec"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <Calendar className="mr-2 h-4 w-4" />
//               Schedule
//             </a>
//           </Button>

//           {application.interviewRel && (
//             <Link href={`/interviews/${application.interviewRel.id}`} className="flex-1 w-full">
//               <Button 
//                 variant="outline"
//                 className="w-full rounded-full border-sky-200 text-sky-700 hover:bg-sky-50"
//               >
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 Full Details
//               </Button>
//             </Link>
//           )}
//           {application.interviewRel?.interviewLink && isUpcoming && iStatus === "scheduled" && (
//             <Button
//               className="flex-1 w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md"
//               asChild
//             >
//               <a
//                 href={application.interviewRel.interviewLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 Join Interview
//               </a>
//             </Button>
//           )}
//           {/* Employer-only actions after scheduled time */}
//           {(iStatus !== "accepted" && iStatus !== "rejected" && iStatus !== "canceled") && isEmployer && isPast && (
//             <div className="flex-1 flex w-full gap-2">
//               {iStatus === "scheduled" && (
//                 <Button 
//                   disabled={submitting}
//                   onClick={() => handleAction("completed")}
//                   className="flex-1 w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600"
//                 >
//                   <CheckCircle2 className="mr-2 h-4 w-4" />
//                   Mark Done
//                 </Button>
//               )}
//               {iStatus === "completed" && (
//                 <>
//                   <Button 
//                     disabled={submitting}
//                     onClick={() => handleAction("accepted")}
//                     className="flex-1 w-full rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
//                   >
//                     Accept
//                   </Button>
//                   <Button 
//                     disabled={submitting}
//                     onClick={() => handleAction("rejected")}
//                     variant="outline"
//                     className="flex-1 w-full rounded-full border-red-300 text-red-700 hover:bg-red-50"
//                   >
//                     <XCircle className="mr-2 h-4 w-4" />
//                     Reject
//                   </Button>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </CardContent>
//       {/* Confirmation Dialog */}
//       <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
//         <DialogContent className="rounded-3xl">
//           <DialogHeader>
//             <DialogTitle className="text-slate-900">
//               {pendingAction === "completed" && "Mark interview as completed?"}
//               {pendingAction === "accepted" && "Accept this candidate?"}
//               {pendingAction === "rejected" && "Reject this candidate?"}
//             </DialogTitle>
//           </DialogHeader>
//           <p className="text-slate-600">
//             {pendingAction === "completed" && "This will mark the interview as done. You can then accept or reject the candidate."}
//             {pendingAction === "accepted" && "This will mark the application as accepted. The candidate will be notified."}
//             {pendingAction === "rejected" && "This will mark the application as rejected. The candidate will be notified."}
//           </p>
//           <DialogFooter className="gap-2">
//             <Button 
//               variant="outline" 
//               onClick={() => setConfirmOpen(false)}
//               className="rounded-full border-slate-200"
//             >
//               Cancel
//             </Button>
//             <Button 
//               disabled={submitting}
//               onClick={onConfirm}
//               className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
//             >
//               Confirm
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   )
// }

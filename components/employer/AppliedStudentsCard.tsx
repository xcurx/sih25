"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { disabledDates } from "@/lib/data"
import type { ApplicationStatus, Student } from "@/lib/types"
import axios from "axios"
import {
    CalendarIcon,
    Eye,
    GraduationCap,
    Mail,
    MessageSquare,
    MousePointerClick,
    Phone,
    Star
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  mentor_approval_needed: { label: "Pending Approval", className: "bg-amber-50 text-amber-700 border-amber-200" },
  applied: { label: "Applied", className: "bg-slate-100 text-slate-700 border-slate-200" },
  reviewed: { label: "Reviewed", className: "bg-blue-50 text-blue-700 border-blue-200" },
  shortlisted: { label: "Shortlisted", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  interviewed: { label: "Interviewed", className: "bg-purple-50 text-purple-700 border-purple-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
  accepted: { label: "Accepted", className: "bg-sky-50 text-sky-700 border-sky-200" },
}

export default function AppliedStudentCard({
  student,
  status,
  id,
  onViewDetails,
}: {
  student: Student
  status: ApplicationStatus
  id: string
  onViewDetails: (student: Student) => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [apStatus, setApStatus] = useState<ApplicationStatus>(status);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleReview = () => {
    if (status === "applied") {
      axios.patch(`/api/employer/application/review`, {apId: id}, { withCredentials: true })
    }
    router.push(`/company/applications/review/${student.id}`)
  }

  const handleShortlistClick = () => {
    setShowCalendarDialog(true);
  }

  const handleShortlist = async () => {
    if (!selectedDate) {
      toast.error("Please select an interview date.");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select an interview time.");
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      toast.error("Invalid interview time selected.");
      return;
    }

    const interviewDateTime = new Date(selectedDate);
    interviewDateTime.setHours(hours, minutes, 0, 0);

    setLoading(true);
    try {
      const res = await axios.patch(`/api/employer/application/shortlist`, {
        apId: id, 
        interviewDateTime: interviewDateTime.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }, { withCredentials: true })
      if (res.status === 200) {
        toast.success("Student shortlisted successfully.");
        setApStatus("shortlisted");
        setShowCalendarDialog(false);
        setSelectedDate(undefined);
        setSelectedTime("");
      } else {
        toast.error("Failed to shortlist student.");
      }
    } catch (error) {
      toast.error("Failed to shortlist student.");
    } finally {
      setLoading(false);
    }
  }

  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    const academicYearStart = new Date(2025, 6, 1);
    const academicYearEnd = new Date(2026, 6, 31);
    if (date < academicYearStart || date > academicYearEnd) return true;

    return disabledDates.some(disabledDate => 
      date.getFullYear() === disabledDate.getFullYear() &&
      date.getMonth() === disabledDate.getMonth() &&
      date.getDate() === disabledDate.getDate()
    );
  }

  const currentStatus = statusConfig[apStatus];

  return (
    <Card className="group rounded-3xl border-slate-200 bg-white/90 shadow-sm hover:shadow-lg hover:border-sky-200 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header with Avatar and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-2 ring-sky-100 ring-offset-2 transition-all group-hover:ring-sky-200">
                <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                <AvatarFallback className="bg-gradient-to-br from-sky-500 to-blue-600 text-white text-lg font-medium">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-slate-900 truncate">{student.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <GraduationCap className="h-4 w-4" />
                <span>{student.branch}</span>
                <span className="text-slate-300">•</span>
                <span>Year {`${4-(student.batch-2025)}`}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${currentStatus.className} border rounded-full px-3 py-0.5 text-xs font-medium`}>
              {currentStatus.label}
            </Badge>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100">
              <Star className="h-3.5 w-3.5 text-sky-600 fill-sky-500" />
              <span className="text-sm font-semibold text-slate-800">{student.cgpa}</span>
              <span className="text-xs text-slate-500">CGPA</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            <span>{student.phone}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-5">
          <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {student.skills.slice(0, 6).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {skill}
              </Badge>
            ))}
            {student.skills.length > 6 && (
              <Badge className="bg-sky-50 text-sky-700 border-sky-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
                +{student.skills.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            >
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              Contact
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              onClick={() => onViewDetails(student)}
            >
              Quick View
            </Button>
            <Button 
              size="sm"
              className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={handleReview}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Full Profile
            </Button>
          </div>
          <Button 
            size="sm"
            className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 disabled:opacity-50"
            disabled={apStatus !== "applied" && apStatus !== "reviewed"}
            onClick={handleShortlistClick}
          >
            <MousePointerClick className="mr-1.5 h-3.5 w-3.5" />
            {loading ? "Shortlisting..." : 
              apStatus === "applied" || apStatus === "reviewed" ? "Shortlist" : 
              apStatus.charAt(0).toUpperCase() + apStatus.slice(1)}
          </Button>
        </div>
      </CardContent>

      {/* Interview Date Selection Dialog */}
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 bg-white/95 backdrop-blur">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">Schedule Interview</DialogTitle>
            <DialogDescription className="text-slate-500">
              Select a date for the interview with {student.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4 rounded-2xl bg-slate-50/50 border border-slate-100">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              startMonth={new Date(2025, 6)}
              endMonth={new Date(2026, 6)}
            />
          </div>
          {selectedDate && (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-sky-50 rounded-xl px-4 py-2 border border-sky-100">
              <CalendarIcon className="h-4 w-4 text-sky-600" />
              <span>Selected: {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Select Time</p>
            <Input 
              type="time" 
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.target.value)}
              className="rounded-2xl border-slate-200"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <div className="space-x-2 w-full flex">
              <Button 
                variant="outline" 
                className="rounded-full flex-1 border-slate-200 hover:bg-slate-50"
                onClick={() => {
                  setShowCalendarDialog(false);
                  setSelectedDate(undefined);
                  setSelectedTime("");
                }}
              >
                Cancel
              </Button>
              <Button 
                className="rounded-full flex-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                onClick={handleShortlist}
                disabled={!selectedDate || loading}
              >
                {loading ? "Scheduling..." : "Confirm & Shortlist"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

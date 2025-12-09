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
import { TimePicker } from "@/components/ui/time-picker"
import { disabledDates } from "@/lib/data"
import type { ApplicationStatus, Student } from "@/lib/types"
import axios from "axios"
import {
    CalendarIcon,
    Clock,
    Eye,
    GraduationCap,
    Mail,
    MessageSquare,
    MousePointerClick,
    Phone,
    Star
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ScheduledInterview {
  id: string
  scheduledAt: string
  length: number
  studentName: string
  opportunityTitle: string
}

interface TimeValue {
  hours: number
  minutes: number
}

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
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(null);
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>([]);
  const [interviewLength, setInterviewLength] = useState<number>(30);

  // Fetch scheduled interviews when dialog opens
  useEffect(() => {
    if (showCalendarDialog) {
      fetchScheduledInterviews();
    }
  }, [showCalendarDialog]);

  const fetchScheduledInterviews = async () => {
    try {
      const res = await axios.get("/api/employer/scheduled-times", { withCredentials: true });
      if (res.status === 200) {
        setScheduledInterviews(res.data.scheduledTimes);
      }
    } catch (error) {
      console.error("Failed to fetch scheduled interviews:", error);
    }
  };

  // Get interviews for a specific date
  const getInterviewsForDate = (date: Date) => {
    return scheduledInterviews.filter(interview => {
      const interviewDate = new Date(interview.scheduledAt);
      return (
        interviewDate.getFullYear() === date.getFullYear() &&
        interviewDate.getMonth() === date.getMonth() &&
        interviewDate.getDate() === date.getDate()
      );
    });
  };

  // Check if a specific time slot is taken
  const isTimeSlotTaken = (time: TimeValue) => {
    if (!selectedDate) return false;
    
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(time.hours, time.minutes, 0, 0);
    
    return scheduledInterviews.some(interview => {
      const interviewStart = new Date(interview.scheduledAt);
      const interviewEnd = new Date(interviewStart.getTime() + interview.length * 60000);
      const slotStart = selectedDateTime;
      const slotEnd = new Date(slotStart.getTime() + interviewLength * 60000);
      
      // Check if there's overlap
      return slotStart < interviewEnd && slotEnd > interviewStart;
    });
  };

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

    // Check if the selected time slot is already taken
    if (isTimeSlotTaken(selectedTime)) {
      toast.error("This time slot conflicts with another interview. Please select a different time.");
      return;
    }

    const interviewDateTime = new Date(selectedDate);
    interviewDateTime.setHours(selectedTime.hours, selectedTime.minutes, 0, 0);

    setLoading(true);
    try {
      const res = await axios.patch(`/api/employer/application/shortlist`, {
        apId: id, 
        interviewDateTime: interviewDateTime.toISOString(),
        interviewLength: interviewLength,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }, { withCredentials: true })
      if (res.status === 200) {
        toast.success("Student shortlisted successfully.");
        setApStatus("shortlisted");
        setShowCalendarDialog(false);
        setSelectedDate(undefined);
        setSelectedTime(null);
        setInterviewLength(30);
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
          <div className="flex items-start gap-4 flex-1">
            <div className="relative flex-shrink-0">
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
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Badge className={`${currentStatus.className} border rounded-full px-4 py-1 text-sm font-medium`}>
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
                variant="outline"
                className="bg-white text-sky-700 border-sky-200 rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {skill}
              </Badge>
            ))}
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
              className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
              onClick={handleReview}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Full Profile
            </Button>
          </div>
          {(apStatus === "applied" || apStatus === "reviewed") && (
            <Button 
              size="sm"
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
              onClick={handleShortlistClick}
            >
              <MousePointerClick className="mr-1.5 h-3.5 w-3.5" />
              {loading ? "Shortlisting..." : "Shortlist"}
            </Button>
          )}
        </div>
      </CardContent>

      {/* Interview Date Selection Dialog */}
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="sm:max-w-lg rounded-3xl border-slate-200 bg-white/95 backdrop-blur">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">Schedule Interview</DialogTitle>
            <DialogDescription className="text-slate-500">
              Select a date and time for the interview with {student.name}
            </DialogDescription>
          </DialogHeader>
          
          <TooltipProvider>
            <div className="flex justify-center py-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                startMonth={new Date(2025, 6)}
                endMonth={new Date(2026, 6)}
                modifiers={{
                  hasInterview: (date) => getInterviewsForDate(date).length > 0,
                }}
                modifiersClassNames={{
                  hasInterview: "bg-amber-100 text-amber-800 font-semibold ring-1 ring-amber-300",
                }}
                components={{
                  DayButton: ({ day, modifiers, ...props }) => {
                    const interviews = getInterviewsForDate(day.date);
                    if (interviews.length > 0) {
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button {...props} />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-semibold text-xs">Scheduled Interviews:</p>
                              {interviews.map((interview) => {
                                const time = new Date(interview.scheduledAt);
                                const endTime = new Date(time.getTime() + interview.length * 60000);
                                return (
                                  <div key={interview.id} className="text-xs">
                                    <span className="text-amber-600">
                                      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <br />
                                    <span className="text-slate-500">{interview.studentName} • {interview.opportunityTitle}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    return <button {...props} />;
                  },
                }}
              />
            </div>
          </TooltipProvider>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-100 ring-1 ring-amber-300" />
              <span>Has scheduled interviews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-slate-200" />
              <span>Unavailable</span>
            </div>
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

          {/* Show interviews on selected date */}
          {selectedDate && getInterviewsForDate(selectedDate).length > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Already scheduled on this day:
              </p>
              <div className="space-y-1">
                {getInterviewsForDate(selectedDate).map((interview) => {
                  const time = new Date(interview.scheduledAt);
                  const endTime = new Date(time.getTime() + interview.length * 60000);
                  return (
                    <div key={interview.id} className="text-xs text-amber-700 flex items-center gap-2">
                      <span className="font-medium">
                        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-amber-600">• {interview.studentName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Select Time</p>
              <TimePicker
                value={selectedTime}
                onChange={(value) => setSelectedTime(value)}
                minuteStep={15}
                minHour={9}
                maxHour={18}
                placeholder="Select time"
              />
              {selectedTime && isTimeSlotTaken(selectedTime) && (
                <p className="text-xs text-red-500">⚠️ This time conflicts with another interview</p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Duration (minutes)</p>
              <select 
                value={interviewLength}
                onChange={(e) => setInterviewLength(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <div className="space-x-2 w-full flex">
              <Button 
                variant="outline" 
                className="rounded-full flex-1 border-slate-200 hover:bg-slate-50"
                onClick={() => {
                  setShowCalendarDialog(false);
                  setSelectedDate(undefined);
                  setSelectedTime(null);
                  setInterviewLength(30);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="rounded-full flex-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
                onClick={handleShortlist}
                disabled={!selectedDate || !selectedTime || loading || (selectedTime && isTimeSlotTaken(selectedTime))}
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

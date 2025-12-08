"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import axios from "axios"
import { MessageSquarePlus, Loader2 } from "lucide-react"

interface FeedbackDialogProps {
  internshipId: string
  opportunityTitle: string
  companyName: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function FeedbackDialog({
  internshipId,
  opportunityTitle,
  companyName,
  isOpen,
  onClose,
  onSuccess,
}: FeedbackDialogProps) {
  const [feedbackText, setFeedbackText] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedbackText.trim() || !description.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await axios.post("/api/student/feedback", {
        internshipId,
        feedbackText: feedbackText.trim(),
        description: description.trim(),
      })

      if (res.status === 201) {
        toast.success("Feedback submitted successfully!")
        setFeedbackText("")
        setDescription("")
        onClose()
        onSuccess?.()
      }
    } catch (error: any) {
      console.error("Error submitting feedback:", error)
      const message = error.response?.data?.message || "Failed to submit feedback"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedbackText("")
      setDescription("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-sky-100 p-2">
              <MessageSquarePlus className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Add Feedback
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Share your experience at {companyName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Opportunity
            </p>
            <p className="text-sm font-medium text-slate-900 mt-1">
              {opportunityTitle}
            </p>
            <p className="text-xs text-slate-500">{companyName}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedbackText" className="text-slate-700">
              Summary <span className="text-red-500">*</span>
            </Label>
            <Input
              id="feedbackText"
              placeholder="Brief summary of your experience..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="rounded-lg border-slate-300 focus:border-sky-500"
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-400">
              A short title or summary (e.g., "Great learning experience")
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">
              Detailed Feedback <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your internship experience in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px] rounded-lg border-slate-300 focus:border-sky-500 resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-400">
              Share details about work culture, mentorship, projects, learning opportunities, etc.
            </p>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

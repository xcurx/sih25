"use client"

import Loader from "@/components/loader/Loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { ArrowLeft, Calendar, Clock, Sparkles, Wand2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

interface OpportunitySummary {
  id: string
  title: string
  description: string
  type: string
  location: string
  salary?: number
  requirements: string[]
  skillsRequired: string[]
  companyRel?: {
    name: string
    industry?: string
  }
}

interface InterviewResponse {
  id: string
  scheduledAt: string
  status: string
  applicationRel: {
    id: string
    opportunityRel: OpportunitySummary
  }
}

interface QAItem {
  question: string
  answer: string
}

export default function InterviewAiPrepPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [interview, setInterview] = useState<InterviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [qaPairs, setQaPairs] = useState<QAItem[]>([])
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [scoreResults, setScoreResults] = useState<
    { question: string; score: number; feedback: string; suggestedAnswer: string }[]
  >([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isScoring, setIsScoring] = useState(false)
  const autoRunRef = useRef(false)

  const opportunity = useMemo(() => interview?.applicationRel.opportunityRel, [interview])

  const fetchInterview = async () => {
    try {
      const res = await axios.get(`/api/student/interview/${params.id}`, {
        withCredentials: true,
      })
      setInterview(res.data.interview)
    } catch (error) {
      console.error(error)
      toast.error("Unable to load interview details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== "student") {
      router.replace("/interviews")
      return
    }
    fetchInterview()
  }, [status, session?.user?.role, params.id])

  const handleGeneratePrep = async () => {
    if (!opportunity) return
    setIsGenerating(true)
    setQaPairs([])
    setScoreResults([])
    try {
      const payload = {
        jobTitle: opportunity.title,
        companyName: opportunity.companyRel?.name,
        jobDescription: opportunity.description,
        skills: opportunity.skillsRequired || [],
        requirements: opportunity.requirements || [],
      }
      const res = await axios.post("/api/interview/generate-qa", payload, {
        withCredentials: true,
      })
      const generated = res.data.questions ?? []
      setQaPairs(generated)
      setUserAnswers(Array.from({ length: generated.length }, () => ""))
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to generate AI prep"
      toast.error(message)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (opportunity && !autoRunRef.current) {
      autoRunRef.current = true
      handleGeneratePrep()
    }
  }, [opportunity])

  const handleScoreAnswers = async () => {
    if (!qaPairs.length) return
    if (userAnswers.some((answer) => !answer.trim())) {
      toast.error("Please answer every question before scoring.")
      return
    }
    setIsScoring(true)
    setScoreResults([])
    try {
      const responses = qaPairs.map((qa, index) => ({
        question: qa.question,
        userAnswer: userAnswers[index],
        expectedAnswer: qa.answer,
      }))
      const res = await axios.post(
        "/api/interview/score-answers",
        { responses },
        { withCredentials: true },
      )
      setScoreResults(res.data.results ?? [])
    } catch (error: any) {
      const message = error?.response?.data?.message || "Unable to score answers"
      toast.error(message)
    } finally {
      setIsScoring(false)
    }
  }

  if (status === "loading" || loading) {
    return <Loader />
  }

  if (!interview || !opportunity) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Button variant="outline" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Interviews
        </Button>
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
          <CardContent className="p-12 text-center space-y-4">
            <Sparkles className="h-10 w-10 text-amber-500 mx-auto" />
            <p className="text-slate-700 font-medium">Interview details were not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const interviewDate = new Date(interview.scheduledAt)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Badge className="rounded-full border-sky-200 bg-sky-50 text-sky-700 px-4 py-2">
          <Sparkles className="h-4 w-4 mr-2" />
          Intelligent Prep Session
        </Badge>
      </div>

      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">
            {opportunity.title}
          </CardTitle>
          <p className="text-slate-600">
            {opportunity.companyRel?.name} • {opportunity.location}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-sky-600" />
              <div>
                <p className="text-xs text-slate-500">Interview Date</p>
                <p className="font-semibold text-slate-900">
                  {interviewDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 flex items-center gap-3">
              <Clock className="h-4 w-4 text-sky-600" />
              <div>
                <p className="text-xs text-slate-500">Time</p>
                <p className="font-semibold text-slate-900">
                  {interviewDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(opportunity.skillsRequired || []).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="rounded-full border-sky-200 bg-white text-sky-800 px-3 py-1 text-sm"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-sky-600" />
            Smart prep based on this role
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            We automatically analyse the job description, role requirements, and highlighted skills to craft a
            relevant practice session. No extra inputs needed—just review the generated questions below or
            regenerate if you want a fresh set.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={handleGeneratePrep}
          disabled={isGenerating}
          className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Regenerate Questions
            </>
          )}
        </Button>
        <p className="text-xs text-slate-500">
          Answer each prompt below, then scroll down to score yourself.
        </p>
      </div>

      {qaPairs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Practice Session</h2>
          {qaPairs.map((qa, index) => {
            const result = scoreResults[index]
            return (
              <Card
                key={`${qa.question}-${index}`}
                className="rounded-3xl border-slate-200 bg-white/90 shadow space-y-4"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 flex items-center gap-2 flex-wrap">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
                      {index + 1}
                    </span>
                    {qa.question}
                    {result && (
                      <Badge
                        className={`ml-auto rounded-full px-3 py-1 text-sm ${
                          result.score >= 80
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : result.score >= 50
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        Score: {result.score}/100
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={userAnswers[index] || ""}
                    onChange={(event) => {
                      const next = [...userAnswers]
                      next[index] = event.target.value
                      setUserAnswers(next)
                    }}
                    placeholder="Type your answer here..."
                    className="rounded-2xl border-slate-200 min-h-[120px]"
                  />
                  {result && (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
                      <p className="text-sm font-semibold text-slate-700">{result.feedback}</p>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                          Suggested Answer
                        </p>
                        <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                          {result.suggestedAnswer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {qaPairs.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-600">
            Ready? Make sure all answers are filled in, then score them with one click.
          </p>
          <Button
            variant="outline"
            onClick={handleScoreAnswers}
            disabled={isScoring}
            className="rounded-full border-slate-200 text-slate-800 hover:bg-slate-50"
          >
            {isScoring ? "Scoring..." : "Score My Answers"}
          </Button>
        </div>
      )}
    </div>
  )
}

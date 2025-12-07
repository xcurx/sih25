"use client"

import { type ComponentType, type Dispatch, type SetStateAction, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Loader from "@/components/loader/Loader"
import { AlertCircle, CheckCircle2, GraduationCap, ShieldCheck, UserPlus } from "lucide-react"

type FormFields = {
  name: string
  email: string
  password: string
}

type FeedbackState = {
  status: "idle" | "success" | "error"
  message: string
}

const emptyForm: FormFields = {
  name: "",
  email: "",
  password: "",
}

const defaultFeedback: FeedbackState = {
  status: "idle",
  message: "",
}

export default function PlacementManagePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [studentForm, setStudentForm] = useState<FormFields>(emptyForm)
  const [facultyForm, setFacultyForm] = useState<FormFields>(emptyForm)
  const [studentLoading, setStudentLoading] = useState(false)
  const [facultyLoading, setFacultyLoading] = useState(false)
  const [studentFeedback, setStudentFeedback] = useState<FeedbackState>(defaultFeedback)
  const [facultyFeedback, setFacultyFeedback] = useState<FeedbackState>(defaultFeedback)

  if (status === "loading") {
    return <Loader />
  }

  if (!session?.user || session.user.role !== "placement-cell") {
    router.replace("/")
    return null
  }

  const handleSubmit = async (role: "student" | "faculty") => {
    const form = role === "student" ? studentForm : facultyForm
    const setForm = role === "student" ? setStudentForm : setFacultyForm
    const setLoading = role === "student" ? setStudentLoading : setFacultyLoading
    const setFeedback = role === "student" ? setStudentFeedback : setFacultyFeedback

    if (!form.name || !form.email || !form.password) {
      setFeedback({
        status: "error",
        message: "All fields are required.",
      })
      return
    }

    setLoading(true)
    setFeedback(defaultFeedback)

    try {
      const response = await axios.post("/api/sign-up", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        roll: role,
      })

      setFeedback({
        status: "success",
        message: response.data?.message ?? `New ${role} account created.`,
      })
      setForm(emptyForm)
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Unable to create the account. Please try again."

      setFeedback({
        status: "error",
        message,
      })
    } finally {
      setLoading(false)
    }
  }

  const renderFeedback = (state: FeedbackState) => {
    if (state.status === "idle") return null

    const Icon = state.status === "success" ? CheckCircle2 : AlertCircle
    const bgClass = state.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"

    return (
      <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${bgClass}`}>
        <Icon className="h-4 w-4" />
        <span>{state.message}</span>
      </div>
    )
  }

  const renderForm = (
    title: string,
    description: string,
    form: FormFields,
    setForm: Dispatch<SetStateAction<FormFields>>,
    onSubmit: () => Promise<void>,
    loading: boolean,
    feedback: FeedbackState,
    badgeText: string,
    badgeIcon: ComponentType<{ className?: string }>,
  ) => {
    const BadgeIcon = badgeIcon
    const idPrefix = badgeText.replace(/\s+/g, "-").toLowerCase()

    return (
      <Card className="border-slate-200 bg-white/95 shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-3">
            <Badge variant="secondary" className="w-fit gap-2 rounded-full bg-sky-50 text-sky-700">
              <BadgeIcon className="h-4 w-4" />
              {badgeText}
            </Badge>
            <div>
              <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
              <CardDescription className="text-slate-600">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              onSubmit()
            }}
          >
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-name`}>Full name</Label>
              <Input
                id={`${idPrefix}-name`}
                placeholder="Enter full name"
                value={form.name}
                autoComplete="name"
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-email`}>Email address</Label>
              <Input
                id={`${idPrefix}-email`}
                placeholder="name@example.com"
                type="email"
                value={form.email}
                autoComplete="email"
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-password`}>Temporary password</Label>
              <Input
                id={`${idPrefix}-password`}
                placeholder="Set an initial password"
                type="password"
                value={form.password}
                autoComplete="new-password"
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </div>

            {renderFeedback(feedback)}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading} className="rounded-full bg-sky-600 text-white hover:bg-sky-700">
                {loading ? "Processing..." : "Create account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-10 p-6">
      <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit gap-2 rounded-full bg-sky-600/10 text-sky-800">
              <ShieldCheck className="h-4 w-4" />
              Placement cell only
            </Badge>
            <h1 className="text-3xl font-semibold text-slate-900">Manage verified access</h1>
            <p className="text-sm text-slate-600">
              Provision student or faculty accounts instantly. These users can sign in with the credentials you set and update their details later.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {renderForm(
          "Add new student",
          "Create student accounts for upcoming batches or special drives.",
          studentForm,
          setStudentForm,
          () => handleSubmit("student"),
          studentLoading,
          studentFeedback,
          "Student access",
          GraduationCap,
        )}

        {renderForm(
          "Add new faculty mentor",
          "Give mentor dashboard access to faculty stakeholders.",
          facultyForm,
          setFacultyForm,
          () => handleSubmit("faculty"),
          facultyLoading,
          facultyFeedback,
          "Faculty access",
          UserPlus,
        )}
      </div>
    </div>
  )
}

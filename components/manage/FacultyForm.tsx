"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface FormFields {
  name: string
  email: string
  password: string
}

interface Feedback {
  type: "success" | "error"
  message: string
}

export function FacultyForm() {
  const [form, setForm] = useState<FormFields>({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setFeedback({ type: "error", message: "Please fill in all fields." })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, roll: "faculty" }),
      })

      const data = await response.json()

      if (response.ok) {
        setFeedback({ type: "success", message: data.message || "Faculty created successfully." })
        setForm({ name: "", email: "", password: "" })
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to create faculty." })
      }
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const renderFeedback = () => {
    if (!feedback) return null
    return (
      <div
        className={`mt-4 rounded-lg p-3 text-sm ${
          feedback.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
        }`}
      >
        {feedback.message}
      </div>
    )
  }

  return (
    <Card className="border-slate-200 bg-white/95 shadow-lg">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit gap-2 rounded-full bg-sky-50 text-sky-600">
            <UserPlus className="h-4 w-4" />
            Faculty access
          </Badge>
          <div>
            <CardTitle className="text-2xl text-slate-900">Add new faculty mentor</CardTitle>
            <CardDescription className="text-slate-600">
              Give mentor dashboard access to faculty stakeholders.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="faculty-name">Full name</Label>
            <Input
              id="faculty-name"
              placeholder="Faculty's full name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faculty-email">Email address</Label>
            <Input
              id="faculty-email"
              placeholder="name@institute.edu"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faculty-password">Temporary password</Label>
            <Input
              id="faculty-password"
              placeholder="Set an initial password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>

          {renderFeedback()}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
            >
              {loading ? "Saving..." : "Create faculty"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

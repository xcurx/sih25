"use client"

import { useState } from "react"
import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EmployerFormFields {
  name: string
  email: string
  password: string
  companyId: string
}

interface Feedback {
  type: "success" | "error"
  message: string
}

interface Company {
  id: string
  name: string
}

interface EmployerFormProps {
  companies: Company[]
  companiesLoading: boolean
  companiesError?: string
  onRefreshCompanies: () => void
}

export function EmployerForm({ companies, companiesLoading, companiesError, onRefreshCompanies }: EmployerFormProps) {
  const [form, setForm] = useState<EmployerFormFields>({
    name: "",
    email: "",
    password: "",
    companyId: "",
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.companyId) {
      setFeedback({ type: "error", message: "Please fill in all required fields including company selection." })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch("/api/sign-up/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        setFeedback({ type: "success", message: data.message || "Employer created successfully." })
        setForm({ name: "", email: "", password: "", companyId: "" })
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to create employer." })
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
          <Badge variant="secondary" className="w-fit gap-2 rounded-full bg-amber-50 text-amber-700">
            <Briefcase className="h-4 w-4" />
            Employer access
          </Badge>
          <div>
            <CardTitle className="text-2xl text-slate-900">Add employer representative</CardTitle>
            <CardDescription className="text-slate-600">
              Link each employer to a verified company so they can post roles and review applicants.
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
            <Label htmlFor="employer-name">Full name</Label>
            <Input
              id="employer-name"
              placeholder="Employer's full name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employer-email">Email address</Label>
            <Input
              id="employer-email"
              placeholder="name@company.com"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employer-password">Temporary password</Label>
            <Input
              id="employer-password"
              placeholder="Set an initial password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Linked company *</Label>
            <Select
              value={form.companyId}
              onValueChange={(value) => setForm((prev) => ({ ...prev, companyId: value }))}
              disabled={companiesLoading || companies.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={companiesLoading ? "Loading companies..." : "Select company"} />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {companiesError && <p className="text-sm text-red-600">{companiesError}</p>}
            {!companiesLoading && companies.length === 0 && (
              <p className="text-sm text-slate-500">No companies yet. Add one first to enable employer onboarding.</p>
            )}
          </div>

          {renderFeedback()}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onRefreshCompanies} disabled={companiesLoading}>
              {companiesLoading ? "Refreshing..." : "Refresh companies"}
            </Button>
            <Button
              type="submit"
              disabled={loading || companies.length === 0}
              className="rounded-full bg-amber-500 text-white hover:bg-amber-600"
            >
              {loading ? "Creating..." : "Create employer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

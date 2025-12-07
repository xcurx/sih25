"use client"

import { useState, useEffect, useCallback } from "react"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface CompanyFormFields {
  name: string
  description: string
  website: string
  industry: string
  location: string
}

interface Feedback {
  type: "success" | "error"
  message: string
}

interface Company {
  id: string
  name: string
}

interface CompanyFormProps {
  onCompaniesUpdate?: (companies: Company[]) => void
}

export function CompanyForm({ onCompaniesUpdate }: CompanyFormProps) {
  const [form, setForm] = useState<CompanyFormFields>({
    name: "",
    description: "",
    website: "",
    industry: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [companiesLoading, setCompaniesLoading] = useState(false)

  const fetchCompanies = useCallback(async () => {
    setCompaniesLoading(true)
    try {
      const response = await fetch("/api/placementcell/get-companies")
      if (response.ok) {
        const data = await response.json()
        onCompaniesUpdate?.(data.companies || [])
      }
    } catch {
      // Silent fail for background fetch
    } finally {
      setCompaniesLoading(false)
    }
  }, [onCompaniesUpdate])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      setFeedback({ type: "error", message: "Company name and description are required." })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch("/api/placementcell/add-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        setFeedback({ type: "success", message: data.message || "Company added successfully." })
        setForm({ name: "", description: "", website: "", industry: "", location: "" })
        fetchCompanies()
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to add company." })
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
          <Badge variant="secondary" className="w-fit gap-2 rounded-full bg-emerald-50 text-emerald-700">
            <Building2 className="h-4 w-4" />
            Company registry
          </Badge>
          <div>
            <CardTitle className="text-2xl text-slate-900">Register a company</CardTitle>
            <CardDescription className="text-slate-600">
              Companies must be registered before assigning employer representatives to them.
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company name *</Label>
              <Input
                id="company-name"
                placeholder="Acme Inc."
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-industry">Industry</Label>
              <Input
                id="company-industry"
                placeholder="Technology, Finance, etc."
                value={form.industry}
                onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-description">Description</Label>
            <Input
              id="company-description"
              placeholder="Brief description of the company"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                placeholder="https://company.com"
                value={form.website}
                onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-location">Location</Label>
              <Input
                id="company-location"
                placeholder="City, Country"
                value={form.location}
                onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
              />
            </div>
          </div>

          {renderFeedback()}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={fetchCompanies} disabled={companiesLoading}>
              {companiesLoading ? "Refreshing..." : "Refresh list"}
            </Button>
            <Button type="submit" disabled={loading} className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
              {loading ? "Saving..." : "Add company"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

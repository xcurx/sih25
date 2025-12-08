"use client"

import { useState } from "react"
import { Building2, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const companyTypes = ["Product", "Services", "Consulting", "Startup", "Enterprise"]

const initialForm = {
  name: "",
  description: "",
  website: "",
  industry: "",
  type: "",
  location: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  message: "",
}

type Feedback = { type: "success" | "error"; message: string }

export function CompanyRequestForm() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.contactName.trim() || !form.contactEmail.trim()) {
      setFeedback({ type: "error", message: "Company name, description, and contact details are required." })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch("/api/company-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()
      if (!response.ok) {
        setFeedback({ type: "error", message: data.error || "Unable to submit request." })
        return
      }

      setFeedback({ type: "success", message: data.message || "Request submitted successfully." })
      setForm(initialForm)
    } catch (error) {
      console.error(error)
      setFeedback({ type: "error", message: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const renderFeedback = () => {
    if (!feedback) return null
    const Icon = feedback.type === "success" ? CheckCircle2 : AlertCircle
    const bg = feedback.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
    return (
      <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${bg}`}>
        <Icon className="h-4 w-4" />
        <span>{feedback.message}</span>
      </div>
    )
  }

  return (
    <Card className="border-slate-200 bg-white/95 shadow-xl">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit gap-2 rounded-full bg-sky-50 text-sky-700">
            <Building2 className="h-4 w-4" />
            Step 1 – Submit request
          </Badge>
          <CardTitle className="text-3xl text-slate-900">Register your company</CardTitle>
          <CardDescription className="text-slate-600">
            Share your organisation’s details and placement cell will verify and whitelist you for campaigns.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
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
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Acme Industries Pvt. Ltd."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-industry">Industry *</Label>
              <Input
                id="company-industry"
                value={form.industry}
                onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
                placeholder="Manufacturing, Fintech, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-description">Description *</Label>
            <Textarea
              id="company-description"
              rows={4}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Tell us about your organisation and typical hiring plans."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="company-type">Company type</Label>
              <select
                id="company-type"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              >
                <option value="">Select type</option>
                {companyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-location">Primary location</Label>
              <Input
                id="company-location"
                value={form.location}
                onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={form.website}
                onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
                placeholder="https://company.com"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-800">Primary contact details</p>
            <p className="text-xs text-slate-500">We’ll share updates with this contact when the placement cell responds.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Contact name *</Label>
                <Input
                  id="contact-name"
                  value={form.contactName}
                  onChange={(event) => setForm((prev) => ({ ...prev, contactName: event.target.value }))}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={form.contactEmail}
                  onChange={(event) => setForm((prev) => ({ ...prev, contactEmail: event.target.value }))}
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact phone</Label>
                <Input
                  id="contact-phone"
                  value={form.contactPhone}
                  onChange={(event) => setForm((prev) => ({ ...prev, contactPhone: event.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-message">Message for placement cell</Label>
            <Textarea
              id="company-message"
              rows={4}
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              placeholder="Share upcoming drives, hiring focus, or compliance documents you’d like reviewed."
            />
          </div>

          {renderFeedback()}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="rounded-full bg-sky-600 text-white hover:bg-sky-500"
            >
              {loading ? "Submitting..." : "Submit request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

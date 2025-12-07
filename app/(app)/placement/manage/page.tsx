"use client"

import { type ComponentType, type Dispatch, type SetStateAction, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Loader from "@/components/loader/Loader"
import { AlertCircle, Briefcase, Building2, CheckCircle2, GraduationCap, ShieldCheck, UserPlus } from "lucide-react"

type FormFields = {
  name: string
  email: string
  password: string
}

type FeedbackState = {
  status: "idle" | "success" | "error"
  message: string
}

type CompanyFormFields = {
  name: string
  description: string
  website: string
  industry: string
  type: string
  location: string
}

type EmployerFormFields = {
  name: string
  email: string
  password: string
  companyId: string
}

type CompanyOption = {
  id: string
  name: string
}

const emptyForm: FormFields = {
  name: "",
  email: "",
  password: "",
}

const companyInitialForm: CompanyFormFields = {
  name: "",
  description: "",
  website: "",
  industry: "",
  type: "",
  location: "",
}

const employerInitialForm: EmployerFormFields = {
  name: "",
  email: "",
  password: "",
  companyId: "",
}

const defaultFeedback: FeedbackState = {
  status: "idle",
  message: "",
}

const companyTypes = ["Product", "Services", "Consulting", "Startup", "Enterprise"]

export default function PlacementManagePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [studentForm, setStudentForm] = useState<FormFields>(emptyForm)
  const [facultyForm, setFacultyForm] = useState<FormFields>(emptyForm)
  const [studentLoading, setStudentLoading] = useState(false)
  const [facultyLoading, setFacultyLoading] = useState(false)
  const [studentFeedback, setStudentFeedback] = useState<FeedbackState>(defaultFeedback)
  const [facultyFeedback, setFacultyFeedback] = useState<FeedbackState>(defaultFeedback)
  const [companyForm, setCompanyForm] = useState<CompanyFormFields>(companyInitialForm)
  const [companyLoading, setCompanyLoading] = useState(false)
  const [companyFeedback, setCompanyFeedback] = useState<FeedbackState>(defaultFeedback)
  const [employerForm, setEmployerForm] = useState<EmployerFormFields>(employerInitialForm)
  const [employerLoading, setEmployerLoading] = useState(false)
  const [employerFeedback, setEmployerFeedback] = useState<FeedbackState>(defaultFeedback)
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(false)
  const [companiesError, setCompaniesError] = useState<string | null>(null)

  const isPlacementCell = session?.user?.role === "placement-cell"

  if (status === "loading") {
    return <Loader />
  }

  if (!session?.user || !isPlacementCell) {
    router.replace("/")
    return null
  }

  const fetchCompanies = async () => {
    setCompaniesLoading(true)
    setCompaniesError(null)
    try {
      const response = await axios.get("/api/placementcell/get-companies")
      const payload = Array.isArray(response.data?.companies) ? response.data.companies : []
      const mapped: CompanyOption[] = payload.map((company: { id: string; name: string }) => ({
        id: company.id,
        name: company.name,
      }))
      setCompanies(mapped)
    } catch (error) {
      console.error("Failed to fetch companies", error)
      setCompaniesError("Unable to fetch registered companies. Try refreshing.")
    } finally {
      setCompaniesLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && isPlacementCell) {
      fetchCompanies()
    }
  }, [status, isPlacementCell])

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

  const handleCompanySubmit = async () => {
    if (!companyForm.name.trim() || !companyForm.description.trim()) {
      setCompanyFeedback({
        status: "error",
        message: "Company name and description are required.",
      })
      return
    }

    setCompanyLoading(true)
    setCompanyFeedback(defaultFeedback)

    try {
      const response = await axios.post("/api/placementcell/create-company", {
        name: companyForm.name.trim(),
        description: companyForm.description.trim(),
        website: companyForm.website.trim() || null,
        industry: companyForm.industry.trim() || null,
        type: companyForm.type || null,
        location: companyForm.location.trim() || null,
      })

      setCompanyFeedback({
        status: "success",
        message: response.data?.message ?? "Company added successfully.",
      })
      setCompanyForm(companyInitialForm)
      fetchCompanies()
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Unable to add the company. Please try again."

      setCompanyFeedback({
        status: "error",
        message,
      })
    } finally {
      setCompanyLoading(false)
    }
  }

  const handleEmployerSubmit = async () => {
    if (!employerForm.name || !employerForm.email || !employerForm.password || !employerForm.companyId) {
      setEmployerFeedback({
        status: "error",
        message: "All employer fields and company selection are required.",
      })
      return
    }

    setEmployerLoading(true)
    setEmployerFeedback(defaultFeedback)

    try {
      const response = await axios.post("/api/sign-up", {
        name: employerForm.name.trim(),
        email: employerForm.email.trim(),
        password: employerForm.password,
        roll: "employer",
        companyId: employerForm.companyId,
      })

      setEmployerFeedback({
        status: "success",
        message: response.data?.message ?? "Employer account created.",
      })
      setEmployerForm(employerInitialForm)
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Unable to create the employer account. Please try again."

      setEmployerFeedback({
        status: "error",
        message,
      })
    } finally {
      setEmployerLoading(false)
    }
  }

  const renderCompanyForm = () => (
    <Card className="border-slate-200 bg-white/95 shadow-lg">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit gap-2 rounded-full bg-emerald-50 text-emerald-700">
            <Building2 className="h-4 w-4" />
            Company registry
          </Badge>
          <div>
            <CardTitle className="text-2xl text-slate-900">Add partner company</CardTitle>
            <CardDescription className="text-slate-600">
              Register a company once. Employers from the same organisation can be onboarded afterwards.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            handleCompanySubmit()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="company-name">Company name *</Label>
            <Input
              id="company-name"
              placeholder="e.g., Innotech Labs"
              value={companyForm.name}
              onChange={(event) => setCompanyForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-description">Description *</Label>
            <Textarea
              id="company-description"
              placeholder="Brief summary about the company and hiring focus."
              value={companyForm.description}
              onChange={(event) => setCompanyForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-industry">Industry</Label>
              <Input
                id="company-industry"
                placeholder="e.g., Fintech"
                value={companyForm.industry}
                onChange={(event) => setCompanyForm((prev) => ({ ...prev, industry: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-type">Company type</Label>
              <Select
                value={companyForm.type}
                onValueChange={(value) => setCompanyForm((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="company-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {companyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                placeholder="https://example.com"
                value={companyForm.website}
                onChange={(event) => setCompanyForm((prev) => ({ ...prev, website: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-location">Primary location</Label>
              <Input
                id="company-location"
                placeholder="City, Country"
                value={companyForm.location}
                onChange={(event) => setCompanyForm((prev) => ({ ...prev, location: event.target.value }))}
              />
            </div>
          </div>

          {renderFeedback(companyFeedback)}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={fetchCompanies} disabled={companiesLoading}>
              {companiesLoading ? "Refreshing..." : "Refresh list"}
            </Button>
            <Button type="submit" disabled={companyLoading} className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
              {companyLoading ? "Saving..." : "Add company"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const renderEmployerForm = () => (
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
            handleEmployerSubmit()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="employer-name">Full name</Label>
            <Input
              id="employer-name"
              placeholder="Employer's full name"
              value={employerForm.name}
              onChange={(event) => setEmployerForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employer-email">Email address</Label>
            <Input
              id="employer-email"
              placeholder="name@company.com"
              type="email"
              value={employerForm.email}
              onChange={(event) => setEmployerForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employer-password">Temporary password</Label>
            <Input
              id="employer-password"
              placeholder="Set an initial password"
              type="password"
              value={employerForm.password}
              onChange={(event) => setEmployerForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Linked company *</Label>
            <Select
              value={employerForm.companyId}
              onValueChange={(value) => setEmployerForm((prev) => ({ ...prev, companyId: value }))}
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

          {renderFeedback(employerFeedback)}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={fetchCompanies} disabled={companiesLoading}>
              {companiesLoading ? "Refreshing..." : "Refresh companies"}
            </Button>
            <Button
              type="submit"
              disabled={employerLoading || companies.length === 0}
              className="rounded-full bg-amber-500 text-white hover:bg-amber-600"
            >
              {employerLoading ? "Creating..." : "Create employer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

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

      <div className="grid gap-6 lg:grid-cols-2">
        {renderCompanyForm()}
        {renderEmployerForm()}
      </div>
    </div>
  )
}

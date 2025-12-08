"use client"

import Link from "next/link"
import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Inbox, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StudentForm } from "@/components/manage/StudentForm"
import { FacultyForm } from "@/components/manage/FacultyForm"
import { CompanyForm } from "@/components/manage/CompanyForm"
import { EmployerForm } from "@/components/manage/EmployerForm"
import { Button } from "@/components/ui/button"

interface Company {
  id: string
  name: string
}

export default function ManagePage() {
  const { data: session, status } = useSession()
  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(false)
  const [companiesError, setCompaniesError] = useState("")
  const [requestsCount, setRequestsCount] = useState(0)
  const [requestsLoading, setRequestsLoading] = useState(false)

  const fetchCompanies = useCallback(async () => {
    setCompaniesLoading(true)
    setCompaniesError("")
    try {
      const response = await fetch("/api/placementcell/get-companies")
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies || [])
      } else {
        setCompaniesError("Failed to load companies.")
      }
    } catch {
      setCompaniesError("Network error loading companies.")
    } finally {
      setCompaniesLoading(false)
    }
  }, [])

  const fetchRequestSummary = useCallback(async () => {
    setRequestsLoading(true)
    try {
      const response = await fetch("/api/placementcell/company-requests?summary=1")
      if (response.ok) {
        const data = await response.json()
        setRequestsCount(data.pendingCount ?? 0)
      }
    } finally {
      setRequestsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "placement-cell") {
      fetchCompanies()
      fetchRequestSummary()
    }
  }, [status, session, fetchCompanies, fetchRequestSummary])

  if (status === "loading") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.role !== "placement-cell") {
    redirect("/dashboard")
  }

  const handleCompaniesUpdate = (updatedCompanies: Company[]) => {
    setCompanies(updatedCompanies)
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
          <Button
            variant="outline"
            className="relative gap-2 rounded-full border-slate-200 text-slate-700 hover:bg-slate-100"
            asChild
          >
            <Link href="/manage/requests">
              <Inbox className="h-4 w-4" />
              Review company requests
              <Badge variant="secondary" className="ml-1 rounded-full bg-slate-100 text-slate-700">
                {requestsLoading ? "..." : requestsCount}
              </Badge>
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentForm />
        <FacultyForm />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CompanyForm onCompaniesUpdate={handleCompaniesUpdate} />
        <EmployerForm
          companies={companies}
          companiesLoading={companiesLoading}
          companiesError={companiesError}
          onRefreshCompanies={fetchCompanies}
        />
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { CompanyRequestForm } from "@/components/register-company/CompanyRequestForm"
import { ShieldCheck, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Register your company | National Placement Mission",
  description: "Submit your organisation details to request access to the unified placement mission portal.",
}

export default function RegisterCompanyPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-4 text-slate-800">
        <Badge variant="secondary" className="bg-sky-100 text-sky-800">
          Employer onboarding
        </Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Request access for your organisation</h1>
          <p className="text-sm text-slate-600">
            Provide your hiring details once and the placement mission team will verify, whitelist, and help you launch
            compliant internship or placement drives.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            Secure workflow
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            Guided onboarding
          </span>
        </div>
      </div>

      <CompanyRequestForm />

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">What happens next?</p>
        <ol className="mt-3 space-y-2 list-decimal pl-4">
          <li>The placement mission cell reviews your submission within 2–3 working days.</li>
          <li>You’ll receive an email response with approval or clarifications.</li>
          <li>Once approved, you can sign in with the provided credentials and begin posting opportunities.</li>
        </ol>
      </div>
    </div>
  )
}

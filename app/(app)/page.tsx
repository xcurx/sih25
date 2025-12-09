import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Building2,
  GraduationCap,
  ShieldCheck,
  Users,
  Briefcase,
  Sparkles,
  CheckCircle2,
  LineChart,
} from "lucide-react"

const heroStats = [
  { label: "Institutes onboarded", value: "280+", detail: "State & central campuses" },
  { label: "Verified employers", value: "1,200+", detail: "PSUs & private" },
  { label: "Opportunities hosted", value: "4,800+", detail: "Internships & jobs" },
]

const journeys = [
  {
    icon: GraduationCap,
    title: "Students & Alumni",
    detail: "Unified career profiles, verified records, and AI-assisted preparation.",
    bullets: ["Secure credential vault", "Skill-gap nudges", "Interview readiness"],
  },
  {
    icon: Users,
    title: "Placement Cells",
    detail: "Single workspace for drives, reporting, approvals, and employer engagement.",
    bullets: ["Drive orchestration", "Automated compliance", "Real-time alerts"],
  },
  {
    icon: Building2,
    title: "Employers",
    detail: "Policy-aligned recruitment with curated cohorts and transparent evaluation.",
    bullets: ["Smart filters", "Digital evaluations", "Offer governance"],
  },
]

const initiatives = [
  {
    title: "Mission Control",
    description: "Live dashboards that align institutions with state and national placement targets.",
  },
  {
    title: "Skill Mission Connect",
    description: "Every opportunity mapped to NSQF and apprenticeship pathways for equitable access.",
  },
  {
    title: "Integrity Lab",
    description: "Fraud checks and compliance workflows safeguard institutes and students.",
  },
]

const updates = [
  {
    date: "12 Nov 2025",
    title: "Summer Internship Calendar 2026 Released",
    detail: "Institutes can now sync official timelines and notify registered students instantly.",
  },
  {
    date: "02 Nov 2025",
    title: "48 PSUs Join Unified Portal",
    detail: "Public sector hiring drives will now operate exclusively on the national mission.",
  },
  {
    date: "29 Oct 2025",
    title: "Security Advisory: MFA Rollout",
    detail: "Mandatory multi-factor authentication for placement officers begins December 1.",
  },
]

export const metadata: Metadata = {
  title: "National Internship & Placement Mission",
  description:
    "Government portal enabling transparent internships and placements across Indian higher-education institutes.",
}

export default async function MarketingHome() {
  const session = await auth()
  if (session?.user) {
    redirect("/dashboard")
  }
  return <PublicLanding />
}

function PublicLanding() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex w-full items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Go to main landing" className="flex items-center gap-3">
            <Image
              src="/Logo_Saksham.png"
              alt="Saksham"
              width={40}
              height={40}
              priority
              className="rounded-full object-cover"
            />
            <div className="text-left">
              <p className="text-lg font-semibold leading-tight text-slate-900">Saksham</p>
              <p className="text-xs font-medium text-slate-500">National Internship & Placement Mission</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button className="inline-flex items-center gap-2 bg-sky-600 text-white leading-none hover:bg-sky-500" asChild>
              <Link href="/sign-in">
                Launch Portal
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="space-y-0">
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-50 text-slate-900">
          <div className="flex w-full flex-col items-center gap-10 px-4 py-16 text-center md:px-8">
            <div className="relative w-full max-w-5xl space-y-6">
              <Badge className="bg-sky-100 text-sky-800" variant="outline">
                Official · Secure · Student-first
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                One official gateway for internships and placements across India.
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-slate-700 lg:mx-auto">
                Digitised workflows, verified records, and transparent employer engagement keep institutes compliant
                and students protected from first application to final offer.
              </p>
              <div className="flex flex-col items-center gap-4 text-sm sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="inline-flex items-center gap-2 bg-sky-600 text-white leading-none hover:bg-sky-500"
                  asChild
                >
                  <Link href="/register-company">
                    Register your company
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-700">
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-slate-200">
                  <Sparkles className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  Central + state institutes onboarded
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-slate-200">
                  <ShieldCheck className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  Verified employers & secure offers
                </div>
              </div>
              <div className="relative w-full px-6">
                <div className="grid gap-4 bg-white/70 p-6 shadow-inner sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-center">
                      <p className="text-sm text-slate-600">{stat.label}</p>
                      <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{stat.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 px-6 text-sm text-slate-600 sm:grid-cols-3 sm:items-center sm:text-center">
                  <div className="flex items-center justify-center gap-2">
                    <LineChart className="h-4 w-4 text-sky-600" aria-hidden="true" />
                    Real-time dashboards
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="h-4 w-4 text-sky-600" aria-hidden="true" />
                    PSU + private drives
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4 text-sky-600" aria-hidden="true" />
                    Inclusive outreach
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="w-full px-6 py-14">
            <div className="mb-10 flex flex-col gap-4 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
              <div className="max-w-3xl space-y-2 lg:text-left">
                <Badge className="bg-sky-100 text-sky-800" variant="outline">
                  Aligned with mission landings
                </Badge>
                <h2 className="text-3xl font-bold text-slate-900">Purpose-built workrooms for every stakeholder</h2>
                <p className="text-base text-slate-600">
                  A blue-white surface, typography, and spacing consistent with other (landings) pages while adding the depth needed for day-to-day operations.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-600 lg:justify-end">
                <div className="flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-sky-600" aria-hidden />
                  Verified ecosystem
                </div>
                <div className="flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <Sparkles className="h-4 w-4 text-sky-600" aria-hidden />
                  Guided readiness
                </div>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {journeys.map((journey) => (
                <Card key={journey.title} className="h-full rounded-2xl border-slate-200 bg-white shadow-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-fit rounded-2xl bg-sky-50 p-3 ring-1 ring-sky-100">
                      <journey.icon className="h-6 w-6 text-sky-700" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl text-slate-900">{journey.title}</CardTitle>
                    <CardDescription className="text-slate-700">{journey.detail}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-slate-700">
                      {journey.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-sky-500" aria-hidden="true" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-gradient-to-br from-sky-50 via-white to-blue-50">
          <div className="grid w-full gap-10 px-6 py-14 lg:grid-cols-[1.2fr,1fr]">
            <div className="space-y-4 text-center lg:text-left">
              <Badge className="bg-slate-100 text-slate-700" variant="outline">
                Analytics & compliance
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900">Mission control for policy makers</h2>
              <p className="max-w-3xl text-base text-slate-700">
                Surface placement rates, drive progress, and socio-economic participation in real time with no manual compilation.
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-sky-500" aria-hidden="true" />
                  Early warning signals for institutes needing intervention.
                </li>
                <li className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-sky-500" aria-hidden="true" />
                  Employer sentiment tracking through structured feedback loops.
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-500" aria-hidden="true" />
                  Diversity observatory covering regions, gender, and categories.
                </li>
              </ul>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {initiatives.map((initiative) => (
                <Card key={initiative.title} className="h-full rounded-2xl border-slate-200 bg-white/90 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base text-slate-900">{initiative.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700">{initiative.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="updates" className="bg-white">
          <div className="w-full px-6 py-14">
            <div className="mb-10 flex flex-col gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Circulars & updates</h2>
                <p className="text-base text-slate-600">Never miss an advisory or drive notification.</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {updates.map((update) => (
                <Card key={update.title} className="h-full rounded-2xl border-slate-200 shadow-sm">
                  <CardHeader>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{update.date}</p>
                    <CardTitle className="text-xl text-slate-900">{update.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{update.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-50 text-slate-900">
          <div className="absolute inset-0 opacity-35" aria-hidden="true" style={{
            backgroundImage: "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.16) 0, rgba(255,255,255,0) 32%)",
          }} />
          <div className="flex w-full flex-col gap-6 px-6 py-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Ready to strengthen your campus-to-career pipeline?</h2>
            <p className="text-base text-slate-700">
              Bring students, administrators, and employers together with a unified, secure, and policy-aligned platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="inline-flex items-center gap-2 bg-sky-600 text-white leading-none hover:bg-sky-500"
                asChild
              >
                <Link href="/sign-in">
                  Start now
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="flex w-full flex-col gap-4 px-6 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {new Date().getFullYear()} Department of Higher Education, Government of India</p>
          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-slate-500">
            <span>Data Protection</span>
            <span>Accessibility</span>
            <span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

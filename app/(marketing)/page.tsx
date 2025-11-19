import type { Metadata } from "next"
import Link from "next/link"
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
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-sky-100 p-3">
              <ShieldCheck className="h-6 w-6 text-sky-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Gov Placement Portal</p>
              <p className="text-base font-semibold">National Internship & Placement Mission</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/resources/policy">Policy Desk</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-in">
                Launch Portal
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-white via-sky-50 to-blue-50">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 lg:flex-row lg:items-center">
            <div className="space-y-6 lg:w-3/5">
              <Badge className="bg-sky-100 text-sky-800" variant="outline">
                Transparent · Secure · Student-first
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 lg:text-5xl">
                One official gateway for internships and placements across India.
              </h1>
              <p className="text-lg text-slate-600">
                The mission digitises every workflow—from employer onboarding to final offer—so institutes can deliver
                equitable opportunities with speed and accountability.
              </p>
              <div className="flex flex-col gap-4 text-sm sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/sign-in">
                    Access Portal
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#updates">View Latest Advisory</Link>
                </Button>
              </div>
            </div>
            <div className="grid flex-1 gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Mission metrics</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.detail}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden="true" />
                Trusted by central, state, and autonomous institutes nationwide.
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Purpose-built for every stakeholder</h2>
            <p className="mt-3 text-base text-slate-600">
              Consistent blue-white experience keeps students, placement teams, and employers aligned.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {journeys.map((journey) => (
              <Card key={journey.title} className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="rounded-2xl bg-sky-50 p-3 w-fit">
                    <journey.icon className="h-6 w-6 text-sky-600" aria-hidden="true" />
                  </div>
                  <CardTitle>{journey.title}</CardTitle>
                  <CardDescription>{journey.detail}</CardDescription>
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
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2">
            <div className="space-y-4">
              <Badge className="bg-slate-100 text-slate-700" variant="outline">
                Analytics & compliance
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900">Mission control for policy makers</h2>
              <p className="text-base text-slate-600">
                Surface placement rates, drive progress, and socio-economic participation in real time with no manual
                compilation.
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
                <Card key={initiative.title} className="border-slate-200 bg-slate-50">
                  <CardHeader>
                    <CardTitle className="text-base">{initiative.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{initiative.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="updates" className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Circulars & updates</h2>
              <p className="text-base text-slate-600">Never miss an advisory or drive notification.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/resources">Browse resource library</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {updates.map((update) => (
              <Card key={update.title} className="border-slate-200 shadow-sm">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{update.date}</p>
                  <CardTitle className="text-xl">{update.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{update.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-gradient-to-br from-sky-100 via-white to-blue-50">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Ready to strengthen your campus-to-career pipeline?</h2>
            <p className="text-base text-slate-600">
              Bring students, administrators, and employers together with a unified, secure, and policy-aligned platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/sign-in">
                  Start now
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-in">Request guided onboarding</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex flex-col gap-4 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
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

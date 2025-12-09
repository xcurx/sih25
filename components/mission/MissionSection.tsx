"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Sparkles, ShieldCheck, BookOpen } from "lucide-react";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/70 bg-white p-4 shadow-sm min-h-[88px]">
      <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="rounded-2xl border border-white/60 bg-white/95 text-center shadow-sm">
      <CardHeader className="flex flex-col items-center gap-3">
        <div className="rounded-md bg-sky-50 p-2">
          <Icon className="h-5 w-5 text-sky-600" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
          <CardDescription className="text-sm text-slate-600">{desc}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <span className="text-sm font-medium text-slate-900">{q}</span>
        <span className="text-sm text-slate-500">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-3 text-sm text-slate-700">{a}</div>}
    </div>
  );
}

export default function MissionSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setEmail(""), 500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto min-h-[calc(100vh-140px)] max-w-7xl px-4 py-12">
        <div className="space-y-8">
          <section>
            <div className="relative overflow-visible rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 text-slate-900 shadow-2xl">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, rgba(14,165,233,0.12) 1px, transparent 0)",
                  backgroundSize: "36px 36px",
                }}
                aria-hidden
              />
              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-sky-100 p-2">
                    <ShieldCheck className="h-5 w-5 text-sky-600" />
                  </span>
                  <Badge className="bg-sky-100 text-sky-800">Platform mission</Badge>
                </div>

                <h1 className="max-w-4xl text-[clamp(2.2rem,3vw,3rem)] font-semibold leading-tight tracking-tight text-slate-900">
                  National Internship & Placement Mission — fair access, verified outcomes, measurable impact
                </h1>

                <p className="max-w-3xl text-[clamp(1rem,1.3vw,1.05rem)] text-slate-700">
                  We connect verified employers, institutes, and students on a single, secure platform with structured roles, audited workflows, and readiness programs.
                </p>

                <div className="flex flex-wrap justify-center gap-3 text-sm">
                  <Link href="/institutes/onboard" className="inline-block">
                    <Button className="rounded-full bg-sky-600 px-5 py-2 text-white shadow-sm hover:bg-sky-500">Onboard an institute</Button>
                  </Link>

                  <Link href="/employers" className="inline-block">
                    <Button variant="outline" className="rounded-full border-sky-200 px-5 py-2 text-sky-700">Hire through the mission</Button>
                  </Link>
                </div>

                <Link href="/resources#policy" className="text-sm text-slate-600 hover:text-slate-900">
                  Read policy & compliance
                </Link>

                <div className="mt-6 grid w-full max-w-4xl gap-3 sm:grid-cols-3">
                  <Stat label="Institutions onboarded" value="280+" />
                  <Stat label="Opportunities listed" value="4,800+" />
                  <Stat label="Students supported" value="1.8L+" />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Platform snapshot</p>
              <div className="mt-4 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Inclusive reach</p>
                    <p className="text-xs text-slate-600">Students from urban and remote institutes with verified profiles.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Smart discovery</p>
                    <p className="text-xs text-slate-600">AI nudges, readiness signals, and filtered shortlists for recruiters.</p>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 sm:col-span-2">
                  <p className="font-semibold text-slate-900">Helpline</p>
                  <p>+91 011 4000 1122 · support@placement.gov.in</p>
                  <p className="pt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">Mon–Sat · 9:00 — 18:00</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Get mission updates</p>
              <div className="mt-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Monthly brief</p>
                <p className="text-xs text-slate-600">Policy changes, new hiring partners, and product rollout notes in one email.</p>
              </div>
              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-3">
                <div className="space-y-2 text-left">
                  <Label htmlFor="subscribe-email" className="text-xs text-slate-600">Work email</Label>
                  <Input
                    id="subscribe-email"
                    placeholder="name@institute.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Subscribe email"
                  />
                </div>
                <div className="space-y-2 text-left text-xs text-slate-600">
                  <p>What you get: rollout alerts, compliance updates, and quarterly metrics.</p>
                  <p>No spam. Unsubscribe anytime.</p>
                </div>
                <Button type="submit" className="rounded-full bg-sky-600 px-4 py-2 text-white">{subscribed ? "Subscribed" : "Subscribe"}</Button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Core pillars</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">What we optimise for — fairness, trust, and skills.</p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <FeatureCard icon={Users} title="Inclusive access" desc="One feed of verified, role-based opportunities for all students across regions." />
            <FeatureCard icon={ShieldCheck} title="Trusted & secure" desc="Minimal attribute sharing, role-based access and auditable recruitment flows." />
            <FeatureCard icon={BookOpen} title="Skills & readiness" desc="Micro-certifications, mock interviews and profile-strength tools that increase employability." />
          </div>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          <Card className="rounded-2xl border border-white/60 bg-white/95 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Programs & initiatives</CardTitle>
              <CardDescription className="text-sm text-slate-600">Concrete initiatives to increase readiness & adoption</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm text-slate-700">
                <li><strong>Campus Ambassador Program:</strong> Local ambassadors accelerate adoption and training at institutes.</li>
                <li><strong>Employer Fellowship:</strong> Curated employer cohorts run focused hiring windows and mentorship drives.</li>
                <li><strong>Micro-cert diplomas:</strong> Short verified courses that make students discoverable for role-specific hiring.</li>
                <li><strong>Placement Ops Playbook:</strong> Templates for JD intake, interview rubrics, and offer rollouts.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-white/60 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Roadmap</CardTitle>
              <CardDescription className="text-sm text-slate-600">Planned milestones for the next 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-700">
                <li><strong>Q1:</strong> Onboard 500 institutes; regional language support.</li>
                <li><strong>Q2:</strong> Employer API & analytics for placement cells.</li>
                <li><strong>Q3:</strong> Integrate micro-cert badges & verified transcripts.</li>
                <li><strong>Q4:</strong> Scale outreach & institutional KPI dashboards.</li>
              </ol>
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-white/60 bg-white/95 p-6 shadow-sm lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 text-center">Quick resources</p>
            <div className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <Link href="/resources#onboard" className="rounded-lg border border-slate-100 bg-white p-3 text-left hover:text-slate-900">Institute onboarding guide</Link>
              <Link href="/resources#api" className="rounded-lg border border-slate-100 bg-white p-3 text-left hover:text-slate-900">Employer API docs</Link>
              <Link href="/resources#policy" className="rounded-lg border border-slate-100 bg-white p-3 text-left hover:text-slate-900">Policy & compliance</Link>
            </div>
          </div>
        </div>

        <div className="mb-12 text-center">
          <h3 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h3>
          <p className="mt-2 text-sm text-slate-600">Short answers to common questions about onboarding, data, and operations.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FAQItem q="Who can request institute onboarding?" a="Authorized placement officers or institute admins may request onboarding. Verification documents are required." />
            <FAQItem q="How is student data shared with employers?" a="Only minimal attributes required for recruitment are shared. Role-based access controls and audit logs ensure traceability." />
            <FAQItem q="What are micro-certifications?" a="Short, assessed courses that issue verifiable badges to make students discoverable for role specific hiring." />
            <FAQItem q="How do employers bulk-post roles?" a="Employers use the Employer API for bulk posting; contact support for API onboarding." />
          </div>
        </div>

        <div className="mb-16 rounded-2xl border border-white/60 bg-white/95 p-8 text-center shadow-sm">
          <h4 className="text-xl font-semibold text-slate-900">Join the mission</h4>
          <p className="mt-2 text-sm text-slate-600">Institutes, employers and students — get started today. For integrations and onboarding, reach out to our mission desk.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/institutes/onboard"><Button className="rounded-full bg-sky-600 text-white">Onboard an institute</Button></Link>
            <Link href="/employers"><Button variant="outline" className="rounded-full border-sky-200 text-sky-700">Offer opportunities</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

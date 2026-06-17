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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm min-h-[88px]">
      <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
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
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Work email is required");
      return;
    }
    console.log({ email, source: "mission-updates" });
    setSubscribed(true);
    setError("");
    setTimeout(() => setEmail(""), 500);
  };

  return (
    <div className="min-h-screen  text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="space-y-12">
          <section className="p-0">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center rounded-full bg-sky-100 p-2">
                  <ShieldCheck className="h-5 w-5 text-sky-600" />
                </span>
                <Badge className="bg-sky-100 text-sky-800" variant="outline">Platform mission</Badge>
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                National Internship & Placement Mission — fair access, verified outcomes, measurable impact
              </h1>

              <p className="max-w-3xl text-base text-slate-700 lg:text-lg">
                We connect verified employers, institutes, and students on a single, secure platform with structured roles, audited workflows, and readiness programs.
              </p>

              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <Button asChild className="rounded-full bg-sky-600 px-5 py-2 text-white hover:bg-sky-500">
                  <Link href="/institutes/onboard">Onboard an institute</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-slate-200 px-5 py-2 text-slate-900 hover:border-sky-200 hover:text-sky-700">
                  <Link href="/employers">Hire through the mission</Link>
                </Button>
              </div>

              <Link href="/resources#policy" className="text-sm text-slate-600 hover:text-slate-900">
                Read policy & compliance
              </Link>

              <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
                <Stat label="Institutions onboarded" value="280+" />
                <Stat label="Opportunities listed" value="4,800+" />
                <Stat label="Students supported" value="1.8L+" />
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Platform snapshot</p>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
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
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 sm:col-span-2">
                  <p className="font-semibold text-slate-900">Helpline</p>
                  <p>+91 011 4000 1122 · support@placement.gov.in</p>
                  <p className="pt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">Mon–Sat · 9:00 — 18:00</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Get mission updates</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">Monthly brief</p>
                  <p className="text-xs text-slate-600">Policy changes, new hiring partners, and product rollout notes in one email.</p>
                </div>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="subscribe-email" className="text-xs text-slate-600">Work email</Label>
                    <Input
                      id="subscribe-email"
                      placeholder="name@institute.edu.in"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      aria-label="Subscribe email"
                      aria-invalid={!!error}
                    />
                    {error && <p className="text-xs text-amber-700">{error}</p>}
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p>What you get: rollout alerts, compliance updates, and quarterly metrics.</p>
                    <p>No spam. Unsubscribe anytime.</p>
                  </div>
                  <Button type="submit" className="rounded-full bg-sky-600 px-4 py-2 text-white hover:bg-sky-500">{subscribed ? "Subscribed" : "Subscribe"}</Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Our Solution</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">An integrated platform powered by Unified Roles, Blockchain Trust, and AI Intelligence.</p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <FeatureCard 
              icon={Users} 
              title="Centralized Role-Based Portal" 
              desc="Students, mentors, placement cells, and employers on one platform. Features single digital profiles, one-click apply, calendar-safe scheduling, and real-time conversion dashboards." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Blockchain-Verified Trust" 
              desc="Certificates and feedback are hashed on a permissioned blockchain (tamper-proof & QR-verifiable). Sensitive data stays off-chain ensuring authenticity and privacy." 
            />
            <FeatureCard 
              icon={Sparkles} 
              title="AI & Hybrid Recommendation" 
              desc="Matching via XGBoost + Random Forest & Collaborative Filtering. Includes adaptive learning, smart notifications (RL), and SHAP-based fairness insights for unbiased choices." 
            />
          </div>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
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

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
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

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
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

        <div className="mb-16 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  Globe,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm min-h-[88px]">
      <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function Benefit({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
      <CardHeader className="flex items-start gap-4 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sky-50">
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

function FAQRow({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="text-sm font-medium text-slate-900">{q}</div>
        <div className="text-sm text-slate-500">{open ? "−" : "+"}</div>
      </button>
      {open && <div className="mt-3 text-sm text-slate-700">{a}</div>}
    </div>
  );
}

export default function InstituteSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [ratingHover, setRatingHover] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Work email is required");
      return;
    }
    console.log({ email, source: "institutes-updates" });
    setSubscribed(true);
    setError("");
    setTimeout(() => setEmail(""), 500);
  };

  return (
    <section id="institutes" className="py-6 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center gap-5">
              <div className="rounded-full bg-sky-100 p-3">
                <Building2 className="h-6 w-6 text-sky-600" />
              </div>
              <Badge className="bg-sky-100 text-sky-800" variant="outline">
                For institutes
              </Badge>

              <h2 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-900 lg:text-5xl">
                Empower placement cells — secure, auditable, outcomes-focused
              </h2>

              <p className="max-w-3xl text-base text-slate-700 lg:text-lg">
                Manage student rosters, coordinate employer engagements, and measure placement outcomes — all on one national platform designed for institutional reliability and governance.
              </p>

              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <Button asChild className="rounded-full bg-sky-600 px-5 py-2 text-white hover:bg-sky-500">
                  <Link href="/institutes/onboard">Request onboarding</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-slate-200 px-5 py-2 text-slate-900 hover:border-sky-200 hover:text-sky-700">
                  <Link href="/resources#onboard">Onboarding guide</Link>
                </Button>
              </div>

              <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
                <Stat label="Institutes onboarded" value="280+" />
                <Stat label="Placement campaigns" value="1,200+" />
                <Stat label="Average placement uplift" value="+18%" />
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="grid gap-4 sm:grid-cols-2 sm:text-center">
              <div className="mx-auto max-w-sm space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Why institutes choose us</p>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-sky-600" />
                    <span>Data governance & audit trails</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <BarChart3 className="h-4 w-4 text-sky-600" />
                    <span>Actionable placement analytics</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-sky-600" />
                    <span>Structured, verified rosters</span>
                  </li>
                </ul>
              </div>

              <div className="mx-auto max-w-xs rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Need help?</p>
                <p className="mt-2 text-slate-900">Mon–Fri, 09:00 — 18:00</p>
                <p className="mt-3 flex items-center justify-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-sky-600" /> +91 011 4000 1122
                </p>
                <p className="mt-2 flex items-center justify-center gap-2 text-slate-700">
                  <Mail className="h-4 w-4 text-sky-600" /> placements@nation.org
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mb-10 text-center">
          <br></br>
          <h3 className="text-2xl font-semibold text-slate-900">Benefits for institutes</h3>
          <p className="mt-2 text-sm text-slate-600">Designed for governance, speed, and measurable outcomes.</p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Benefit
              icon={Users}
              title="Centralised student management"
              desc="Verified rosters, role-based access, and delegated permissions keep campus ops auditable."
            />
            <Benefit
              icon={BarChart3}
              title="Data-first analytics"
              desc="Dashboards, funnels, and KPIs give officers clarity instead of guesswork."
            />
            <Benefit
              icon={CheckCircle}
              title="Employer trust & compliance"
              desc="Structured postings with eligibility filters reduce noise and lift show-rates."
            />
          </div>
        </div>

        <div className="mb-8 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Success stories</CardTitle>
                <CardDescription className="text-sm text-slate-600">How institutes improved placements using the mission.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5 text-sm text-slate-700">
                  <div className="space-y-1">
                    <p className="font-semibold">Govt. Polytechnic — Ahmedabad</p>
                    <p>Onboarded in 6 weeks; 40% uplift in role matches due to structured eligibility and skill-badges.</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold">City Engineering College</p>
                    <p>Reduced manual shortlisting by 70% using profile-strength scoring and mock-interview funnels.</p>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-slate-600">Institute rating</p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => {
                          const active = ratingHover !== null ? s <= ratingHover : s <= 5;
                          return (
                            <Star
                              key={s}
                              onMouseEnter={() => setRatingHover(s)}
                              onMouseLeave={() => setRatingHover(null)}
                              className={`h-5 w-5 ${active ? "text-amber-500" : "text-slate-300"}`}
                            />
                          );
                        })}
                      </div>
                      <div className="text-sm text-slate-600">4.6 (based on institutional feedback)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Programmes for institutes</CardTitle>
                <CardDescription className="text-sm text-slate-600">Training, onboarding, and data governance support packages.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li><strong>Placement officer training:</strong> Workshops & SOPs for campus teams.</li>
                  <li><strong>Rosters & verification:</strong> Secure roster ingestion pipelines for large cohorts.</li>
                  <li><strong>Data audits:</strong> Periodic privacy & access reviews to maintain compliance.</li>
                  <li><strong>Outreach playbooks:</strong> Templates for employer collaboration and JD intake.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Quick facts</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p><strong>Verification:</strong> Institute authority verified</p>
                <p><strong>Auditability:</strong> Full logs for approvals & shortlists</p>
                <p><strong>Privacy:</strong> Minimal attribute sharing by default</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Need help?</p>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p className="font-semibold">placements@nation.org</p>
                <p className="text-xs text-slate-600">+91 011 4000 1122</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h3 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h3>
          <p className="mt-2 text-sm text-slate-600">Questions institutes commonly ask about onboarding, data, and employer engagement.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FAQRow q="How long does onboarding take?" a="Typical onboarding (verification + roster ingestion) takes 3–6 weeks depending on document readiness." />
            <FAQRow q="What data do institutes share?" a="Only minimal attributes required for recruitment are shared by default; full roster data is only accessible to authorized recruiters with institute consent." />
            <FAQRow q="Can we restrict employers?" a="Yes — placement cells can whitelist/pause employer access and manage application flows centrally." />
            <FAQRow q="What support is available?" a="Onboarding managers, technical integration docs and live helpdesk support are available for all verified institutes." />
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h4 className="text-xl font-semibold text-slate-900">Ready to onboard your institute?</h4>
          <p className="mt-2 text-sm text-slate-600">Request an onboarding call and a tailored integration plan for rosters & reports.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/institutes/onboard"><Button className="rounded-full bg-sky-600 text-white">Request onboarding</Button></Link>
            <Link href="/resources#onboard"><Button variant="outline" className="rounded-full border-sky-200 text-sky-700">Read onboarding docs</Button></Link>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-slate-700">Get monthly institute operations updates</p>
          <form onSubmit={handleSubscribe} className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              id="inst-sub-email"
              placeholder="name@institute.edu.in"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={!!error}
            />
            <Button type="submit" className="rounded-full bg-sky-600 text-white hover:bg-sky-500">{subscribed ? "Subscribed" : "Subscribe"}</Button>
          </form>
          {error && <p className="mt-2 text-xs text-amber-700">{error}</p>}
          {subscribed && <p className="mt-2 text-xs text-sky-700">Thanks — we will send the next update to your inbox.</p>}
        </div>
      
    </section>
  );
}

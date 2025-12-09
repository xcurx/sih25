"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Building2,
  CheckCircle,
  Users,
  ShieldCheck,
  BarChart3,
  Briefcase,
  Sparkles,
  Target,
  Clock,
  Mail,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-5 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
      <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</dt>
      <dd className="mt-2 text-[clamp(1.6rem,2.5vw,2rem)] font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <Card className="rounded-2xl border border-white/60 bg-white/95 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-col items-center gap-3">
        <div className="rounded-lg bg-sky-50 p-2">
          <Icon className="h-6 w-6 text-sky-600" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
          <CardDescription className="text-[clamp(0.9rem,1.2vw,1rem)] text-slate-600">{desc}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

function FAQRow({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between text-left"
      >
        <span className="text-sm font-medium text-slate-900">{q}</span>
        <span className="text-slate-500">{open ? "−" : "+"}</span>
      </button>

      {open && <p className="mt-3 text-sm text-slate-700">{a}</p>}
    </div>
  );
}

export default function EmployerSection() {
  return (
    <section id="employers" className="mx-auto max-w-7xl px-4">
      <div className="mb-12 grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-stretch">
        <div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50 to-blue-50 p-10 text-center shadow-2xl"
          aria-hidden={false}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(14,165,233,0.14) 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="rounded-full bg-sky-100 p-3">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>

            <Badge className="bg-sky-100 text-sky-800" variant="outline">
              Employer Partnership Program
            </Badge>

            <h1 className="max-w-4xl text-[clamp(2.2rem,3vw,3.2rem)] font-semibold leading-tight tracking-tight text-slate-900">
              Hire industry-ready talent with a secure, structured national platform.
            </h1>

            <p className="max-w-3xl text-[clamp(1rem,1.4vw,1.1rem)] text-slate-700">
              Access verified student pools, skill-tagged profiles, interview-ready candidates, and structured hiring workflows built for HR teams, recruitment drives, and large-scale talent acquisition.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/employers/register">
                <Button className="rounded-full bg-sky-600 text-white shadow-md transition-transform duration-300 hover:-translate-y-[2px] hover:bg-sky-500">
                  Register as employer
                </Button>
              </Link>

              <Link href="/resources#employer-api">
                <Button variant="outline" className="rounded-full border-sky-200 text-sky-700 shadow-sm transition-transform duration-300 hover:-translate-y-[2px]">
                  Explore Employer API
                </Button>
              </Link>
            </div>

            <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
              <Stat label="Verified Institutes" value="280+" />
              <Stat label="Active Employer Partners" value="950+" />
              <Stat label="Annual Hiring Drives" value="1,200+" />
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/60 bg-white/95 p-6 text-center shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="grid gap-4 sm:grid-cols-2 sm:text-center">
            <div className="mx-auto max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                Why employers choose us
              </p>

              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-4 w-4 text-sky-600" />
                  <span>Verified student identity & academic history</span>
                </li>
                <li className="flex items-center justify-center gap-3">
                  <Sparkles className="h-4 w-4 text-sky-600" />
                  <span>AI-driven candidate recommendations</span>
                </li>
                <li className="flex items-center justify-center gap-3">
                  <BarChart3 className="h-4 w-4 text-sky-600" />
                  <span>Detailed hiring analytics & reporting</span>
                </li>
              </ul>
            </div>

            <div className="mx-auto max-w-xs rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Need help?</p>
              <p className="mt-2 text-slate-900">Mon–Sat, 9:00 — 18:00</p>
              <p className="mt-3 flex items-center justify-center gap-2 text-slate-700">
                <Phone className="h-4 w-4 text-sky-600" /> +91 011 4000 1122
              </p>
              <p className="mt-2 flex items-center justify-center gap-2 text-slate-700">
                <Mail className="h-4 w-4 text-sky-600" /> support@placement.gov.in
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mb-12 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Built for modern hiring teams</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          Tools and workflows designed to reduce hiring time, increase match accuracy,
          and provide audit-friendly documentation for institutional partnerships.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Benefit
            icon={Briefcase}
            title="Access to skill-tagged talent"
            desc="Discover candidates with verified competencies, certifications, and academic backgrounds."
          />

          <Benefit
            icon={Target}
            title="AI-recommended matching"
            desc="Get smart recommendations based on your JD, hiring history, and required competencies."
          />

          <Benefit
            icon={ShieldCheck}
            title="Secure & compliant"
            desc="Minimally shared data, role-based access, ISO-compliant flows, and fully auditable actions."
          />
        </div>
      </div>

      <div className="mb-12 grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border border-white/60 bg-white/90 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              How hiring works on the mission platform
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              A simple, structured pipeline from job posting to selection.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 text-sm text-slate-700 sm:grid-cols-[1.6fr,1fr]">
            <div className="space-y-3">
              <p><strong>1. Register & verify:</strong> Employers complete KYC verification and get access to recruitment tools.</p>
              <p><strong>2. Post opportunities:</strong> Use structured fields for eligibility, skills, salary, location, etc.</p>
              <p><strong>3. Discover candidates:</strong> Search, filter, and shortlist using smart AI recommendations.</p>
              <p><strong>4. Manage applications:</strong> Track applications, schedule interviews, and record feedback.</p>
              <p><strong>5. Final selection:</strong> Issue offers, track acceptance, and access analytics for hiring cycles.</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 text-center text-sm text-slate-700 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Service window</p>
              <p className="mt-2 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-sky-600" /> Mon–Sat · 9:00 — 18:00 IST
              </p>
              <p className="mt-2 flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-600" /> Data minimization & audit logs
              </p>
              <p className="mt-2 flex items-center justify-center gap-2">
                <Users className="h-4 w-4 text-sky-600" /> Dedicated success desk for drives
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between rounded-2xl border border-white/60 bg-white/90 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Employer programs</CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Dedicated initiatives to support hiring at scale.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-slate-700">
            <p><strong>Campus Hiring Program:</strong> Coordinate multi-institute drives with automation.</p>
            <p><strong>Startup Hiring Track:</strong> Support for startups seeking interns or entry-level talent.</p>
            <p><strong>Women-in-Tech Fellowship:</strong> Programs to onboard and hire women candidates in STEM.</p>
            <p><strong>Executive Outreach Desk:</strong> One-stop support for enterprise offers, NDAs, and SLA-bound timelines.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16 text-center">
        <h3 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          Answers to common questions from employers regarding hiring, data protection, and workflow.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FAQRow
            q="How are candidates verified?"
            a="Student identities and academics are verified through institute administrators before profiles become accessible."
          />

          <FAQRow
            q="Can employers run multi-institute hiring drives?"
            a="Yes, the platform supports scheduling, slot booking, and analytics for large-scale drives."
          />

          <FAQRow
            q="Is salary information confidential?"
            a="Yes. Salary and role details are securely stored and visible only to authorized candidates."
          />

          <FAQRow
            q="Do you support API-based integrations?"
            a="Yes, our Employer API allows automated job posting, status syncing, and applicant tracking."
          />
        </div>
      </div>

      <div className="mb-12">
        <Card className="grid gap-6 rounded-2xl border border-white/60 bg-white/90 p-8 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-center text-center">
            <h4 className="text-xl font-semibold text-slate-900">Ready to hire with transparency and precision?</h4>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Join leading employers hiring through the National Internship & Placement Mission.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/employers/register">
                <Button className="rounded-full bg-sky-600 text-white shadow-sm transition-transform duration-300 hover:-translate-y-[2px]">Register now</Button>
              </Link>

              <Link href="/resources#employer-api">
                <Button variant="outline" className="rounded-full border-sky-200 text-sky-700 shadow-sm transition-transform duration-300 hover:-translate-y-[2px]">
                  View API documentation
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-700 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Quick assistance</p>
            <div className="mt-3 space-y-2">
              <p className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-sky-600" /> +91 011 4000 1122
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-sky-600" /> employer-support@placement.gov.in
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-sky-600" /> Mon–Sat, 9:00 — 18:00
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Building2,
  FileText,
  ShieldCheck,
  CloudDownload,
  HelpCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function ResourceCard({ icon: Icon, title, desc, link }: { icon: any; title: string; desc: string; link: string }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm hover:shadow-md transition">
      <CardHeader className="flex items-start gap-3">
        <div className="rounded-lg bg-sky-100 p-2">
          <Icon className="h-5 w-5 text-sky-700" />
        </div>
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
          <CardDescription className="text-sm text-slate-600">{desc}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={link} className="text-sm font-medium text-sky-700 hover:underline flex items-center gap-1">
          View resource <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <button onClick={() => setOpen(!open)} className="flex w-full justify-between text-left">
        <span className="text-sm font-semibold text-slate-900">{q}</span>
        <span className="text-slate-500">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-sm text-slate-700">{a}</p>}
    </div>
  );
}

export default function ResourcesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        {/* HERO */}
        <div className="rounded-3xl bg-gradient-to-br from-white via-sky-50 to-blue-50 p-10 shadow-2xl">
          <Badge className="bg-sky-100 text-sky-700" variant="outline">
            Resources hub
          </Badge>

          <h1 className="mt-4 text-4xl font-bold text-slate-900 max-w-3xl leading-tight">
            Your official hub for guides, documentation, policy updates & onboarding materials.
          </h1>

          <p className="mt-4 text-lg text-slate-700 max-w-2xl">
            Whether you're a student, institute, or employer, these curated resources help you onboard, operate, and
            collaborate more effectively on the national placement mission.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="rounded-full bg-sky-600">Explore documentation</Button>
            <Button variant="outline" className="rounded-full border-sky-300 text-sky-700">
              Download starter pack
            </Button>
          </div>
        </div>

        {/* RESOURCE GRID */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <ResourceCard
            icon={GraduationCap}
            title="Student success toolkit"
            desc="Guides for resumes, mock interviews, application strategy and verified micro-certification."
            link="/resources/students"
          />

          <ResourceCard
            icon={Building2}
            title="Institute operations manual"
            desc="Training for placement cells, roster uploads, campus drive workflows, and audits."
            link="/resources/institutes"
          />

          <ResourceCard
            icon={BookOpen}
            title="Employer API + docs"
            desc="Bulk posting APIs, eligibility filters, hiring windows, analytics integration."
            link="/resources/employers"
          />

          <ResourceCard
            icon={ShieldCheck}
            title="Policy & compliance"
            desc="National standards, privacy rules, audit trails, verification protocols."
            link="/resources/policy"
          />

          <ResourceCard
            icon={FileText}
            title="Forms & templates"
            desc="Official templates for institute verification, employer onboarding, campus MOU."
            link="/resources/forms"
          />

          <ResourceCard
            icon={CloudDownload}
            title="Download center"
            desc="Brand kit, posters, training decks, communication templates for institutions."
            link="/resources/downloads"
          />
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
          <p className="text-sm text-slate-600 max-w-xl mt-2">
            Quick answers to common operational, onboarding and data-handling questions.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FAQItem
              q="How do institutes get verified?"
              a="Institutes must upload authorization documents from official authorities. Verification is completed in 24–48 hours."
            />
            <FAQItem
              q="Are student details shared with employers?"
              a="Only minimal attributes required for hiring are shared. All actions are audit-logged and role-secured."
            />
            <FAQItem
              q="Can employers integrate via API?"
              a="Yes. Employers can request API access keys and follow the standard posting endpoints for bulk roles."
            />
            <FAQItem
              q="Where can I download onboarding materials?"
              a="The download center includes posters, training decks, and brand kit files for institutes."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">
            Need help finding the right resource?
          </h3>
          <p className="mt-2 text-sm text-slate-600">Our support team is available to guide institutes, employers and students.</p>

          <div className="mt-4 flex justify-center gap-3">
            <Button className="rounded-full bg-sky-600">Contact support</Button>
            <Button variant="outline" className="rounded-full border-sky-300 text-sky-700">
              Visit help center
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

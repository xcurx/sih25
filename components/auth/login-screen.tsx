"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building2, Globe, GraduationCap, Loader2, Mail, Phone, Shield, ShieldCheck, Sparkles, Type } from "lucide-react"
import LandingHeader from "../layout/LandingHeader"
import Footer from "../layout/Footer"

const roleOptions = [
  { value: "student", label: "Student / Alumnus" },
  { value: "faculty", label: "Faculty / Coordinator" },
  { value: "placement-cell", label: "Placement Cell" },
  { value: "employer", label: "Recruiter / Employer" },
]

const stats = [
  { label: "Institutions Onboarded", value: "280+" },
  { label: "Opportunities Listed", value: "4,800+" },
  { label: "Students Supported", value: "1.8L+" },
]

const contactChannels = [
  { icon: Phone, label: "Helpline", value: "+91 011 4000 1122" },
  { icon: Mail, label: "Official Support", value: "support@placement.gov.in" },
]

export function LoginScreen() {
  const router = useRouter()
  const search = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fontScale, setFontScale] = useState(1)
  const [isReading, setIsReading] = useState(false)
  const [accessibilityMessage, setAccessibilityMessage] = useState<string | null>(null)

  const urlError = useMemo(() => {
    const err = search.get("error")
    if (!err) return null
    if (err === "CredentialsSignin") {
      return "Invalid credentials. Please verify your details and try again."
    }
    return "We were unable to sign you in. Please try once more."
  }, [search])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!selectedRole) {
      setFormError("Please choose an appropriate role to proceed.")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        role: selectedRole,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.error) {
        setFormError("Please check your credentials and chosen role.")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      setFormError("Unexpected error. Kindly retry in a moment.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleScreenReaderNarration = () => {
    if (typeof window === "undefined") return
    const summaryText =
      "Official Government of India placement mission portal. Sign in with your institute credentials, choose your role, and access dashboards securely."

    if (!("speechSynthesis" in window)) {
      setAccessibilityMessage("Screen reader assistance is unavailable in this browser.")
      return
    }

    window.speechSynthesis.cancel()
    setIsReading(true)
    const utterance = new SpeechSynthesisUtterance(summaryText)
    utterance.onend = () => setIsReading(false)
    utterance.onerror = () => {
      setIsReading(false)
      setAccessibilityMessage("Unable to start narration. Please check browser permissions.")
    }
    window.speechSynthesis.speak(utterance)
    setAccessibilityMessage("Narrating page overview.")
  }

  const adjustFontScale = (delta: number) => {
    setFontScale((prev) => {
      const next = Math.min(1.2, Math.max(0.9, parseFloat((prev + delta).toFixed(2))))
      setAccessibilityMessage(`Font size set to ${Math.round(next * 100)} percent`)
      return next
    })
  }

  const resetFontScale = () => {
    setFontScale(1)
    setAccessibilityMessage("Font size reset to default")
  }

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontSize: `${fontScale}rem` }}>
      
      <LandingHeader />

      <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl flex-col px-4 py-12 lg:flex-row lg:items-start lg:gap-10">
        <section className="relative mb-10 flex-1 overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 text-slate-900 shadow-2xl lg:mb-0" id="main-content">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(14,165,233,0.25) 1px, transparent 0)", backgroundSize: "40px 40px" }}
          />
          <div className="relative flex h-full flex-col gap-6">
            <Badge className="bg-sky-100 text-sky-800" variant="outline">
              Digital Campus Enablement
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              One secure window for internships, placements, and employer partnerships.
            </h1>
            <p className="max-w-xl text-base text-slate-600">
              The official mission platform keeps every student opportunity traceable, transparent, and aligned with national skilling priorities.
            </p>

            <div className="grid gap-4 rounded-2xl border border-white/50 bg-white/80 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
                Platform Commitments
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  ISO 27001 aligned data security standards
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  Unified reporting for institutes, states, and employers
                </li>
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  Student-centric dashboards & credentialed access
                </li>
              </ul>
            </div>

            <dl className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 p-4 text-center shadow-sm">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</dt>
                  <dd className="text-2xl font-semibold text-slate-900">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <div className="grid gap-3 rounded-2xl border border-white/60 bg-white/80 p-5 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Operational safeguards</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <Shield className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  Role-based access
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <Globe className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  24x7 availability
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <Sparkles className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  Accessibility-ready
                </div>
              </div>
            </div>

            <div className="mt-auto grid gap-3 rounded-2xl border border-white/60 bg-white/80 p-5 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Service status & support</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Uptime</p>
                  <p className="text-sm font-semibold text-slate-800">99.4% last 30 days</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Support window</p>
                  <p className="text-sm font-semibold text-slate-800">Mon–Sat · 9:00–18:00</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">Data residency: India</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Encrypted at rest</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">24x7 monitoring</span>
              </div>
            </div>
          </div>
        </section>

        <section className="order-1 w-full lg:order-2 lg:self-stretch lg:flex-1">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 px-6 py-8 shadow-[0_30px_90px_rgba(15,23,42,0.15)] sm:px-7 sm:py-9 lg:px-8 lg:py-10">
            <div className="pointer-events-none absolute -top-14 -right-16 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-6 h-24 w-24 rounded-full bg-cyan-100/60 blur-2xl" />
            <div className="relative flex h-full flex-col space-y-8">
              <div className="space-y-3">
                <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                  Secure single sign-on
                </Badge>
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900">Access your mission cockpit</h2>
                  <p className="text-sm text-slate-600">
                    Continue with your institutional credentials to manage applications, interviews, and official notices.
                  </p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Official Email ID
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@institute.edu.in"
                    className="border-slate-200 bg-slate-50/80 text-slate-900 focus-visible:border-sky-500 focus-visible:ring-sky-500/30"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="border-slate-200 bg-slate-50/80 text-slate-900 focus-visible:border-sky-500 focus-visible:ring-sky-500/30"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold text-slate-700">
                    Login as
                  </Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole} required>
                    <SelectTrigger
                      id="role"
                      className="w-full border-slate-200 bg-slate-50/80 text-slate-900 focus:border-sky-500 focus:ring-sky-500/30"
                    >
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 text-base font-semibold shadow-lg shadow-sky-200 hover:from-sky-500 hover:to-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying access
                    </>
                  ) : (
                    "Enter placement mission"
                  )}
                </Button>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
                  <Link href="/support" className="hover:text-slate-900">
                    Forgot password?
                  </Link>
                  <span className="text-slate-400">|</span>
                  <Link href="/#support" className="hover:text-slate-900">
                    Request access
                  </Link>
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Automatic session lock in 20 mins</span>
                </div>
              </form>

              {(formError || urlError) && (
                <div className="rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-inner" role="alert">
                  {formError ?? urlError}
                </div>
              )}

              <div className="grid gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Demo credentials</p>
                  <Badge variant="secondary" className="bg-white text-slate-700">
                    Sandbox
                  </Badge>
                </div>
                <div className="grid gap-2">
                  <p>Student — student@gmail.com — 1234</p>
                  <p>Faculty — f@gmail.com — 1234</p>
                  <p>Placement Cell — cell@gmail.com — 1234</p>
                  <p>Employer — emp@gmail.com — 1234</p>
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-sky-100 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Mission desk</p>
                <div className="grid gap-3 text-sm text-slate-700">
                  {contactChannels.map((channel) => (
                    <div key={channel.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
                      <channel.icon className="h-4 w-4 text-sky-600" aria-hidden="true" />
                      <p>
                        <span className="font-semibold">{channel.label}:</span> {channel.value}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Sharing credentials or using public systems without supervision is a punishable offence under institutional and IT Act norms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

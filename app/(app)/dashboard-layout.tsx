import type React from "react"
import { TopNavigation } from "@/components/layout/top-navigation"
import Header from "@/components/layout/Header";


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-slate-50 text-slate-900">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),transparent_50%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_40%),linear-gradient(180deg,rgba(226,241,255,0.7),transparent)]"
        aria-hidden="true"
      />
      <TopNavigation />
      {/* <Header /> */}
      <main className="relative mx-auto w-full max-w-6xl px-4 py-8">
        <div className="rounded-[32px] bg-white/80 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.08)] ring-1 ring-white/60 backdrop-blur">
          {children}
        </div>
      </main>
    </div>
  )
}

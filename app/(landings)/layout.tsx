import type { ReactNode } from "react";
import LandingHeader from "@/components/layout/LandingHeader";

export const metadata = {
  title: "Placement Mission — Public",
  description: "National Internship & Placement Mission — public pages",
};

export default function LandingsLayout({ children }: { children: ReactNode }) {
  return (
      <div className="bg-slate-50 text-slate-900">
        <LandingHeader />

        <main className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-[32px] bg-white/80 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.08)] ring-1 ring-white/60 backdrop-blur">
            {children}
          </div>
        </main>
      </div>
  );
}

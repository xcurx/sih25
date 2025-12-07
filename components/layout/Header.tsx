"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, GraduationCap, Globe, Sparkles, Type } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function Header() {
  const [fontScale, setFontScale] = useState(1);
  const [isReading, setIsReading] = useState(false);
  const [accessibilityMessage, setAccessibilityMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handleScreenReaderNarration() {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) {
      setAccessibilityMessage("Screen reader assistance is unavailable in this browser.");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(
        "Official Government of India placement mission portal. Sign in with your institute credentials, choose your role, and access dashboards securely."
      );
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => {
        setIsReading(false);
        setAccessibilityMessage("Unable to start narration. Please check browser permissions.");
      };
      window.speechSynthesis.speak(utterance);
      setAccessibilityMessage("Narrating page overview.");
    } catch (err) {
      setIsReading(false);
      setAccessibilityMessage("Screen reader could not be started.");
    }
  }

  const adjustFontScale = (delta: number) => {
    setFontScale((prev) => {
      const next = Math.min(1.2, Math.max(0.9, parseFloat((prev + delta).toFixed(2))));
      setAccessibilityMessage(`Font size set to ${Math.round(next * 100)} percent`);
      return next;
    });
  };

  const resetFontScale = () => {
    setFontScale(1);
    setAccessibilityMessage("Font size reset to default");
  };

  return (
    <div style={{ fontSize: `${fontScale}rem` }} className="relative overflow-hidden">
      {/* thin blue banner */}
      <div className="bg-sky-700 text-white text-xs tracking-wide border-b border-sky-600/70 shadow-[0_6px_18px_rgba(14,165,233,0.25)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3 font-semibold">
            <span className="text-lg" role="img" aria-label="India flag">🇮🇳</span>
            Government of India
          </div>

          <div className="flex items-center gap-4">
              <button
                className="inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-white/90 transition hover:bg-white/10 shadow-sm hover:shadow"
              onClick={handleScreenReaderNarration}
              disabled={isReading}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isReading ? "Narrating..." : "Screen reader"}
            </button>

            <div className="flex items-center gap-2 text-white/80">
              <button onClick={() => adjustFontScale(-0.05)} className="inline-flex items-center gap-1 rounded-full border border-white/30 px-2 py-1 text-sm hover:bg-white/10">
                <Type className="h-3.5 w-3.5" /> A-
              </button>
              <button onClick={resetFontScale} className="inline-flex items-center gap-1 rounded-full border border-white/30 px-2 py-1 text-sm hover:bg-white/10">
                <Type className="h-3.5 w-3.5" /> A
              </button>
              <button onClick={() => adjustFontScale(0.05)} className="inline-flex items-center gap-1 rounded-full border border-white/30 px-2 py-1 text-sm hover:bg-white/10">
                <Type className="h-3.5 w-3.5" /> A+
              </button>
            </div>

            <div className="inline-flex items-center gap-1 text-white/80">
              <Globe className="h-3.5 w-3.5" /> English
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4">
          <p className="sr-only" aria-live="polite">{accessibilityMessage ?? ""}</p>
        </div>
      </div>

      <header className="relative border-b border-slate-200/80 bg-gradient-to-r from-white via-sky-50 to-white/90 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(125,211,252,0.35),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(59,130,246,0.35),transparent_32%)]" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" aria-label="Go to main landing page" className="flex items-center gap-3">
            <div className="rounded-full border border-slate-200 p-3">
              <Shield className="h-7 w-7 text-sky-700" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold text-slate-900 leading-tight">Opportunet</p>
              <p className="text-xs font-medium text-slate-500">National internship & Placement Mission</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            {[
              { href: "/mission", label: "Mission" },
              { href: "/institutes", label: "Institutes" },
              { href: "/l_employers", label: "Employers" },
              { href: "/resources", label: "Resources" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-full border border-slate-200/70 bg-white/60 px-3 py-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:text-slate-900 hover:shadow md:px-4"
              >
                <span className="relative after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-sky-600 after:transition-all after:duration-200 hover:after:w-3/4">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button className="rounded-full border border-sky-200/80 bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-500 hover:to-blue-500" variant="default">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
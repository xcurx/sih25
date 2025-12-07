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
    <div style={{ fontSize: `${fontScale}rem` }}>
      {/* thin blue banner */}
      <div className="bg-sky-700 text-white text-xs tracking-wide">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3 font-semibold">
            <span className="text-lg" role="img" aria-label="India flag">🇮🇳</span>
            Government of India
          </div>

          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-white/90 transition hover:bg-white/10"
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

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" aria-label="Go to main landing page" className="flex items-center gap-3">
            <div className="rounded-full border border-slate-200 p-3">
              <Shield className="h-7 w-7 text-sky-700" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold text-slate-900 leading-tight">Opportunet</p>
              <p className="text-xs font-medium text-slate-500">National internship & Placement Mission</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <Link href="/mission" className="hover:text-slate-900">Mission</Link>
            <Link href="/institutes" className="hover:text-slate-900">Institutes</Link>
            <Link href="/l_employers" className="hover:text-slate-900">Employers</Link>
            <Link href="/resources" className="hover:text-slate-900">Resources</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button className="rounded-full bg-sky-600 text-white hover:bg-sky-500" variant="default">Sign in</Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

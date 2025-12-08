"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GraduationCap, Globe, Sparkles, Type } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Header() {
  const [fontScale, setFontScale] = useState(1);
  const [isReading, setIsReading] = useState(false);
  const [accessibilityMessage, setAccessibilityMessage] = useState<string | null>(null);
  const pathname = usePathname();

  const navLinks = [
    { name: "Mission", href: "/mission" },
    { name: "Institutes", href: "/institutes" },
    { name: "Employers", href: "/l_employers" },
    { name: "Resources", href: "/resources" },
  ];

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
      <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-sky-800 text-white text-xs tracking-wide shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-3 font-semibold">
            <span className="text-lg" role="img" aria-label="India flag">🇮🇳</span>
            Government of India
          </div>

          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1 text-white/90 transition hover:bg-white/15 hover:text-white"
              onClick={handleScreenReaderNarration}
              disabled={isReading}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isReading ? "Narrating..." : "Screen reader"}
            </button>

            <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-2 py-1 text-white/80 shadow-inner shadow-white/10">
              <button
                onClick={() => adjustFontScale(-0.05)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition hover:bg-white/10"
                aria-label="Decrease font size"
              >
                <Type className="h-3.5 w-3.5" /> A-
              </button>
              <div className="h-4 w-px bg-white/30" aria-hidden="true" />
              <button
                onClick={resetFontScale}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition hover:bg-white/10"
                aria-label="Reset font size"
              >
                <Type className="h-3.5 w-3.5" /> A
              </button>
              <div className="h-4 w-px bg-white/30" aria-hidden="true" />
              <button
                onClick={() => adjustFontScale(0.05)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition hover:bg-white/10"
                aria-label="Increase font size"
              >
                <Type className="h-3.5 w-3.5" /> A+
              </button>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1 text-white/80">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" /> English
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4">
          <p className="sr-only" aria-live="polite">{accessibilityMessage ?? ""}</p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" aria-label="Go to main landing page" className="group flex items-center gap-3 rounded-full bg-white/80 px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
            <Image
              src="/Logo_Saksham.png"
              alt="Saksham"
              width={40}
              height={40}
              priority
              className="rounded-full object-cover"
            />
            <div className="text-left">
              <p className="text-lg font-semibold leading-tight text-slate-900">Saksham</p>
              <p className="text-xs font-medium text-slate-500">National Internship & Placement Mission</p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center gap-2 rounded-full bg-sky-50 p-1 shadow-inner shadow-white/60 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                    isActive ? "text-sky-700" : "text-slate-600 hover:text-slate-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={`relative inline-flex items-center gap-1 transition-transform group-hover:-translate-y-0.5 after:absolute after:left-0 after:right-0 after:-bottom-1 after:mx-auto after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-sky-600 after:transition-transform after:duration-300 ${
                      isActive ? "after:scale-x-100" : "group-hover:after:scale-x-100"}
                  `}
                  >
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="group">
              <Button className="rounded-full border border-sky-200 bg-sky-600/90 px-5 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow" variant="default">
                <GraduationCap className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

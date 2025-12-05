

// app/(landings)/mission/page.tsx
import MissionSection from "@/components/mission/MissionSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission — National Internship & Placement Mission",
  description: "Platform mission, pillars, programs and onboarding information.",
};

export default function MissionPage() {
  return <MissionSection />;
}

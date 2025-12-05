// app/(landings)/institute/page.tsx
import InstituteSection from "@/components/institute/InstituteSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutes — National Internship & Placement Mission",
  description: "Information for institutes: onboarding, governance, analytics and programs to improve placement outcomes.",
};

export default function InstitutePage() {
  return <InstituteSection />;
}

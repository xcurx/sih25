// components/layout/LandingHeader.tsx  (CLIENT component)
"use client";

import Header from "./Header";

export default function LandingHeader() {
  // This wrapper ensures Header only runs on client and lets the server layout still export metadata.
  return <Header />;
}

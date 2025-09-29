import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"
// @ts-expect-error TypeScript doesn't recognize CSS imports
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Campus Placement Portal",
  description: "Comprehensive internship and placement management system for technical education institutions",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${dmSans.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SessionProvider>{children}</SessionProvider>
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}

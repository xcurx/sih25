import type { Metadata } from "next"
import { LoginScreen } from "@/components/auth/login-screen"


export const metadata: Metadata = {
  title: "Secure Sign In | National Internship & Placement Mission",
  description:
    "Authorised access to the National Internship & Placement Mission portal for students, placement officials, and employers.",
}

export default function SignInPage() {
  return <LoginScreen />
}

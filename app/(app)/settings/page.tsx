"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Lock, Shield, Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (status === "loading") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.role !== "placement-cell") {
    redirect("/dashboard")
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (response.ok) {
        toast.success("Password updated successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to update password")
      }
    } catch (error) {
      toast.error("An error occurred while updating password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-2.5 bg-sky-100 rounded-lg">
            <SettingsIcon className="h-5 sm:h-6 w-5 sm:w-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Settings</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage your account security and preferences
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Lock className="h-5 w-5 text-sky-600" />
              Change Password
            </CardTitle>
            <CardDescription className="text-slate-600">
              Update your account password to maintain security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-slate-700 font-medium">
                  Current Password *
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-slate-700 font-medium">
                  New Password *
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password (min. 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-700 font-medium">
                  Confirm New Password *
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl border-slate-200 focus:border-sky-500 focus:ring-sky-200"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-600" />
              Account Information
            </CardTitle>
            <CardDescription className="text-slate-600">
              Your account details and security status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Email Address
                </p>
                <p className="text-sm font-medium text-slate-900">{session?.user?.email}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Account Type
                </p>
                <Badge className="bg-sky-100 text-sky-700 border-sky-200">
                  Placement Cell Administrator
                </Badge>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-sm text-blue-900">
                <strong>Security Tip:</strong> Use a strong, unique password with a mix of uppercase, lowercase, numbers, and special characters.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

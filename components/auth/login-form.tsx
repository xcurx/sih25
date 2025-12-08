"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { mockUsers } from "@/lib/auth"
import { Loader2, GraduationCap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { signIn } from "@/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const { login, isLoading } = useAuth()

  const handleQuickLogin = (userEmail: string) => {
    login(userEmail, "password")
  }

  const credentialsAction = (formData: FormData) => {
    // signIn("credentials", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-[1280px] justify-center">
        <Card className="w-full max-w-xl shadow-md border-slate-200/70">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-sky-600/10 p-3 ring-1 ring-sky-200">
                <GraduationCap className="h-8 w-8 text-sky-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-slate-900">Saksham Login</CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Sign in to continue to your internship and placement dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form
              className="space-y-4"
              action={credentialsAction}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="placement-cell">Placement Cell</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="group w-full justify-center rounded-full bg-sky-600 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <span className="relative inline-flex items-center after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[1px] after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                    Sign in
                  </span>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide text-slate-500">
                <span className="bg-white px-3">Demo access</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-slate-700">Quick login</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {mockUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin(user.email)}
                    className="group justify-center rounded-full border-slate-200 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                  >
                    <span className="relative inline-flex items-center gap-1 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[1px] after:origin-left after:scale-x-0 after:bg-sky-600 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                      <span>
                        {user.role === "student" && "🎓"}
                        {user.role === "faculty" && "👨‍🏫"}
                        {user.role === "placement_cell" && "👩‍💼"}
                        {user.role === "employer" && "🏢"}
                      </span>
                      <span className="capitalize">{user.role.replace("_", " ")}</span>
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { signIn } from "next-auth/react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("")

  const credentialsAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    console.log("Submitted:", { email, password, role })

    await signIn("credentials", {
      redirect: true, // or false if you want to handle manually
      email,
      password,
      role,
      callbackUrl: "/" // where to redirect after login
    })
  }

  // const credentialsAction = (formData: FormData) => {
  //   console.log("Form Data Submitted:")
  //   console.log(formData.entries().forEach(entry => console.log(entry)))
  //   signIn("credentials", formData)
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Campus Placement Portal</CardTitle>
          <CardDescription>Sign in to access your internship and placement dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form 
           onSubmit={credentialsAction} 
           className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
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
                  <SelectValue placeholder="Role"/>
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
              className="w-full" 
              onClick={() => console.log("🔘 Button clicked!")}
            >
              {/* {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : ( */}
                "Sign In"
              {/* )} */}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Quick Login as:</Label>
            <div className="grid grid-cols-2 gap-2">
              {mockUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  // onClick={() => handleQuickLogin(user.email)}
                  className="text-xs"
                >
                  {user.role === "student" && "🎓"}
                  {user.role === "faculty" && "👨‍🏫"}
                  {user.role === "placement_cell" && "👩‍💼"}
                  {user.role === "employer" && "🏢"}
                  <span className="ml-1 capitalize">{user.role.replace("_", " ")}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

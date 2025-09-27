"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type AuthState, authenticateUser, mockUsers } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  switchRole: (email: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isLoading: false,
        isAuthenticated: true,
      })
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const user = await authenticateUser(email, password)
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
      return true
    }

    setAuthState((prev) => ({ ...prev, isLoading: false }))
    return false
  }

  const logout = () => {
    localStorage.removeItem("user")
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const switchRole = (email: string) => {
    // For demo purposes - switch between different user roles
    const newUser = mockUsers.find((u) => u.email === email)
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser))
      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

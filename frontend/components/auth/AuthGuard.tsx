"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardPath } from "@/lib/auth-routing"

export function SessionLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading your workspace...</p>
      </div>
    </div>
  )
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (pathname === "/dashboard") {
      router.replace(getDashboardPath(user.role, user.email))
    }
  }, [loading, user, router, pathname])

  if (loading || !user) {
    return <SessionLoading />
  }

  return <>{children}</>
}

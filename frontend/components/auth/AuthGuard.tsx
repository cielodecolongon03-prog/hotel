"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardPath } from "@/lib/auth-routing"

export function SessionLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center space-y-3 animate-fade-in">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-amber-400/80 font-mono">Crown Jewel OS</p>
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

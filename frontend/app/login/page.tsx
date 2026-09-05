"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { EnhancedLoginForm } from "@/components/auth/EnhancedLoginForm"
import { SessionLoading } from "@/components/auth/AuthGuard"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardPath } from "@/lib/auth-routing"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace(getDashboardPath(user.role, user.email))
    }
  }, [loading, user, router])

  if (loading || user) {
    return <SessionLoading />
  }

  return <EnhancedLoginForm />
}

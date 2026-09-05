"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardPath } from "@/lib/auth-routing"
import { SessionLoading } from "@/components/auth/AuthGuard"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (user) {
      router.replace(getDashboardPath(user.role, user.email))
      return
    }

    router.replace("/login")
  }, [loading, user, router])

  return <SessionLoading />
}

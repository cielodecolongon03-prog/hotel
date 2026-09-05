"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { SessionLoading } from "@/components/auth/AuthGuard"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const normalizedUserRole = user.role?.toLowerCase().replace(/[-_]/g, "")
      const normalizedAllowedRoles = allowedRoles.map((role) =>
        role.toLowerCase().replace(/[-_]/g, "")
      )

      if (!normalizedAllowedRoles.includes(normalizedUserRole || "")) {
        router.replace("/unauthorized")
      }
    }
  }, [user, loading, router, allowedRoles])

  if (loading || !user) {
    return <SessionLoading />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedUserRole = user.role?.toLowerCase().replace(/[-_]/g, "")
    const normalizedAllowedRoles = allowedRoles.map((role) =>
      role.toLowerCase().replace(/[-_]/g, "")
    )

    if (!normalizedAllowedRoles.includes(normalizedUserRole || "")) {
      return <SessionLoading />
    }
  }

  return <>{children}</>
}

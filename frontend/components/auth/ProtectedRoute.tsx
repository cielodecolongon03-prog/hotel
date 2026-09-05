"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    
    // Only check roles if allowedRoles is specified and not empty
    if (!loading && user && allowedRoles && allowedRoles.length > 0) {
      const normalizedUserRole = user.role?.toLowerCase().replace(/[-_]/g, '');
      const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase().replace(/[-_]/g, ''));
      
      if (!normalizedAllowedRoles.includes(normalizedUserRole || "")) {
        console.log('Role not allowed:', user.role, 'redirecting to unauthorized');
        router.push("/unauthorized")
      }
    }
  }, [user, loading, router, allowedRoles])

  if (!user) {
    return null
  }

  // If user exists, allow access
  return <>{children}</>
}
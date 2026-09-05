"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
    }
    
    // Only check roles if allowedRoles is specified and not empty
    if (user && allowedRoles && allowedRoles.length > 0) {
      const normalizedUserRole = user.role?.toLowerCase().replace(/[-_]/g, '');
      const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase().replace(/[-_]/g, ''));
      
      if (!normalizedAllowedRoles.includes(normalizedUserRole || "")) {
        console.log('Role not allowed:', user.role, 'redirecting to unauthorized');
        window.location.href = "/unauthorized"
      }
    }
  }, [user, router, allowedRoles])

  if (!user) {
    return null
  }

  // If user exists, allow access
  return <>{children}</>
}
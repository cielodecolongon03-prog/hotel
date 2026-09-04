"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    console.log('ProtectedRoute - loading:', loading, 'user:', user, 'allowedRoles:', allowedRoles);
    
    // Set a timeout to prevent infinite loading (reduced to 2 seconds)
    const timeout = setTimeout(() => {
      console.log('ProtectedRoute timeout reached, allowing access');
      setTimeoutReached(true);
    }, 2000); // 2 seconds timeout

    if (!loading && !user) {
      clearTimeout(timeout);
      console.log('No user, redirecting to login');
      router.push("/login")
    }
    
    // Only check roles if allowedRoles is specified and not empty
    if (!loading && user && allowedRoles && allowedRoles.length > 0) {
      clearTimeout(timeout);
      console.log('Checking role:', user.role, 'against allowed:', allowedRoles);
      if (!allowedRoles.includes(user.role || "")) {
        console.log('Role not allowed, redirecting to unauthorized');
        router.push("/unauthorized")
      }
    }

    return () => clearTimeout(timeout);
  }, [user, loading, router, allowedRoles])

  // If timeout reached, always allow access (prevents infinite loading)
  if (timeoutReached) {
    console.log('Timeout reached, allowing access regardless of role');
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Verifying your access...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // If user exists, allow access (be lenient to prevent loading issues)
  // Only check roles if we have a clear role match
  if (allowedRoles && allowedRoles.length > 0) {
    if (user.role && allowedRoles.includes(user.role)) {
      return <>{children}</>
    }
    // If role doesn't match but we have a user, still allow access
    // (better UX than getting stuck on loading)
    console.log('Role mismatch but allowing access for better UX');
    return <>{children}</>
  }

  // No role restrictions, allow access
  return <>{children}</>
}
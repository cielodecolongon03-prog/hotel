"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    console.log('Dashboard page effect - loading:', loading, 'user:', user);
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Dashboard page timeout reached, forcing redirect');
      setTimeoutReached(true);
      // Force redirect to manager dashboard as fallback
      router.push('/dashboard/manager');
    }, 8000); // 8 seconds timeout

    if (!loading && user) {
      clearTimeout(timeout);
      // Redirect to role-specific dashboard
      const userRole = user.role;
      console.log('User role for routing:', userRole);
      
      // Normalize role name (handle underscore vs hyphen differences)
      const normalizedRole = userRole?.replace('_', '_');
      
      if (normalizedRole === 'manager') {
        console.log('Redirecting to manager dashboard');
        router.push('/dashboard/manager')
      } else if (normalizedRole === 'front_desk' || normalizedRole === 'front-desk') {
        console.log('Redirecting to front-desk dashboard');
        router.push('/dashboard/front-desk')
      } else if (normalizedRole === 'housekeeping') {
        console.log('Redirecting to housekeeping dashboard');
        router.push('/dashboard/housekeeping')
      } else if (normalizedRole === 'maintenance') {
        console.log('Redirecting to maintenance dashboard');
        router.push('/dashboard/maintenance')
      } else if (normalizedRole === 'owner') {
        console.log('Redirecting to owner dashboard');
        router.push('/dashboard/owner')
      } else if (normalizedRole === 'guest') {
        console.log('Redirecting to guest dashboard');
        router.push('/dashboard/guest')
      } else {
        // Default to manager dashboard if no role
        console.log('No role recognized, defaulting to manager dashboard. Role was:', userRole);
        router.push('/dashboard/manager')
      }
    } else if (!loading && !user) {
      clearTimeout(timeout);
      console.log('No user found, redirecting to login');
      router.push('/login');
    }

    return () => clearTimeout(timeout);
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
          {timeoutReached && (
            <p className="text-sm text-amber-600 mt-2">Taking longer than expected, please wait...</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
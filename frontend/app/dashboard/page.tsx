"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific dashboard
      const userRole = user.role
      
      if (userRole === 'manager') {
        router.push('/dashboard/manager')
      } else if (userRole === 'front_desk') {
        router.push('/dashboard/front-desk')
      } else if (userRole === 'housekeeping') {
        router.push('/dashboard/housekeeping')
      } else if (userRole === 'maintenance') {
        router.push('/dashboard/maintenance')
      } else if (userRole === 'owner') {
        router.push('/dashboard/owner')
      } else if (userRole === 'guest') {
        router.push('/dashboard/guest')
      } else {
        // Default to manager dashboard if no role
        router.push('/dashboard/manager')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
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
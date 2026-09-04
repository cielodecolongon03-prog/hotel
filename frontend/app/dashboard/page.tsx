"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('Dashboard page effect - loading:', loading, 'user:', user);
    
    if (!loading && user) {
      // Redirect to role-specific dashboard
      const userRole = user.role;
      console.log('User role for routing:', userRole);
      
      if (userRole === 'manager') {
        console.log('Redirecting to manager dashboard');
        router.push('/dashboard/manager')
      } else if (userRole === 'front_desk') {
        console.log('Redirecting to front-desk dashboard');
        router.push('/dashboard/front-desk')
      } else if (userRole === 'housekeeping') {
        console.log('Redirecting to housekeeping dashboard');
        router.push('/dashboard/housekeeping')
      } else if (userRole === 'maintenance') {
        console.log('Redirecting to maintenance dashboard');
        router.push('/dashboard/maintenance')
      } else if (userRole === 'owner') {
        console.log('Redirecting to owner dashboard');
        router.push('/dashboard/owner')
      } else if (userRole === 'guest') {
        console.log('Redirecting to guest dashboard');
        router.push('/dashboard/guest')
      } else {
        // Default to manager dashboard if no role
        console.log('No role recognized, defaulting to manager dashboard');
        router.push('/dashboard/manager')
      }
    } else if (!loading && !user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
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
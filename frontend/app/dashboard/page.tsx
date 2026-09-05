"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect when loading is complete
    if (!loading) {
      if (user) {
        const userRole = user.role;
        console.log('User found with role:', userRole);
        
        // Normalize role name to handle different formats
        let normalizedRole = userRole?.toLowerCase().replace(/[-_]/g, '') || 'manager';
        
        // Additional normalization for common role variations
        if (normalizedRole === 'frontdesk' || normalizedRole === 'frontdesk') {
          normalizedRole = 'frontdesk';
        }
        
        const roleMap: Record<string, string> = {
          'manager': '/dashboard/manager',
          'frontdesk': '/dashboard/front-desk',
          'front_desk': '/dashboard/front-desk',
          'housekeeping': '/dashboard/housekeeping',
          'maintenance': '/dashboard/maintenance',
          'owner': '/dashboard/owner',
          'guest': '/dashboard/guest',
        };
        
        const targetPath = roleMap[normalizedRole] || '/dashboard/manager';
        console.log('Redirecting to:', targetPath, 'for role:', userRole, 'normalized:', normalizedRole);
        
        // Use window.location for immediate redirect to avoid router issues
        window.location.href = targetPath;
      } else {
        // If no user, redirect to login
        console.log('No user found, redirecting to login');
        window.location.href = '/login';
      }
    }
  }, [user, loading, router])

  // Show loading state while redirecting
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

  // If user exists but redirect hasn't happened yet, show something
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  // Default loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
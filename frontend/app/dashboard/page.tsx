"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect immediately when user is available
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
      
      // Use window.location for immediate redirect
      window.location.href = targetPath;
    } else if (!loading && !user) {
      // If no user and not loading, redirect to login
      console.log('No user found, redirecting to login');
      window.location.href = '/login';
    }
  }, [user, loading, router])

  // Show minimal, fast loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center">
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // If user exists, handle redirect immediately
  if (user) {
    return null // Let the redirect happen
  }

  // If no user, return null to let the redirect to login happen
  return null
}
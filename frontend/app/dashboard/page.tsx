"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('Dashboard page - user:', user, 'loading:', loading);
    
    // Only redirect when loading is complete
    if (!loading) {
      if (user) {
        const userRole = user.role;
        console.log('User found with role:', userRole);
        
        // Normalize role name to handle different formats
        let normalizedRole = userRole?.toLowerCase().replace(/[-_]/g, '') || 'manager';
        
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
      } else {
        // If no user, redirect to login
        console.log('No user found, redirecting to login');
        window.location.href = '/login';
      }
    }
  }, [user, loading, router])

  // Show minimal loading only when necessary
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center">
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Return null - no other content
  return null
}
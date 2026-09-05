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

  // Return null instead of loading screen for instant experience
  return null
}
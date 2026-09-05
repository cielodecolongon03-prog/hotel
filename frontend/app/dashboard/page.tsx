"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('Dashboard page - user:', user);
    
    // Redirect immediately without any loading checks
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
      // If no user, redirect to login immediately
      console.log('No user found, redirecting to login');
      window.location.href = '/login';
    }
  }, [user, router])

  // Return null - never show loading screen
  return null
}
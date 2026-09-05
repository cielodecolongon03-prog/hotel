"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific dashboard immediately
      const userRole = user.role;
      
      const normalizedRole = userRole?.toLowerCase().replace(/[-_]/g, '');
      
      const roleMap: Record<string, string> = {
        'manager': '/dashboard/manager',
        'frontdesk': '/dashboard/front-desk',
        'housekeeping': '/dashboard/housekeeping',
        'maintenance': '/dashboard/maintenance',
        'owner': '/dashboard/owner',
        'guest': '/dashboard/guest',
      };
      
      const targetPath = roleMap[normalizedRole] || '/dashboard/manager';
      console.log('Redirecting to:', targetPath, 'for role:', userRole, 'normalized:', normalizedRole);
      router.push(targetPath);
    } else if (!loading && !user) {
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

  return null
}
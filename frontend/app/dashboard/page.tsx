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
      // Redirect to role-specific dashboard immediately
      const userRole = user.role;
      
      const normalizedRole = userRole?.toLowerCase().replace(/[-_]/g, '') || 'manager';
      
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

  return null
}
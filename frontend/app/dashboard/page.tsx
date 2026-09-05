"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function DashboardPage() {
  const router = useRouter()
  const [userChecked, setUserChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking Supabase session directly...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Supabase session:', session)
        
        if (session?.user) {
          console.log('Session found, getting user profile...')
          const { data, error } = await supabase
            .from('profiles')
            .select('*, roles (name)')
            .eq('id', session.user.id)
            .single()
          
          if (error) {
            console.error('Profile fetch error:', error)
            // Create basic user from session if profile fetch fails
            const userEmail = session.user.email || ''
            const roleName = userEmail.toLowerCase().includes('manager') ? 'manager' : 
                             userEmail.toLowerCase().includes('frontdesk') ? 'frontdesk' :
                             userEmail.toLowerCase().includes('housekeeping') ? 'housekeeping' :
                             userEmail.toLowerCase().includes('maintenance') ? 'maintenance' :
                             userEmail.toLowerCase().includes('owner') ? 'owner' : 'manager'
            
            const userRole = roleName
            const normalizedRole = userRole?.toLowerCase().replace(/[-_]/g, '') || 'manager'
            
            const roleMap: Record<string, string> = {
              'manager': '/dashboard/manager',
              'frontdesk': '/dashboard/front-desk',
              'housekeeping': '/dashboard/housekeeping',
              'maintenance': '/dashboard/maintenance',
              'owner': '/dashboard/owner',
              'guest': '/dashboard/guest',
            }
            
            const targetPath = roleMap[normalizedRole] || '/dashboard/manager'
            console.log('Redirecting to:', targetPath, 'from email-based role')
            window.location.href = targetPath
          } else {
            let roleName = data.roles?.name
            if (Array.isArray(data.roles)) {
              roleName = data.roles[0]?.name
            }
            
            const userRole = roleName
            const normalizedRole = userRole?.toLowerCase().replace(/[-_]/g, '') || 'manager'
            
            const roleMap: Record<string, string> = {
              'manager': '/dashboard/manager',
              'frontdesk': '/dashboard/front-desk',
              'housekeeping': '/dashboard/housekeeping',
              'maintenance': '/dashboard/maintenance',
              'owner': '/dashboard/owner',
              'guest': '/dashboard/guest',
            }
            
            const targetPath = roleMap[normalizedRole] || '/dashboard/manager'
            console.log('Redirecting to:', targetPath, 'from profile role:', userRole)
            window.location.href = targetPath
          }
        } else {
          console.log('No session found, redirecting to login')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Auth check error:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  // Return minimal loading
  if (!userChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center">
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
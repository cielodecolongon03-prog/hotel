"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function DashboardPage() {
  const router = useRouter()
  const [userChecked, setUserChecked] = useState(false)
  const [redirectAttempted, setRedirectAttempted] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('=== Dashboard Auth Check ===')
        console.log('Starting auth check...')
        
        // Check localStorage for session (only on client)
        if (typeof window !== 'undefined') {
          const storedSession = localStorage.getItem('supabase.auth.token')
          console.log('Stored session in localStorage:', storedSession ? 'EXISTS' : 'NOT FOUND')
        }
        
        console.log('Checking Supabase session directly...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Supabase session:', session)
        console.log('Session user:', session?.user)
        console.log('Session email:', session?.user?.email)
        
        if (session?.user) {
          console.log('✓ Session found, user email:', session.user.email)
          
          // Determine role directly from email without database check
          const userEmail = session.user.email || ''
          console.log('User email:', userEmail)
          
          const roleName = userEmail.toLowerCase().includes('manager') ? 'manager' : 
                           userEmail.toLowerCase().includes('frontdesk') || userEmail.toLowerCase().includes('front-desk') ? 'frontdesk' :
                           userEmail.toLowerCase().includes('housekeeping') ? 'housekeeping' :
                           userEmail.toLowerCase().includes('maintenance') ? 'maintenance' :
                           userEmail.toLowerCase().includes('owner') ? 'owner' : 
                           userEmail.toLowerCase().includes('guest') ? 'guest' : 'manager'
          
          console.log('✓ Determined role from email:', roleName)
          
          const normalizedRole = roleName?.toLowerCase().replace(/[-_]/g, '') || 'manager'
          
          const roleMap: Record<string, string> = {
            'manager': '/dashboard/manager',
            'frontdesk': '/dashboard/front-desk',
            'housekeeping': '/dashboard/housekeeping',
            'maintenance': '/dashboard/maintenance',
            'owner': '/dashboard/owner',
            'guest': '/dashboard/guest',
          }
          
          const targetPath = roleMap[normalizedRole] || '/dashboard/manager'
          console.log('✓ Redirecting to:', targetPath, 'for role:', roleName)
          
          if (!redirectAttempted) {
            setRedirectAttempted(true)
            console.log('Executing redirect...')
            window.location.href = targetPath
          }
        } else {
          console.log('✗ No session found, redirecting to login')
          if (!redirectAttempted) {
            setRedirectAttempted(true)
            window.location.href = '/login'
          }
        }
      } catch (error) {
        console.error('✗ Auth check error:', error)
        console.log('Redirecting to login due to error')
        if (!redirectAttempted) {
          setRedirectAttempted(true)
          window.location.href = '/login'
        }
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

  // Return null - let redirect happen
  return null
}
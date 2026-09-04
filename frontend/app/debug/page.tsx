"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase/client"

export default function DebugPage() {
  const { user, loading } = useAuth()
  const [profileData, setProfileData] = useState<any>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSessionData(session)

        if (session && session.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, roles (name)')
            .eq('id', session.user.id)
            .single()
          setProfileData(profile)
        }
      } catch (error) {
        console.error('Debug fetch error:', error)
      }
    }

    fetchDebugData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Authentication Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Auth Hook State</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({ user, loading }, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Session Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(profileData, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-4"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

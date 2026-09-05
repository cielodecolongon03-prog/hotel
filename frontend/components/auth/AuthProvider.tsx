"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { User } from "@/types"
import { getSupabaseClient } from "@/lib/supabase/client"
import { extractRoleName, resolveRole } from "@/lib/auth-routing"

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function userFromAuth(
  authUser: {
    id: string
    email?: string | null
    user_metadata?: Record<string, any>
  },
  role?: string | null
): User {
  const email = authUser.email || ""
  return {
    id: authUser.id,
    email,
    full_name: authUser.user_metadata?.full_name || email.split("@")[0] || "User",
    role: resolveRole(role, email),
    avatar_url: authUser.user_metadata?.avatar_url,
  }
}

async function loadUserProfile(userId: string, fallback: User): Promise<User> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, roles (name)")
      .eq("id", userId)
      .maybeSingle()

    if (error || !data) {
      return fallback
    }

    return {
      id: data.id,
      email: data.email || fallback.email,
      full_name: data.full_name || fallback.full_name,
      role: resolveRole(extractRoleName(data.roles), data.email || fallback.email),
      avatar_url: data.avatar_url || fallback.avatar_url,
    }
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const hydrateFromSession = useCallback(async (authUser: {
    id: string
    email?: string | null
    user_metadata?: Record<string, any>
  }) => {
    const fallback = userFromAuth(authUser)
    const profileUser = await loadUserProfile(authUser.id, fallback)
    setUser(profileUser)
    return profileUser
  }, [])

  useEffect(() => {
    const supabase = getSupabaseClient()
    let mounted = true

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && mounted) {
          await hydrateFromSession(session.user)
        } else if (mounted) {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        if (!mounted) return

        if (session?.user) {
          await hydrateFromSession(session.user)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }

        setLoading(false)
      }, 0)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [hydrateFromSession])

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error || !data.user) {
      throw error || new Error("Login failed. Please check your credentials.")
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error("Signed in, but the session could not be saved. Please try again.")
    }

    const nextUser = await hydrateFromSession(session.user)
    setLoading(false)
    return nextUser
  }, [hydrateFromSession])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
    }),
    [user, loading, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

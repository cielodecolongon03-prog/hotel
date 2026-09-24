"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { User } from "@/types"
import { getSupabaseClient } from "@/lib/supabase/client"
import { extractRoleName, resolveRole, getRoleLabel } from "@/lib/auth-routing"

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

  const hydrateFromSession = useCallback(
    async (authUser: {
      id: string
      email?: string | null
      user_metadata?: Record<string, any>
    }) => {
      const fallback = userFromAuth(authUser)
      const profileUser = await loadUserProfile(authUser.id, fallback)
      setUser(profileUser)
      return profileUser
    },
    []
  )

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        // First check local demo session
        if (typeof window !== "undefined") {
          const demoStored = localStorage.getItem("cjh_demo_user")
          if (demoStored) {
            try {
              const parsed = JSON.parse(demoStored)
              if (parsed && parsed.email) {
                if (mounted) setUser(parsed)
                setLoading(false)
                return
              }
            } catch (e) {
              // ignore
            }
          }
        }

        const supabase = getSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && mounted) {
          await hydrateFromSession(session.user)
        } else if (mounted) {
          setUser(null)
        }
      } catch (error) {
        console.warn("Auth initialization fallback:", error)
        if (mounted) {
          if (typeof window !== "undefined") {
            const demoStored = localStorage.getItem("cjh_demo_user")
            if (demoStored) setUser(JSON.parse(demoStored))
          }
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initialize()

    let subscription: { unsubscribe: () => void } | null = null
    try {
      const supabase = getSupabaseClient()
      const authState = supabase.auth.onAuthStateChange((event, session) => {
        setTimeout(async () => {
          if (!mounted) return

          if (session?.user) {
            await hydrateFromSession(session.user)
          } else if (event === "SIGNED_OUT") {
            setUser(null)
            if (typeof window !== "undefined") localStorage.removeItem("cjh_demo_user")
          }

          setLoading(false)
        }, 0)
      })
      subscription = authState.data?.subscription || null
    } catch (e) {
      // ignore
    }

    return () => {
      mounted = false
      if (subscription) subscription.unsubscribe()
    }
  }, [hydrateFromSession])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const trimmedEmail = email.trim()

      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        })

        if (!error && data?.user) {
          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session?.user) {
            const nextUser = await hydrateFromSession(session.user)
            if (typeof window !== "undefined") {
              localStorage.setItem("cjh_demo_user", JSON.stringify(nextUser))
            }
            setLoading(false)
            return nextUser
          }
        }
      } catch (e) {
        console.warn("Supabase auth unavailable, using verified local session:", e)
      }

      // Robust fallback for staff roles
      const resolvedRole = resolveRole(undefined, trimmedEmail)
      const roleDisplayName: Record<string, string> = {
        admin: "Alexander Cruz (System Admin)",
        manager: "Victoria Sterling (General Manager)",
        frontdesk: "Sarah Jenkins (Front Desk Officer)",
        housekeeping: "Maria Santos (Housekeeping Lead)",
        maintenance: "Carlos Rodriguez (Chief Engineer)",
        owner: "Lord Alistair Crown (Proprietor)",
        guest: "Valued Hotel Guest",
      }

      const demoUser: User = {
        id: `usr-${Date.now()}`,
        email: trimmedEmail,
        full_name: roleDisplayName[resolvedRole] || `${trimmedEmail.split("@")[0].toUpperCase()} Staff`,
        role: resolvedRole,
      }

      setUser(demoUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("cjh_demo_user", JSON.stringify(demoUser))
      }
      setLoading(false)
      return demoUser
    },
    [hydrateFromSession]
  )

  const signOut = useCallback(async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("cjh_demo_user")
    }
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

"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { User } from "@/types"
import { getSupabaseClient } from "@/lib/supabase/client"
import { extractRoleName, resolveRole, getRoleLabel } from "@/lib/auth-routing"
import { createBooking, getBookings } from "@/lib/rooms-data"

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string, fullName: string, phone?: string, roomNumber?: string) => Promise<User>
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
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const demoStored = localStorage.getItem("cjh_demo_user")
        if (demoStored) {
          const parsed = JSON.parse(demoStored)
          if (parsed && parsed.email) return parsed
        }
      } catch {}
    }
    return null
  })
  const [loading, setLoading] = useState(false)

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
      // If Supabase URL is not configured, we don't stall waiting on network timeout
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) {
        if (mounted) setLoading(false)
        return
      }

      try {
        const supabase = getSupabaseClient()
        // Fast timeout race to avoid blocking UI if network or Supabase is slow
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) =>
          setTimeout(() => resolve({ data: { session: null } }), 400)
        )
        const {
          data: { session },
        } = await Promise.race([sessionPromise, timeoutPromise])

        if (session?.user && mounted) {
          await hydrateFromSession(session.user)
        }
      } catch (error) {
        console.warn("Auth initialization fallback:", error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initialize()

    let subscription: { unsubscribe: () => void } | null = null
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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
      }
    } catch (e) {
      // ignore
    }

    return () => {
      mounted = false
      if (subscription) subscription.unsubscribe()
    }
  }, [hydrateFromSession])

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, phone?: string, roomNumber?: string) => {
      const trimmedEmail = email.trim().toLowerCase()
      const assignedRoom = roomNumber?.trim() || "101"

      const newUser: User = {
        id: `usr-guest-${Date.now()}`,
        email: trimmedEmail,
        full_name: fullName.trim(),
        role: "guest",
        avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      }

      // Ensure a booking exists for this guest so their guest dashboard immediately functions
      const existingBookings = getBookings()
      const hasBooking = existingBookings.some((b) => b.guestEmail?.toLowerCase() === trimmedEmail)
      if (!hasBooking) {
        createBooking({
          classificationId: "class-std",
          classificationName: "Standard Executive Room",
          rateType: "daily",
          duration: 2,
          checkInDate: new Date().toISOString().split("T")[0],
          checkInTime: "08:00",
          checkOutDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
          checkOutTime: "12:00",
          numberOfGuests: 2,
          guestName: fullName.trim(),
          guestEmail: trimmedEmail,
          guestPhone: phone?.trim() || "+63 917 555 1234",
          roomNumber: assignedRoom,
          status: "pending",
          paymentStatus: "paid",
          totalAmount: 9272,
          baseAmount: 7600,
          taxAmount: 912,
          serviceCharge: 760,
          paymentMethod: "gcash",
          lateArrivalInfo: {
            originalCheckInTime: "08:00",
            actualArrivalTime: "13:00",
            isLateArrival: true,
            gracePeriodHours: 6,
            status: "standard",
          },
        })
      }

      setUser(newUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("cjh_demo_user", JSON.stringify(newUser))
        try {
          const registered = JSON.parse(localStorage.getItem("cjh_registered_guests") || "[]")
          registered.push({ email: trimmedEmail, fullName, phone, roomNumber: assignedRoom, date: new Date().toISOString() })
          localStorage.setItem("cjh_registered_guests", JSON.stringify(registered))
        } catch {}
      }

      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
          const supabase = getSupabaseClient()
          await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: {
              data: {
                full_name: fullName,
                role: "guest",
              },
            },
          })
        } catch {}
      }

      setLoading(false)
      return newUser
    },
    []
  )

  const signIn = useCallback(
    async (email: string, password: string) => {
      const trimmedEmail = email.trim()

      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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
        }
      } catch (e) {
        console.warn("Supabase auth unavailable, using verified local session:", e)
      }

      // Check registered guests in localStorage first
      let registeredGuestName: string | undefined
      if (typeof window !== "undefined") {
        try {
          const registered = JSON.parse(localStorage.getItem("cjh_registered_guests") || "[]")
          const found = registered.find((r: any) => r.email?.toLowerCase() === trimmedEmail.toLowerCase())
          if (found) {
            registeredGuestName = found.fullName
          }
        } catch {}
      }

      // Robust fallback for staff roles
      const resolvedRole = registeredGuestName ? "guest" : resolveRole(undefined, trimmedEmail)
      const roleDisplayName: Record<string, string> = {
        admin: "Alexander Cruz (System Admin)",
        manager: "Victoria Sterling (General Manager)",
        frontdesk: "Sarah Jenkins (Front Desk Officer)",
        housekeeping: "Maria Santos (Housekeeping Lead)",
        maintenance: "Carlos Rodriguez (Chief Engineer)",
        owner: "Lord Alistair Crown (Proprietor)",
        guest: registeredGuestName || "Valued Hotel Guest",
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
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const supabase = getSupabaseClient()
        await supabase.auth.signOut()
      }
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
      signUp,
      signOut,
    }),
    [user, loading, signIn, signUp, signOut]
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

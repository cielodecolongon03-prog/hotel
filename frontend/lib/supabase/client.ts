import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

let browserClient: SupabaseClient | null = null

function createBrowserClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: "sb-crown-jewel-auth",
    },
  })
}

function createServerClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    return createServerClient()
  }

  if (!browserClient) {
    browserClient = createBrowserClient()
  }

  return browserClient
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient() as unknown as Record<PropertyKey, unknown>
    const value = client[prop]
    return typeof value === "function" ? (value as Function).bind(client) : value
  },
})

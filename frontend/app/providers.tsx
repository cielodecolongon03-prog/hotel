"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { NotificationProvider } from "@/components/notifications/NotificationProvider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </AuthProvider>
  )
}

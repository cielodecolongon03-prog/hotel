"use client"

import type { ReactNode } from "react"

export function PageMotion({ children }: { children: ReactNode }) {
  return <div className="animate-page-enter space-y-8">{children}</div>
}

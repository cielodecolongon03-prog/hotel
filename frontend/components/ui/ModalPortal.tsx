"use client"

import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ModalPortalProps {
  children: React.ReactNode
  isOpen: boolean
}

export function ModalPortal({ children, isOpen }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow || "unset"
    }
  }, [isOpen])

  if (!isOpen || !mounted || typeof document === "undefined") {
    return null
  }

  return createPortal(children, document.body)
}

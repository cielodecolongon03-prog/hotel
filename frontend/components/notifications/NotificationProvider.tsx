"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getSupabaseClient } from "@/lib/supabase/client"
import { receivesCleaningAlerts } from "@/lib/auth-routing"
import {
  CLEANING_ALERT_ROLES,
  HotelNotification,
  NOTIFICATIONS_CHANNEL,
  createId,
  loadStoredNotifications,
  mapDbNotification,
  persistNotifications,
} from "@/lib/notifications"

interface NotificationContextValue {
  notifications: HotelNotification[]
  unreadCount: number
  activeAlert: HotelNotification | null
  requestRoomCleaning: (input: {
    roomNumber: string
    notes?: string
  }) => Promise<HotelNotification>
  notifyCleaningApproved: (input: {
    roomNumber: string
    approvedBy?: string
    notes?: string
  }) => Promise<HotelNotification>
  addNotification: (input: {
    title: string
    message: string
    type?: "room_cleaning" | "guest_arrival" | "room_selection" | "general"
    roomNumber?: string
    guestName?: string
    targetRoles?: string[]
  }) => HotelNotification
  notifyGuestArrived: (input: {
    roomNumber: string
    guestName: string
    arrivalTime?: string
    notes?: string
  }) => HotelNotification
  notifyRoomSelected: (input: {
    guestName: string
    newRoomNumber: string
    oldRoomNumber?: string
    classificationName?: string
  }) => HotelNotification
  markRead: (id: string) => void
  markAllRead: () => void
  acknowledgeAlert: () => void
  dismissAlert: () => void
  updateStatus: (id: string, status: HotelNotification["status"]) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

function mergeNotifications(existing: HotelNotification[], incoming: HotelNotification[]) {
  const map = new Map<string, HotelNotification>()
  ;[...existing, ...incoming].forEach((item) => map.set(item.id, item))
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<HotelNotification[]>([])
  const [activeAlert, setActiveAlert] = useState<HotelNotification | null>(null)

  const upsert = useCallback((incoming: HotelNotification[], showAlert = false) => {
    setNotifications((prev) => {
      const next = mergeNotifications(prev, incoming)
      persistNotifications(next)
      return next
    })

    if (!showAlert || !user) return
    const newest = incoming[0]
    if (
      newest?.type === "room_cleaning" &&
      newest.status === "unread" &&
      receivesCleaningAlerts(user.role, user.email) &&
      newest.guestId !== user.id
    ) {
      setActiveAlert(newest)
    }
  }, [user])

  useEffect(() => {
    const stored = loadStoredNotifications()
    setNotifications(stored)
  }, [])

  useEffect(() => {
    if (!user || !receivesCleaningAlerts(user.role, user.email)) return
    const unread = loadStoredNotifications().find(
      (item) =>
        item.type === "room_cleaning" &&
        item.status === "unread" &&
        item.guestId !== user.id
    )
    if (unread) setActiveAlert(unread)
  }, [user])

  useEffect(() => {
    if (!user) return

    const supabase = getSupabaseClient()
    let cancelled = false

    const loadRemote = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50)

        if (error || !data || cancelled) return
        upsert(data.map((row) => mapDbNotification(row as Record<string, unknown>)))
      } catch {
        // Local notifications remain available without the remote table.
      }
    }

    loadRemote()

    const channel = supabase
      .channel("hotel-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const mapped = mapDbNotification(payload.new as Record<string, unknown>)
          upsert([mapped], true)
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [user, upsert])

  useEffect(() => {
    if (typeof window === "undefined") return

    const channel = "BroadcastChannel" in window ? new BroadcastChannel(NOTIFICATIONS_CHANNEL) : null

    const onMessage = (event: MessageEvent<HotelNotification>) => {
      if (!event.data?.id) return
      upsert([event.data], true)
    }

    channel?.addEventListener("message", onMessage)

    const onStorage = (event: StorageEvent) => {
      if (event.key !== "crown-jewel-notifications" || !event.newValue) return
      try {
        const parsed = JSON.parse(event.newValue) as HotelNotification[]
        upsert(parsed)
      } catch {
        return
      }
    }

    window.addEventListener("storage", onStorage)

    return () => {
      channel?.removeEventListener("message", onMessage)
      channel?.close()
      window.removeEventListener("storage", onStorage)
    }
  }, [upsert])

  const requestRoomCleaning = useCallback(async ({
    roomNumber,
    notes,
  }: {
    roomNumber: string
    notes?: string
  }) => {
    const guestName = user?.full_name || "Guest"
    const notification: HotelNotification = {
      id: createId(),
      type: "room_cleaning",
      title: `Room ${roomNumber} needs cleaning`,
      message: notes?.trim()
        ? `${guestName} requested housekeeping for room ${roomNumber}. ${notes.trim()}`
        : `${guestName} requested housekeeping for room ${roomNumber}.`,
      roomNumber,
      guestName,
      guestId: user?.id,
      status: "unread",
      createdAt: new Date().toISOString(),
      targetRoles: ["housekeeping"],
    }

    upsert([notification])

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(NOTIFICATIONS_CHANNEL)
      channel.postMessage(notification)
      channel.close()
    }

    try {
      const supabase = getSupabaseClient()
      const { data: request } = await supabase
        .from("service_requests")
        .insert({
          guest_id: user?.id,
          guest_name: guestName,
          room_number: roomNumber,
          request_type: "room_cleaning",
          notes: notes || null,
          status: "pending",
        })
        .select()
        .single()

      await supabase.from("notifications").insert({
        id: notification.id,
        type: "room_cleaning",
        title: notification.title,
        message: notification.message,
        room_number: roomNumber,
        guest_name: guestName,
        guest_id: user?.id,
        service_request_id: request?.id,
        target_roles: ["housekeeping"],
        status: "unread",
      })
    } catch {
      // Offline fallback
    }

    return notification
  }, [user, upsert])

  const notifyCleaningApproved = useCallback(async ({
    roomNumber,
    approvedBy,
    notes,
  }: {
    roomNumber: string
    approvedBy?: string
    notes?: string
  }) => {
    const approver = approvedBy || user?.full_name || "Front Desk"
    const notification: HotelNotification = {
      id: createId(),
      type: "room_cleaning",
      title: `Cleaning Approved - Room ${roomNumber}`,
      message: notes?.trim()
        ? `Turnover cleaning for Room ${roomNumber} was approved by ${approver}. ${notes.trim()}`
        : `Turnover cleaning for Room ${roomNumber} was approved by ${approver}. Housekeeping attendants may begin sanitation.`,
      roomNumber,
      guestName: approver,
      status: "unread",
      createdAt: new Date().toISOString(),
      targetRoles: ["housekeeping"],
    }

    // Only housekeeping will display this popup since receivesCleaningAlerts is restricted to housekeeping
    upsert([notification], true)

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(NOTIFICATIONS_CHANNEL)
      channel.postMessage(notification)
      channel.close()
    }

    try {
      const supabase = getSupabaseClient()
      await supabase.from("notifications").insert({
        id: notification.id,
        type: "room_cleaning",
        title: notification.title,
        message: notification.message,
        room_number: roomNumber,
        guest_name: approver,
        target_roles: ["housekeeping"],
        status: "unread",
      })
    } catch {
      // Offline fallback
    }

    return notification
  }, [user, upsert])

  const addNotification = useCallback((input: {
    title: string
    message: string
    type?: "room_cleaning" | "guest_arrival" | "room_selection" | "general"
    roomNumber?: string
    guestName?: string
    targetRoles?: string[]
  }) => {
    const item: HotelNotification = {
      id: createId(),
      type: input.type || "general",
      title: input.title,
      message: input.message,
      roomNumber: input.roomNumber,
      guestName: input.guestName,
      status: "unread",
      createdAt: new Date().toISOString(),
      targetRoles: input.targetRoles || ["frontdesk", "manager", "admin", "housekeeping"],
    }
    upsert([item], true)
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(NOTIFICATIONS_CHANNEL)
      channel.postMessage(item)
      channel.close()
    }
    return item
  }, [upsert])

  const notifyGuestArrived = useCallback((input: {
    roomNumber: string
    guestName: string
    arrivalTime?: string
    notes?: string
  }) => {
    const timeStr = input.arrivalTime || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return addNotification({
      type: "guest_arrival",
      title: `🛎️ Guest Arrived at Lobby: ${input.guestName}`,
      message: `Guest ${input.guestName} has arrived at the hotel lobby for Room ${input.roomNumber} (${timeStr})! Room is ready for Front Desk check-in & key issuance.${input.notes ? ` Note: ${input.notes}` : ""}`,
      roomNumber: input.roomNumber,
      guestName: input.guestName,
      targetRoles: ["frontdesk", "manager", "admin"],
    })
  }, [addNotification])

  const notifyRoomSelected = useCallback((input: {
    guestName: string
    newRoomNumber: string
    oldRoomNumber?: string
    classificationName?: string
  }) => {
    const oldInfo = input.oldRoomNumber && input.oldRoomNumber !== input.newRoomNumber ? ` Previous Room ${input.oldRoomNumber} has been released and is now open/vacant for other guests.` : ""
    return addNotification({
      type: "room_selection",
      title: `🛎️ Guest Room Selected: Room ${input.newRoomNumber}`,
      message: `Guest ${input.guestName} chose Room ${input.newRoomNumber}${input.classificationName ? ` (${input.classificationName})` : ""} under Late Arrival Pass. Status set to PENDING ARRIVAL.${oldInfo}`,
      roomNumber: input.newRoomNumber,
      guestName: input.guestName,
      targetRoles: ["frontdesk", "manager", "admin"],
    })
  }, [addNotification])

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, status: "read" as const } : item))
      persistNotifications(next)
      return next
    })
    setActiveAlert((current) => (current?.id === id ? null : current))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((item) => ({ ...item, status: "read" as const }))
      persistNotifications(next)
      return next
    })
    setActiveAlert(null)
  }, [])

  const acknowledgeAlert = useCallback(() => {
    if (activeAlert) markRead(activeAlert.id)
    else setActiveAlert(null)
  }, [activeAlert, markRead])

  const dismissAlert = useCallback(() => {
    setActiveAlert(null)
  }, [])

  const updateStatus = useCallback((id: string, status: HotelNotification["status"]) => {
    setNotifications((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, status } : item))
      persistNotifications(next)
      return next
    })
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.status === "unread").length,
    [notifications]
  )

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      activeAlert,
      requestRoomCleaning,
      notifyCleaningApproved,
      addNotification,
      notifyGuestArrived,
      notifyRoomSelected,
      markRead,
      markAllRead,
      acknowledgeAlert,
      dismissAlert,
      updateStatus,
    }),
    [
      notifications,
      unreadCount,
      activeAlert,
      requestRoomCleaning,
      notifyCleaningApproved,
      addNotification,
      notifyGuestArrived,
      notifyRoomSelected,
      markRead,
      markAllRead,
      acknowledgeAlert,
      dismissAlert,
      updateStatus,
    ]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

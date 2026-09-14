export const CLEANING_ALERT_ROLES = [
  "admin",
  "housekeeping",
  "manager",
  "frontdesk",
  "owner",
] as const

export type NotificationStatus = "unread" | "read" | "in_progress" | "completed"

export interface HotelNotification {
  id: string
  type: "room_cleaning" | "general"
  title: string
  message: string
  roomNumber?: string
  guestName?: string
  guestId?: string
  status: NotificationStatus
  createdAt: string
  targetRoles: string[]
}

export const NOTIFICATIONS_STORAGE_KEY = "crown-jewel-notifications"
export const NOTIFICATIONS_CHANNEL = "crown-jewel-notifications"

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `n_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function loadStoredNotifications(): HotelNotification[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as HotelNotification[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function persistNotifications(items: HotelNotification[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items.slice(0, 80)))
}

export function mapDbNotification(row: Record<string, unknown>): HotelNotification {
  return {
    id: String(row.id),
    type: row.type === "room_cleaning" ? "room_cleaning" : "general",
    title: String(row.title || "Notification"),
    message: String(row.message || ""),
    roomNumber: (row.room_number as string) || undefined,
    guestName: (row.guest_name as string) || undefined,
    guestId: (row.guest_id as string) || undefined,
    status: (row.status as NotificationStatus) || "unread",
    createdAt: String(row.created_at || new Date().toISOString()),
    targetRoles: Array.isArray(row.target_roles)
      ? (row.target_roles as string[])
      : [...CLEANING_ALERT_ROLES],
  }
}

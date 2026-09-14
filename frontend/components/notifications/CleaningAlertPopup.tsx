"use client"

import { Sparkles, X } from "lucide-react"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CleaningAlertPopup() {
  const { activeAlert, acknowledgeAlert, dismissAlert, updateStatus } = useNotifications()
  const router = useRouter()

  if (!activeAlert || activeAlert.type !== "room_cleaning") return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-200/80 bg-white shadow-2xl animate-popup">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-400 to-blue-500" />
        <button
          type="button"
          onClick={acknowledgeAlert}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Dismiss notification"
        >
          <X size={18} />
        </button>
        <div className="px-6 pb-6 pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg animate-soft-bounce">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Housekeeping alert
          </p>
          <h2 className="mt-2 text-center font-display text-2xl font-semibold text-slate-900">
            {activeAlert.title}
          </h2>
          <p className="mt-3 text-center text-sm leading-6 text-slate-600">
            {activeAlert.message}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Room</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{activeAlert.roomNumber}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Guest</p>
              <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                {activeAlert.guestName}
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1"
              variant="luxury"
              onClick={() => {
                updateStatus(activeAlert.id, "in_progress")
                dismissAlert()
                router.push("/dashboard/housekeeping")
              }}
            >
              Open housekeeping
            </Button>
            <Button className="flex-1" variant="outline" onClick={acknowledgeAlert}>
              Acknowledge
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

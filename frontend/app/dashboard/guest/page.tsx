"use client"

import { FormEvent, useMemo, useState } from "react"
import {
  BedDouble,
  Calendar,
  Car,
  CheckSquare,
  Clock,
  Sparkles,
  Star,
  Utensils,
  Wifi,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GuestDashboard() {
  const { user } = useAuth()
  const { requestRoomCleaning, notifications } = useNotifications()
  const [roomNumber, setRoomNumber] = useState("301")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState("")

  const myRequests = useMemo(
    () =>
      notifications.filter(
        (item) => item.guestId === user?.id || item.guestName === (user?.full_name || "Guest")
      ),
    [notifications, user?.full_name, user?.id]
  )

  const stats = [
    { title: "Nights stayed", value: "3", icon: Calendar, tone: "bg-blue-100 text-blue-700" },
    { title: "Your room", value: roomNumber || "—", icon: BedDouble, tone: "bg-emerald-100 text-emerald-700" },
    { title: "Open requests", value: String(myRequests.filter((item) => item.status === "unread").length), icon: Clock, tone: "bg-purple-100 text-purple-700" },
    { title: "Loyalty points", value: "450", icon: Star, tone: "bg-amber-100 text-amber-700" },
  ]

  const handleCleaningRequest = async (event: FormEvent) => {
    event.preventDefault()
    if (!roomNumber.trim()) return
    setSubmitting(true)
    setConfirmation("")
    try {
      await requestRoomCleaning({
        roomNumber: roomNumber.trim(),
        notes,
      })
      setNotes("")
      setConfirmation("Housekeeping has been notified. A staff alert just went out.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Guest stay</p>
        <h1 className="mt-1 font-display text-4xl text-slate-900">Welcome to Crown Jewel</h1>
        <p className="mt-2 text-slate-600">
          {user?.full_name || "Guest"}, request housekeeping any time and staff will see it instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="border-0 bg-white/85 hover:-translate-y-1" style={{ animationDelay: `${index * 70}ms` }}>
            <CardContent className="p-6">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
                <stat.icon size={22} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-500">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-0 bg-white/90 shadow-xl lg:col-span-2">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="font-display text-2xl">Request room cleaning</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCleaningRequest} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Room number
                  <input
                    value={roomNumber}
                    onChange={(event) => setRoomNumber(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="301"
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Notes for housekeeping
                  <input
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="Please refresh linens"
                  />
                </label>
              </div>
              {confirmation && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 animate-scale-in">
                  {confirmation}
                </div>
              )}
              <Button type="submit" variant="luxury" size="lg" loading={submitting} className="h-12">
                <Sparkles className="mr-2 h-4 w-4" />
                Notify housekeeping
              </Button>
            </form>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { name: "Room service", icon: Utensils },
                { name: "Housekeeping", icon: CheckSquare },
                { name: "WiFi", icon: Wifi },
                { name: "Valet", icon: Car },
              ].map((service) => (
                <div key={service.name} className="rounded-2xl bg-slate-50 p-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                  <service.icon className="mx-auto mb-2 h-6 w-6 text-teal-600" />
                  <p className="text-sm font-medium text-slate-800">{service.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 shadow-xl">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>My requests</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {myRequests.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">
                No requests yet. Tap notify housekeeping when you want the room cleaned.
              </p>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 6).map((request) => (
                  <div key={request.id} className="rounded-2xl border border-slate-100 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-900">{request.title}</p>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  ArrowUpRight,
  Bed,
  CheckSquare,
  Clock,
  Sparkles,
  Star,
  Check,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRooms, updateRoomStatus } from "@/lib/rooms-data"

export default function HousekeepingDashboard() {
  const { user } = useAuth()
  const { notifications, updateStatus } = useNotifications()
  const [toastMsg, setToastMsg] = useState("")

  const rooms = getRooms()
  const cleaningRooms = rooms.filter((r) => r.status === "cleaning")

  const cleaningRequests = notifications.filter((item) => item.type === "room_cleaning")
  const pending = cleaningRequests.filter((item) => item.status === "unread" || item.status === "in_progress")

  const showToast = (m: string) => {
    setToastMsg(m)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const handleStartCleaning = (requestId: string, roomNumber?: string) => {
    updateStatus(requestId, "in_progress")
    if (roomNumber) {
      updateRoomStatus(roomNumber, "cleaning")
    }
    showToast(`Cleaning started for Room ${roomNumber || "assigned"}!`)
  }

  const handleMarkClean = (requestId: string, roomNumber?: string) => {
    updateStatus(requestId, "completed")
    if (roomNumber) {
      updateRoomStatus(roomNumber, "vacant")
    }
    showToast(`Room ${roomNumber || "assigned"} marked clean & vacant for next guest!`)
  }

  const stats = [
    { title: "Live Guest Requests", value: String(cleaningRequests.length), change: `${pending.length} pending`, icon: Sparkles, tone: "bg-amber-100 text-amber-700" },
    { title: "Turnover Queue", value: String(cleaningRooms.length || 4), change: "Rooms in queue", icon: Bed, tone: "bg-blue-100 text-blue-700" },
    { title: "Sanitized Today", value: "24", change: "+14 complete", icon: CheckSquare, tone: "bg-emerald-100 text-emerald-700" },
    { title: "Cleanliness Audit", value: "4.96 ★", change: "Excellence score", icon: Star, tone: "bg-purple-100 text-purple-700" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-sm font-semibold flex items-center gap-2 animate-scale-in">
            <Check className="w-4 h-4 text-emerald-400" />
            {toastMsg}
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Housekeeping & Hygiene</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-slate-900">Live Housekeeping Board</h1>
          <p className="mt-1 text-slate-600 text-sm">
            Welcome back, {user?.full_name || "Housekeeping Lead"}! Real-time guest room cleaning alerts appear immediately.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 bg-white/90 shadow-lg hover:-translate-y-1 transition-all">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
                    <stat.icon size={22} />
                  </div>
                  <span className="flex items-center text-xs font-semibold text-emerald-600">
                    <ArrowUpRight size={14} className="mr-0.5" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold font-display text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cleaning Requests Queue */}
        <Card className="border-0 bg-white/90 shadow-xl">
          <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="font-display text-2xl text-slate-900">Live Cleaning Orders</CardTitle>
              <p className="text-xs text-slate-500">Real-time alerts from in-house guests and Front Desk checkout turnovers</p>
            </div>
            <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
              {pending.length} Requiring Attention
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {cleaningRequests.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-16 text-center text-slate-500">
                <Clock className="mb-3 h-8 w-8 text-slate-300" />
                <p className="font-semibold text-sm">All suites are sanitized and inspected.</p>
                <p className="text-xs text-slate-400 mt-1">New guest requests will notify this console instantly.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cleaningRequests.map((request) => (
                  <div key={request.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between hover:bg-slate-50/80 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded">
                          Room {request.roomNumber}
                        </span>
                        <p className="font-semibold text-slate-800 text-sm">{request.title}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{request.message}</p>
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                        {request.status.replace("_", " ")}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartCleaning(request.id, request.roomNumber)}
                        className="text-xs rounded-xl"
                      >
                        Start Cleaning
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleMarkClean(request.id, request.roomNumber)}
                        className="text-xs rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Mark Clean & Ready
                      </Button>
                    </div>
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

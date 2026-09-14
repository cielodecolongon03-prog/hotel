"use client"

import { formatDistanceToNow } from "date-fns"
import {
  ArrowUpRight,
  Bed,
  CheckSquare,
  Clock,
  Sparkles,
  Star,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HousekeepingDashboard() {
  const { user } = useAuth()
  const { notifications, updateStatus } = useNotifications()
  const cleaningRequests = notifications.filter((item) => item.type === "room_cleaning")
  const pending = cleaningRequests.filter((item) => item.status === "unread" || item.status === "in_progress")

  const stats = [
    { title: "Guest requests", value: String(cleaningRequests.length), change: `${pending.length} live`, icon: Sparkles, tone: "bg-amber-100 text-amber-700" },
    { title: "Rooms to clean", value: "34", change: "+8", icon: Bed, tone: "bg-blue-100 text-blue-700" },
    { title: "Completed today", value: "21", change: "+12", icon: CheckSquare, tone: "bg-emerald-100 text-emerald-700" },
    { title: "Quality rating", value: "4.9", change: "+0.1", icon: Star, tone: "bg-purple-100 text-purple-700" },
  ]

  return (
    <DashboardLayout>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Housekeeping</p>
        <h1 className="mt-1 font-display text-4xl text-slate-900">Live cleaning board</h1>
        <p className="mt-2 text-slate-600">
          {user?.full_name || "Housekeeping"}, new guest requests pop up the moment they arrive.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 bg-white/85 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
                  <stat.icon size={22} />
                </div>
                <span className="flex items-center text-sm font-medium text-emerald-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-500">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 bg-white/90 shadow-xl">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-2xl">Guest cleaning requests</CardTitle>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              {pending.length} need attention
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cleaningRequests.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center text-slate-500">
              <Clock className="mb-3 h-8 w-8 text-slate-300" />
              Waiting for the next guest request.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cleaningRequests.map((request) => (
                <div key={request.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Room {request.roomNumber}</p>
                    <p className="mt-1 text-sm text-slate-500">{request.message}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                      {request.status.replace("_", " ")}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(request.id, "in_progress")}>
                      Start
                    </Button>
                    <Button size="sm" variant="luxury" onClick={() => updateStatus(request.id, "completed")}>
                      Mark clean
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

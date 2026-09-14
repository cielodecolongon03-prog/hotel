"use client"

import { useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Activity,
  Bell,
  CheckSquare,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { notifications, unreadCount, updateStatus, markAllRead } = useNotifications()
  const [filter, setFilter] = useState<"all" | "unread" | "room_cleaning">("all")

  const cleaningQueue = notifications.filter((item) => item.type === "room_cleaning")
  const visible = useMemo(() => {
    return notifications.filter((item) => {
      if (filter === "unread") return item.status === "unread"
      if (filter === "room_cleaning") return item.type === "room_cleaning"
      return true
    })
  }, [filter, notifications])

  const stats = [
    {
      title: "Live alerts",
      value: String(unreadCount),
      hint: "Waiting on staff",
      icon: Bell,
      tone: "from-rose-500 to-amber-500",
    },
    {
      title: "Cleaning requests",
      value: String(cleaningQueue.length),
      hint: "Guest housekeeping",
      icon: Sparkles,
      tone: "from-emerald-500 to-teal-500",
    },
    {
      title: "Staff workspaces",
      value: "6",
      hint: "Role dashboards",
      icon: Users,
      tone: "from-blue-500 to-indigo-500",
    },
    {
      title: "System health",
      value: "Online",
      hint: "Operations ready",
      icon: Activity,
      tone: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
            Administrator
          </p>
          <h1 className="mt-1 font-display text-4xl text-slate-900">Command center</h1>
          <p className="mt-2 text-slate-600">
            Welcome, {user?.full_name || "Admin"}. Guest cleaning requests appear here instantly.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          <Shield size={16} className="text-amber-600" />
          Full access
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur-sm hover:-translate-y-1"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <CardContent className="p-6">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.tone} text-white shadow-md`}>
                <stat.icon size={22} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">{stat.value}</h3>
              <p className="mt-1 text-sm font-medium text-slate-700">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="border-0 bg-white/85 shadow-xl xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
            <CardTitle className="font-display text-2xl">Operations inbox</CardTitle>
            <div className="flex gap-2">
              {(["all", "unread", "room_cleaning"] as const).map((key) => (
                <Button
                  key={key}
                  size="sm"
                  variant={filter === key ? "luxury" : "outline"}
                  onClick={() => setFilter(key)}
                >
                  {key === "room_cleaning" ? "Cleaning" : key}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {visible.length === 0 ? (
              <div className="px-6 py-16 text-center text-slate-500">
                No notifications in this view.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {visible.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.message}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, "in_progress")}>
                        Assign
                      </Button>
                      <Button size="sm" variant="luxury" onClick={() => updateStatus(item.id, "completed")}>
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Admin playbook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Guest cleaning requests trigger a live popup for housekeeping and admin.",
              "Use the inbox to assign and resolve requests without leaving this view.",
              "Role dashboards stay specialized while you keep a hotel-wide pulse.",
            ].map((line) => (
              <div key={line} className="flex gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <p className="text-sm leading-6 text-slate-100">{line}</p>
              </div>
            ))}
            <Button variant="secondary" className="w-full" onClick={markAllRead}>
              Clear unread alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

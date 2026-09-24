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
  CreditCard,
  Sliders,
  Check,
  Send,
  X,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ManageRatesModal } from "@/components/booking/ManageRatesModal"
import { ProcessPaymentModal } from "@/components/payment/ProcessPaymentModal"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { notifications, unreadCount, updateStatus, markAllRead, addNotification } = useNotifications()
  const [filter, setFilter] = useState<"all" | "unread" | "room_cleaning">("all")
  const [isRatesOpen, setIsRatesOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [broadcastSent, setBroadcastSent] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const showToast = (m: string) => {
    setToastMsg(m)
    setTimeout(() => setToastMsg(""), 3000)
  }

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
      hint: "All Services 100%",
      icon: Activity,
      tone: "from-amber-500 to-orange-500",
    },
  ]

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastMessage.trim()) return

    addNotification({
      title: "Hotel-wide Admin Announcement",
      message: broadcastMessage.trim(),
      type: "general",
      targetRoles: ["admin", "hotel_manager", "front_desk", "housekeeping", "maintenance", "hotel_owner"],
    })

    setBroadcastMessage("")
    setBroadcastSent(true)
    setTimeout(() => setBroadcastSent(false), 3000)
    showToast("Announcement broadcasted to all staff dashboards!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-sm font-semibold flex items-center gap-2 animate-scale-in">
            <Check className="w-4 h-4 text-emerald-400" />
            {toastMsg}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Administrator</p>
            <h1 className="mt-1 font-display text-4xl font-bold text-slate-900">Executive Command Center</h1>
            <p className="mt-1 text-slate-600 text-sm">
              Welcome, {user?.full_name || "Admin"}. Comprehensive hotel operations, tariffs, and real-time live staff dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setIsRatesOpen(true)}
              variant="outline"
              className="rounded-xl border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Manage Room Rates
            </Button>
            <Button
              onClick={() => setIsPaymentOpen(true)}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Payment Terminal
            </Button>
            <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
              <Shield size={14} className="text-amber-600" />
              Full Access Root
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="overflow-hidden border-0 bg-white/90 shadow-lg hover:-translate-y-1 transition-all"
            >
              <CardContent className="p-6">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.tone} text-white shadow-md`}
                >
                  <stat.icon size={22} />
                </div>
                <h3 className="text-3xl font-bold font-display text-slate-900">{stat.value}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-700">{stat.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Operations Inbox & Admin Playbook */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="border-0 bg-white/90 shadow-xl xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <CardTitle className="font-display text-2xl">Operations Dispatch Inbox</CardTitle>
                <p className="text-xs text-slate-500">Live guest cleaning orders, maintenance tickets, and front-desk events.</p>
              </div>
              <div className="flex gap-2">
                {(["all", "unread", "room_cleaning"] as const).map((key) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={filter === key ? "luxury" : "outline"}
                    onClick={() => setFilter(key)}
                    className="text-xs rounded-xl"
                  >
                    {key === "room_cleaning" ? "Cleaning" : key}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {visible.length === 0 ? (
                <div className="px-6 py-16 text-center text-slate-500 text-sm">
                  No notifications in this view. All current tasks are settled!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                  {visible.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/80 transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              item.status === "unread"
                                ? "bg-rose-100 text-rose-800"
                                : item.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{item.message}</p>
                        <p className="mt-2 text-[11px] text-slate-400">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateStatus(item.id, "in_progress")
                            showToast(`Task for Room ${item.roomNumber || "Assigned"} marked In-Progress!`)
                          }}
                          className="text-xs rounded-xl"
                        >
                          Assign Staff
                        </Button>
                        <Button
                          size="sm"
                          variant="luxury"
                          onClick={() => {
                            updateStatus(item.id, "completed")
                            showToast(`Task resolved!`)
                          }}
                          className="text-xs rounded-xl"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Playbook & Broadcast Console */}
          <div className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-xl">
              <CardHeader className="pb-3 border-b border-white/10">
                <CardTitle className="text-white text-lg font-display">Staff Broadcast Console</CardTitle>
                <p className="text-xs text-amber-200/80">Send urgent hotel-wide alerts to all employee dashboards.</p>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <form onSubmit={handleSendBroadcast} className="space-y-3">
                  <textarea
                    rows={3}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Type urgent hotel announcement or VIP arrival advisory..."
                    className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                  {broadcastSent && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Broadcast dispatched to all terminals!
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs h-10"
                  >
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Transmit Alert
                  </Button>
                </form>

                <Button
                  variant="secondary"
                  className="w-full text-xs rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  onClick={() => {
                    markAllRead()
                    showToast("Marked all alerts as read!")
                  }}
                >
                  Clear Unread Alert Queue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rate Management Modal */}
      {isRatesOpen && (
        <ManageRatesModal isOpen={isRatesOpen} onClose={() => setIsRatesOpen(false)} />
      )}

      {/* Payment Modal */}
      {isPaymentOpen && (
        <ProcessPaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
      )}
    </DashboardLayout>
  )
}

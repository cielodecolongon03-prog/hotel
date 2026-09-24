"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckSquare,
  Users,
  Star,
  Clock,
  ArrowUpRight,
  DollarSign,
  Building,
  Calendar,
  Sliders,
  Sparkles,
  BarChart3,
  Check,
} from "lucide-react"
import { ManageRatesModal } from "@/components/booking/ManageRatesModal"
import { getRooms, getBookings, formatCurrency } from "@/lib/rooms-data"

export default function ManagerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [isRatesOpen, setIsRatesOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const rooms = getRooms()
  const bookings = getBookings()

  const occupiedCount = rooms.filter((r) => r.status === "occupied").length
  const occupancyPercent = Math.round((occupiedCount / (rooms.length || 1)) * 100)

  const [recentTasks, setRecentTasks] = useState([
    { id: 1, title: "Review Q3 Staff Performance", department: "HR", priority: "High", status: "In Progress" },
    { id: 2, title: "Monthly RevPAR & Tariff Budget Review", department: "Finance", priority: "High", status: "Pending" },
    { id: 3, title: "Guest Satisfaction Survey Analysis", department: "Guest Services", priority: "Medium", status: "Completed" },
    { id: 4, title: "Executive Department Heads Meeting", department: "Management", priority: "Medium", status: "Pending" },
    { id: 5, title: "Prepare VIP Penthouse Protocol", department: "Operations", priority: "High", status: "In Progress" },
  ])

  const stats = [
    {
      title: "Active Occupancy",
      value: `${occupancyPercent}%`,
      change: `${occupiedCount} / ${rooms.length} Suites`,
      trend: "up",
      icon: Building,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Staff on Duty",
      value: "42",
      change: "4 Departments active",
      trend: "up",
      icon: Users,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Average Daily Rate (ADR)",
      value: "$285",
      change: "+12% vs prior month",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Guest Satisfaction",
      value: "4.9 ★",
      change: "Based on 148 reviews",
      trend: "up",
      icon: Star,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  const departmentStats = [
    { name: "Front Desk & Concierge", efficiency: 96, tasks: 48 },
    { name: "Housekeeping & Turnovers", efficiency: 91, tasks: 72 },
    { name: "Maintenance & Facilities", efficiency: 94, tasks: 26 },
    { name: "Food & Beverage (In-Room)", efficiency: 89, tasks: 38 },
  ]

  const toggleTaskStatus = (id: number) => {
    setRecentTasks(
      recentTasks.map((t) =>
        t.id === id ? { ...t, status: t.status === "Completed" ? "In Progress" : "Completed" } : t
      )
    )
    setToastMsg("Task status updated!")
    setTimeout(() => setToastMsg(""), 2500)
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">General Operations</p>
            <h1 className="mt-1 font-display text-4xl font-bold text-slate-900">General Manager Command</h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Welcome back, {user?.full_name || "Hotel Manager"}. Overview of property performance, department metrics, and revenue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setIsRatesOpen(true)}
              variant="outline"
              className="rounded-xl border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Room Rate Tariffs
            </Button>
            <Button
              onClick={() => router.push("/dashboard/reports")}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md"
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              Analytics & Reports
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight size={14} className="mr-0.5" /> {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold font-display text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tasks & Department Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Management Tasks */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="font-display text-2xl text-slate-900">Management Action Items</CardTitle>
                  <p className="text-xs text-slate-500">Key administrative and departmental follow-ups</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/tasks")}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  View All Tasks →
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskStatus(task.id)}
                      className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{task.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{task.department}</span>
                          <span>•</span>
                          <span className={`font-semibold ${task.priority === "High" ? "text-orange-600" : "text-slate-600"}`}>
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <div>
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="font-display text-xl text-slate-900">Department KPI Efficiency</CardTitle>
                <p className="text-xs text-slate-500">Weekly operational audit scores</p>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {departmentStats.map((dept) => (
                  <div key={dept.name} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{dept.name}</span>
                      <span className="font-semibold text-blue-700">{dept.tasks} orders</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${dept.efficiency}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 text-right">{dept.efficiency}% SLA Efficiency</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-900 via-slate-900 to-purple-950 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-display">General Management Controls</h3>
              <p className="text-xs text-blue-200 max-w-lg">
                Instantly generate real-time financial P&L and HR analytics reports or audit active staff rosters across all hotel divisions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => router.push("/dashboard/reports")}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl h-11 px-5"
              >
                <BarChart3 className="w-4 h-4 mr-2 text-blue-700" />
                View Reports
              </Button>
              <Button
                onClick={() => router.push("/dashboard/employees")}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-bold rounded-xl h-11 px-5"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Staff Roster
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {isRatesOpen && (
        <ManageRatesModal isOpen={isRatesOpen} onClose={() => setIsRatesOpen(false)} />
      )}
    </DashboardLayout>
  )
}

"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  CheckSquare,
  Users,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  AlertTriangle,
  Box,
  Settings,
  Plus,
  Check,
  PackagePlus,
  Sparkles,
} from "lucide-react"

export default function MaintenanceDashboard() {
  const { user } = useAuth()
  const [maintenanceTasks, setMaintenanceTasks] = useState([
    { id: 1, room: "305", issue: "AC Condenser Thermostat Calibration", priority: "Urgent", status: "In Progress", time: "2:00 PM" },
    { id: 2, room: "201", issue: "Bathroom Faucet Cartridge Seal", priority: "High", status: "Pending", time: "2:30 PM" },
    { id: 3, room: "402", issue: "Balcony LED Lighting Replacement", priority: "Medium", status: "Completed", time: "1:00 PM" },
    { id: 4, room: "315", issue: "RFID Smart Door Lock Battery Replacement", priority: "Medium", status: "Pending", time: "1:45 PM" },
    { id: 5, room: "108", issue: "Smart TV HDMI Media Hub Audio Check", priority: "Low", status: "In Progress", time: "12:30 PM" },
  ])

  const [equipment, setEquipment] = useState([
    { name: "Central HVAC Chillers", status: "Operational", lastCheck: "Today" },
    { name: "Main Passenger Elevators", status: "Operational", lastCheck: "1 day ago" },
    { name: "Emergency Backup Generator", status: "Operational", lastCheck: "Scheduled test passed" },
    { name: "Solar Heated Water Boiler Unit", status: "Operational", lastCheck: "2 days ago" },
  ])

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isPartsModalOpen, setIsPartsModalOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({ room: "", issue: "", priority: "High" })
  const [newPart, setNewPart] = useState({ partName: "", quantity: 1, urgency: "Normal" })
  const [toastMsg, setToastMsg] = useState("")

  const showToast = (m: string) => {
    setToastMsg(m)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicket.room || !newTicket.issue) return

    const t = {
      id: Date.now(),
      room: newTicket.room,
      issue: newTicket.issue,
      priority: newTicket.priority,
      status: "Pending",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMaintenanceTasks([t, ...maintenanceTasks])
    setNewTicket({ room: "", issue: "", priority: "High" })
    setIsTicketModalOpen(false)
    showToast(`Maintenance ticket for Room ${t.room} logged!`)
  }

  const handleOrderPart = (e: React.FormEvent) => {
    e.preventDefault()
    setIsPartsModalOpen(false)
    showToast(`Order request submitted for ${newPart.quantity}x ${newPart.partName}!`)
    setNewPart({ partName: "", quantity: 1, urgency: "Normal" })
  }

  const toggleTaskStatus = (id: number) => {
    setMaintenanceTasks(
      maintenanceTasks.map((t) =>
        t.id === id ? { ...t, status: t.status === "Completed" ? "In Progress" : "Completed" } : t
      )
    )
    showToast("Ticket status updated!")
  }

  const toggleEquipment = (name: string) => {
    setEquipment(
      equipment.map((eq) =>
        eq.name === name
          ? {
              ...eq,
              status: eq.status === "Operational" ? "Maintenance" : "Operational",
              lastCheck: "Just now",
            }
          : eq
      )
    )
    showToast(`Equipment ${name} status toggled!`)
  }

  const stats = [
    {
      title: "Open Work Orders",
      value: String(maintenanceTasks.filter((t) => t.status !== "Completed").length),
      change: "Active tickets",
      trend: "up",
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Completed Today",
      value: String(maintenanceTasks.filter((t) => t.status === "Completed").length),
      change: "Resolved issues",
      trend: "up",
      icon: CheckSquare,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Equipment Uptime",
      value: "99.4%",
      change: "Facilities Online",
      trend: "up",
      icon: Settings,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Avg Response Time",
      value: "14m",
      change: "Under 15m target",
      trend: "down",
      icon: Clock,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Engineering & Facilities</p>
            <h1 className="mt-1 font-display text-4xl font-bold text-slate-900">Maintenance Command</h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Welcome back, {user?.full_name || "Chief Engineer"}! Manage work orders, HVAC chillers, and equipment health.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setIsPartsModalOpen(true)}
              variant="outline"
              className="rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold"
            >
              <PackagePlus className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Order Spare Parts
            </Button>
            <Button
              onClick={() => setIsTicketModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Work Ticket
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
                  <span className="text-xs font-semibold text-slate-500">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold font-display text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tickets & Equipment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="font-display text-2xl text-slate-900">Active Maintenance Tickets</CardTitle>
                  <p className="text-xs text-slate-500">Tap any ticket to toggle completion status</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTicketModalOpen(true)}
                  className="text-xs rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Ticket
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {maintenanceTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskStatus(task.id)}
                      className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            Room {task.room}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{task.issue}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>Reported: {task.time}</span>
                          <span>•</span>
                          <span className={`font-semibold ${task.priority === "Urgent" ? "text-rose-600" : "text-amber-600"}`}>
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment Status */}
          <div>
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="font-display text-xl text-slate-900">Equipment Health</CardTitle>
                <p className="text-xs text-slate-500">Critical building facilities</p>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {equipment.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => toggleEquipment(item.name)}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                      <p className="text-[11px] text-slate-500">{item.lastCheck}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === "Operational"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Create Maintenance Work Order">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Room or Area</label>
            <input
              type="text"
              value={newTicket.room}
              onChange={(e) => setNewTicket({ ...newTicket, room: e.target.value })}
              placeholder="e.g. 305 or Rooftop Pool"
              required
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Issue Description</label>
            <textarea
              rows={3}
              value={newTicket.issue}
              onChange={(e) => setNewTicket({ ...newTicket, issue: e.target.value })}
              placeholder="Describe malfunction or diagnostic needed..."
              required
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
            <select
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsTicketModalOpen(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-orange-600 text-white font-bold">
              Dispatch Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Order Parts Modal */}
      <Modal isOpen={isPartsModalOpen} onClose={() => setIsPartsModalOpen(false)} title="Requisition Spare Parts">
        <form onSubmit={handleOrderPart} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Part Name / Component SKU</label>
            <input
              type="text"
              value={newPart.partName}
              onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })}
              placeholder="e.g. Daikin Inverter Coil 1.5HP"
              required
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={newPart.quantity}
                onChange={(e) => setNewPart({ ...newPart, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Urgency</label>
              <select
                value={newPart.urgency}
                onChange={(e) => setNewPart({ ...newPart, urgency: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              >
                <option value="Emergency (Same Day)">Emergency</option>
                <option value="Urgent (24h)">Urgent</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsPartsModalOpen(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-blue-600 text-white font-bold">
              Submit Requisition
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

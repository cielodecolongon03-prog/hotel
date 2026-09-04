"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Users, Star, Clock, ArrowUpRight, ArrowDownRight, Wrench, AlertTriangle, Box, Settings } from "lucide-react"

export default function MaintenanceDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Open Tickets",
      value: "12",
      change: "+3",
      trend: "up",
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Completed Today",
      value: "8",
      change: "+2",
      trend: "up",
      icon: CheckSquare,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "In Progress",
      value: "5",
      change: "-1",
      trend: "down",
      icon: Wrench,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Avg Response",
      value: "15m",
      change: "-3m",
      trend: "down",
      icon: Clock,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ]

  const maintenanceTasks = [
    { id: 1, room: "305", issue: "AC Not Working", priority: "Urgent", status: "In Progress", time: "2:00 PM" },
    { id: 2, room: "201", issue: "Leaking Faucet", priority: "High", status: "Pending", time: "2:30 PM" },
    { id: 3, room: "402", issue: "Electrical Outlet", priority: "High", status: "Completed", time: "1:00 PM" },
    { id: 4, room: "315", issue: "Door Lock", priority: "Medium", status: "Pending", time: "1:45 PM" },
    { id: 5, room: "108", issue: "TV Not Working", priority: "Medium", status: "In Progress", time: "12:30 PM" },
  ]

  const equipment = [
    { name: "HVAC System", status: "Operational", lastCheck: "2 days ago" },
    { name: "Elevator", status: "Operational", lastCheck: "1 day ago" },
    { name: "Backup Generator", status: "Maintenance", lastCheck: "5 days ago" },
    { name: "Water Heater", status: "Operational", lastCheck: "3 days ago" },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name || 'Maintenance Staff'}! Here's your maintenance schedule.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.trend === "up" ? (
                        <ArrowUpRight size={16} className="mr-1" />
                      ) : (
                        <ArrowDownRight size={16} className="mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Maintenance Tasks */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle>Maintenance Tickets</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {maintenanceTasks.map((task) => (
                      <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{task.issue} - Room {task.room}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span>{task.time}</span>
                              <span>•</span>
                              <span className={`font-medium ${
                                task.priority === "Urgent" ? "text-red-600" :
                                task.priority === "High" ? "text-orange-600" :
                                "text-gray-600"
                              }`}>{task.priority}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              task.status === "Completed" ? "bg-green-100 text-green-700" :
                              task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Equipment Status */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Equipment Status</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {equipment.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.lastCheck}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Operational" ? "bg-green-100 text-green-700" :
                          item.status === "Maintenance" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Maintenance Actions</h3>
                    <p className="text-orange-100">Create tickets, order parts, and schedule equipment checks</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                      New Ticket
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      Order Parts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Users, Star, Clock, ArrowUpRight, ArrowDownRight, Calendar, CreditCard, Bell, Key } from "lucide-react"

export default function FrontDeskDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Today's Check-ins",
      value: "23",
      change: "+5",
      trend: "up",
      icon: CheckSquare,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Check-outs",
      value: "18",
      change: "+2",
      trend: "up",
      icon: Clock,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Active Guests",
      value: "127",
      change: "+15",
      trend: "up",
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Pending Requests",
      value: "7",
      change: "-3",
      trend: "down",
      icon: Bell,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  const recentTasks = [
    { id: 1, title: "Check-in Guest Room 301", guest: "John Smith", time: "2:30 PM", status: "In Progress" },
    { id: 2, title: "Process Payment Room 205", guest: "Sarah Johnson", time: "2:15 PM", status: "Pending" },
    { id: 3, title: "Guest Checkout Room 402", guest: "Michael Brown", time: "1:45 PM", status: "Completed" },
    { id: 4, title: "Issue Key Card Room 315", guest: "Emily Davis", time: "1:30 PM", status: "Pending" },
    { id: 5, title: "Handle Guest Complaint", guest: "Robert Wilson", time: "12:00 PM", status: "In Progress" },
  ]

  const roomStatus = [
    { number: "201", status: "Occupied", guest: "John Smith" },
    { number: "202", status: "Vacant", guest: "-" },
    { number: "203", status: "Occupied", guest: "Sarah Johnson" },
    { number: "204", status: "Maintenance", guest: "-" },
    { number: "205", status: "Occupied", guest: "Michael Brown" },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Front Desk Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name || 'Front Desk Staff'}! Here's your daily overview.</p>
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
            {/* Recent Tasks */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle>Today's Front Desk Tasks</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span>{task.guest}</span>
                              <span>•</span>
                              <span>{task.time}</span>
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

            {/* Room Status */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Room Status</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {roomStatus.map((room) => (
                      <div key={room.number} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Key className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Room {room.number}</h4>
                            <p className="text-sm text-gray-600">{room.guest}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.status === "Occupied" ? "bg-green-100 text-green-700" :
                          room.status === "Vacant" ? "bg-blue-100 text-blue-700" :
                          room.status === "Maintenance" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {room.status}
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
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Front Desk Actions</h3>
                    <p className="text-blue-100">Check in guests, process payments, and manage reservations</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                      Check-in Guest
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      Process Payment
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

"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Users, Star, Clock, ArrowUpRight, ArrowDownRight, Sparkles, Bed, Trash2, Sheet } from "lucide-react"

export default function HousekeepingDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Rooms to Clean",
      value: "34",
      change: "+8",
      trend: "up",
      icon: Bed,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Completed Today",
      value: "21",
      change: "+12",
      trend: "up",
      icon: CheckSquare,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Average Time",
      value: "28m",
      change: "-2m",
      trend: "down",
      icon: Clock,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Quality Rating",
      value: "4.9",
      change: "+0.1",
      trend: "up",
      icon: Star,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  const roomTasks = [
    { id: 1, room: "301", type: "Turn-down Service", priority: "High", status: "In Progress", time: "2:00 PM" },
    { id: 2, room: "205", type: "Full Clean", priority: "High", status: "Pending", time: "2:30 PM" },
    { id: 3, room: "402", type: "Checkout Clean", priority: "Urgent", status: "Pending", time: "1:00 PM" },
    { id: 4, room: "315", type: "Towel Service", priority: "Medium", status: "Completed", time: "12:30 PM" },
    { id: 5, room: "108", type: "Full Clean", priority: "High", status: "In Progress", time: "1:45 PM" },
  ]

  const supplies = [
    { name: "Clean Towels", stock: 45, status: "Good" },
    { name: "Bed Sheets", stock: 30, status: "Good" },
    { name: "Cleaning Solution", stock: 12, status: "Low" },
    { name: "Toiletries", stock: 25, status: "Good" },
  ]

  return (
    <DashboardLayout>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Housekeeping Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name || 'Housekeeping Staff'}! Here's your cleaning schedule.</p>
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
            {/* Room Tasks */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle>Room Cleaning Tasks</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {roomTasks.map((task) => (
                      <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{task.type} - Room {task.room}</h4>
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

            {/* Supplies */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Supplies Status</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {supplies.map((supply) => (
                      <div key={supply.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{supply.name}</h4>
                            <p className="text-sm text-gray-600">{supply.stock} units</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          supply.status === "Good" ? "bg-green-100 text-green-700" :
                          supply.status === "Low" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {supply.status}
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
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Housekeeping Actions</h3>
                    <p className="text-green-100">Mark rooms clean, request supplies, and view cleaning schedules</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-green-50">
                      Mark Clean
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      Request Supplies
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
  )
}

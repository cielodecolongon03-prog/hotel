"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Users, Star, Clock, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Building, Calendar } from "lucide-react"

export default function ManagerDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Tasks",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: CheckSquare,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Employees",
      value: "42",
      change: "+3",
      trend: "up",
      icon: Users,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Occupancy Rate",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: Building,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Revenue (Monthly)",
      value: "$125K",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  const recentTasks = [
    { id: 1, title: "Review Staff Performance", department: "HR", priority: "High", status: "In Progress" },
    { id: 2, title: "Monthly Budget Report", department: "Finance", priority: "High", status: "Pending" },
    { id: 3, title: "Guest Satisfaction Survey", department: "Guest Services", priority: "Medium", status: "Completed" },
    { id: 4, title: "Staff Meeting", department: "Management", priority: "Medium", status: "Pending" },
    { id: 5, title: "Q4 Planning", department: "Strategy", priority: "High", status: "In Progress" },
  ]

  const departmentStats = [
    { name: "Front Desk", efficiency: 94, tasks: 45 },
    { name: "Housekeeping", efficiency: 89, tasks: 67 },
    { name: "Maintenance", efficiency: 91, tasks: 23 },
    { name: "Restaurant", efficiency: 87, tasks: 34 },
  ]

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Operations</p>
          <h1 className="mt-1 font-display text-4xl text-gray-900 mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.full_name || 'Manager'}! Here's your management overview.</p>
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
                    <CardTitle>Management Tasks</CardTitle>
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
                              <span>{task.department}</span>
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

            {/* Department Stats */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {departmentStats.map((dept) => (
                      <div key={dept.name} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{dept.name}</h4>
                          <span className="text-sm text-gray-600">{dept.tasks} tasks</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${dept.efficiency}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{dept.efficiency}% efficiency</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Management Actions</h3>
                    <p className="text-blue-100">View reports, manage staff, and analyze performance</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                      View Reports
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      Manage Staff
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

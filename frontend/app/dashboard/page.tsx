"use client"

import React from "react"
import { motion } from "framer-motion"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckSquare, 
  Users, 
  Star, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export default function DashboardPage() {
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
      title: "Avg Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Pending Tasks",
      value: "18",
      change: "-5",
      trend: "down",
      icon: Clock,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ]

  const recentTasks = [
    { id: 1, title: "Clean Room 201", department: "Housekeeping", priority: "High", status: "In Progress" },
    { id: 2, title: "Check-in Guest", department: "Front Desk", priority: "Medium", status: "Pending" },
    { id: 3, title: "Fix AC in Room 305", department: "Maintenance", priority: "Urgent", status: "Completed" },
    { id: 4, title: "Prepare VIP Suite", department: "Housekeeping", priority: "High", status: "Pending" },
    { id: 5, title: "Guest Checkout", department: "Front Desk", priority: "Medium", status: "In Progress" },
  ]

  const topPerformers = [
    { name: "Maria Santos", role: "Housekeeping", tasks: 45, rating: 4.9 },
    { name: "John Cruz", role: "Front Desk", tasks: 38, rating: 4.8 },
    { name: "Ana Reyes", role: "Maintenance", tasks: 32, rating: 4.7 },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Tasks</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {recentTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
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
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <motion.div
                        key={performer.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold">
                            {performer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{performer.name}</h4>
                          <p className="text-sm text-gray-600">{performer.role}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1 text-amber-600">
                            <Star size={16} fill="currentColor" />
                            <span className="font-semibold">{performer.rating}</span>
                          </div>
                          <p className="text-xs text-gray-600">{performer.tasks} tasks</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                    <p className="text-blue-100">Create new tasks, add employees, or generate reports</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                      Create Task
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      View Reports
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
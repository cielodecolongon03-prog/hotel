"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Users, Star, Clock, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Building, Target, Award } from "lucide-react"

export default function OwnerDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Revenue",
      value: "$1.2M",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Occupancy Rate",
      value: "89%",
      change: "+7%",
      trend: "up",
      icon: Building,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Guest Satisfaction",
      value: "4.9",
      change: "+0.3",
      trend: "up",
      icon: Star,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Monthly Profit",
      value: "$185K",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ]

  const businessMetrics = [
    { metric: "Total Rooms", value: "150", status: "Stable" },
    { metric: "Staff Count", value: "42", status: "Stable" },
    { metric: "Avg Daily Rate", value: "$245", status: "Up" },
    { metric: "RevPAR", value: "$218", status: "Up" },
  ]

  const recentAchievements = [
    { title: "Best Hotel Award", date: "This Month", category: "Industry" },
    { title: "95% Satisfaction", date: "This Quarter", category: "Guest" },
    { title: "Revenue Target Met", date: "This Month", category: "Financial" },
  ]

  return (
    <DashboardLayout>
        <div>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Ownership</p>
            <h1 className="mt-1 font-display text-4xl text-gray-900 mb-2">Owner Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name || 'Owner'}! Here's your business overview.</p>
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
            {/* Business Metrics */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle>Business Metrics</CardTitle>
                    <Button variant="ghost" size="sm">View Report</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {businessMetrics.map((metric) => (
                      <div key={metric.metric} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">{metric.metric}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <span className={`text-xs font-medium ${
                          metric.status === "Up" ? "text-green-600" :
                          metric.status === "Down" ? "text-red-600" :
                          "text-gray-600"
                        }`}>
                          {metric.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.title} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.date}</p>
                        </div>
                        <span className="text-xs text-gray-500">{achievement.category}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Executive Actions</h3>
                    <p className="text-purple-100">View financial reports, manage assets, and set business goals</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                      Financial Report
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      Set Goals
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

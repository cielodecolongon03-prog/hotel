"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Users, CheckSquare, FileText } from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()
  const [reports] = useState([
    { id: 1, name: "Monthly Performance Report", type: "Performance", date: "2024-09-01", status: "Ready" },
    { id: 2, name: "Q3 Financial Summary", type: "Financial", date: "2024-09-01", status: "Ready" },
    { id: 3, name: "Staff Productivity Analysis", type: "HR", date: "2024-08-28", status: "Ready" },
    { id: 4, name: "Guest Satisfaction Survey", type: "Guest", date: "2024-08-25", status: "Ready" },
    { id: 5, name: "Operational Efficiency Report", type: "Operations", date: "2024-08-20", status: "Ready" },
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Performance": return "bg-blue-100 text-blue-700 border-blue-200"
      case "Financial": return "bg-green-100 text-green-700 border-green-200"
      case "HR": return "bg-purple-100 text-purple-700 border-purple-200"
      case "Guest": return "bg-amber-100 text-amber-700 border-amber-200"
      case "Operations": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
              <p className="text-gray-600">Generate and view hotel reports</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Revenue (MTD)</p>
                    <p className="text-3xl font-bold">$125K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Occupancy Rate</p>
                    <p className="text-3xl font-bold">87%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Tasks Completed</p>
                    <p className="text-3xl font-bold">186</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Guest Rating</p>
                    <p className="text-3xl font-bold">4.7</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Financial Reports</h3>
                    <p className="text-sm text-gray-600">Revenue & expenses</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Generate</Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">HR Reports</h3>
                    <p className="text-sm text-gray-600">Staff performance</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Generate</Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Operational Reports</h3>
                    <p className="text-sm text-gray-600">Daily operations</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Generate</Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{report.date}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(report.type)}`}>
                              {report.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-green-600 font-medium">{report.status}</span>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

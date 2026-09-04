"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Star, Clock, ArrowUpRight, ArrowDownRight, Calendar, Utensils, Wifi, Car } from "lucide-react"

export default function GuestDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Nights Stayed",
      value: "3",
      change: "+0",
      trend: "neutral",
      icon: Calendar,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Room Number",
      value: "301",
      change: "-",
      trend: "neutral",
      icon: CheckSquare,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Service Requests",
      value: "2",
      change: "+1",
      trend: "up",
      icon: Clock,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Loyalty Points",
      value: "450",
      change: "+50",
      trend: "up",
      icon: Star,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  const services = [
    { name: "Room Service", icon: Utensils, available: true },
    { name: "Housekeeping", icon: CheckSquare, available: true },
    { name: "WiFi Access", icon: Wifi, available: true },
    { name: "Valet Parking", icon: Car, available: true },
  ]

  const requests = [
    { id: 1, type: "Extra Towels", status: "Completed", time: "2:00 PM" },
    { id: 2, type: "Wake-up Call", status: "Pending", time: "7:00 AM" },
  ]

  return (
    <ProtectedRoute allowedRoles={["guest"]}>
      <DashboardLayout>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.full_name || 'Guest'}! Enjoy your stay at Crown Jewel Hotel.</p>
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
                    {stat.trend !== "neutral" && (
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
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Hotel Services</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {services.map((service) => (
                      <div key={service.name} className="p-4 bg-gray-50 rounded-lg text-center">
                        <div className={`w-12 h-12 rounded-lg ${service.available ? 'bg-green-100' : 'bg-gray-200'} flex items-center justify-center mx-auto mb-3`}>
                          <service.icon className={`w-6 h-6 ${service.available ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
                        <span className={`text-xs font-medium ${
                          service.available ? "text-green-600" : "text-gray-500"
                        }`}>
                          {service.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Requests */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>My Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {requests.map((request) => (
                      <div key={request.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{request.type}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === "Completed" ? "bg-green-100 text-green-700" :
                            request.status === "Pending" ? "bg-amber-100 text-amber-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{request.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Guest Services</h3>
                    <p className="text-teal-100">Request room service, book amenities, or contact concierge</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
                      Room Service
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      Contact Concierge
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

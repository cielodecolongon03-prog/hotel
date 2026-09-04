"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, TrendingDown, Award, Calendar, User } from "lucide-react"

export default function RatingsPage() {
  const { user } = useAuth()
  const [ratings] = useState([
    { id: 1, employee: "Maria Santos", role: "Housekeeping", overall: 4.9, punctuality: 4.8, quality: 5.0, teamwork: 4.9, period: "September 2024" },
    { id: 2, employee: "John Cruz", role: "Front Desk", overall: 4.8, punctuality: 4.9, quality: 4.7, teamwork: 4.8, period: "September 2024" },
    { id: 3, employee: "Ana Reyes", role: "Maintenance", overall: 4.7, punctuality: 4.6, quality: 4.8, teamwork: 4.7, period: "September 2024" },
    { id: 4, employee: "Robert Wilson", role: "Front Desk", overall: 4.6, punctuality: 4.5, quality: 4.7, teamwork: 4.6, period: "September 2024" },
    { id: 5, employee: "Emily Davis", role: "Housekeeping", overall: 4.5, punctuality: 4.4, quality: 4.6, teamwork: 4.5, period: "September 2024" },
  ])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Ratings</h1>
              <p className="text-gray-600">Track and manage employee performance</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all">
              <Award className="w-4 h-4 mr-2" />
              New Rating
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Avg Rating</p>
                    <p className="text-3xl font-bold">4.7</p>
                  </div>
                  <Star className="w-8 h-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Top Performer</p>
                    <p className="text-lg font-bold">Maria S.</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Rated This Month</p>
                    <p className="text-3xl font-bold">42</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Improvement</p>
                    <p className="text-3xl font-bold">+0.3</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ratings List */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>All Ratings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {ratings.map((rating) => (
                  <div key={rating.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold">{rating.employee.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{rating.employee}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{rating.role}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{rating.period}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Overall</p>
                          {renderStars(rating.overall)}
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Quality</p>
                          {renderStars(rating.quality)}
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Teamwork</p>
                          {renderStars(rating.teamwork)}
                        </div>
                        <div className="text-2xl font-bold text-amber-600">
                          {rating.overall}
                        </div>
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

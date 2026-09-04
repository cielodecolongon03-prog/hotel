"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Star, Search, Filter, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react"

export default function FeedbackPage() {
  const { user } = useAuth()
  const [feedback, setFeedback] = useState([
    { id: 1, guest: "John Smith", rating: 5, category: "Service", message: "Excellent service from the front desk staff!", date: "2024-09-04", status: "Reviewed" },
    { id: 2, guest: "Sarah Johnson", rating: 4, category: "Cleanliness", message: "Room was very clean, but AC was a bit noisy.", date: "2024-09-04", status: "Pending" },
    { id: 3, guest: "Michael Brown", rating: 5, category: "Amenities", message: "Great amenities and very comfortable stay.", date: "2024-09-03", status: "Reviewed" },
    { id: 4, guest: "Emily Davis", rating: 3, category: "Staff", message: "Housekeeping was slow, but staff was friendly.", date: "2024-09-03", status: "Pending" },
    { id: 5, guest: "Robert Wilson", rating: 5, category: "Service", message: "Outstanding service throughout our stay.", date: "2024-09-02", status: "Reviewed" },
  ])
  const [isLoading, setIsLoading] = useState(false)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reviewed": return "bg-green-100 text-green-700 border-green-200"
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200"
      case "Flagged": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Service": return "bg-blue-100 text-blue-700 border-blue-200"
      case "Cleanliness": return "bg-green-100 text-green-700 border-green-200"
      case "Amenities": return "bg-purple-100 text-purple-700 border-purple-200"
      case "Staff": return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleExportFeedback = async () => {
    setIsLoading(true)
    // Simulate export with 2-second delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate file download
    const dataStr = JSON.stringify(feedback, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'feedback-export.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setIsLoading(false)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Feedback</h1>
              <p className="text-gray-600">Monitor and respond to guest reviews</p>
            </div>
            <Button 
              onClick={handleExportFeedback}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {isLoading ? "Exporting..." : "Export Feedback"}
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
                    <p className="text-green-100 text-sm">Total Reviews</p>
                    <p className="text-3xl font-bold">{feedback.length}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">5-Star Reviews</p>
                    <p className="text-3xl font-bold">{feedback.filter(f => f.rating === 5).length}</p>
                  </div>
                  <Star className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Pending Review</p>
                    <p className="text-3xl font-bold">{feedback.filter(f => f.status === "Pending").length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback List */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle>All Feedback</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search feedback..."
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {feedback.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{item.guest}</h4>
                          {renderStars(item.rating)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{item.message}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
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

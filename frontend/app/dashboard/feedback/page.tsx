"use client"

import React, { useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  MessageSquare,
  Star,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Sparkles,
  Check,
} from "lucide-react"

export default function FeedbackPage() {
  const { user } = useAuth()
  const [feedback, setFeedback] = useState([
    { id: 1, guest: "Jonathan Vance", rating: 5, category: "Service", message: "Incredible attention to detail from the Front Desk team during express check-in.", date: "2026-09-24", status: "Reviewed" },
    { id: 2, guest: "Elena Rostova", rating: 5, category: "Cleanliness", message: "The Standard Executive suite was spotless and the high-speed fiber internet made my work seamless.", date: "2026-09-24", status: "Pending" },
    { id: 3, guest: "Lord Alistair Sterling", rating: 5, category: "Amenities", message: "The Penthouse plunge pool and private butler service were transcendent.", date: "2026-09-23", status: "Reviewed" },
    { id: 4, guest: "Marcus Sterling", rating: 4, category: "Staff", message: "Deluxe Haven room was breathtaking. Housekeeping brought extra feather pillows within 5 minutes.", date: "2026-09-22", status: "Pending" },
    { id: 5, guest: "Alexander Wright", rating: 5, category: "Service", message: "The hourly day-use option saved my schedule between conferences. Top notch!", date: "2026-09-24", status: "Reviewed" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const showToast = (m: string) => {
    setToastMsg(m)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}
        />
      ))}
    </div>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reviewed": return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Pending": return "bg-amber-100 text-amber-800 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Service": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cleanliness": return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Amenities": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Staff": return "bg-amber-100 text-amber-800 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      const matchesSearch =
        item.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCat = categoryFilter === "All" || item.category === categoryFilter
      const matchesStatus = statusFilter === "All" || item.status === statusFilter
      return matchesSearch && matchesCat && matchesStatus
    })
  }, [feedback, searchTerm, categoryFilter, statusFilter])

  const handleExportFeedback = () => {
    setIsLoading(true)
    const dataStr = JSON.stringify(feedback, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `crown-jewel-feedback-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setIsLoading(false)
    showToast("Feedback export downloaded successfully!")
  }

  const handleMarkReviewed = (id: number) => {
    setFeedback(
      feedback.map((f) => (f.id === id ? { ...f, status: "Reviewed" } : f))
    )
    setSelectedFeedback(null)
    setReplyText("")
    showToast("Review marked as resolved and noted!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-sm font-semibold flex items-center gap-2 animate-scale-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {toastMsg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Guest Experience</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mt-1">Guest Reviews & Feedback</h1>
            <p className="text-slate-600 text-sm mt-0.5">Monitor guest sentiments, ratings, and service recovery responses.</p>
          </div>
          <Button
            onClick={handleExportFeedback}
            disabled={isLoading}
            className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold hover:opacity-90 shadow-md"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Guest Reviews
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">Average Rating</p>
                <p className="text-3xl font-bold font-display mt-1">4.9 ★</p>
              </div>
              <Star className="w-8 h-8 text-amber-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Total Reviews</p>
                <p className="text-3xl font-bold font-display mt-1">{feedback.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-emerald-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">5-Star Ratings</p>
                <p className="text-3xl font-bold font-display mt-1">{feedback.filter((f) => f.rating === 5).length}</p>
              </div>
              <Star className="w-8 h-8 text-blue-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Pending Action</p>
                <p className="text-3xl font-bold font-display mt-1">{feedback.filter((f) => f.status === "Pending").length}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-200" />
            </CardContent>
          </Card>
        </div>

        {/* Feedback List Card */}
        <Card className="border-0 shadow-xl bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="font-display text-2xl text-slate-900">Guest Review Feed</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search reviews..."
                    className="pl-9 pr-4 py-2 border border-slate-200 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-xs w-60 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Service">Service</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Amenities">Amenities</option>
                  <option value="Staff">Staff</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredFeedback.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">No reviews found matching current filter.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredFeedback.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFeedback(item)}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-slate-900 text-sm">{item.guest}</h4>
                          {renderStars(item.rating)}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">{item.message}</p>
                        <p className="text-[11px] text-slate-400">{item.date}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <Button size="sm" variant="outline" className="text-xs h-7 rounded-lg">
                          Respond
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review & Respond Modal */}
        {selectedFeedback && (
          <Modal
            isOpen={!!selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
            title="Review & Manage Guest Feedback"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{selectedFeedback.guest}</span>
                  {renderStars(selectedFeedback.rating)}
                </div>
                <p className="text-xs text-slate-600 mt-2">{selectedFeedback.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">Submitted: {selectedFeedback.date}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Managerial Resolution Notes / Guest Response
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Record internal resolution actions or compose direct courtesy response..."
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setSelectedFeedback(null)} className="flex-1 rounded-xl">
                  Close
                </Button>
                <Button
                  onClick={() => handleMarkReviewed(selectedFeedback.id)}
                  className="flex-1 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Mark Resolved
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  )
}

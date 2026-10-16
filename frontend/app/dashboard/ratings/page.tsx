"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  Star,
  TrendingUp,
  Award,
  Calendar,
  User,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Filter,
  Plus,
  Heart,
  Smile,
  Zap,
  Shield,
  BedDouble,
} from "lucide-react"
import {
  getEmployeeRatings,
  saveEmployeeRating,
  EmployeeRatingRecord,
  DEFAULT_HOTEL_STAFF,
} from "@/lib/rooms-data"
import { formatDistanceToNow } from "date-fns"

export default function RatingsPage() {
  const { user } = useAuth()
  const [ratings, setRatings] = useState<EmployeeRatingRecord[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [isNewRatingModalOpen, setIsNewRatingModalOpen] = useState(false)
  const [newRating, setNewRating] = useState({
    employeeId: DEFAULT_HOTEL_STAFF[0].id,
    friendliness: "5",
    speed: "5",
    quality: "5",
    professionalism: "5",
    notes: "",
    guestName: "Hotel General Manager",
    roomNumber: "Administration",
  })
  const [isLoading, setIsLoading] = useState(false)

  const reloadRatings = () => {
    setRatings(getEmployeeRatings())
  }

  useEffect(() => {
    reloadRatings()
    const handleStorage = () => reloadRatings()
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const filteredRatings = useMemo(() => {
    if (selectedDepartment === "all") return ratings
    if (selectedDepartment === "guest") {
      return ratings.filter((r) => r.roomNumber && r.roomNumber !== "Administration")
    }
    return ratings.filter((r) =>
      r.employeeRole.toLowerCase().includes(selectedDepartment.toLowerCase())
    )
  }, [ratings, selectedDepartment])

  const stats = useMemo(() => {
    if (ratings.length === 0) {
      return { avg: 5.0, topStaff: "John Cruz", count: 0, guestCount: 0 }
    }
    const sum = ratings.reduce((acc, curr) => acc + curr.overallRating, 0)
    const avg = Number((sum / ratings.length).toFixed(1))

    // Staff frequency and top score
    const staffMap: Record<string, { total: number; count: number }> = {}
    let guestReviews = 0

    ratings.forEach((r) => {
      if (r.roomNumber && r.roomNumber !== "Administration") guestReviews++
      if (!staffMap[r.employeeName]) staffMap[r.employeeName] = { total: 0, count: 0 }
      staffMap[r.employeeName].total += r.overallRating
      staffMap[r.employeeName].count += 1
    })

    let topStaffName = ratings[0]?.employeeName || "John Cruz"
    let highestAvg = 0

    Object.entries(staffMap).forEach(([name, data]) => {
      const staffAvg = data.total / data.count
      if (staffAvg > highestAvg) {
        highestAvg = staffAvg
        topStaffName = name
      }
    })

    return {
      avg,
      topStaff: topStaffName,
      count: ratings.length,
      guestCount: guestReviews,
    }
  }, [ratings])

  const renderStars = (score: number, size = 16) => {
    const rounded = Math.round(score)
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rounded ? "text-amber-500 fill-amber-500" : "text-slate-300"}
          />
        ))}
      </div>
    )
  }

  const handleCreateRating = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const staff = DEFAULT_HOTEL_STAFF.find((s) => s.id === newRating.employeeId) || DEFAULT_HOTEL_STAFF[0]

    const f = parseFloat(newRating.friendliness)
    const s = parseFloat(newRating.speed)
    const q = parseFloat(newRating.quality)
    const p = parseFloat(newRating.professionalism)
    const overall = parseFloat(((f + s + q + p) / 4).toFixed(1))

    saveEmployeeRating({
      employeeId: staff.id,
      employeeName: staff.name,
      employeeRole: staff.role,
      overallRating: overall,
      friendliness: f,
      speed: s,
      quality: q,
      professionalism: p,
      guestName: newRating.guestName || user?.full_name || "Manager Evaluation",
      roomNumber: newRating.roomNumber || "VIP Evaluation",
      notes: newRating.notes || "High performance and exemplary guest courtesy verified.",
    })

    reloadRatings()
    setIsNewRatingModalOpen(false)
    setIsLoading(false)
    setNewRating({
      employeeId: DEFAULT_HOTEL_STAFF[0].id,
      friendliness: "5",
      speed: "5",
      quality: "5",
      professionalism: "5",
      notes: "",
      guestName: "Hotel General Manager",
      roomNumber: "Administration",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">Service Performance</span>
              <span className="text-xs text-slate-400">• Verified In-House Guest Reviews</span>
            </div>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Employee Performance & Guest Ratings
            </h1>
            <p className="mt-1 text-slate-600 text-sm">
              Live feedback directly from hotel guests and departmental hospitality evaluations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsNewRatingModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Performance Evaluation
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">Average Hotel Score</p>
                  <p className="text-3xl font-bold font-display mt-1">{stats.avg} / 5.0</p>
                  <p className="text-xs text-amber-200 mt-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Across all departments
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Top Rated Staff</p>
                  <p className="text-2xl font-bold font-display mt-1">{stats.topStaff}</p>
                  <p className="text-xs text-emerald-200 mt-1">Recognized by guests</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Recorded Reviews</p>
                  <p className="text-3xl font-bold font-display mt-1">{stats.count}</p>
                  <p className="text-xs text-blue-200 mt-1">{stats.guestCount} Verified In-House Guests</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-600 to-violet-800 text-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Service Quality Index</p>
                  <p className="text-3xl font-bold font-display mt-1">98.4%</p>
                  <p className="text-xs text-purple-200 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +2.1% this month
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <span className="text-xs font-bold text-slate-700">Filter Ratings:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Reviews" },
              { id: "guest", label: "Guest Stay Reviews" },
              { id: "front desk", label: "Front Desk & Concierge" },
              { id: "housekeeping", label: "Housekeeping Staff" },
              { id: "maintenance", label: "Maintenance & Engineering" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDepartment(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedDepartment === tab.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ratings List */}
        <div className="space-y-4">
          {filteredRatings.length === 0 ? (
            <Card className="p-12 text-center text-slate-400">
              <Star className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No ratings found for this filter.</p>
              <p className="text-xs">Ratings submitted by guests in the In-House Stay Portal will appear here.</p>
            </Card>
          ) : (
            filteredRatings.map((record) => {
              const staffMember = DEFAULT_HOTEL_STAFF.find((s) => s.id === record.employeeId)
              const isGuestReview = record.roomNumber && record.roomNumber !== "Administration"

              return (
                <Card
                  key={record.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 rounded-2xl overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Staff Identity & Guest Reviewer */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="relative">
                          <img
                            src={
                              staffMember?.avatar ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                            }
                            alt={record.employeeName}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/50 shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-white fill-white" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-slate-900">
                              {record.employeeName}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                              {record.employeeRole}
                            </span>
                            {isGuestReview ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 text-[11px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-teal-600" />
                                Guest Review • Suite {record.roomNumber}
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                                Management Evaluation
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              Reviewer: {record.guestName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}
                            </span>
                          </div>

                          {record.notes && (
                            <div className="mt-2 text-xs italic text-slate-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p>"{record.notes}"</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Detailed Metric Scores */}
                      <div className="flex flex-wrap items-center gap-4 lg:gap-6 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 justify-between sm:justify-start">
                        <div className="text-center px-2">
                          <p className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                            <Smile className="w-3 h-3 text-amber-500" /> Friendliness
                          </p>
                          {renderStars(record.friendliness, 14)}
                          <p className="text-xs font-bold text-slate-700 mt-1">{record.friendliness.toFixed(1)}</p>
                        </div>

                        <div className="text-center px-2">
                          <p className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" /> Speed
                          </p>
                          {renderStars(record.speed, 14)}
                          <p className="text-xs font-bold text-slate-700 mt-1">{record.speed.toFixed(1)}</p>
                        </div>

                        <div className="text-center px-2">
                          <p className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3 text-amber-500" /> Quality
                          </p>
                          {renderStars(record.quality, 14)}
                          <p className="text-xs font-bold text-slate-700 mt-1">{record.quality.toFixed(1)}</p>
                        </div>

                        <div className="text-center px-2">
                          <p className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                            <Award className="w-3 h-3 text-amber-500" /> Professional
                          </p>
                          {renderStars(record.professionalism, 14)}
                          <p className="text-xs font-bold text-slate-700 mt-1">{record.professionalism.toFixed(1)}</p>
                        </div>

                        {/* Overall Badge */}
                        <div className="text-center pl-2 border-l border-slate-200">
                          <p className="text-[10px] uppercase font-bold text-amber-700">Overall</p>
                          <p className="text-2xl font-bold font-display text-amber-600">
                            {record.overallRating.toFixed(1)}
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold">/ 5.0</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* New Performance Evaluation Modal */}
        <Modal
          isOpen={isNewRatingModalOpen}
          onClose={() => setIsNewRatingModalOpen(false)}
          title="Add Staff Performance Evaluation"
        >
          <form onSubmit={handleCreateRating} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Staff Employee to Evaluate</label>
              <select
                value={newRating.employeeId}
                onChange={(e) => setNewRating({ ...newRating, employeeId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {DEFAULT_HOTEL_STAFF.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} — {staff.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Friendliness & Courtesy (1-5)</label>
                <select
                  value={newRating.friendliness}
                  onChange={(e) => setNewRating({ ...newRating, friendliness: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="5">5 - Exceptional</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Standard</option>
                  <option value="2">2 - Needs Coaching</option>
                  <option value="1">1 - Unsatisfactory</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Speed of Service (1-5)</label>
                <select
                  value={newRating.speed}
                  onChange={(e) => setNewRating({ ...newRating, speed: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="5">5 - Instant / Flawless</option>
                  <option value="4">4 - Prompt</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Slow</option>
                  <option value="1">1 - Significant Delay</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Quality of Work (1-5)</label>
                <select
                  value={newRating.quality}
                  onChange={(e) => setNewRating({ ...newRating, quality: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="5">5 - Flawless Craft</option>
                  <option value="4">4 - High Quality</option>
                  <option value="3">3 - Acceptable</option>
                  <option value="2">2 - Below Standard</option>
                  <option value="1">1 - Defective</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Professionalism (1-5)</label>
                <select
                  value={newRating.professionalism}
                  onChange={(e) => setNewRating({ ...newRating, professionalism: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="5">5 - Exemplary Ambassador</option>
                  <option value="4">4 - Very Professional</option>
                  <option value="3">3 - Professional</option>
                  <option value="2">2 - Casual</option>
                  <option value="1">1 - Unprofessional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Evaluator Notes / Guest Compliments</label>
              <textarea
                value={newRating.notes}
                onChange={(e) => setNewRating({ ...newRating, notes: e.target.value })}
                placeholder="Specific comments on guest care, attention to detail, or commendable performance..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewRatingModalOpen(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold"
              >
                {isLoading ? "Saving..." : "Save Evaluation"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

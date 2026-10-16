"use client"

import React, { useState } from "react"
import { DEFAULT_HOTEL_STAFF, saveEmployeeRating, getEmployeeRatings } from "@/lib/rooms-data"
import { useAuth } from "@/hooks/useAuth"
import {
  Star,
  Award,
  Sparkles,
  CheckCircle2,
  User,
  Heart,
  Smile,
  Zap,
  Shield,
  X,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/components/notifications/NotificationProvider"

interface GuestEmployeeRatingModalProps {
  isOpen: boolean
  onClose: () => void
  onRatingSubmitted?: () => void
  defaultEmployeeId?: string
  roomNumber?: string
}

export function GuestEmployeeRatingModal({
  isOpen,
  onClose,
  onRatingSubmitted,
  defaultEmployeeId,
  roomNumber = "301",
}: GuestEmployeeRatingModalProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const staffList = DEFAULT_HOTEL_STAFF

  const [selectedStaffId, setSelectedStaffId] = useState(defaultEmployeeId || staffList[0].id)
  const [overallRating, setOverallRating] = useState(5)
  const [friendliness, setFriendliness] = useState(5)
  const [speed, setSpeed] = useState(5)
  const [quality, setQuality] = useState(5)
  const [professionalism, setProfessionalism] = useState(5)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  if (!isOpen) return null

  const selectedStaff = staffList.find((s) => s.id === selectedStaffId) || staffList[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    saveEmployeeRating({
      employeeId: selectedStaff.id,
      employeeName: selectedStaff.name,
      employeeRole: selectedStaff.role,
      guestName: user?.full_name || "Valued Hotel Guest",
      guestEmail: user?.email,
      roomNumber,
      overallRating,
      friendliness,
      speed,
      quality,
      professionalism,
      notes: notes.trim() || `Exceptional 5-star service provided by ${selectedStaff.name}.`,
    })

    // Dispatches real-time alert to all managers, admin, and front desk
    addNotification({
      title: `⭐ New ${overallRating}-Star Rating for ${selectedStaff.name}`,
      message: `${user?.full_name || "Guest in Suite " + roomNumber} submitted a ${overallRating}-star evaluation: "${notes.trim() || 'Exceptional 5-star service provided by ' + selectedStaff.name}."`,
      type: "general",
      roomNumber,
      guestName: user?.full_name || "Valued Guest",
      targetRoles: ["admin", "hotel_manager", "front_desk"],
    })

    setSubmitting(false)
    setSubmittedSuccess(true)

    if (onRatingSubmitted) {
      onRatingSubmitted()
    }

    setTimeout(() => {
      setSubmittedSuccess(false)
      onClose()
    }, 2000)
  }

  const StarRatingRow = ({
    label,
    value,
    onChange,
    icon: Icon,
  }: {
    label: string
    value: number
    onChange: (val: number) => void
    icon: React.ElementType
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-125 transition-transform"
          >
            <Star
              size={18}
              className={star <= value ? "text-amber-500 fill-amber-500" : "text-slate-200"}
            />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-300/70 my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                In-House Guest Recognition
              </span>
              <h2 className="text-xl font-bold font-display text-white">Rate Hotel Staff & Attendants</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-900">Thank You For Your Rating!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your feedback directly rewards <strong>{selectedStaff.name}</strong> and motivates our team to uphold
              world-class hospitality standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Staff Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Choose Hotel Employee to Rate
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.role} ({s.badgeNumber})
                  </option>
                ))}
              </select>

              {/* Selected Staff Card */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold flex items-center justify-center text-sm shadow">
                    {selectedStaff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{selectedStaff.name}</p>
                    <p className="text-xs text-amber-800 font-semibold">{selectedStaff.role}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                  Room {roomNumber}
                </span>
              </div>
            </div>

            {/* Overall Star Rating */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Overall Experience</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      size={28}
                      className={star <= overallRating ? "text-amber-500 fill-amber-500" : "text-slate-300"}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-amber-700">
                {overallRating === 5
                  ? "⭐⭐⭐⭐⭐ Flawless Five-Star Excellence"
                  : overallRating === 4
                  ? "⭐⭐⭐⭐ Very Good Experience"
                  : overallRating === 3
                  ? "⭐⭐⭐ Good Service"
                  : "Needs Attention"}
              </p>
            </div>

            {/* Specific Rating Dimensions */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <StarRatingRow
                label="Friendliness & Courtesy"
                value={friendliness}
                onChange={setFriendliness}
                icon={Smile}
              />
              <StarRatingRow
                label="Speed & Attentiveness"
                value={speed}
                onChange={setSpeed}
                icon={Zap}
              />
              <StarRatingRow
                label="Quality & Attention to Detail"
                value={quality}
                onChange={setQuality}
                icon={Sparkles}
              />
              <StarRatingRow
                label="Professionalism"
                value={professionalism}
                onChange={setProfessionalism}
                icon={Shield}
              />
            </div>

            {/* Comments */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Personal Compliment or Note</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your personal experience with this staff member (e.g. entertained us warmly, swift response, helpful concierge advice)..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Submit Official Staff Rating
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

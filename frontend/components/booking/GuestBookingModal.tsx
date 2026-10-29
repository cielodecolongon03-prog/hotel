"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RoomClassification, RateType, Booking, PaymentTransaction } from "@/types"
import {
  calculateCost,
  createBooking,
  formatCurrency,
  getRooms,
  isRoomAvailable,
  CONCIERGE_ADDONS,
  DEFAULT_HOTEL_STAFF,
} from "@/lib/rooms-data"
import { useAuth } from "@/hooks/useAuth"
import {
  Calendar,
  Clock,
  Users,
  BedDouble,
  ShieldCheck,
  Sparkles,
  X,
  ChevronRight,
  Check,
  Award,
  Key,
  LogIn,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  DoorClosed,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModalPortal } from "@/components/ui/ModalPortal"
import { PaymentModal } from "@/components/payment/PaymentModal"
import { ReceiptModal } from "@/components/payment/ReceiptModal"

interface GuestBookingModalProps {
  isOpen: boolean
  onClose: () => void
  classification: RoomClassification | null
}

export function GuestBookingModal({ isOpen, onClose, classification }: GuestBookingModalProps) {
  const router = useRouter()
  const { user, signIn, signUp } = useAuth()

  const [rateType, setRateType] = useState<RateType>("daily")
  const [dailyDays, setDailyDays] = useState(2)
  const [hourlyHours, setHourlyHours] = useState(classification?.minHours || 3)
  const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().split("T")[0])
  const [checkInTime, setCheckInTime] = useState("14:00")
  const [guestsCount, setGuestsCount] = useState(2)
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([])

  // Rooms in this classification
  const [roomsList, setRoomsList] = useState(() => getRooms())
  const classificationRooms = useMemo(() => {
    if (!classification) return []
    return roomsList.filter((r) => r.classificationId === classification.id)
  }, [classification, roomsList])

  // Selectable room number state
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>("")

  // Update selected room number automatically when classification or rooms change
  useEffect(() => {
    if (classificationRooms.length > 0) {
      const firstAvailable = classificationRooms.find((r) => isRoomAvailable(r.roomNumber, user?.email))
      if (firstAvailable) {
        setSelectedRoomNumber(firstAvailable.roomNumber)
      } else {
        setSelectedRoomNumber(classificationRooms[0]?.roomNumber || "")
      }
    }
  }, [classificationRooms, user?.email])

  const frontDeskHosts = useMemo(
    () =>
      DEFAULT_HOTEL_STAFF.filter(
        (s) =>
          s.role.toLowerCase().includes("front desk") ||
          s.role.toLowerCase().includes("reception") ||
          s.role.toLowerCase().includes("butler")
      ),
    []
  )
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    frontDeskHosts[0]?.id || DEFAULT_HOTEL_STAFF[0].id
  )

  // Guest & Auth details
  const [authMode, setAuthMode] = useState<"express" | "signin">("express")
  const [guestName, setGuestName] = useState(user?.full_name || "")
  const [guestEmail, setGuestEmail] = useState(user?.email || "")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestPassword, setGuestPassword] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authSuccessMsg, setAuthSuccessMsg] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  // Pre-fill user data if user logs in
  useEffect(() => {
    if (user) {
      if (user.full_name) setGuestName(user.full_name)
      if (user.email) setGuestEmail(user.email)
    }
  }, [user])

  // Payment integration
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [latestTransaction, setLatestTransaction] = useState<PaymentTransaction | null>(null)
  const [bookingErrorMessage, setBookingErrorMessage] = useState("")

  if (!isOpen || !classification) return null

  const addOnsTotal = selectedAddOnIds.reduce((sum, id) => {
    const item = CONCIERGE_ADDONS.find((a) => a.id === id)
    return sum + (item ? item.pricePHP : 0)
  }, 0)

  const duration = rateType === "daily" ? dailyDays : hourlyHours
  const cost = calculateCost(classification, rateType, duration, addOnsTotal)

  // Auto calculate checkout date/time
  const { checkOutDate, checkOutTime } = useMemo(() => {
    if (rateType === "daily") {
      const d = new Date(checkInDate)
      d.setDate(d.getDate() + dailyDays)
      return { checkOutDate: d.toISOString().split("T")[0], checkOutTime: "12:00" }
    } else {
      const [h, m] = checkInTime.split(":").map(Number)
      const totalH = (h || 0) + hourlyHours
      const outH = totalH % 24
      const nextDay = Math.floor(totalH / 24)
      const d = new Date(checkInDate)
      d.setDate(d.getDate() + nextDay)
      return {
        checkOutDate: d.toISOString().split("T")[0],
        checkOutTime: `${outH.toString().padStart(2, "0")}:${(m || 0).toString().padStart(2, "0")}`,
      }
    }
  }, [rateType, dailyDays, hourlyHours, checkInDate, checkInTime])

  const handleInlineSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    if (!guestEmail.trim() || !signInPassword) {
      setAuthError("Please enter both email and password to sign in.")
      return
    }

    try {
      const loggedUser = await signIn(guestEmail.trim(), signInPassword)
      setAuthSuccessMsg(`Welcome back, ${loggedUser.full_name || loggedUser.email}! You can now proceed to payment.`)
      setGuestName(loggedUser.full_name || "")
      setGuestEmail(loggedUser.email || "")
      setRoomsList(getRooms())
      setTimeout(() => setAuthSuccessMsg(""), 4000)
    } catch (err: any) {
      setAuthError(err?.message || "Invalid email or password. Please try again.")
    }
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    setBookingErrorMessage("")

    // Verify guest info
    if (!guestName.trim()) {
      setBookingErrorMessage("Please enter your full legal name.")
      return
    }
    if (!guestEmail.trim() || !guestEmail.includes("@")) {
      setBookingErrorMessage("Please enter a valid contact email address.")
      return
    }

    // Determine room number & check availability
    let finalRoomNumber = selectedRoomNumber
    if (!finalRoomNumber || !isRoomAvailable(finalRoomNumber, guestEmail.trim())) {
      const firstVacant = classificationRooms.find((r) => isRoomAvailable(r.roomNumber, guestEmail.trim()))
      if (firstVacant) {
        finalRoomNumber = firstVacant.roomNumber
      } else {
        const anyVacant = getRooms().find((r) => isRoomAvailable(r.roomNumber, guestEmail.trim()))
        if (anyVacant) {
          finalRoomNumber = anyVacant.roomNumber
        } else {
          setBookingErrorMessage(
            `All rooms in ${classification.name} are currently occupied or reserved. Please choose another suite category or date.`
          )
          return
        }
      }
    }

    const selectedAddOns = selectedAddOnIds.map((id) => {
      const item = CONCIERGE_ADDONS.find((a) => a.id === id)!
      return { id: item.id, name: item.name, price: item.pricePHP }
    })

    const assignedStaff =
      DEFAULT_HOTEL_STAFF.find((s) => s.id === selectedStaffId) || DEFAULT_HOTEL_STAFF[0]

    // Create booking (status: confirmed, paymentStatus: pending)
    const newBooking = createBooking({
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim().toLowerCase(),
      guestPhone: guestPhone.trim() || "+63 917 555 1234",
      roomNumber: finalRoomNumber,
      classificationId: classification.id,
      classificationName: classification.name,
      rateType,
      duration,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      numberOfGuests: guestsCount,
      baseAmount: cost.baseAmount,
      addOnsAmount: addOnsTotal,
      addOns: selectedAddOns,
      taxAmount: cost.taxAmount,
      serviceCharge: cost.serviceCharge,
      totalAmount: cost.totalAmount,
      specialRequests: specialRequests.trim(),
      status: "confirmed",
      paymentStatus: "pending",
      assignedStaff,
      lateArrivalInfo: {
        originalCheckInTime: checkInTime,
        actualArrivalTime: checkInTime,
        isLateArrival: false,
        gracePeriodHours: 4,
        status: "standard",
      },
    })

    setActiveBooking(newBooking)
    setShowPaymentModal(true)
  }

  const handlePaymentCompleted = async (txn: PaymentTransaction) => {
    setLatestTransaction(txn)

    // Auto-create account and sign in if guest was not logged in
    if (!user && guestEmail.trim()) {
      try {
        const pass = guestPassword.trim() || "CrownGuest2026!"
        await signUp(
          guestEmail.trim(),
          pass,
          guestName.trim(),
          guestPhone.trim() || "+63 917 555 1234",
          activeBooking?.roomNumber
        )
      } catch (err) {
        console.error("Auto-registration error:", err)
      }
    }

    setShowReceiptModal(true)
  }

  return (
    <>
      <ModalPortal isOpen={isOpen}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 sm:p-8 text-white flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Direct Guest Reservation & Instant Checkout
                </span>
                <span className="text-xs text-amber-200/90 font-medium">No Pre-Login Required</span>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-display text-white">{classification.name}</h2>
              <p className="text-sm text-amber-200/80 mt-1">{classification.tagline}</p>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {bookingErrorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{bookingErrorMessage}</span>
                </div>
              )}

              {/* Rate Type Selector: Daily vs Hourly */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  1. Select Stay Rate Plan (Daily Stay or Hourly Day-Use)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRateType("daily")}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      rateType === "daily"
                        ? "border-amber-600 bg-amber-50/70 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        Per Day Stay
                      </span>
                      <span className="text-xs font-semibold text-amber-800">
                        {formatCurrency(classification.dailyRate)} / night
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Traditional overnight & multi-day luxury stay.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRateType("hourly")}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      rateType === "hourly"
                        ? "border-amber-600 bg-amber-50/70 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        Per Hour (Day-Use)
                      </span>
                      <span className="text-xs font-semibold text-teal-800">
                        {formatCurrency(classification.hourlyRate)} / hr
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Flexible short stays (min. {classification.minHours} hours).</p>
                  </button>
                </div>
              </div>

              {/* Duration & Date Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {rateType === "daily" ? "Nights Duration" : "Hours Duration"}
                  </label>
                  {rateType === "daily" ? (
                    <select
                      value={dailyDays}
                      onChange={(e) => setDailyDays(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:border-amber-500"
                    >
                      {[1, 2, 3, 4, 5, 7, 10, 14, 21, 30].map((d) => (
                        <option key={d} value={d}>
                          {d} {d === 1 ? "Night" : "Nights"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={hourlyHours}
                      onChange={(e) => setHourlyHours(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:border-teal-500"
                    >
                      {[3, 4, 5, 6, 8, 10, 12, 18, 24].map((h) => (
                        <option key={h} value={h}>
                          {h} Hours
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Scheduled Arrival Time</label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Specific Room Selection with Anti-Collision / Real-Time Availability Lock */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    2. Select Suite Room Number
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Double-Booking Protection Active
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {classificationRooms.map((room) => {
                    const available = isRoomAvailable(room.roomNumber, guestEmail)
                    const isSelected = selectedRoomNumber === room.roomNumber
                    return (
                      <button
                        key={room.roomNumber}
                        type="button"
                        disabled={!available}
                        onClick={() => setSelectedRoomNumber(room.roomNumber)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                          isSelected && available
                            ? "border-amber-600 bg-amber-500 text-slate-950 font-bold shadow-md ring-2 ring-amber-400"
                            : available
                            ? "border-slate-200 hover:border-amber-400 bg-white text-slate-800 hover:bg-amber-50/50"
                            : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <span className="text-xs font-bold">Suite {room.roomNumber}</span>
                        <span className="text-[10px] mt-0.5">
                          {available ? (isSelected ? "Selected ✓" : "Available") : "Reserved"}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] text-slate-500">
                  Once you confirm and pay, your selected suite is locked exclusively for you. No other user can reserve or seize it.
                </p>
              </div>

              {/* Guest Identification & Account Authentication */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    3. Guest Account & Contact Details
                  </label>
                  {user ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Logged in as {user.full_name || user.email}
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-800 font-semibold bg-amber-100/70 px-2.5 py-0.5 rounded-lg border border-amber-300">
                      ⚡ Direct Booking • Instant Dashboard Access
                    </span>
                  )}
                </div>

                {authSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{authSuccessMsg}</span>
                  </div>
                )}

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {!user && (
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-200/80">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("express")
                        setAuthError("")
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        authMode === "express"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Express Guest Checkout (Auto-Register)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signin")
                        setAuthError("")
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        authMode === "signin"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5 text-amber-600" />
                      Sign In to Existing Account
                    </button>
                  </div>
                )}

                {/* If Not Logged In and in Existing Account Sign-in mode */}
                {!user && authMode === "signin" ? (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-slate-600">
                      Enter your existing account credentials to link this booking directly to your profile without losing your selected suite or dates.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="your-email@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                        <input
                          type="password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleInlineSignIn}
                      className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
                    >
                      <LogIn className="w-3.5 h-3.5 mr-1.5" />
                      Sign In & Continue Booking
                    </Button>
                  </div>
                ) : (
                  /* Express Registration or Logged-In Guest Details Form */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Maria Clara Santos"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Email (Instant Receipt & Portal Access)</label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="guest@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile / WhatsApp Number</label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+63 917 555 1234"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Number of Guests</label>
                        <select
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-amber-500"
                        >
                          {Array.from({ length: classification.capacity }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "Guest" : "Guests"} (Max {classification.capacity})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {!user && (
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Account Password (Optional — to log back in anytime)
                        </label>
                        <input
                          type="password"
                          value={guestPassword}
                          onChange={(e) => setGuestPassword(e.target.value)}
                          placeholder="Create a password (default: CrownGuest2026!)"
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Special Preferences / Requests</label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. High floor, extra pillows, early luggage drop, honeymoon setup..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Dedicated Front Desk Host with Fixed Fallback Pictures */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    4. Dedicated Front Desk Host (Assigned to Entertain & Assist You)
                  </label>
                  <span className="text-[11px] text-amber-700 font-semibold">Complimentary VIP Service</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {frontDeskHosts.map((staff) => {
                    const isSelected = selectedStaffId === staff.id
                    return (
                      <button
                        key={staff.id}
                        type="button"
                        onClick={() => setSelectedStaffId(staff.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                          isSelected
                            ? "border-amber-600 bg-amber-50/80 text-amber-950 shadow-sm ring-1 ring-amber-400"
                            : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        {/* Verified Avatar with Robust Initials Fallback */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-amber-400/50 bg-gradient-to-br from-amber-200 to-amber-300 shrink-0 flex items-center justify-center font-bold text-amber-950 text-xs shadow-sm">
                          {staff.avatar ? (
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLElement).style.display = "none"
                              }}
                            />
                          ) : null}
                          <span className="absolute font-display font-bold">
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-xs truncate">{staff.name}</p>
                            {isSelected && (
                              <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                                Assigned
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{staff.role}</p>
                          <p className="text-[10px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" /> Dedicated Host & Welcome
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Optional Luxury Concierge Add-Ons */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block flex items-center justify-between">
                  <span>5. Optional Luxury Concierge Add-Ons</span>
                  <span className="text-[11px] text-amber-700 font-semibold">Philippine Peso Rates</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CONCIERGE_ADDONS.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id)
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => {
                          setSelectedAddOnIds((prev) =>
                            prev.includes(addon.id) ? prev.filter((id) => id !== addon.id) : [...prev, addon.id]
                          )
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? "border-amber-600 bg-amber-50/80 text-amber-950 shadow-sm ring-1 ring-amber-400"
                            : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border ${
                            isSelected ? "bg-amber-600 border-amber-600 text-white" : "border-slate-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs truncate">{addon.name}</span>
                            <span className="font-bold text-xs text-amber-700 shrink-0 ml-1">
                              +{formatCurrency(addon.pricePHP)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{addon.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Live Pricing Breakdown Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>
                    Suite Rate ({duration} {rateType === "daily" ? (duration === 1 ? "Night" : "Nights") : "Hours"} @{" "}
                    {formatCurrency(cost.unitRate)})
                  </span>
                  <span className="font-semibold text-slate-900">{formatCurrency(cost.baseAmount)}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between items-center text-xs text-amber-800 font-semibold">
                    <span>Selected Concierge Add-Ons ({selectedAddOnIds.length})</span>
                    <span>+{formatCurrency(addOnsTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Philippine Government Taxes & VAT (12%)</span>
                  <span>{formatCurrency(cost.taxAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Luxury Resort Service Charge (10%)</span>
                  <span>{formatCurrency(cost.serviceCharge)}</span>
                </div>
                <div className="border-t border-amber-200 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total All-Inclusive Amount</span>
                  <span className="text-2xl font-bold font-display text-amber-900">{formatCurrency(cost.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-12 flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl h-12 flex-[2] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold shadow-lg shadow-amber-900/20"
                >
                  Pay Direct & Book Suite ({formatCurrency(cost.totalAmount)})
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>

      {/* Payment Processing Modal */}
      {showPaymentModal && activeBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={activeBooking}
          onPaymentSuccess={handlePaymentCompleted}
        />
      )}

      {/* Receipt Modal with direct link to Guest Dashboard */}
      {showReceiptModal && latestTransaction && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false)
            onClose()
            router.push("/dashboard/guest")
          }}
          transaction={latestTransaction}
          booking={activeBooking}
        />
      )}
    </>
  )
}

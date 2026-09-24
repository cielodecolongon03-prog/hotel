"use client"

import React, { useState, useMemo } from "react"
import { RoomClassification, RateType, Booking, PaymentTransaction } from "@/types"
import { calculateCost, createBooking, formatCurrency, getRooms } from "@/lib/rooms-data"
import { Calendar, Clock, Users, BedDouble, ShieldCheck, Sparkles, X, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment/PaymentModal"
import { ReceiptModal } from "@/components/payment/ReceiptModal"

interface GuestBookingModalProps {
  isOpen: boolean
  onClose: () => void
  classification: RoomClassification | null
}

export function GuestBookingModal({ isOpen, onClose, classification }: GuestBookingModalProps) {
  const [rateType, setRateType] = useState<RateType>("daily")
  const [dailyDays, setDailyDays] = useState(2)
  const [hourlyHours, setHourlyHours] = useState(classification?.minHours || 3)
  const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().split("T")[0])
  const [checkInTime, setCheckInTime] = useState("14:00")
  const [guestsCount, setGuestsCount] = useState(2)

  // Guest details (no login required!)
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  // Payment integration
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [latestTransaction, setLatestTransaction] = useState<PaymentTransaction | null>(null)
  const [bookedSuccess, setBookedSuccess] = useState(false)

  if (!isOpen || !classification) return null

  const duration = rateType === "daily" ? dailyDays : hourlyHours
  const cost = calculateCost(classification, rateType, duration)

  // Auto calculate checkout date/time
  const { checkOutDate, checkOutTime } = useMemo(() => {
    if (rateType === "daily") {
      const d = new Date(checkInDate)
      d.setDate(d.getDate() + dailyDays)
      return { checkOutDate: d.toISOString().split("T")[0], checkOutTime: "12:00" }
    } else {
      const [h, m] = checkInTime.split(":").map(Number)
      const totalH = h + hourlyHours
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

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()

    // Find available room
    const rooms = getRooms()
    const available = rooms.find(
      (r) => r.classificationId === classification.id && r.status === "vacant"
    )
    const assignedRoomNumber = available ? available.roomNumber : `${classification.code}-${Math.floor(100 + Math.random() * 900)}`

    const newBooking = createBooking({
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      roomNumber: assignedRoomNumber,
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
      taxAmount: cost.taxAmount,
      serviceCharge: cost.serviceCharge,
      totalAmount: cost.totalAmount,
      specialRequests: specialRequests.trim(),
      status: "confirmed",
      paymentStatus: "pending",
    })

    setActiveBooking(newBooking)
    setShowPaymentModal(true)
  }

  const handlePaymentCompleted = (txn: PaymentTransaction) => {
    setLatestTransaction(txn)
    setBookedSuccess(true)
    setShowReceiptModal(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 my-6">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 sm:p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Direct Guest Reservation
              </span>
              <span className="text-xs text-slate-300">No Account or Login Required</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-display text-white">{classification.name}</h2>
            <p className="text-sm text-amber-200/80 mt-1">{classification.tagline}</p>
          </div>

          <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Rate Type Selector: Daily vs Hourly */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                1. Select Rate Option (Daily Stay or Hourly Stay)
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
                  <p className="text-xs text-slate-500">Traditional overnight & multi-day hotel booking.</p>
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
                      Per Hour (Day Use)
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Check-in Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {rateType === "daily" ? "Nights Stay" : "Hours Duration"}
                </label>
                {rateType === "daily" ? (
                  <select
                    value={dailyDays}
                    onChange={(e) => setDailyDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-amber-500"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-teal-500"
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Check-in Time</label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  required
                />
              </div>
            </div>

            {/* Guest Information (No Login!) */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                2. Guest Details (No Account Required)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Maria Clara Santos"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email (For Instant Receipt & Key)</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g. guest@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="e.g. +63 917 555 1234"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Number of Guests</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  >
                    {Array.from({ length: classification.capacity }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"} (Max {classification.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Special Preferences / Requests</label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. High floor, extra feather pillows, early check-in, honeymoon setup..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Live Pricing Breakdown Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>
                  Room Rate ({duration} {rateType === "daily" ? (duration === 1 ? "Night" : "Nights") : "Hours"} @{" "}
                  {formatCurrency(cost.unitRate)})
                </span>
                <span className="font-semibold text-slate-900">{formatCurrency(cost.baseAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Government Taxes & VAT (12%)</span>
                <span>{formatCurrency(cost.taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Luxury Resort Service Charge (5%)</span>
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
                Proceed to Real Payment ({formatCurrency(cost.totalAmount)})
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && activeBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={activeBooking}
          onPaymentSuccess={handlePaymentCompleted}
        />
      )}

      {/* Receipt Modal */}
      {showReceiptModal && latestTransaction && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false)
            onClose()
          }}
          transaction={latestTransaction}
          booking={activeBooking}
        />
      )}
    </>
  )
}

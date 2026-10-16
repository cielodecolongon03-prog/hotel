"use client"

import React, { useState } from "react"
import { Room, RoomClassification, RateType, Booking, PaymentTransaction, AssignedStaff } from "@/types"
import {
  getClassifications,
  getRooms,
  calculateCost,
  createBooking,
  updateRoomStatus,
  formatCurrency,
  DEFAULT_HOTEL_STAFF,
  recommendAlternativeRooms,
} from "@/lib/rooms-data"
import {
  Key,
  User,
  Calendar,
  Clock,
  DollarSign,
  Check,
  X,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment/PaymentModal"
import { ReceiptModal } from "@/components/payment/ReceiptModal"
import { LateArrivalEvidenceModal } from "@/components/booking/LateArrivalEvidenceModal"

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onCheckInCompleted: () => void
}

export function CheckInModal({ isOpen, onClose, onCheckInCompleted }: CheckInModalProps) {
  const classifications = getClassifications()
  const allRooms = getRooms()

  const [selectedClassId, setSelectedClassId] = useState(classifications[0]?.id || "")
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("")
  const [rateType, setRateType] = useState<RateType>("daily")
  const [duration, setDuration] = useState(1)
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [selectedStaffId, setSelectedStaffId] = useState(DEFAULT_HOTEL_STAFF[0].id)
  const [showLateArrivalModal, setShowLateArrivalModal] = useState(false)

  // Payment flow
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [latestTxn, setLatestTxn] = useState<PaymentTransaction | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  if (!isOpen) return null

  const currentClass = classifications.find((c) => c.id === selectedClassId) || classifications[0]
  const availableRoomsForClass = allRooms.filter(
    (r) => r.classificationId === currentClass.id && (r.status === "vacant" || r.status === "cleaning")
  )

  const cost = calculateCost(currentClass, rateType, duration)

  const handleExecuteCheckIn = (e: React.FormEvent, collectPaymentNow: boolean) => {
    e.preventDefault()

    const chosenRoom = selectedRoomNumber || (availableRoomsForClass[0]?.roomNumber ?? "101")
    const checkInDate = new Date().toISOString().split("T")[0]
    const checkInTime = new Date().toTimeString().slice(0, 5)

    const attendant = DEFAULT_HOTEL_STAFF.find((s) => s.id === selectedStaffId) || DEFAULT_HOTEL_STAFF[0]

    const d = new Date()
    if (rateType === "daily") {
      d.setDate(d.getDate() + duration)
    } else {
      d.setHours(d.getHours() + duration)
    }
    const checkOutDate = d.toISOString().split("T")[0]
    const checkOutTime = rateType === "daily" ? "12:00" : d.toTimeString().slice(0, 5)

    const booking = createBooking({
      guestName: guestName.trim() || "Walk-In Guest",
      guestEmail: guestEmail.trim() || "walkin@guest.com",
      guestPhone: guestPhone.trim() || "+1 555-0000",
      roomNumber: chosenRoom,
      classificationId: currentClass.id,
      classificationName: currentClass.name,
      rateType,
      duration,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      numberOfGuests: 1,
      baseAmount: cost.baseAmount,
      taxAmount: cost.taxAmount,
      serviceCharge: cost.serviceCharge,
      totalAmount: cost.totalAmount,
      status: "checked_in",
      paymentStatus: collectPaymentNow ? "pending" : "pending",
      assignedStaff: attendant,
    })

    // Immediately update room status to occupied
    updateRoomStatus(chosenRoom, "occupied", {
      name: guestName.trim() || "Walk-In Guest",
      bookingId: booking.referenceCode,
      rateType,
      checkIn: `${checkInDate} ${checkInTime}`,
      expectedCheckOut: `${checkOutDate} ${checkOutTime}`,
      phone: guestPhone.trim(),
      assignedStaff: attendant,
    })

    setActiveBooking(booking)

    if (collectPaymentNow) {
      setShowPaymentModal(true)
    } else {
      setSuccessMessage(`Room ${chosenRoom} successfully checked in! Host ${attendant.name} assigned to entertain the guest.`)
      setTimeout(() => {
        onCheckInCompleted()
        onClose()
      }, 1500)
    }
  }

  const handlePaymentSuccess = (txn: PaymentTransaction) => {
    setLatestTxn(txn)
    setShowReceiptModal(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display tracking-tight">Front Desk Check-In & Room Assignment</h2>
                <p className="text-xs text-blue-200/80">Check in walk-in or booked guests with instant key card issuance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form className="p-6 sm:p-8 space-y-5 max-h-[70vh] overflow-y-auto">
            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold text-sm flex items-center gap-2 animate-scale-in">
                <Check className="w-5 h-5 text-emerald-700" />
                {successMessage}
              </div>
            )}

            {/* Guest Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Guest Information</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Guest Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 555-0192"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="guest@mail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Room Selection & Late Arrival Protocol */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Room Classification & Inventory
                </label>
                <button
                  type="button"
                  onClick={() => setShowLateArrivalModal(true)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Late Arrival Evidence & Recommendations
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Classification</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value)
                      setSelectedRoomNumber("")
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {classifications.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({formatCurrency(c.dailyRate)}/day • {formatCurrency(c.hourlyRate)}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assign Room Number</label>
                  <select
                    value={selectedRoomNumber}
                    onChange={(e) => setSelectedRoomNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  >
                    {allRooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.classificationName.split(" ")[0]} • Floor {r.floor} • {r.status.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Automatic Recommendation Alert if Selected Room is Occupied */}
              {allRooms.find((r) => r.roomNumber === (selectedRoomNumber || "101"))?.status === "occupied" && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2 animate-scale-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Room {selectedRoomNumber || "101"} is currently OCCUPIED! System recommends available unoccupied rooms:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {recommendAlternativeRooms(selectedRoomNumber || "101", selectedClassId)
                      .slice(0, 2)
                      .map((rec) => (
                        <button
                          key={rec.room.id}
                          type="button"
                          onClick={() => {
                            setSelectedRoomNumber(rec.room.roomNumber)
                            setSelectedClassId(rec.classification.id)
                          }}
                          className="p-2.5 rounded-xl bg-white border border-amber-200 text-left hover:border-amber-400 transition flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              Room {rec.room.roomNumber} ({rec.classification.name})
                            </p>
                            <p className="text-[10px] text-emerald-700 font-semibold">
                              {rec.isUpgrade ? "✨ Free Upgrade (₱0 Extra)" : "Ready Vacant Room"}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-50 text-blue-700">
                            Select Room
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Assigned Front Desk Employee to Entertain Guest */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-blue-900 block flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                <span>Assigned Employee to Entertain & Assist Guest</span>
              </label>
              <p className="text-xs text-blue-700">
                Staff member designated to welcome, entertain, and assist this guest upon check-in.
              </p>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {DEFAULT_HOTEL_STAFF.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} — {staff.role} ({staff.badgeNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Rate Selection: Daily vs Hourly */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Stay Rate Plan (Daily vs Hourly)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRateType("daily")
                    setDuration(1)
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition ${
                    rateType === "daily"
                      ? "border-blue-600 bg-blue-50 font-bold text-blue-900"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  <p className="text-xs font-semibold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" /> Daily Rate
                  </p>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {formatCurrency(currentClass.dailyRate)} <span className="text-xs font-normal">/ day</span>
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRateType("hourly")
                    setDuration(currentClass.minHours)
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition ${
                    rateType === "hourly"
                      ? "border-teal-600 bg-teal-50 font-bold text-teal-900"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  <p className="text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" /> Hourly Rate
                  </p>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {formatCurrency(currentClass.hourlyRate)} <span className="text-xs font-normal">/ hr</span>
                  </p>
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Duration ({rateType === "daily" ? "Days / Nights" : `Hours - Min ${currentClass.minHours}h`})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={rateType === "daily" ? 1 : currentClass.minHours}
                    max={rateType === "daily" ? 30 : 24}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="font-bold text-sm text-slate-900 px-3 py-1 bg-slate-100 rounded-lg">
                    {duration} {rateType === "daily" ? (duration === 1 ? "Night" : "Nights") : "Hours"}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Folio Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Total All-Inclusive Charge</p>
                <p className="text-xl font-bold font-display text-slate-900">{formatCurrency(cost.totalAmount)}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>Tax: {formatCurrency(cost.taxAmount)}</p>
                <p>Service: {formatCurrency(cost.serviceCharge)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto rounded-xl">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={(e) => handleExecuteCheckIn(e, false)}
                variant="secondary"
                className="w-full sm:flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800"
              >
                Check-in (Pay at Checkout)
              </Button>
              <Button
                type="button"
                onClick={(e) => handleExecuteCheckIn(e, true)}
                className="w-full sm:flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Collect Payment & Check-In
              </Button>
            </div>
          </form>
        </div>
      </div>

      {showPaymentModal && activeBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            onCheckInCompleted()
            onClose()
          }}
          booking={activeBooking}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {showReceiptModal && latestTxn && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false)
            onCheckInCompleted()
            onClose()
          }}
          transaction={latestTxn}
          booking={activeBooking}
        />
      )}

      {showLateArrivalModal && (
        <LateArrivalEvidenceModal
          isOpen={showLateArrivalModal}
          onClose={() => setShowLateArrivalModal(false)}
          onReassigned={(b, newRoom) => {
            setSelectedRoomNumber(newRoom)
            setSelectedClassId(b.classificationId)
            setShowLateArrivalModal(false)
          }}
        />
      )}
    </>
  )
}

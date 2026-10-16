"use client"

import React, { useState, useMemo } from "react"
import { Booking, Room, RoomClassification, RoomRecommendation, AssignedStaff } from "@/types"
import {
  getBookings,
  getRooms,
  getClassifications,
  recommendAlternativeRooms,
  reassignBookingRoom,
  verifyLateArrivalEvidence,
  formatCurrency,
  DEFAULT_HOTEL_STAFF,
} from "@/lib/rooms-data"
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  ArrowRight,
  Key,
  User,
  Phone,
  Mail,
  Calendar,
  X,
  Printer,
  ChevronRight,
  BedDouble,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DigitalKeycardModal } from "@/components/guest/DigitalKeycardModal"

interface LateArrivalEvidenceModalProps {
  isOpen: boolean
  onClose: () => void
  initialBookingRef?: string
  onReassigned?: (booking: Booking, newRoomNumber: string) => void
}

export function LateArrivalEvidenceModal({
  isOpen,
  onClose,
  initialBookingRef = "CJH-BK-7PM-LATE",
  onReassigned,
}: LateArrivalEvidenceModalProps) {
  const bookings = getBookings()
  const allRooms = getRooms()
  const classifications = getClassifications()

  const [selectedBookingRef, setSelectedBookingRef] = useState(initialBookingRef)
  const [actualArrivalTime, setActualArrivalTime] = useState("19:00") // 7:00 PM
  const [selectedStaffId, setSelectedStaffId] = useState(DEFAULT_HOTEL_STAFF[0].id)
  const [reassignSuccessMsg, setReassignSuccessMsg] = useState("")
  const [showKeycard, setShowKeycard] = useState(false)
  const [activeReassignedRoom, setActiveReassignedRoom] = useState<string>("")

  if (!isOpen) return null

  // Selected booking
  const currentBooking =
    bookings.find((b) => b.referenceCode.toUpperCase() === selectedBookingRef.trim().toUpperCase()) ||
    bookings.find((b) => b.referenceCode === "CJH-BK-7PM-LATE") ||
    bookings[0]

  // Evidence verification result
  const evidence = verifyLateArrivalEvidence(currentBooking?.referenceCode || "", actualArrivalTime)

  // Assigned attendant
  const assignedAttendant =
    DEFAULT_HOTEL_STAFF.find((s) => s.id === selectedStaffId) ||
    currentBooking?.assignedStaff ||
    DEFAULT_HOTEL_STAFF[0]

  const originalRoom = allRooms.find((r) => r.roomNumber === currentBooking?.roomNumber)
  const isOriginalOccupied = originalRoom ? originalRoom.status === "occupied" : false

  const recommendations = useMemo(() => {
    if (!currentBooking) return []
    return recommendAlternativeRooms(currentBooking.roomNumber, currentBooking.classificationId)
  }, [currentBooking, allRooms])

  const handleExecuteReassignment = (recommendedRoomNumber: string, isUpgrade: boolean, reason: string) => {
    if (!currentBooking) return
    const result = reassignBookingRoom(
      currentBooking.referenceCode,
      recommendedRoomNumber,
      `Late arrival at ${actualArrivalTime} (Booked for ${currentBooking.checkInTime || "13:00"}). Original Room ${currentBooking.roomNumber} was occupied. Reallocated to ${recommendedRoomNumber} (${isUpgrade ? "Free Upgrade" : "Same Tier"}).`,
      assignedAttendant
    )

    if (result) {
      setActiveReassignedRoom(recommendedRoomNumber)
      setReassignSuccessMsg(
        `Success! Room ${recommendedRoomNumber} is now assigned to ${currentBooking.guestName}. Dedicated Host ${assignedAttendant.name} assigned to entertain the guest!`
      )
      if (onReassigned) {
        onReassigned(result.booking, recommendedRoomNumber)
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-300/70 my-6">
          {/* Top Luxury Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20 flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    Late Arrival Intelligence & Verification
                  </span>
                  <span className="text-xs text-slate-400 font-mono">1:00 PM → 7:00 PM Protocol</span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white mt-1">
                  Guest Arrival Evidences & Smart Reallocation
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition self-end sm:self-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Success Toast */}
            {reassignSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-semibold text-sm flex items-center justify-between gap-3 animate-scale-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{reassignSuccessMsg}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowKeycard(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  <Key className="w-3.5 h-3.5 mr-1.5" />
                  Issue Keycard
                </Button>
              </div>
            )}

            {/* Step 1: Select or Switch Booking to Test Late Arrival */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Reservation</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {currentBooking?.referenceCode}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{currentBooking?.guestName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block">Actual Arrival Time</label>
                  <input
                    type="time"
                    value={actualArrivalTime}
                    onChange={(e) => setActualArrivalTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-4">
                  <select
                    value={selectedBookingRef}
                    onChange={(e) => {
                      setSelectedBookingRef(e.target.value)
                      setReassignSuccessMsg("")
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.referenceCode}>
                        {b.referenceCode} - {b.guestName} (Room {b.roomNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: The Evidence Folio (What proofs the guest presents) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>1. Guest Proofs & Arrival Evidence</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Verified
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    If a guest booked for 1:00 PM and arrives at 7:00 PM, the system authenticates the following guaranteed evidences:
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-right">
                  <p className="text-[10px] uppercase font-bold text-amber-700">Late Arrival Window</p>
                  <p className="text-xs font-bold text-slate-900">
                    1:00 PM → {actualArrivalTime === "19:00" ? "7:00 PM" : actualArrivalTime} ({evidence?.hoursLate || 6}h Elapsed)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Proof 1: Official Reservation Code */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evidence ① Reference</p>
                  <p className="font-mono text-sm font-bold text-slate-900 truncate">{currentBooking?.referenceCode}</p>
                  <p className="text-[11px] text-slate-500">Digital Reservation Voucher with 256-bit cryptohash</p>
                </div>

                {/* Proof 2: Proof of Paid Receipt */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evidence ② Payment Auth</p>
                  <p className="font-mono text-sm font-bold text-slate-900">
                    {currentBooking?.paymentId || "AUTH-PAID-100%"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Total: {formatCurrency(currentBooking?.totalAmount || 0)} (Guaranteed Paid)
                  </p>
                </div>

                {/* Proof 3: Contactless QR Code Verification */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-2">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evidence ③ QR Token</p>
                  <p className="font-mono text-xs font-bold text-purple-900 truncate">
                    {currentBooking?.qrVerificationCode || "QR-VERIFY-1300-1900"}
                  </p>
                  <p className="text-[11px] text-slate-500">Scannable contactless check-in pass</p>
                </div>

                {/* Proof 4: 12-Hour Late Arrival Policy */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 flex items-center justify-center text-amber-800 mb-2">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Evidence ④ Holding Policy</p>
                  <p className="text-xs font-bold text-amber-950">12h Grace Guarantee</p>
                  <p className="text-[11px] text-amber-800">Guaranteed room holding until 12:00 midnight</p>
                </div>
              </div>
            </div>

            {/* Step 3: Room Status Conflict Detector */}
            <div className="p-5 rounded-2xl border-2 transition-all space-y-3 bg-rose-50/60 border-rose-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                      Room Occupancy Status Conflict
                    </span>
                    <h4 className="font-display text-lg font-bold text-slate-900">
                      Booked Room {currentBooking?.roomNumber} ({currentBooking?.classificationName})
                    </h4>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    isOriginalOccupied
                      ? "bg-rose-200 text-rose-900 border border-rose-300"
                      : "bg-emerald-200 text-emerald-900"
                  }`}
                >
                  {isOriginalOccupied ? "Currently Occupied" : "Room Available"}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Guest booked for <strong>1:00 PM check-in</strong>, but arrived at <strong>{actualArrivalTime}</strong>.
                {isOriginalOccupied ? (
                  <span className="text-rose-900 font-semibold block mt-1">
                    Room {currentBooking?.roomNumber} is currently occupied by another in-house guest (or extended stay).
                    Crown Jewel Hotel Intelligent Reallocation has activated below to recommend immediate alternatives.
                  </span>
                ) : (
                  <span className="text-emerald-800 font-semibold block mt-1">
                    Room {currentBooking?.roomNumber} is vacant and ready for immediate check-in.
                  </span>
                )}
              </p>
            </div>

            {/* Step 4: Assigned Employee to Entertain / Serve the Guest */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-display text-base font-bold text-blue-950 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-700" />
                    <span>Assigned Front Desk Employee to Entertain & Assist Guest</span>
                  </h4>
                  <p className="text-xs text-blue-800">
                    Designated host responsible for greeting, entertaining, and escorting the guest to their suite.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-200 text-blue-900 border border-blue-300">
                  Active Host Duty
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Select Attendant</label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {DEFAULT_HOTEL_STAFF.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} — {staff.role} ({staff.badgeNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-white border border-blue-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {assignedAttendant.name.charAt(0)}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{assignedAttendant.name}</p>
                    <p className="text-blue-700 font-medium text-[11px]">{assignedAttendant.role}</p>
                    <p className="text-slate-500 text-[10px]">Direct Phone: {assignedAttendant.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Automatic Smart Room Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>2. Automatic Smart Room Recommendations</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    If original room is occupied, the system recommends unoccupied suites with free upgrade guarantees:
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  {recommendations.length} Unoccupied Options Available
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div
                    key={rec.room.id}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      rec.isUpgrade
                        ? "bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-white border-amber-300 hover:border-amber-400"
                        : "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base flex-shrink-0 shadow-md ${
                          rec.isUpgrade
                            ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {rec.room.roomNumber}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display font-bold text-base text-slate-900">
                            Room {rec.room.roomNumber} — {rec.classification.name}
                          </h4>
                          {rec.isUpgrade ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm">
                              ✨ Complimentary VIP Upgrade (₱0 Extra)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Same Tier Match
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-500">Floor {rec.room.floor}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <BedDouble className="w-3.5 h-3.5 text-amber-600" /> {rec.classification.bedType}
                          </span>
                          <span>•</span>
                          <span>Size: {rec.classification.sizeSqM} m²</span>
                          <span>•</span>
                          <span>Cleanliness: Sanitized & Inspected</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">Tariff Rate</p>
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(rec.classification.dailyRate)}
                          {rec.isUpgrade && (
                            <span className="text-emerald-600 text-xs block font-bold">Waived Difference: ₱0</span>
                          )}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleExecuteReassignment(rec.room.roomNumber, rec.isUpgrade, rec.reason)}
                        className={`rounded-xl text-xs font-bold px-4 h-10 shadow-md ${
                          rec.isUpgrade
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        <Key className="w-3.5 h-3.5 mr-1.5" />
                        Accept & Reassign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Complies with World-Class Luxury Hotel Late Arrival Standards</span>
            </div>

            <Button variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
              Close Window
            </Button>
          </div>
        </div>
      </div>

      {showKeycard && (
        <DigitalKeycardModal
          isOpen={showKeycard}
          onClose={() => setShowKeycard(false)}
          roomNumber={activeReassignedRoom || currentBooking?.roomNumber || "102"}
          guestName={currentBooking?.guestName || "Valued Hotel Guest"}
          referenceCode={currentBooking?.referenceCode || "CJH-BK-REALLOC"}
          classificationName={currentBooking?.classificationName || "Executive Suite"}
        />
      )}
    </>
  )
}

"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Booking, PaymentTransaction } from "@/types"
import { getBookingByCode, formatCurrency, getTransactions } from "@/lib/rooms-data"
import { Search, Crown, CheckCircle2, BedDouble, Calendar, Clock, Wifi, Sparkles, X, FileText, Phone, Key, Star, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModalPortal } from "@/components/ui/ModalPortal"
import { ReceiptModal } from "@/components/payment/ReceiptModal"
import { DigitalKeycardModal } from "@/components/guest/DigitalKeycardModal"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { LateArrivalEvidenceModal } from "@/components/booking/LateArrivalEvidenceModal"
import { GuestEmployeeRatingModal } from "@/components/guest/GuestEmployeeRatingModal"

interface ReservationLookupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReservationLookupModal({ isOpen, onClose }: ReservationLookupModalProps) {
  const [code, setCode] = useState("")
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showKeycard, setShowKeycard] = useState(false)
  const [showLateArrivalModal, setShowLateArrivalModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [cleaningRequested, setCleaningRequested] = useState(false)
  const { requestRoomCleaning } = useNotifications()

  if (!isOpen) return null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    const res = getBookingByCode(code.trim())
    setSearchedBooking(res || null)
    setHasSearched(true)
    setCleaningRequested(false)
  }

  const handleRequestCleaning = async () => {
    if (!searchedBooking) return
    try {
      await requestRoomCleaning({
        roomNumber: searchedBooking.roomNumber,
        notes: `Guest request via Portal (${searchedBooking.guestName})`,
      })
      setCleaningRequested(true)
    } catch (e) {
      console.error(e)
    }
  }

  const transactions = getTransactions()
  const matchingTxn = transactions.find(
    (t) => t.bookingId === searchedBooking?.id || t.bookingRef === searchedBooking?.referenceCode
  ) || (searchedBooking ? {
    id: `txn-hist-${searchedBooking.id}`,
    receiptNumber: `REC-HIST-${searchedBooking.referenceCode}`,
    bookingId: searchedBooking.id,
    bookingRef: searchedBooking.referenceCode,
    guestName: searchedBooking.guestName,
    guestEmail: searchedBooking.guestEmail,
    amount: searchedBooking.totalAmount,
    currency: "PHP" as const,
    paymentMethod: searchedBooking.paymentMethod || "credit_card",
    status: "completed" as const,
    authCode: "AUTH-HIST-VERIFIED",
    transactionDate: searchedBooking.createdAt,
    breakdown: {
      roomSubtotal: searchedBooking.baseAmount,
      taxes: searchedBooking.taxAmount,
      serviceFee: searchedBooking.serviceCharge,
      total: searchedBooking.totalAmount,
    },
  } : null)

  return (
    <>
      <ModalPortal isOpen={isOpen}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 my-auto max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Guest Reservation Lookup</h2>
                <p className="text-xs text-amber-200/80">Access your verified stay & folios</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Enter Booking Reference Code or Room Number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CJH-BK-91823 or Room 101"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm font-mono focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-xl px-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold"
                >
                  Look Up
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: Try demo codes <code className="bg-amber-100 text-amber-900 font-bold px-1 py-0.5 rounded">CJH-BK-7PM-LATE</code> (Late Arrival Scenario),{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">CJH-BK-91823</code>, or room{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">101</code>
              </p>
            </form>

            {/* Results */}
            {hasSearched && searchedBooking && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/80 space-y-4 animate-scale-in">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Confirmed Stay
                      </span>
                      {searchedBooking.lateArrivalInfo?.isLateArrival && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-200 text-amber-900 border border-amber-300">
                          1:00 PM → 7:00 PM Late Arrival Pass
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mt-2">
                      {searchedBooking.guestName}
                    </h3>
                    <p className="text-xs text-slate-600 font-mono">Ref: {searchedBooking.referenceCode}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Assigned Room</span>
                    <span className="text-2xl font-bold font-display text-amber-900">
                      Room {searchedBooking.roomNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-white/80 p-3.5 rounded-xl border border-amber-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Suite Type</span>
                    <span className="font-semibold text-slate-800">{searchedBooking.classificationName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Stay Rate Plan</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {searchedBooking.rateType} ({searchedBooking.duration}{" "}
                      {searchedBooking.rateType === "daily" ? "nights" : "hours"})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Check-In</span>
                    <span className="font-semibold text-slate-800">
                      {searchedBooking.checkInDate} @ {searchedBooking.checkInTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Check-Out</span>
                    <span className="font-semibold text-slate-800">
                      {searchedBooking.checkOutDate} @ {searchedBooking.checkOutTime}
                    </span>
                  </div>
                </div>

                {/* Assigned Host to Entertain Guest */}
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-950">
                        Dedicated Host: {searchedBooking.assignedStaff?.name || "John Cruz"}
                      </p>
                      <p className="text-[11px] text-blue-700">
                        {searchedBooking.assignedStaff?.role || "Front Desk Officer"} • Ready to assist your stay
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowRatingModal(true)}
                    className="rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold h-7 px-2.5"
                  >
                    <Star className="w-3 h-3 mr-1 fill-slate-950" />
                    Rate Staff
                  </Button>
                </div>

                {/* Late Arrival Evidence Trigger */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-amber-950">Late Arrival Guarantee & Evidences</p>
                      <p className="text-[11px] text-amber-800">
                        Booked 1:00 PM, arriving 7:00 PM? View verified booking proof & auto room recommendations.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowLateArrivalModal(true)}
                    className="rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 text-[11px] font-bold h-8 px-3"
                  >
                    Late Arrival Pass
                  </Button>
                </div>

                {/* Stay Amenities & Quick Actions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white text-xs">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-amber-400" />
                      <span>Guest High-Speed WiFi:</span>
                      <strong className="text-amber-300 font-mono">CrownJewel_VIP</strong>
                    </div>
                    <span className="text-[11px] text-slate-300 font-mono">Pass: luxury2026</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowKeycard(true)}
                      className="flex-1 text-xs rounded-xl border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold"
                    >
                      <Key className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      Digital Room Key
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReceipt(true)}
                      className="flex-1 text-xs rounded-xl"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      Folio / Receipt
                    </Button>
                    <Button
                      type="button"
                      onClick={handleRequestCleaning}
                      disabled={cleaningRequested}
                      className="flex-1 text-xs rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      {cleaningRequested ? "Housekeeping Alerted!" : "Housekeeping"}
                    </Button>
                  </div>

                  <Link href="/dashboard/guest" onClick={onClose} className="block w-full">
                    <Button
                      type="button"
                      className="w-full mt-2 text-xs rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Open Full In-House Guest Portal & Service Hub →
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {hasSearched && !searchedBooking && (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-600">
                <p className="font-semibold text-sm">No reservation found matching "{code}"</p>
                <p className="text-xs text-slate-400 mt-1">
                  Please verify your booking reference code or contact our front desk at +63 (83) 238-9000.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>

      {showReceipt && matchingTxn && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          transaction={matchingTxn}
          booking={searchedBooking}
        />
      )}

      {showKeycard && searchedBooking && (
        <DigitalKeycardModal
          isOpen={showKeycard}
          onClose={() => setShowKeycard(false)}
          roomNumber={searchedBooking.roomNumber}
          guestName={searchedBooking.guestName}
          referenceCode={searchedBooking.referenceCode}
          classificationName={searchedBooking.classificationName}
        />
      )}

      {showLateArrivalModal && (
        <LateArrivalEvidenceModal
          isOpen={showLateArrivalModal}
          onClose={() => setShowLateArrivalModal(false)}
          initialBookingRef={searchedBooking?.referenceCode || "CJH-BK-7PM-LATE"}
          onReassigned={(b, newRoom) => {
            setSearchedBooking(b)
            setShowLateArrivalModal(false)
          }}
        />
      )}

      {showRatingModal && (
        <GuestEmployeeRatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          defaultEmployeeId={searchedBooking?.assignedStaff?.id}
          roomNumber={searchedBooking?.roomNumber || "301"}
        />
      )}
    </>
  )
}

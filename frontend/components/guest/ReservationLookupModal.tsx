"use client"

import React, { useState } from "react"
import { Booking, PaymentTransaction } from "@/types"
import { getBookingByCode, formatCurrency, getTransactions } from "@/lib/rooms-data"
import { Search, Crown, CheckCircle2, BedDouble, Calendar, Clock, Wifi, Sparkles, X, FileText, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReceiptModal } from "@/components/payment/ReceiptModal"
import { useNotifications } from "@/components/notifications/NotificationProvider"

interface ReservationLookupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReservationLookupModal({ isOpen, onClose }: ReservationLookupModalProps) {
  const [code, setCode] = useState("")
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
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
    currency: "USD" as const,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 my-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Guest Reservation Lookup</h2>
                <p className="text-xs text-amber-200/80">Access your stay without logging in</p>
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
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
                Tip: Try demo codes <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">CJH-BK-91823</code>,{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">CJH-BK-91824</code>, or room{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">101</code>
              </p>
            </form>

            {/* Results */}
            {hasSearched && searchedBooking && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/80 space-y-4 animate-scale-in">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Confirmed Stay
                    </span>
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

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReceipt(true)}
                      className="flex-1 text-xs rounded-xl"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      View Invoice / Receipt
                    </Button>
                    <Button
                      type="button"
                      onClick={handleRequestCleaning}
                      disabled={cleaningRequested}
                      className="flex-1 text-xs rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      {cleaningRequested ? "Housekeeping Alerted!" : "Request Cleaning"}
                    </Button>
                  </div>
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

      {showReceipt && matchingTxn && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          transaction={matchingTxn}
          booking={searchedBooking}
        />
      )}
    </>
  )
}

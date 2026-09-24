"use client"

import React, { useState } from "react"
import { Booking, PaymentTransaction } from "@/types"
import { getBookings, getRooms, formatCurrency } from "@/lib/rooms-data"
import { CreditCard, Search, DollarSign, Check, X, ShieldCheck, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment/PaymentModal"
import { ReceiptModal } from "@/components/payment/ReceiptModal"

interface ProcessPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentCompleted?: () => void
}

export function ProcessPaymentModal({ isOpen, onClose, onPaymentCompleted }: ProcessPaymentModalProps) {
  const bookings = getBookings()
  const rooms = getRooms()

  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id || "")
  const [customAmount, setCustomAmount] = useState<number | "">("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [latestTxn, setLatestTxn] = useState<PaymentTransaction | null>(null)

  if (!isOpen) return null

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0]
  const amountToCharge = customAmount !== "" ? Number(customAmount) : selectedBooking?.totalAmount || 150

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBooking) return
    setActiveBooking({
      ...selectedBooking,
      totalAmount: amountToCharge,
    })
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (txn: PaymentTransaction) => {
    setLatestTxn(txn)
    setShowReceiptModal(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display tracking-tight">Front Desk Payment Terminal</h2>
                <p className="text-xs text-emerald-200/80">Settle guest folios & room charges</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleStartPayment} className="p-6 sm:p-8 space-y-5">
            {/* Booking Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Select Active Guest / Room Folio
              </label>
              <select
                value={selectedBookingId}
                onChange={(e) => {
                  setSelectedBookingId(e.target.value)
                  setCustomAmount("")
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    Room {b.roomNumber} — {b.guestName} ({b.rateType.toUpperCase()} • {formatCurrency(b.totalAmount)}) [
                    {b.paymentStatus.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Folio Summary Card */}
            {selectedBooking && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Booking Reference</span>
                  <span className="font-mono font-bold text-slate-900">{selectedBooking.referenceCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Guest Name</span>
                  <span className="font-semibold text-slate-900">{selectedBooking.guestName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Accommodation</span>
                  <span className="font-semibold text-slate-900">
                    Room {selectedBooking.roomNumber} ({selectedBooking.classificationName})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Stay Duration</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {selectedBooking.duration} {selectedBooking.rateType === "daily" ? "Nights" : "Hours"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold text-sm">
                  <span className="text-slate-700">Folio Balance</span>
                  <span className="text-emerald-800 font-display text-base">
                    {formatCurrency(selectedBooking.totalAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* Amount to Collect */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Amount to Collect (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={customAmount !== "" ? customAmount : selectedBooking?.totalAmount || ""}
                  onChange={(e) => setCustomAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Default is full folio amount. Can be adjusted for partial payment.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-900/20"
              >
                Launch Payment Gateway ({formatCurrency(amountToCharge)})
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
            if (onPaymentCompleted) onPaymentCompleted()
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
            if (onPaymentCompleted) onPaymentCompleted()
            onClose()
          }}
          transaction={latestTxn}
          booking={activeBooking}
        />
      )}
    </>
  )
}

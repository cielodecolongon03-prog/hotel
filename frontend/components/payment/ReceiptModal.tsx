"use client"

import React, { useRef } from "react"
import { PaymentTransaction, Booking } from "@/types"
import { formatCurrency } from "@/lib/rooms-data"
import { Crown, CheckCircle2, Printer, Download, X, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: PaymentTransaction | null
  booking?: Booking | null
}

export function ReceiptModal({ isOpen, onClose, transaction, booking }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !transaction) return null

  const handlePrint = () => {
    window.print()
  }

  const breakdown = transaction.breakdown || {
    roomSubtotal: transaction.amount * 0.83,
    taxes: transaction.amount * 0.12,
    serviceFee: transaction.amount * 0.05,
    total: transaction.amount,
  }

  const formattedDate = new Date(transaction.transactionDate).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200/60 my-8">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-wide">Official Guest Folio & Receipt</h2>
              <p className="text-xs text-amber-300/80">Crown Jewel Hotel & Luxury Residences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Area */}
        <div ref={receiptRef} className="p-8 space-y-6 text-slate-800 bg-white">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-7 h-7 text-amber-600" />
                <span className="text-2xl font-bold font-display tracking-tight text-slate-900">
                  CROWN JEWEL HOTEL
                </span>
              </div>
              <p className="text-xs text-slate-500">Tboli, South Cotabato • Luxury Resort & Spa</p>
              <p className="text-xs text-slate-500">Tel: +63 (83) 238-9000 • reservations@crownjewel.com</p>
              <p className="text-xs text-slate-500">VAT Reg TIN: 009-482-194-000</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                PAYMENT CONFIRMED
              </span>
              <p className="text-xs font-semibold text-slate-700 mt-2">RECEIPT #: <span className="font-mono text-amber-800">{transaction.receiptNumber}</span></p>
              <p className="text-xs text-slate-500">Date: {formattedDate}</p>
              <p className="text-xs text-slate-500">Auth Code: <span className="font-mono">{transaction.authCode}</span></p>
            </div>
          </div>

          {/* Guest & Reservation Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Guest Name</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{transaction.guestName}</p>
              <p className="text-slate-500 truncate">{transaction.guestEmail}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Booking Reference</p>
              <p className="text-sm font-bold text-amber-800 font-mono mt-0.5">{transaction.bookingRef}</p>
              <p className="text-slate-600">Room: <span className="font-bold text-slate-900">{booking?.roomNumber || "Assigned"}</span></p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Payment Method</p>
              <p className="text-sm font-bold text-slate-900 capitalize mt-0.5">
                {transaction.paymentMethod.replace("_", " ")}
                {transaction.cardLast4 ? ` (•••• ${transaction.cardLast4})` : ""}
              </p>
              <p className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Transaction
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border rounded-xl overflow-hidden border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Type / Duration</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{booking?.classificationName || "Crown Jewel Accommodation"}</p>
                    <p className="text-[11px] text-slate-500">Room {booking?.roomNumber || "Assigned"} • All luxury amenities included</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-amber-100 text-amber-900">
                      {booking?.rateType === "hourly" ? `${booking.duration} Hours (Hourly)` : `${booking?.duration || 1} Nights (Daily)`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">{formatCurrency(breakdown.roomSubtotal)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-slate-500" colSpan={2}>Government Value Added Tax (VAT 12%)</td>
                  <td className="py-2.5 px-4 text-right font-medium text-slate-600">{formatCurrency(breakdown.taxes)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-slate-500" colSpan={2}>Hotel Service Charge (5%)</td>
                  <td className="py-2.5 px-4 text-right font-medium text-slate-600">{formatCurrency(breakdown.serviceFee)}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 text-slate-900 font-bold">
                <tr>
                  <td className="py-3.5 px-4 text-sm" colSpan={2}>Total Amount Paid</td>
                  <td className="py-3.5 px-4 text-right text-base text-amber-800">{formatCurrency(transaction.amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Notes */}
          <div className="text-center pt-4 border-t border-slate-100 space-y-1">
            <p className="text-xs font-semibold text-slate-700">Thank you for choosing Crown Jewel Hotel!</p>
            <p className="text-[11px] text-slate-400">
              Check-in: 2:00 PM • Standard Check-out: 12:00 PM • Late check-out available upon request
            </p>
            <p className="text-[10px] text-slate-400">This serves as an official electronic receipt. No physical signature required.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-md"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print / Save Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}

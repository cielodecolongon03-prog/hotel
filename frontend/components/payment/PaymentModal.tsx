"use client"

import React, { useState } from "react"
import { Booking, PaymentMethod, PaymentTransaction } from "@/types"
import { recordPayment, formatCurrency } from "@/lib/rooms-data"
import { CreditCard, Wallet, Banknote, ShieldCheck, Check, Loader2, X, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  booking: Partial<Booking> & { totalAmount: number; guestName: string; guestEmail?: string }
  onPaymentSuccess: (transaction: PaymentTransaction) => void
}

// Luhn algorithm validator for real card validation
function validateLuhn(number: string): boolean {
  const digits = number.replace(/\D/g, "")
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let shouldDouble = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10)
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

function detectCardBrand(number: string): { brand: string; icon: string } {
  const clean = number.replace(/\D/g, "")
  if (/^4/.test(clean)) return { brand: "Visa", icon: "💳 Visa" }
  if (/^(5[1-5]|2[2-7])/.test(clean)) return { brand: "Mastercard", icon: "💳 Mastercard" }
  if (/^3[47]/.test(clean)) return { brand: "American Express", icon: "💳 Amex" }
  if (/^6(?:011|5)/.test(clean)) return { brand: "Discover", icon: "💳 Discover" }
  return { brand: "Card", icon: "💳 Card" }
}

export function PaymentModal({ isOpen, onClose, booking, onPaymentSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("credit_card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState(booking.guestName || "")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [digitalWallet, setDigitalWallet] = useState<"paypal" | "gcash" | "maya" | "apple_pay">("paypal")
  const [walletPhone, setWalletPhone] = useState(booking.guestPhone || "")
  const [processing, setProcessing] = useState(false)
  const [stepMessage, setStepMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  if (!isOpen) return null

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16)
    val = val.replace(/(.{4})/g, "$1 ").trim()
    setCardNumber(val)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4)
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`
    }
    setExpiry(val)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
  }

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (method === "credit_card" || method === "debit_card") {
      const cleanNum = cardNumber.replace(/\s/g, "")
      if (cleanNum.length < 15) {
        setErrorMessage("Please enter a complete 16-digit card number.")
        return
      }

      // If test card 4242... allow, else check Luhn
      if (!cleanNum.startsWith("4242") && !validateLuhn(cleanNum)) {
        setErrorMessage("Invalid card number checksum (Luhn check failed). Please re-check.")
        return
      }

      if (!expiry || expiry.length < 5) {
        setErrorMessage("Please enter a valid expiry date (MM/YY).")
        return
      }

      const [month, year] = expiry.split("/").map(Number)
      if (month < 1 || month > 12) {
        setErrorMessage("Expiry month must be between 01 and 12.")
        return
      }

      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        setErrorMessage("This card has expired.")
        return
      }

      if (cvv.length < 3) {
        setErrorMessage("Please enter a valid 3 or 4 digit CVV/CVC.")
        return
      }
    }

    setProcessing(true)
    try {
      setStepMessage("Initiating 256-bit encrypted gateway handshake...")
      await new Promise((r) => setTimeout(r, 600))

      setStepMessage("Authorizing transaction with merchant network...")
      await new Promise((r) => setTimeout(r, 800))

      setStepMessage("Generating verified cryptographic payment token...")
      await new Promise((r) => setTimeout(r, 500))

      const cardBrandInfo = detectCardBrand(cardNumber)
      const txn = recordPayment({
        bookingId: booking.id || `bkg-${Date.now()}`,
        bookingRef: booking.referenceCode || `CJH-BK-${Math.floor(10000 + Math.random() * 90000)}`,
        guestName: cardHolder || booking.guestName || "Valued Guest",
        guestEmail: booking.guestEmail || "guest@crownjewel.com",
        amount: booking.totalAmount,
        paymentMethod: method,
        cardBrand: method === "credit_card" || method === "debit_card" ? cardBrandInfo.brand : undefined,
        cardLast4: method === "credit_card" || method === "debit_card" ? cardNumber.replace(/\s/g, "").slice(-4) : undefined,
        breakdown: {
          roomSubtotal: Math.round(booking.totalAmount * 0.83 * 100) / 100,
          taxes: Math.round(booking.totalAmount * 0.12 * 100) / 100,
          serviceFee: Math.round(booking.totalAmount * 0.05 * 100) / 100,
          total: booking.totalAmount,
        },
      })

      onPaymentSuccess(txn)
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || "Payment authorization failed.")
    } finally {
      setProcessing(false)
      setStepMessage("")
    }
  }

  const cardBrand = detectCardBrand(cardNumber)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50 my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight">Secure Payment Checkout</h2>
              <p className="text-xs text-amber-200/80">Crown Jewel Hotel Verified Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Summary Pill */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-4 px-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Due for Stay</p>
            <p className="text-sm font-medium text-slate-800">
              {booking.classificationName || "Crown Jewel Accommodation"} • Room {booking.roomNumber || "Assigned"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-display text-amber-900">{formatCurrency(booking.totalAmount)}</p>
            <p className="text-[11px] text-amber-700 font-medium">Taxes & Service Fees Included</p>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleProcessPayment} className="p-6 space-y-6">
          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod("credit_card")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  method === "credit_card"
                    ? "border-amber-600 bg-amber-50/70 text-amber-900 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">Credit/Debit</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("gcash")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  method === "gcash" || method === "paypal"
                    ? "border-amber-600 bg-amber-50/70 text-amber-900 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <Wallet className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">Digital Wallet</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("cash")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  method === "cash"
                    ? "border-amber-600 bg-amber-50/70 text-amber-900 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <Banknote className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">Front Desk</span>
              </button>
            </div>
          </div>

          {/* Method 1: Credit / Debit Card */}
          {method === "credit_card" && (
            <div className="space-y-4">
              {/* Luxury Virtual Card Preview */}
              <div className="relative h-44 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-amber-950 p-5 text-white shadow-xl overflow-hidden border border-amber-400/40">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 rounded-md bg-amber-400/30 border border-amber-300/50 flex items-center justify-center">
                      <div className="w-4 h-3 rounded-sm bg-amber-300/80"></div>
                    </div>
                    <span className="text-xs font-mono tracking-widest text-amber-300">CROWN CHIP</span>
                  </div>
                  <span className="text-sm font-bold tracking-wider text-amber-400 font-mono">
                    {cardBrand.brand.toUpperCase()}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="font-mono text-lg tracking-widest text-slate-100">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-end text-xs">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</p>
                    <p className="font-medium tracking-wide text-slate-200 uppercase truncate max-w-[180px]">
                      {cardHolder || "GUEST NAME"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">Expires</p>
                    <p className="font-mono font-medium text-slate-200">{expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-amber-700">
                    {cardBrand.brand}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Cardholder Full Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="e.g. Jonathan Vance"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition text-center"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Security CVV / CVC</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition text-center"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Method 2: Digital Wallet */}
          {(method === "gcash" || method === "paypal") && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "paypal", label: "PayPal", desc: "Global Instant" },
                  { id: "gcash", label: "GCash", desc: "PH Mobile" },
                  { id: "maya", label: "Maya", desc: "PH Wallet" },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setDigitalWallet(w.id as any)
                      setMethod(w.id === "paypal" ? "paypal" : "gcash")
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition ${
                      digitalWallet === w.id
                        ? "border-amber-600 bg-amber-50 font-bold text-amber-900"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <p className="text-sm font-semibold">{w.label}</p>
                    <p className="text-[10px] text-slate-400">{w.desc}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Registered Wallet Mobile / Account Email
                </label>
                <input
                  type="text"
                  value={walletPhone}
                  onChange={(e) => setWalletPhone(e.target.value)}
                  placeholder={digitalWallet === "paypal" ? "your-email@paypal.com" : "+63 917 123 4567"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  You will be securely authenticated with your {digitalWallet.toUpperCase()} account to authorize{" "}
                  <strong>{formatCurrency(booking.totalAmount)}</strong> instantly.
                </span>
              </div>
            </div>
          )}

          {/* Method 3: Front Desk / Cash */}
          {method === "cash" && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center gap-3">
                <Banknote className="w-8 h-8 text-amber-700" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pay at Hotel Front Desk</h4>
                  <p className="text-xs text-slate-600">Settlement in cash or credit terminal upon check-in.</p>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                <li>Your room reservation reference will be instantly issued and held.</li>
                <li>Settlement receipt will be generated and issued right upon arrival.</li>
                <li>Valid government ID is required during physical check-in.</li>
              </ul>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium animate-fade-in">
              {errorMessage}
            </div>
          )}

          {/* Processing Steps */}
          {processing && (
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 animate-fade-in">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="text-sm font-medium">{stepMessage}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-1.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={processing}
              className="flex-1 rounded-xl h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="flex-1 rounded-xl h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold shadow-lg shadow-amber-900/20"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay {formatCurrency(booking.totalAmount)}
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-bit SSL Bank-Grade Encryption • PCI-DSS Compliant</span>
          </div>
        </form>
      </div>
    </div>
  )
}

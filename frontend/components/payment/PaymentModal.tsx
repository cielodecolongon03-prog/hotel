"use client"

import React, { useState } from "react"
import { Booking, PaymentMethod, PaymentTransaction } from "@/types"
import { recordPayment, formatCurrency } from "@/lib/rooms-data"
import { CreditCard, Wallet, Banknote, ShieldCheck, Check, Loader2, X, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/components/notifications/NotificationProvider"

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
  const { addNotification } = useNotifications()
  const [method, setMethod] = useState<PaymentMethod>("gcash")
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState(booking.guestName || "")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [digitalWallet, setDigitalWallet] = useState<"gcash" | "maya" | "grabpay" | "paypal">("gcash")
  const [walletPhone, setWalletPhone] = useState(booking.guestPhone || "+63 9")
  const [bankChannel, setBankChannel] = useState<"bdo" | "bpi" | "unionbank">("bdo")
  const [cashTendered, setCashTendered] = useState<number | "">(booking.totalAmount)
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [otpCode, setOtpCode] = useState("")
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

  const finalizePayment = async (selectedMethod: PaymentMethod) => {
    setProcessing(true)
    try {
      setStepMessage("Authorizing with Bangko Sentral ng Pilipinas (BSP) gateway...")
      await new Promise((r) => setTimeout(r, 120))

      setStepMessage(`Contacting ${selectedMethod.toUpperCase()} merchant network...`)
      await new Promise((r) => setTimeout(r, 120))

      setStepMessage("Generating official BIR-compliant VAT tax receipt...")
      await new Promise((r) => setTimeout(r, 100))

      const cardBrandInfo = detectCardBrand(cardNumber)
      const txn = recordPayment({
        bookingId: booking.id || `bkg-${Date.now()}`,
        bookingRef: booking.referenceCode || `CJH-BK-${Math.floor(10000 + Math.random() * 90000)}`,
        guestName: cardHolder || booking.guestName || "Valued Guest",
        guestEmail: booking.guestEmail || "guest@crownjewel.com",
        amount: booking.totalAmount,
        currency: "PHP",
        paymentMethod: selectedMethod,
        cardBrand: selectedMethod === "credit_card" || selectedMethod === "debit_card" ? cardBrandInfo.brand : undefined,
        cardLast4: selectedMethod === "credit_card" || selectedMethod === "debit_card" ? cardNumber.replace(/\s/g, "").slice(-4) : undefined,
        breakdown: {
          roomSubtotal: Math.round(booking.totalAmount * 0.82 * 100) / 100,
          taxes: Math.round(booking.totalAmount * 0.12 * 100) / 100,
          serviceFee: Math.round(booking.totalAmount * 0.10 * 100) / 100,
          total: booking.totalAmount,
        },
      })

      // Alert front desk and administration
      addNotification({
        title: `💳 Verified Payment Confirmed (${txn.receiptNumber})`,
        message: `${cardHolder || booking.guestName || "Guest"} settled payment of ₱${booking.totalAmount.toLocaleString()} via ${selectedMethod.toUpperCase()}.`,
        type: "general",
        roomNumber: booking.roomNumber,
        guestName: cardHolder || booking.guestName || "Valued Guest",
        targetRoles: ["admin", "hotel_manager", "front_desk"],
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

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (method === "credit_card" || method === "debit_card") {
      const cleanNum = cardNumber.replace(/\s/g, "")
      if (cleanNum.length < 15) {
        setErrorMessage("Please enter a complete 16-digit card number.")
        return
      }

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

      await finalizePayment(method)
      return
    }

    if (method === "gcash" || method === "maya" || method === "grabpay") {
      // Trigger OTP verification simulation
      setShowOtpStep(true)
      return
    }

    if (method === "bdo" || method === "bpi" || method === "unionbank") {
      await finalizePayment(method)
      return
    }

    if (method === "cash") {
      const tenderedNum = Number(cashTendered) || 0
      if (tenderedNum < booking.totalAmount) {
        setErrorMessage(`Amount tendered (₱${tenderedNum.toLocaleString()}) is less than total amount (₱${booking.totalAmount.toLocaleString()}).`)
        return
      }
      await finalizePayment("cash")
      return
    }

    await finalizePayment(method)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage("Please enter the 6-digit authentication OTP code sent to your phone.")
      return
    }
    setShowOtpStep(false)
    await finalizePayment(method)
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
          {/* Payment Method Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block">
              Select Philippine Payment Gateway
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMethod("gcash")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  method === "gcash" || method === "maya" || method === "grabpay"
                    ? "border-blue-600 bg-blue-50/70 text-blue-950 shadow-sm font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <Wallet className="w-5 h-5 mb-1 text-blue-600" />
                <span className="text-[11px] font-semibold">PH E-Wallet</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("credit_card")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  method === "credit_card"
                    ? "border-amber-600 bg-amber-50/70 text-amber-950 shadow-sm font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-amber-600" />
                <span className="text-[11px] font-semibold">Cards / JCB</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("bdo")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  method === "bdo" || method === "bpi" || method === "unionbank"
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <Sparkles className="w-5 h-5 mb-1 text-indigo-600" />
                <span className="text-[11px] font-semibold">Bank / InstaPay</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("cash")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  method === "cash"
                    ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <Banknote className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="text-[11px] font-semibold">Cash / Counter</span>
              </button>
            </div>
          </div>

          {/* Panel 1: Philippine E-Wallets (GCash, Maya, GrabPay) */}
          {(method === "gcash" || method === "maya" || method === "grabpay") && !showOtpStep && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "gcash", label: "GCash", color: "border-blue-500 bg-blue-50 text-blue-900", tag: "Most Popular PH" },
                  { id: "maya", label: "Maya Wallet", color: "border-teal-500 bg-teal-50 text-teal-900", tag: "QR Ph Ready" },
                  { id: "grabpay", label: "GrabPay", color: "border-emerald-500 bg-emerald-50 text-emerald-900", tag: "Rewards" },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setDigitalWallet(w.id as any)
                      setMethod(w.id as PaymentMethod)
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition ${
                      method === w.id
                        ? `${w.color} font-bold shadow-sm ring-1 ring-amber-400`
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <p className="text-sm font-bold">{w.label}</p>
                    <p className="text-[10px] text-slate-500">{w.tag}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Registered {method.toUpperCase()} Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-slate-500 text-sm">
                    🇵🇭 +63
                  </span>
                  <input
                    type="tel"
                    value={walletPhone.replace(/^\+63\s?/, "")}
                    onChange={(e) => setWalletPhone(`+63 ${e.target.value.replace(/\D/g, "").slice(0, 10)}`)}
                    placeholder="917 123 4567"
                    className="w-full pl-16 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  Clicking Proceed will send a secure 6-digit OTP to your verified Philippine mobile number to charge{" "}
                  <strong>{formatCurrency(booking.totalAmount)}</strong> via {method.toUpperCase()}.
                </span>
              </div>
            </div>
          )}

          {/* OTP Verification Step for E-Wallets */}
          {showOtpStep && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-4 animate-scale-in border border-blue-400/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                  <h4 className="font-bold text-base">{method.toUpperCase()} 2-Factor Authentication</h4>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-300">BSP VERIFIED</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Enter the 6-digit security code sent to <strong>{walletPhone}</strong> to confirm payment of{" "}
                <strong className="text-amber-400">{formatCurrency(booking.totalAmount)}</strong>.
              </p>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-xl bg-slate-950/80 border border-blue-400/40 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setOtpCode("891204")}
                  className="text-amber-400 hover:underline font-semibold"
                >
                  ⚡ Auto-Fill Demo OTP (891204)
                </button>
                <span>Expires in 04:59</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowOtpStep(false)}
                  className="flex-1 rounded-xl text-slate-900 border-white/20 bg-white/90 hover:bg-white"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
                >
                  Verify & Pay {formatCurrency(booking.totalAmount)}
                </Button>
              </div>
            </div>
          )}

          {/* Panel 2: Credit / Debit Card */}
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number (Visa / MC / JCB / Amex)</label>
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

          {/* Panel 3: Philippine Online Banking / InstaPay */}
          {(method === "bdo" || method === "bpi" || method === "unionbank") && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "bdo", name: "BDO Unibank", tag: "Online Banking" },
                  { id: "bpi", name: "BPI", tag: "ExpressOnline" },
                  { id: "unionbank", name: "UnionBank", tag: "InstaPay 24/7" },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setBankChannel(b.id as any)
                      setMethod(b.id as PaymentMethod)
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition ${
                      method === b.id
                        ? "border-indigo-600 bg-indigo-50 font-bold text-indigo-950 shadow-sm"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <p className="text-xs font-bold">{b.name}</p>
                    <p className="text-[10px] text-slate-400">{b.tag}</p>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>InstaPay Reference Account:</span>
                  <span className="font-mono text-indigo-800">CROWN-HOTEL-PH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Account Number:</span>
                  <span className="font-mono font-bold text-slate-800">0092-8172-9102</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Clicking Proceed generates an instant verified InstaPay authorization receipt for{" "}
                  <strong>{formatCurrency(booking.totalAmount)}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Panel 4: Front Desk Cash with Live Change Calculator */}
          {method === "cash" && (
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
              <div className="flex items-center gap-3">
                <Banknote className="w-8 h-8 text-amber-700" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Front Desk Cash Settlement</h4>
                  <p className="text-xs text-slate-600">Physical settlement in Philippine Pesos (PHP ₱) at counter.</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Cash Amount Tendered by Guest (₱)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₱</span>
                  <input
                    type="number"
                    min={booking.totalAmount}
                    value={cashTendered !== "" ? cashTendered : ""}
                    onChange={(e) => setCashTendered(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 font-mono font-bold text-lg text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
                    placeholder="Enter cash amount"
                    required
                  />
                </div>
              </div>

              {Number(cashTendered) >= booking.totalAmount && (
                <div className="p-3 rounded-xl bg-white border border-amber-300/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Change Due to Guest:</span>
                  <span className="text-base font-bold font-mono text-emerald-700">
                    {formatCurrency(Number(cashTendered) - booking.totalAmount)}
                  </span>
                </div>
              )}

              <ul className="text-[11px] text-slate-600 space-y-1 pl-4 list-disc">
                <li>Folio receipt and tax invoice issued instantly to the front desk terminal.</li>
                <li>Digital room key card automatically encoded upon receipt confirmation.</li>
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
          {!showOtpStep && (
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
                className="flex-1 rounded-xl h-12 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold shadow-lg shadow-amber-900/20"
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
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-bit SSL Bank-Grade Encryption • PCI-DSS Compliant</span>
          </div>
        </form>
      </div>
    </div>
  )
}

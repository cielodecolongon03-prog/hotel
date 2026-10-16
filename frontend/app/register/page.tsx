"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Button } from "@/components/ui/button"
import {
  Crown,
  Sparkles,
  BedDouble,
  Star,
  Key,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
} from "lucide-react"

export default function RegisterPage() {
  const { signUp } = useAuth()
  const { addNotification } = useNotifications()
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("+63 ")
  const [roomNumber, setRoomNumber] = useState("301")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!fullName.trim()) {
      setError("Please enter your full legal name.")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.")
      return
    }

    setSubmitting(true)

    try {
      await signUp(email, password, fullName, phone, roomNumber)

      // Alert Front Desk & Management of the new registered guest
      addNotification({
        title: `👑 New Guest Registered: ${fullName}`,
        message: `${fullName} has created an in-house guest profile for Room ${roomNumber || "301"}. Instant cleaning and employee rating features enabled.`,
        type: "general",
        roomNumber: roomNumber || "301",
        guestName: fullName,
        targetRoles: ["admin", "hotel_manager", "front_desk"],
      })

      router.replace("/dashboard/guest")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Left Column: Luxury Presentation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 overflow-hidden border-r border-amber-500/20 p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-slate-950/50 z-10" />

        <img
          src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85"
          alt="Crown Jewel Grand Suite"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay filter contrast-125"
        />

        {/* Top Brand */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-white block">
              CROWN JEWEL
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400/90 font-semibold block">
              Hotel & Luxury Residences
            </span>
          </div>
        </div>

        {/* Center Benefits Showcase */}
        <div className="relative z-20 space-y-6 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            VIP In-House Guest Privileges
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Elevate Your Stay with Five-Star Convenience.
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Register your guest folio to unlock instant on-demand hospitality, contactless amenities, and priority service.
          </p>

          <div className="space-y-3.5 pt-2">
            {[
              {
                icon: BedDouble,
                title: "1-Click Housekeeping Requests",
                desc: "Request instant suite turnover, fresh Egyptian cotton linens, or turndown service.",
              },
              {
                icon: Star,
                title: "Rate Hotel Employees & Dedicated Butler",
                desc: "Reward our front desk hosts, concierges, and cleaning attendants with verified reviews.",
              },
              {
                icon: Key,
                title: "Instant Digital RFID / NFC Keycard",
                desc: "Unlock your suite doors and VIP elevators securely from your mobile device.",
              },
              {
                icon: ShieldCheck,
                title: "Late Arrival Grace & Evidences",
                desc: "Full 12-hour holding protection with automated zero-cost upgrade guarantees.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="relative z-20 text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Crown Jewel Encryption • Philippine Data Privacy Act Compliant</span>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-md w-full mx-auto space-y-6 py-6">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between pb-2">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition flex items-center gap-1.5"
            >
              ← Return to Guest Portal
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-amber-400 hover:underline"
            >
              Already Registered? Sign In →
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="font-display text-3xl font-bold text-white tracking-tight">
              Create In-House Guest Account
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Register below to ask for room cleaning, rate hotel employees, access digital keycards, and manage your stay.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium animate-scale-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Legal Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Legal Name (as on Photo ID)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maria Clara Santos"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address (For Keycard & Receipts)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maria.santos@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>
            </div>

            {/* Mobile / Room Number Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Mobile / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 917 555 1234"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Suite / Room Number
                </label>
                <div className="relative">
                  <BedDouble className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 301"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Create Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-mono"
                  required
                />
              </div>
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold text-sm shadow-xl shadow-amber-900/30 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>Registering Your Account...</>
              ) : (
                <>
                  Register & Enter Guest Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Fill */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setFullName("Maria Clara Santos")
                setEmail("maria.santos@crownjewel.ph")
                setPhone("+63 917 555 1234")
                setRoomNumber("301")
                setPassword("password123")
                setConfirmPassword("password123")
              }}
              className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              ⚡ Fill Demo Guest Credentials
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500 pt-4">
          Crown Jewel Hotel & Luxury Residences © 2026. All rights reserved.
        </div>
      </div>
    </div>
  )
}

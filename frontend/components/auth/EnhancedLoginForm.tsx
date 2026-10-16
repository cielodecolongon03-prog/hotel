"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Lock,
  Mail,
  Crown,
  Shield,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Building2,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Key,
  Wrench,
  Bed,
  Briefcase,
} from "lucide-react"
import { getDashboardPath } from "@/lib/auth-routing"

export function EnhancedLoginForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("admin@crownjewel.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: (i * 17) % 100,
        top: (i * 29) % 100,
        delay: (i % 6) * 0.3,
        duration: 3 + (i % 4),
      })),
    []
  )

  const demoAccounts = [
    { label: "Admin", email: "admin@crownjewel.com", role: "Full Access", icon: Shield, tone: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { label: "Manager", email: "manager@crownjewel.com", role: "Operations", icon: Briefcase, tone: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    { label: "Front Desk", email: "frontdesk1@crownjewel.com", role: "Guest Folios", icon: Key, tone: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    { label: "Housekeeping", email: "housekeeping1@crownjewel.com", role: "Cleaning Board", icon: Bed, tone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { label: "Maintenance", email: "maintenance1@crownjewel.com", role: "Facilities", icon: Wrench, tone: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
    { label: "Owner", email: "owner@crownjewel.com", role: "Financials", icon: Crown, tone: "text-amber-300 bg-amber-400/10 border-amber-400/30" },
    { label: "Guest Stay", email: "guest@crownjewel.com", role: "Rate & Clean", icon: Sparkles, tone: "text-teal-300 bg-teal-500/10 border-teal-500/30" },
  ]

  const handleSubmit = async (e?: React.FormEvent, directEmail?: string) => {
    if (e) e.preventDefault()
    setError("")
    setSubmitting(true)

    const targetEmail = directEmail || email

    try {
      const loggedInUser = await signIn(targetEmail, password || "password123")
      router.replace(getDashboardPath(loggedInUser.role, loggedInUser.email))
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.")
      setSubmitting(false)
    }
  }

  const handleQuickLogin = (targetEmail: string) => {
    setEmail(targetEmail)
    setPassword("password123")
    handleSubmit(undefined, targetEmail)
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Left Side: Luxury Hotel Architectural Presentation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 overflow-hidden border-r border-amber-500/20">
        <div className="absolute inset-0 bg-slate-950/40 z-10"></div>

        {/* High-Resolution Luxury Hotel Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85"
            alt="Crown Jewel Grand Resort & Hotel"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay filter contrast-125 brightness-90"
          />
        </div>

        {/* Ambient Floating Stardust Particles */}
        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-1.5 h-1.5 bg-amber-400/50 rounded-full animate-pulse"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content Box */}
        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          {/* Top Brand Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-white block">CROWN JEWEL</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold block">
                  Staff Command Center
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              All Systems Operational
            </div>
          </div>

          {/* Central Headline */}
          <div className="space-y-4 max-w-lg">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-300">
              Crown Jewel Hotel OS v3.0
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Hospitality Excellence, <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Engineered for Perfection.
              </span>
            </h1>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Unified role-based operations dashboard managing daily & hourly reservations, housekeeping dispatch, staff ratings,
              and real-time financial folios with bank-grade encryption.
            </p>

            {/* Public Guest Callout */}
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 p-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold transition group shadow-xl"
              >
                <span>Looking to Book a Room? Visit Guest Booking Portal</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Bottom Telemetry Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <p className="text-xl font-bold font-display text-amber-400">150</p>
              <p className="text-xs text-slate-400">Luxury Suites</p>
            </div>
            <div>
              <p className="text-xl font-bold font-display text-amber-400">99.98%</p>
              <p className="text-xs text-slate-400">System Uptime</p>
            </div>
            <div>
              <p className="text-xl font-bold font-display text-amber-400">24 / 7</p>
              <p className="text-xs text-slate-400">Staff Dispatch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: World-Class Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <span className="font-display text-lg font-bold text-white">Crown Jewel Hotel</span>
            </div>
            <Link href="/" className="text-xs text-amber-400 font-semibold hover:underline">
              Guest Portal →
            </Link>
          </div>

          {/* Title Box */}
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-bold text-white tracking-tight">Crown Jewel Sign In</h2>
            <p className="text-xs text-slate-400">
              Sign in with your staff credentials or registered guest account.
            </p>
          </div>

          {/* 1-Click Role Quick Switcher */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Instant Role Sign-In
              </span>
              <span className="text-[10px] text-slate-500">Tap to access</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickLogin(account.email)}
                  disabled={submitting}
                  className={`p-2.5 rounded-xl border text-left transition hover:scale-[1.02] flex flex-col justify-between ${account.tone}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-white">{account.label}</span>
                    <account.icon className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <span className="text-[10px] opacity-75 truncate mt-1">{account.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Staff Email</label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition ${
                    focusedInput === "email" ? "text-amber-400" : "text-slate-500"
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="staff@crownjewel.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 block">Password</label>
                <span className="text-[11px] text-slate-500 font-mono">Demo: password123</span>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition ${
                    focusedInput === "password" ? "text-amber-400" : "text-slate-500"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-mono"
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

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-fade-in">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating Staff Credentials...
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ChevronRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          {/* Guest Registration & In-House Access Link Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
            <div>
              <p className="text-xs font-bold text-white">Staying at Crown Jewel Hotel?</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Register as an in-house guest to rate staff and ask to clean your suite.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link
                href="/register"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-md transition text-center"
              >
                ✨ Register as Guest
              </Link>
              <button
                type="button"
                onClick={() => handleQuickLogin("guest@crownjewel.com")}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-teal-500/20 border border-teal-500/40 text-xs font-bold text-teal-300 hover:bg-teal-500/30 transition text-center"
              >
                Guest Demo (Suite 301)
              </button>
            </div>
          </div>

          {/* Security Footer */}
          <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1">
            <p className="flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Enterprise RBAC Security • 256-Bit TLS Encryption</span>
            </p>
            <p>© 2026 Crown Jewel Hotel & Luxury Residences</p>
          </div>
        </div>
      </div>
    </div>
  )
}
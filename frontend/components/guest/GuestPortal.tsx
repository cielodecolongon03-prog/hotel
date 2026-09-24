"use client"

import React, { useState } from "react"
import Link from "next/link"
import { RoomClassification, RateType } from "@/types"
import { getClassifications, getCurrency, setCurrency, formatCurrency } from "@/lib/rooms-data"
import {
  Crown,
  Calendar,
  Clock,
  Users,
  BedDouble,
  Sparkles,
  ShieldCheck,
  Search,
  Wifi,
  Coffee,
  Bath,
  ArrowRight,
  Star,
  CheckCircle2,
  LogIn,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GuestBookingModal } from "@/components/booking/GuestBookingModal"
import { ReservationLookupModal } from "@/components/guest/ReservationLookupModal"

export function GuestPortal() {
  const [classifications, setClassifications] = useState<RoomClassification[]>(() => getClassifications())
  const [rateView, setRateView] = useState<RateType>("daily")
  const [selectedClassForBooking, setSelectedClassForBooking] = useState<RoomClassification | null>(null)
  const [showLookupModal, setShowLookupModal] = useState(false)
  const [currency, setCurrState] = useState<"USD" | "PHP">(() => getCurrency())

  const handleToggleCurrency = () => {
    const next = currency === "USD" ? "PHP" : "USD"
    setCurrency(next)
    setCurrState(next)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 py-2 px-4 text-xs font-semibold tracking-wide text-center">
        <span>✨ Welcome to Crown Jewel Hotel & Luxury Residences • Direct Guest Booking (No Login Required) • Best Rate Guarantee</span>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
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
                Hotel & Residences
              </span>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#rooms" className="hover:text-amber-400 transition">
              Suites & Villas
            </a>
            <a href="#amenities" className="hover:text-amber-400 transition">
              Amenities
            </a>
            <a href="#rates-info" className="hover:text-amber-400 transition">
              Hourly & Daily Rates
            </a>
            <a href="#contact" className="hover:text-amber-400 transition">
              Concierge
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Currency Switcher */}
            <button
              onClick={handleToggleCurrency}
              className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-bold text-amber-400 hover:border-amber-500/50 transition flex items-center gap-1"
              title="Toggle Currency (USD / PHP)"
            >
              <span>{currency === "USD" ? "💵 USD ($)" : "🇵🇭 PHP (₱)"}</span>
            </button>

            {/* Look up Reservation without login */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLookupModal(true)}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 rounded-xl text-xs hidden sm:flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Lookup Booking
            </Button>

            {/* Staff Portal Login */}
            <Link href="/login">
              <Button
                size="sm"
                className="rounded-xl text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                Staff Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs font-semibold text-amber-300 backdrop-blur-md animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            World-Class Hospitality • Tboli, South Cotabato
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Where Unrivaled Luxury <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Meets Timeless Grandeur
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Reserve five-star suites and private villas with complete flexibility. Choose customized{" "}
            <strong className="text-amber-300 font-semibold">Daily Stays</strong> or convenient{" "}
            <strong className="text-amber-300 font-semibold">Hourly Day-Use Stays</strong> with instant direct checkout.
          </p>

          {/* Quick Rate View Switcher & Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center shadow-xl">
              <button
                onClick={() => setRateView("daily")}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  rateView === "daily"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Daily Rates (Per Night)
              </button>
              <button
                onClick={() => setRateView("hourly")}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  rateView === "hourly"
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Clock className="w-4 h-4" />
                Hourly Rates (Day Use)
              </button>
            </div>

            <Button
              onClick={() => setShowLookupModal(true)}
              variant="outline"
              className="h-12 px-6 rounded-2xl border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm font-semibold"
            >
              <Search className="w-4 h-4 mr-2 text-amber-400" />
              Manage My Booking (No Login)
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Room Classifications Showcase */}
      <section id="rooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Accommodations</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
              Select Your Sanctuary
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Showing pricing configured for:{" "}
              <strong className="text-amber-300 font-bold uppercase tracking-wider">{rateView} STAYS</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">View Rate Mode:</span>
            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setRateView("daily")}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  rateView === "daily" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                Per Day
              </button>
              <button
                onClick={() => setRateView("hourly")}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  rateView === "hourly" ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                Per Hour
              </button>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {classifications.map((roomClass) => {
            const displayPrice = rateView === "daily" ? roomClass.dailyRate : roomClass.hourlyRate
            const rateUnit = rateView === "daily" ? "/ night" : "/ hour"

            return (
              <div
                key={roomClass.id}
                className="group relative rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 shadow-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <img
                    src={roomClass.imageUrl}
                    alt={roomClass.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {roomClass.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                        {roomClass.badge}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10">
                      {roomClass.floorLevel}
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 right-4 text-right bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 shadow-xl">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {rateView === "daily" ? "Daily Rate" : `Hourly (min. ${roomClass.minHours}h)`}
                    </p>
                    <p className="text-2xl font-bold font-display text-amber-400">
                      {formatCurrency(displayPrice, currency)}
                      <span className="text-xs text-slate-400 font-normal"> {rateUnit}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {rateView === "daily"
                        ? `Also available at ${formatCurrency(roomClass.hourlyRate, currency)}/hr`
                        : `Daily rate: ${formatCurrency(roomClass.dailyRate, currency)}/day`}
                    </p>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-display text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {roomClass.name}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{roomClass.description}</p>

                    {/* Room Meta Badges */}
                    <div className="grid grid-cols-3 gap-2 pt-2 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Up to {roomClass.capacity} Guests</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{roomClass.bedType}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
                        <Bath className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{roomClass.sizeSqM} m² Luxury</span>
                      </div>
                    </div>

                    {/* Amenities List */}
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Included Amenities:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {roomClass.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/40"
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking Trigger Button */}
                  <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Instant Confirmation
                      </span>
                      <span className="text-[11px] text-slate-500">No account required</span>
                    </div>

                    <Button
                      onClick={() => setSelectedClassForBooking(roomClass)}
                      className="px-6 h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                    >
                      Book Room Now
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Hotel Amenities & Experience */}
      <section id="amenities" className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Five-Star Amenities</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Every Stay is a Royal Masterpiece
            </h2>
            <p className="text-slate-400 text-sm">
              Immerse yourself in our signature bespoke amenities curated for comfort, rejuvenation, and luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Infinity Sky Pool & Bar",
                desc: "Heated rooftop infinity pool overlooking mountain horizons with signature cocktails.",
                icon: Bath,
              },
              {
                title: "Michelin-Inspired Dining",
                desc: "Culinary excellence from world-renowned chefs serving local and international cuisine.",
                icon: Coffee,
              },
              {
                title: "24/7 Digital Concierge",
                desc: "Instant room service, housekeeping, and valet requests from your personal mobile folio.",
                icon: Sparkles,
              },
              {
                title: "Bank-Grade Security",
                desc: "State-of-the-art keycard biometric encryption, secure parking, and 24h surveillance.",
                icon: ShieldCheck,
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hourly vs Daily Explanation Section */}
      <section id="rates-info" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/40 border border-amber-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pioneering Flexible Hospitality
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Rates Tailored to Your Schedule
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Whether you need a full restful weekend escape or a pristine, luxurious 6-hour executive haven between
                flights and business presentations, Crown Jewel Hotel provides transparent, instant pricing.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span><strong>Daily Rates:</strong> Check in from 2:00 PM, standard 12:00 PM checkout.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span><strong>Hourly Rates:</strong> Day use starting at 3 hours. Full suite access and amenities included.</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base">Instant Guest Booking Features:</h3>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No mandatory login or password creation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time payment verification with official tax folio
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Digital WiFi and room key access lookup tool
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Immediate housekeeping notification integration
                </li>
              </ul>
              <Button
                onClick={() => {
                  const el = document.getElementById("rooms")
                  if (el) el.scrollIntoView({ behavior: "smooth" })
                }}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold"
              >
                Browse Suites & Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="font-display font-bold text-white text-base">Crown Jewel Hotel</span>
            </div>
            <p className="text-slate-400">
              A luxury hospitality sanctuary in Tboli, South Cotabato, Philippines.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-200">Contact & Reservations</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-400" /> +63 (83) 238-9000</p>
            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-400" /> reservations@crownjewel.com</p>
            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Tboli, South Cotabato</p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-200">Guest Services</p>
            <p><button onClick={() => setShowLookupModal(true)} className="hover:text-amber-400">Lookup Booking Status</button></p>
            <p><a href="#rates-info" className="hover:text-amber-400">Hourly & Daily Rates</a></p>
            <p><Link href="/login" className="hover:text-amber-400">Staff & Management Portal</Link></p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-200">Payment Security</p>
            <p>Accepting Visa, Mastercard, Amex, PayPal, GCash, and Front Desk Cash.</p>
            <p className="text-[10px] text-slate-600">© 2026 Crown Jewel Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {selectedClassForBooking && (
        <GuestBookingModal
          isOpen={!!selectedClassForBooking}
          onClose={() => setSelectedClassForBooking(null)}
          classification={selectedClassForBooking}
        />
      )}

      {/* Reservation Lookup Modal */}
      {showLookupModal && (
        <ReservationLookupModal
          isOpen={showLookupModal}
          onClose={() => setShowLookupModal(false)}
        />
      )}
    </div>
  )
}

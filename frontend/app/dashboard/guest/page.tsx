"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import {
  BedDouble,
  Calendar,
  Car,
  CheckSquare,
  Clock,
  Sparkles,
  Star,
  Utensils,
  Wifi,
  FileText,
  Phone,
  ShieldCheck,
  Check,
  Search,
  ExternalLink,
  Key,
  Award,
  HeartHandshake,
  UserCheck,
  ShieldAlert,
  ChevronRight,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getBookings, getTransactions, formatCurrency, DEFAULT_HOTEL_STAFF } from "@/lib/rooms-data"
import { ReceiptModal } from "@/components/payment/ReceiptModal"
import { DigitalKeycardModal } from "@/components/guest/DigitalKeycardModal"
import { GuestEmployeeRatingModal } from "@/components/guest/GuestEmployeeRatingModal"
import { LateArrivalEvidenceModal } from "@/components/booking/LateArrivalEvidenceModal"

export default function GuestDashboard() {
  const { user } = useAuth()
  const { requestRoomCleaning, notifications } = useNotifications()
  const [roomNumber, setRoomNumber] = useState("301")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const [serviceAlert, setServiceAlert] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)
  const [showKeycard, setShowKeycard] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingStaffId, setRatingStaffId] = useState<string | undefined>(undefined)
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)

  const bookings = getBookings()

  // Match guest booking by user email or room number
  const currentBooking = useMemo(() => {
    return (
      bookings.find(
        (b) =>
          (user?.email && b.guestEmail?.toLowerCase() === user.email.toLowerCase()) ||
          (user?.full_name && b.guestName.toLowerCase().includes(user.full_name.toLowerCase()))
      ) ||
      bookings.find((b) => b.roomNumber === roomNumber) ||
      bookings[0]
    )
  }, [bookings, user, roomNumber])

  const transactions = getTransactions()
  const currentTxn = transactions.find((t) => t.bookingId === currentBooking?.id) || transactions[0]

  // Assigned Host who entertains and assists the guest
  const assignedHost = currentBooking?.assignedStaff || DEFAULT_HOTEL_STAFF[0]

  const myRequests = useMemo(
    () =>
      notifications.filter(
        (item) =>
          item.guestId === user?.id ||
          item.roomNumber === roomNumber ||
          item.guestName === (user?.full_name || "Guest")
      ),
    [notifications, roomNumber, user?.full_name, user?.id]
  )

  const stats = [
    {
      title: "Stay Rate Plan",
      value: currentBooking?.rateType === "hourly" ? "Hourly Day-Use" : "Daily Overnight",
      icon: Calendar,
      tone: "bg-blue-100 text-blue-700",
    },
    {
      title: "Assigned Suite",
      value: `Room ${currentBooking?.roomNumber || roomNumber}`,
      icon: BedDouble,
      tone: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Active Requests",
      value: String(myRequests.filter((item) => item.status !== "completed").length),
      icon: Clock,
      tone: "bg-purple-100 text-purple-700",
    },
    {
      title: "Loyalty Points",
      value: "1,250 VIP Pts",
      icon: Star,
      tone: "bg-amber-100 text-amber-700",
    },
  ]

  const handleCleaningRequest = async (event: FormEvent) => {
    event.preventDefault()
    const targetRoom = currentBooking?.roomNumber || roomNumber
    if (!targetRoom.trim()) return
    setSubmitting(true)
    setConfirmation("")
    try {
      await requestRoomCleaning({
        roomNumber: targetRoom.trim(),
        notes: notes || "Guest requested room refresh.",
      })
      setNotes("")
      setConfirmation("Housekeeping has received your request. An attendant is on the way.")
    } finally {
      setSubmitting(false)
    }
  }

  const triggerPresetCleaning = async (presetNote: string) => {
    const targetRoom = currentBooking?.roomNumber || roomNumber
    setSubmitting(true)
    setConfirmation("")
    try {
      await requestRoomCleaning({
        roomNumber: targetRoom.trim(),
        notes: presetNote,
      })
      setConfirmation(`Housekeeping notified: "${presetNote}". Priority dispatch confirmed.`)
    } finally {
      setSubmitting(false)
    }
  }

  const triggerServiceQuickAction = (serviceName: string) => {
    setServiceAlert(`${serviceName} request received! Concierge has been alerted.`)
    setTimeout(() => setServiceAlert(""), 3500)
  }

  const openRatingForStaff = (staffId?: string) => {
    setRatingStaffId(staffId || assignedHost.id)
    setShowRatingModal(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Service Alert Toast */}
        {serviceAlert && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-sm font-semibold flex items-center gap-2 animate-scale-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {serviceAlert}
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">In-House Stay Portal</span>
              <span className="text-xs text-slate-400">• Valued Guest Folio</span>
            </div>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Welcome, {currentBooking?.guestName || user?.full_name || "Valued In-House Guest"}
            </h1>
            <p className="mt-1 text-slate-600 text-sm">
              Your comfort is our sacred duty. Request room cleaning, rate our employees, or access your arrival security guarantees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                const el = document.getElementById("cleaning-section")
                el?.scrollIntoView({ behavior: "smooth" })
              }}
              className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Request Room Cleaning
            </Button>

            <Button
              onClick={() => openRatingForStaff()}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
            >
              <Star className="w-3.5 h-3.5 mr-1.5 fill-slate-950" />
              Rate Hotel Employees
            </Button>

            <Button
              onClick={() => setShowEvidenceModal(true)}
              variant="outline"
              className="rounded-xl border-blue-300 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-xs font-bold"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
              Late Arrival & Evidences Pass
            </Button>

            <Button
              onClick={() => setShowReceipt(true)}
              variant="outline"
              className="rounded-xl border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs font-bold"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              View Paid Receipt
            </Button>
          </div>
        </div>

        {/* Assigned Host / Front Desk Concierge Card */}
        <Card className="border-0 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-amber-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={assignedHost.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                  alt={assignedHost.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/60 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Assigned Front Desk Host</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Active On Duty
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <span>{assignedHost.name}</span>
                  <span className="text-xs text-amber-300 font-sans font-normal">• {assignedHost.role}</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-lg">
                  Assigned by Front Desk to entertain, welcome, and assist you with all amenities throughout your stay.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                onClick={() => openRatingForStaff(assignedHost.id)}
                className="rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-lg"
              >
                <Star className="w-3.5 h-3.5 mr-1.5 fill-slate-950" />
                Rate {assignedHost.name.split(" ")[0]}
              </Button>
              <Button
                onClick={() => triggerServiceQuickAction(`Direct message sent to host ${assignedHost.name}`)}
                variant="outline"
                className="rounded-xl border-amber-400/40 text-amber-300 hover:bg-white/10 text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                Call Concierge ({assignedHost.contact || "Ext 101"})
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 bg-white/90 shadow-lg hover:-translate-y-1 transition-all">
              <CardContent className="p-6">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
                  <stat.icon size={22} />
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900">{stat.value}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Digital Key & Late Arrival Policy Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Guest Room Access</span>
              <h3 className="font-display text-2xl font-bold text-white">Digital Suite Key Card Active</h3>
              <p className="text-xs text-slate-300">
                Suite {currentBooking?.roomNumber || roomNumber} • High-Speed Fiber WiFi:{" "}
                <strong className="text-amber-300 font-mono">CrownJewel_VIP</strong> (Pass: luxury2026)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                RFID Key Active
              </span>
              <Button
                onClick={() => setShowKeycard(true)}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-lg"
              >
                <Key className="w-3.5 h-3.5 mr-1.5" />
                Open NFC Keycard
              </Button>
            </div>
          </Card>

          <Card className="border-0 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">12-Hour Protection</span>
              <h3 className="font-display text-2xl font-bold text-white">Late Arrival Guarantee & Evidences</h3>
              <p className="text-xs text-slate-300">
                Booked 1:00 PM but arriving 7:00 PM? Your reservation is securely held with tamper-proof cryptographic evidence and automatic zero-cost room upgrades.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <span className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                Holding Grace Active
              </span>
              <Button
                onClick={() => setShowEvidenceModal(true)}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                View Arrival Evidences & Voucher
              </Button>
            </div>
          </Card>
        </div>

        {/* Request Housekeeping & Cleaning Panel */}
        <div id="cleaning-section" className="grid grid-cols-1 gap-6 lg:grid-cols-3 scroll-mt-6">
          <Card className="border-0 bg-white/90 shadow-xl lg:col-span-2">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display text-2xl text-slate-900">Request Housekeeping & Room Cleaning</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Exclusive Housekeeping Dispatch: This request alerts only the Housekeeping Department terminals.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Housekeeping Only Alert
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Quick 1-Click Cleaning Presets */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">1-Click Cleaning Requests</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: "Clean Room Now", desc: "Full suite refresh", note: "Guest requested immediate room turnover and cleaning." },
                    { label: "Fresh Linens", desc: "Towels & beddings", note: "Guest requested replacement bed sheets and fresh bath towels." },
                    { label: "Evening Turndown", desc: "Night preparation", note: "Guest requested evening turndown service and amenities replenishment." },
                    { label: "Restock Toiletries", desc: "Soap, water & care", note: "Guest requested replenishing toiletries, slippers, and bottled water." },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      disabled={submitting}
                      onClick={() => triggerPresetCleaning(preset.note)}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition hover:scale-[1.01]"
                    >
                      <p className="text-xs font-bold text-slate-900">{preset.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{preset.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Cleaning Form */}
              <form onSubmit={handleCleaningRequest} className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Suite Number</label>
                    <input
                      value={roomNumber}
                      onChange={(event) => setRoomNumber(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="301"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Notes / Special Instructions</label>
                    <input
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="e.g. Please bring hypoallergenic pillows and mineral water..."
                    />
                  </div>
                </div>

                {confirmation && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-scale-in">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{confirmation}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" variant="luxury" size="lg" loading={submitting} className="h-11 rounded-xl text-xs font-bold">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Dispatch Cleaning to Housekeeping
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openRatingForStaff()}
                    className="h-11 rounded-xl text-xs font-bold border-amber-300 text-amber-900 bg-amber-50/50 hover:bg-amber-100"
                  >
                    <Star className="mr-2 h-4 w-4 fill-amber-500 text-amber-500" />
                    Rate Housekeeping & Hotel Staff
                  </Button>
                </div>
              </form>

              {/* Instant Guest Services Grid */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">On-Demand Hotel Services</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: "In-Room Dining", icon: Utensils },
                    { name: "Housekeeping", icon: CheckSquare },
                    { name: "Valet Service", icon: Car },
                    { name: "Concierge Call", icon: Phone },
                  ].map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => triggerServiceQuickAction(service.name)}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center transition hover:-translate-y-0.5 hover:bg-amber-50/50 hover:border-amber-300"
                    >
                      <service.icon className="mx-auto mb-2 h-5 w-5 text-teal-600" />
                      <p className="text-xs font-bold text-slate-800">{service.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Status & Staff Ratings Panel */}
          <div className="space-y-6">
            {/* Rate Staff Card */}
            <Card className="border-0 bg-gradient-to-br from-amber-500/10 via-white to-amber-50/40 border border-amber-200/80 shadow-xl">
              <CardHeader className="pb-3 border-b border-amber-100">
                <CardTitle className="font-display text-lg text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  Rate Hotel Employees
                </CardTitle>
                <p className="text-xs text-slate-600">Your feedback inspires our 5-star service excellence.</p>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Have our front desk, housekeeping, or concierge staff served you exceptionally today? Leave a rating and a compliment!
                </p>
                <Button
                  onClick={() => openRatingForStaff()}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md"
                >
                  <Star className="w-3.5 h-3.5 mr-1.5 fill-slate-950" />
                  Rate An Employee Now
                </Button>
              </CardContent>
            </Card>

            {/* Request Status Feed */}
            <Card className="border-0 bg-white/90 shadow-xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="font-display text-xl text-slate-900">My Stay Activity</CardTitle>
                <p className="text-xs text-slate-500">Live timeline of dispatched services</p>
              </CardHeader>
              <CardContent className="p-4">
                {myRequests.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                    <Clock className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No active service requests.</p>
                    <p>Tap "Clean Room Now" or submit notes to dispatch housekeeping.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="rounded-xl border border-slate-100 p-3 bg-slate-50/70">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-slate-900 text-xs">{request.title}</p>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                            {request.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{request.message}</p>
                        <p className="mt-1.5 text-[10px] text-slate-400">
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Paid Receipt Modal */}
      {showReceipt && currentTxn && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          transaction={currentTxn}
          booking={currentBooking}
        />
      )}

      {/* Digital Keycard Modal */}
      {showKeycard && (
        <DigitalKeycardModal
          isOpen={showKeycard}
          onClose={() => setShowKeycard(false)}
          roomNumber={currentBooking?.roomNumber || roomNumber}
          guestName={currentBooking?.guestName || user?.full_name || "Valued In-House Guest"}
          referenceCode={currentBooking?.referenceCode || `CJH-GUEST-${roomNumber}`}
          classificationName={currentBooking?.classificationName || "Crown Executive Suite"}
        />
      )}

      {/* Guest Employee Rating Modal */}
      {showRatingModal && (
        <GuestEmployeeRatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          defaultEmployeeId={ratingStaffId}
          roomNumber={currentBooking?.roomNumber || roomNumber}
          onRatingSubmitted={() => {
            setServiceAlert("Thank you! Your employee rating has been recorded and submitted to management.")
            setTimeout(() => setServiceAlert(""), 4000)
          }}
        />
      )}

      {/* Late Arrival Evidence Modal */}
      {showEvidenceModal && (
        <LateArrivalEvidenceModal
          isOpen={showEvidenceModal}
          onClose={() => setShowEvidenceModal(false)}
          initialBookingRef={currentBooking?.referenceCode || "CJH-BK-7PM-LATE"}
        />
      )}
    </DashboardLayout>
  )
}

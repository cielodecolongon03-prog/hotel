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
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getBookings, getTransactions, formatCurrency } from "@/lib/rooms-data"
import { ReceiptModal } from "@/components/payment/ReceiptModal"
import { DigitalKeycardModal } from "@/components/guest/DigitalKeycardModal"

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

  const bookings = getBookings()
  const currentBooking = bookings.find((b) => b.roomNumber === roomNumber) || bookings[0]
  const transactions = getTransactions()
  const currentTxn = transactions.find((t) => t.bookingId === currentBooking?.id) || transactions[0]

  const myRequests = useMemo(
    () =>
      notifications.filter(
        (item) => item.guestId === user?.id || item.roomNumber === roomNumber || item.guestName === (user?.full_name || "Guest")
      ),
    [notifications, roomNumber, user?.full_name, user?.id]
  )

  const stats = [
    { title: "Stay Rate Plan", value: currentBooking?.rateType === "hourly" ? "Hourly Day-Use" : "Daily Overnight", icon: Calendar, tone: "bg-blue-100 text-blue-700" },
    { title: "Assigned Suite", value: `Room ${roomNumber}`, icon: BedDouble, tone: "bg-emerald-100 text-emerald-700" },
    { title: "Active Requests", value: String(myRequests.filter((item) => item.status !== "completed").length), icon: Clock, tone: "bg-purple-100 text-purple-700" },
    { title: "Loyalty Points", value: "850 Pts", icon: Star, tone: "bg-amber-100 text-amber-700" },
  ]

  const handleCleaningRequest = async (event: FormEvent) => {
    event.preventDefault()
    if (!roomNumber.trim()) return
    setSubmitting(true)
    setConfirmation("")
    try {
      await requestRoomCleaning({
        roomNumber: roomNumber.trim(),
        notes: notes || "Guest requested room refresh.",
      })
      setNotes("")
      setConfirmation("Housekeeping has received your request. An attendant is on the way.")
    } finally {
      setSubmitting(false)
    }
  }

  const triggerServiceQuickAction = (serviceName: string) => {
    setServiceAlert(`${serviceName} request received! Concierge has been alerted.`)
    setTimeout(() => setServiceAlert(""), 3500)
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">In-House Stay Portal</span>
              <span className="text-xs text-slate-400">• Direct Guest Access (No Account Required)</span>
            </div>
            <h1 className="mt-1 font-display text-4xl font-bold text-slate-900">
              Welcome to Crown Jewel Hotel
            </h1>
            <p className="mt-1 text-slate-600 text-sm">
              Your comfort is our sacred duty. Request room cleaning, order room dining, or inspect your digital folio folio below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowReceipt(true)}
              variant="outline"
              className="rounded-xl border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs font-bold"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              View Paid Receipt
            </Button>
            <Link href="/">
              <Button className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Browse More Suites
              </Button>
            </Link>
          </div>
        </div>

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

        {/* Digital Key & WiFi Card */}
        <Card className="border-0 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 rounded-3xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Guest Room Access</span>
              <h3 className="font-display text-2xl font-bold text-white">Digital Suite Key Card Active</h3>
              <p className="text-xs text-slate-300">
                Room {roomNumber} • High-Speed Fiber WiFi: <strong className="text-amber-300 font-mono">CrownJewel_VIP</strong> (Pass: luxury2026)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                RFID Key Activated
              </span>
              <Button
                onClick={() => setShowKeycard(true)}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-lg"
              >
                <Key className="w-3.5 h-3.5 mr-1.5" />
                Open NFC Keycard
              </Button>
            </div>
          </div>
        </Card>

        {/* Request Cleaning & Service Panel */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-0 bg-white/90 shadow-xl lg:col-span-2">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="font-display text-2xl text-slate-900">Request Housekeeping & Cleaning</CardTitle>
              <p className="text-xs text-slate-500">Alerts the on-duty floor attendants directly on their terminals.</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleCleaningRequest} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Room Number</label>
                    <input
                      value={roomNumber}
                      onChange={(event) => setRoomNumber(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="301"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Special Housekeeping Notes</label>
                    <input
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="e.g. Extra towels, replace linens, fresh mineral water..."
                    />
                  </div>
                </div>

                {confirmation && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-scale-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    {confirmation}
                  </div>
                )}

                <Button type="submit" variant="luxury" size="lg" loading={submitting} className="h-11 rounded-xl text-xs font-bold">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Notify Housekeeping Now
                </Button>
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

          {/* Request Status Feed */}
          <Card className="border-0 bg-white/90 shadow-xl">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="font-display text-xl text-slate-900">My Stay Activity</CardTitle>
              <p className="text-xs text-slate-500">Live timeline of dispatched services</p>
            </CardHeader>
            <CardContent className="p-4">
              {myRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                  <Clock className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No active service requests.</p>
                  <p>Tap "Notify Housekeeping" to request room service or fresh linens.</p>
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

      {showReceipt && currentTxn && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          transaction={currentTxn}
          booking={currentBooking}
        />
      )}

      {showKeycard && (
        <DigitalKeycardModal
          isOpen={showKeycard}
          onClose={() => setShowKeycard(false)}
          roomNumber={roomNumber}
          guestName={currentBooking?.guestName || user?.full_name || "Valued In-House Guest"}
          referenceCode={currentBooking?.referenceCode || `CJH-GUEST-${roomNumber}`}
          classificationName={currentBooking?.classificationName || "Crown Executive Suite"}
        />
      )}
    </DashboardLayout>
  )
}

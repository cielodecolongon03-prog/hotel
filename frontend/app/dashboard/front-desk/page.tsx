"use client"

import React, { useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNotifications } from "@/components/notifications/NotificationProvider"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckSquare,
  Users,
  Clock,
  ArrowUpRight,
  CreditCard,
  Bell,
  Key,
  DollarSign,
  Calendar,
  Sparkles,
  Plus,
  Sliders,
  Filter,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  FileText,
  X,
  Printer,
  TrendingUp,
  ShieldCheck,
} from "lucide-react"
import { getRooms, getBookings, updateRoomStatus, getClassifications, formatCurrency, getTransactions } from "@/lib/rooms-data"
import { Room, RoomStatus } from "@/types"
import { CheckInModal } from "@/components/booking/CheckInModal"
import { ProcessPaymentModal } from "@/components/payment/ProcessPaymentModal"
import { ManageRatesModal } from "@/components/booking/ManageRatesModal"
import { InteractiveFloorPlan } from "@/components/dashboard/InteractiveFloorPlan"
import { DigitalKeycardModal } from "@/components/guest/DigitalKeycardModal"
import { LateArrivalEvidenceModal } from "@/components/booking/LateArrivalEvidenceModal"

export default function FrontDeskDashboard() {
  const { user } = useAuth()
  const { unreadCount, notifications, requestRoomCleaning, notifyCleaningApproved } = useNotifications()

  // Dynamic store data
  const [rooms, setRooms] = useState<Room[]>(() => getRooms())
  const [bookings, setBookings] = useState(() => getBookings())
  const [roomFilter, setRoomFilter] = useState<"all" | RoomStatus>("all")

  // Modals
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isRatesOpen, setIsRatesOpen] = useState(false)
  const [isNightAuditOpen, setIsNightAuditOpen] = useState(false)
  const [isLateArrivalModalOpen, setIsLateArrivalModalOpen] = useState(false)
  const [keycardBooking, setKeycardBooking] = useState<{ roomNumber: string; guestName: string; referenceCode: string; classificationName?: string } | null>(null)
  const [toastMessage, setToastMessage] = useState("")

  const reloadData = () => {
    setRooms(getRooms())
    setBookings(getBookings())
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const liveCleaning = notifications.filter((item) => item.type === "room_cleaning" && item.status === "unread").length

  const occupiedRooms = useMemo(() => rooms.filter((r) => r.status === "occupied"), [rooms])
  const vacantRooms = useMemo(() => rooms.filter((r) => r.status === "vacant"), [rooms])
  const cleaningRooms = useMemo(() => rooms.filter((r) => r.status === "cleaning"), [rooms])

  const stats = [
    {
      title: "Occupied Rooms",
      value: `${occupiedRooms.length} / ${rooms.length}`,
      change: `${Math.round((occupiedRooms.length / (rooms.length || 1)) * 100)}% Occupancy`,
      trend: "up",
      icon: Key,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Vacant Available",
      value: String(vacantRooms.length),
      change: "Ready for check-in",
      trend: "up",
      icon: CheckSquare,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Active Guests",
      value: String(bookings.filter((b) => b.status === "checked_in").length + occupiedRooms.length),
      change: "In-house guests",
      trend: "up",
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Pending Housekeeping",
      value: String(cleaningRooms.length + unreadCount),
      change: liveCleaning ? `${liveCleaning} urgent alerts` : "Normal schedule",
      trend: "down",
      icon: Bell,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  const filteredRooms = useMemo(() => {
    if (roomFilter === "all") return rooms
    return rooms.filter((r) => r.status === roomFilter)
  }, [rooms, roomFilter])

  const handleCheckoutRoom = (roomNumber: string) => {
    updateRoomStatus(roomNumber, "cleaning")
    reloadData()
    notifyCleaningApproved({
      roomNumber,
      approvedBy: user?.full_name || "Front Desk Staff",
      notes: "Guest checkout turnover approved by Front Desk. Housekeeping attendants may begin sanitation.",
    })
    showToast(`Room ${roomNumber} checked out! Sent approved cleaning turnover notification to Housekeeping only.`)
  }

  const handleMarkClean = (roomNumber: string) => {
    updateRoomStatus(roomNumber, "vacant")
    reloadData()
    notifyCleaningApproved({
      roomNumber,
      approvedBy: user?.full_name || "Front Desk Staff",
      notes: "Room verified and inspected. Turnover approved clean and ready for check-in.",
    })
    showToast(`Room ${roomNumber} marked vacant & ready! Notification sent to Housekeeping only.`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-sm font-semibold flex items-center gap-2 animate-scale-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {toastMessage}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Guest Services</span>
              <span className="text-xs text-slate-400">• Front Desk Operations</span>
            </div>
            <h1 className="mt-1 font-display text-4xl font-bold text-slate-900">Front Desk Command Center</h1>
            <p className="text-slate-600 text-sm mt-1">
              Welcome back, {user?.full_name || "Front Desk Staff"}! Manage walk-ins, daily/hourly rates, folios, and real payments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setIsNightAuditOpen(true)}
              variant="outline"
              className="rounded-xl border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 text-xs font-bold"
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-indigo-700" />
              Night Audit (₱)
            </Button>
            <Button
              onClick={() => setIsRatesOpen(true)}
              variant="outline"
              className="rounded-xl border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs font-bold"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Room Rates (Hourly & Daily)
            </Button>
            <Button
              onClick={() => setIsPaymentOpen(true)}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Process Payment
            </Button>
            <Button
              onClick={() => setIsLateArrivalModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-md"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Late Arrival & Evidences
            </Button>
            <Button
              onClick={() => setIsCheckInOpen(true)}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Check-in Guest
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold font-display text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Floorplan Blueprint Widget */}
        <InteractiveFloorPlan
          onSelectRoomForCheckIn={() => setIsCheckInOpen(true)}
          onRefresh={reloadData}
        />

        {/* Live Interactive Room Inventory Status with Filter Tabs */}
        <Card className="border-0 shadow-xl bg-white/90">
          <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div>
              <CardTitle className="font-display text-2xl text-slate-900">Room Status & Folios</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time room occupancy, guest assignments, daily/hourly rate indicators, and quick checkout controls.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(["all", "occupied", "vacant", "cleaning", "maintenance"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRoomFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    roomFilter === st ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st} ({st === "all" ? rooms.length : rooms.filter((r) => r.status === st).length})
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRooms.map((room) => {
                const isOccupied = room.status === "occupied"
                const isVacant = room.status === "vacant"
                const isCleaning = room.status === "cleaning"
                const isMaint = room.status === "maintenance"

                return (
                  <div
                    key={room.id}
                    className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
                      isOccupied
                        ? "bg-blue-50/40 border-blue-200"
                        : isVacant
                        ? "bg-emerald-50/40 border-emerald-200"
                        : isCleaning
                        ? "bg-amber-50/40 border-amber-200"
                        : "bg-rose-50/40 border-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isOccupied
                              ? "bg-blue-600 text-white"
                              : isVacant
                              ? "bg-emerald-600 text-white"
                              : isCleaning
                              ? "bg-amber-500 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {room.roomNumber}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Room {room.roomNumber}</h4>
                          <p className="text-[11px] text-slate-500 truncate max-w-[170px]">{room.classificationName}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isOccupied
                            ? "bg-blue-100 text-blue-800"
                            : isVacant
                            ? "bg-emerald-100 text-emerald-800"
                            : isCleaning
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>

                    {/* Guest Information if occupied */}
                    {isOccupied && room.currentGuest && (
                      <div className="p-3 rounded-xl bg-white/80 border border-blue-100 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-900">{room.currentGuest.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-900">
                            {room.currentGuest.rateType} Stay
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Check-out: {room.currentGuest.expectedCheckOut}
                        </p>
                        <p className="text-[11px] text-blue-700 font-semibold flex items-center gap-1 pt-0.5">
                          <Users className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span>Host: {room.currentGuest.assignedStaff?.name || "Front Desk Attendant"}</span>
                        </p>
                      </div>
                    )}

                    {isVacant && (
                      <div className="p-3 rounded-xl bg-white/80 border border-emerald-100 text-xs text-slate-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Inspected & Cleaned. Ready for immediate assignment.</span>
                      </div>
                    )}

                    {isCleaning && (
                      <div className="p-3 rounded-xl bg-white/80 border border-amber-100 text-xs text-slate-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                        <span>Housekeeping turnover in progress.</span>
                      </div>
                    )}

                    {/* Action buttons on card */}
                    <div className="pt-1 flex items-center gap-2">
                      {isOccupied && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsPaymentOpen(true)}
                            className="flex-1 text-xs h-8 border-slate-300"
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            Folio Pay
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const b = bookings.find((bk) => bk.roomNumber === room.roomNumber)
                              setKeycardBooking({
                                roomNumber: room.roomNumber,
                                guestName: room.currentGuest?.name || b?.guestName || "Valued In-House Guest",
                                referenceCode: b?.referenceCode || `CJH-${room.roomNumber}-${Date.now().toString().slice(-4)}`,
                                classificationName: room.classificationName,
                              })
                            }}
                            className="text-xs h-8 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold"
                            title="Issue or preview guest NFC keycard"
                          >
                            <Key className="w-3 h-3 mr-1 text-amber-600" />
                            Keycard
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleCheckoutRoom(room.roomNumber)}
                            className="flex-1 text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                          >
                            Check-Out
                          </Button>
                        </>
                      )}

                      {isVacant && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setIsCheckInOpen(true)
                          }}
                          className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Assign & Check-In
                        </Button>
                      )}

                      {isCleaning && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkClean(room.roomNumber)}
                          className="w-full text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approve Cleaning
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Activity Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-900 to-indigo-950 text-white lg:col-span-2">
            <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-blue-200">
                  Quick Actions Terminal
                </span>
                <h3 className="font-display text-2xl font-bold">Front Desk Guest Services</h3>
                <p className="text-xs text-blue-200 max-w-md">
                  Execute immediate walk-in reservations, collect payment on credit terminal, or modify hourly & daily
                  classification rate tariffs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => setIsCheckInOpen(true)}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl h-11 px-6 shadow-lg"
                >
                  <Key className="w-4 h-4 mr-2 text-blue-700" />
                  New Check-In
                </Button>
                <Button
                  onClick={() => setIsPaymentOpen(true)}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-bold rounded-xl h-11 px-6"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Collect Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Staff Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <button
                onClick={() => setIsRatesOpen(true)}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-amber-50 text-left transition flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800">Tariff Manager</p>
                  <p className="text-[11px] text-slate-500">Edit per day & per hour rates</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
              </button>

              <button
                onClick={() => {
                  requestRoomCleaning({
                    roomNumber: "All Floors",
                    notes: "Front Desk bulk housekeeping inspection alert.",
                  })
                  showToast("Housekeeping team alerted!")
                }}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-teal-50 text-left transition flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-teal-800">Call Housekeeping</p>
                  <p className="text-[11px] text-slate-500">Send instant priority dispatch</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {isCheckInOpen && (
        <CheckInModal
          isOpen={isCheckInOpen}
          onClose={() => setIsCheckInOpen(false)}
          onCheckInCompleted={reloadData}
        />
      )}

      {isPaymentOpen && (
        <ProcessPaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentCompleted={reloadData}
        />
      )}

      {isRatesOpen && (
        <ManageRatesModal
          isOpen={isRatesOpen}
          onClose={() => setIsRatesOpen(false)}
          onRatesUpdated={reloadData}
        />
      )}

      {/* Digital Keycard Modal */}
      {keycardBooking && (
        <DigitalKeycardModal
          isOpen={!!keycardBooking}
          onClose={() => setKeycardBooking(null)}
          roomNumber={keycardBooking.roomNumber}
          guestName={keycardBooking.guestName}
          referenceCode={keycardBooking.referenceCode}
          classificationName={keycardBooking.classificationName}
        />
      )}

      {/* Night Audit Modal */}
      {isNightAuditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Crown Jewel Night Audit</h3>
                  <p className="text-xs text-slate-300">Daily Revenue Settlement & BIR Reconciliation (₱)</p>
                </div>
              </div>
              <button
                onClick={() => setIsNightAuditOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {(() => {
                const txns = getTransactions()
                const totalGross = txns.reduce((sum, t) => sum + (t.status === "completed" ? t.amount : 0), 0)
                const totalVat = txns.reduce((sum, t) => sum + (t.breakdown?.taxes || 0), 0)
                const totalService = txns.reduce((sum, t) => sum + (t.breakdown?.serviceFee || 0), 0)
                const netRoomTariff = totalGross - totalVat - totalService
                const occupancyPct = Math.round((occupiedRooms.length / (rooms.length || 1)) * 100)
                const adr = occupiedRooms.length > 0 ? Math.round(totalGross / occupiedRooms.length) : 0

                return (
                  <>
                    {/* Summary KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                        <span className="text-[10px] uppercase font-bold text-amber-800">Total Settled</span>
                        <p className="text-lg font-bold text-amber-950 mt-0.5">{formatCurrency(totalGross)}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                        <span className="text-[10px] uppercase font-bold text-blue-800">12% BIR VAT</span>
                        <p className="text-lg font-bold text-blue-950 mt-0.5">{formatCurrency(totalVat)}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
                        <span className="text-[10px] uppercase font-bold text-teal-800">10% Service Charge</span>
                        <p className="text-lg font-bold text-teal-950 mt-0.5">{formatCurrency(totalService)}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                        <span className="text-[10px] uppercase font-bold text-purple-800">Occupancy & ADR</span>
                        <p className="text-lg font-bold text-purple-950 mt-0.5">{occupancyPct}% ({formatCurrency(adr)})</p>
                      </div>
                    </div>

                    {/* Breakdown Ledger Table */}
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Folio Collections Breakdown
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{txns.length} Recorded Transactions</span>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                        {txns.map((t) => (
                          <div key={t.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                            <div>
                              <p className="font-bold text-slate-900">{t.guestName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {t.receiptNumber} • {t.paymentMethod.toUpperCase()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-700">{formatCurrency(t.amount)}</p>
                              <span className="text-[10px] text-slate-400">
                                {new Date(t.transactionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BIR Compliance Banner */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        Reconciled with Philippine Bureau of Internal Revenue (BIR) 12% Value-Added Tax regulations and 10% Hotel Service Charge. All folios recorded with unique POS authorization code.
                      </p>
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="rounded-xl border-slate-300 text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                Print Night Audit Report
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    showToast("Night Audit completed! All daily folios closed.")
                    setIsNightAuditOpen(false)
                  }}
                  className="rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold px-5"
                >
                  Close & Post Ledger
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLateArrivalModalOpen && (
        <LateArrivalEvidenceModal
          isOpen={isLateArrivalModalOpen}
          onClose={() => setIsLateArrivalModalOpen(false)}
          onReassigned={() => {
            reloadData()
            showToast("Late arrival room reallocation confirmed & assigned host updated!")
          }}
        />
      )}
    </DashboardLayout>
  )
}

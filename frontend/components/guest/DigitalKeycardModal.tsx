"use client"

import React, { useState } from "react"
import { Booking } from "@/types"
import { Key, Wifi, ShieldCheck, Check, Sparkles, X, Smartphone, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DigitalKeycardModalProps {
  isOpen: boolean
  onClose: () => void
  booking?: Booking | { roomNumber: string; guestName: string; referenceCode: string; classificationName?: string }
  roomNumber?: string
  guestName?: string
  referenceCode?: string
  classificationName?: string
}

export function DigitalKeycardModal({
  isOpen,
  onClose,
  booking: propBooking,
  roomNumber: propRoom,
  guestName: propGuest,
  referenceCode: propRef,
  classificationName: propClass,
}: DigitalKeycardModalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [viewMode, setViewMode] = useState<"nfc" | "qr">("nfc")

  if (!isOpen) return null

  const booking = {
    roomNumber: propBooking?.roomNumber || propRoom || "301",
    guestName: propBooking?.guestName || propGuest || "Valued In-House Guest",
    referenceCode: propBooking?.referenceCode || propRef || "CJH-PASS",
    classificationName: propBooking?.classificationName || propClass || "Executive Suite",
  }

  const handleSimulateTap = () => {
    setUnlocking(true)
    setTimeout(() => {
      setUnlocking(false)
      setIsUnlocked(true)
      setTimeout(() => setIsUnlocked(false), 4000)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-400/40 my-6 text-white">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">Crown Jewel Digital Key</h3>
              <p className="text-xs text-amber-200/80">Encrypted RFID / Contactless Pass</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950 border border-white/10">
            <button
              onClick={() => setViewMode("nfc")}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === "nfc" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              NFC Door Key
            </button>
            <button
              onClick={() => setViewMode("qr")}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                viewMode === "qr" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <QrCode className="w-4 h-4" />
              Lobby QR Pass
            </button>
          </div>

          {/* NFC Virtual Keycard View */}
          {viewMode === "nfc" && (
            <div className="space-y-5">
              {/* Luxury Obsidian & Gold Card */}
              <div
                className={`relative h-64 rounded-3xl p-6 text-white shadow-2xl border transition-all duration-500 flex flex-col justify-between overflow-hidden ${
                  isUnlocked
                    ? "bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-900 border-emerald-400 shadow-emerald-900/50"
                    : "bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950 border-amber-400/50 shadow-amber-900/30"
                }`}
              >
                {/* Decorative gold shimmer glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl" />

                {/* Card Top Row */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-400 block font-bold">
                      CROWN JEWEL LUXURY RESIDENCES
                    </span>
                    <span className="text-xs text-slate-400">{booking.classificationName || "Executive Suite"}</span>
                  </div>

                  {/* RFID Waves Icon */}
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                    <Wifi className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                {/* Big Room Number Badge */}
                <div className="my-auto text-center">
                  <p className="text-[11px] uppercase tracking-widest text-slate-400">Suite Keycard</p>
                  <p className="font-display text-5xl font-black tracking-tight text-white mt-1">
                    ROOM {booking.roomNumber}
                  </p>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400 mt-2 animate-bounce">
                      <Check className="w-3.5 h-3.5" /> Door Latch Unlocked!
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 mt-2 block font-mono">
                      Ref: {booking.referenceCode}
                    </span>
                  )}
                </div>

                {/* Card Bottom Row */}
                <div className="flex justify-between items-end text-xs pt-3 border-t border-white/10">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 block">Registered Guest</span>
                    <span className="font-bold text-white uppercase">{booking.guestName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 block">Status</span>
                    <span className="font-mono text-emerald-400 font-bold">ACTIVE & ENCRYPTED</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="button"
                onClick={handleSimulateTap}
                disabled={unlocking}
                className="w-full h-13 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-xl shadow-amber-900/30 transition-all"
              >
                {unlocking ? (
                  "Transmitting 13.56MHz NFC Key Signal..."
                ) : isUnlocked ? (
                  "Door Unlocked! (Auto-locks in 4s)"
                ) : (
                  "📱 Tap Keycard to Suite Door Lock"
                )}
              </Button>
            </div>
          )}

          {/* QR Pass View for lobby kiosk */}
          {viewMode === "qr" && (
            <div className="p-6 rounded-3xl bg-white text-slate-900 text-center space-y-4 shadow-xl">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Contactless Express Lobby Kiosk Check-In
              </p>

              {/* Visual simulated QR code */}
              <div className="w-48 h-48 mx-auto bg-slate-950 p-3 rounded-2xl flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-xl p-2 grid grid-cols-6 grid-rows-6 gap-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                          ? "bg-slate-950"
                          : i % 5 === 0
                          ? "bg-amber-600"
                          : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono font-bold text-base text-slate-900">{booking.referenceCode}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Room {booking.roomNumber} • {booking.guestName}
                </p>
              </div>

              <p className="text-[11px] text-slate-400">
                Scan this dynamic QR code at the hotel elevator lobby or front desk kiosk to retrieve physical keycards.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Cryptographic Key Architecture • Crown Jewel OS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

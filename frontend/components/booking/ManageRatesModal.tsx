"use client"

import React, { useState } from "react"
import { RoomClassification } from "@/types"
import { getClassifications, updateClassificationRates, formatCurrency } from "@/lib/rooms-data"
import { Crown, DollarSign, Clock, Calendar, Check, X, Sparkles, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModalPortal } from "@/components/ui/ModalPortal"

interface ManageRatesModalProps {
  isOpen: boolean
  onClose: () => void
  onRatesUpdated?: () => void
}

export function ManageRatesModal({ isOpen, onClose, onRatesUpdated }: ManageRatesModalProps) {
  const [classifications, setClassifications] = useState<RoomClassification[]>(() => getClassifications())
  const [ratesState, setRatesState] = useState<Record<string, { daily: number; hourly: number }>>(() => {
    const map: Record<string, { daily: number; hourly: number }> = {}
    getClassifications().forEach((c) => {
      map[c.id] = { daily: c.dailyRate, hourly: c.hourlyRate }
    })
    return map
  })
  const [savedSuccess, setSavedSuccess] = useState(false)

  if (!isOpen) return null

  const handleRateChange = (id: string, field: "daily" | "hourly", value: number) => {
    setRatesState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: Math.max(0, value),
      },
    }))
  }

  const handleSave = () => {
    Object.entries(ratesState).forEach(([id, rates]) => {
      updateClassificationRates(id, rates.daily, rates.hourly)
    })
    setClassifications(getClassifications())
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      if (onRatesUpdated) onRatesUpdated()
      onClose()
    }, 1000)
  }

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight">Room Rate Tariff Management</h2>
              <p className="text-xs text-amber-200/80">Configure Daily & Hourly Rates Per Room Classification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold text-sm flex items-center gap-2 animate-scale-in">
              <Check className="w-5 h-5 text-emerald-700" />
              Room rates updated successfully across the entire booking engine!
            </div>
          )}

          <p className="text-xs text-slate-500">
            Rates dynamically govern all guest reservations, front-desk walk-in check-ins, and invoices. Both Daily
            (overnight) and Hourly (day use short-stays) can be customized independently.
          </p>

          <div className="space-y-4">
            {classifications.map((roomClass) => {
              const rates = ratesState[roomClass.id] || { daily: roomClass.dailyRate, hourly: roomClass.hourlyRate }
              return (
                <div
                  key={roomClass.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-display text-base">{roomClass.name}</span>
                        {roomClass.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            {roomClass.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Capacity: {roomClass.capacity} Guests • {roomClass.bedType} • Min Hourly Stay: {roomClass.minHours} hrs
                      </p>
                    </div>
                    <div className="text-xs font-mono text-slate-400">Code: {roomClass.code}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Daily Rate Input */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        Daily Rate (Per 24h / Night)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-amber-700">₱</span>
                        <input
                          type="number"
                          min="1"
                          value={rates.daily}
                          onChange={(e) => handleRateChange(roomClass.id, "daily", Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        />
                      </div>
                    </div>

                    {/* Hourly Rate Input */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <Clock className="w-4 h-4 text-teal-600" />
                        Hourly Rate (Per Hour - Min {roomClass.minHours}h)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-teal-700">₱</span>
                        <input
                          type="number"
                          min="1"
                          value={rates.hourly}
                          onChange={(e) => handleRateChange(roomClass.id, "hourly", Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold shadow-md shadow-amber-900/20"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Publish Rates
          </Button>
        </div>
        </div>
      </div>
    </ModalPortal>
  )
}

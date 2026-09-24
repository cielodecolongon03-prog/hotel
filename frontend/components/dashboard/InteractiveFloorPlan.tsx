"use client"

import React, { useState } from "react"
import { Room, RoomStatus } from "@/types"
import { getRooms, updateRoomStatus, formatCurrency } from "@/lib/rooms-data"
import { Sparkles, BedDouble, Key, Sparkle, User, Phone, Check, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InteractiveFloorPlanProps {
  onSelectRoomForCheckIn?: (roomNumber: string) => void
  onRefresh?: () => void
}

export function InteractiveFloorPlan({ onSelectRoomForCheckIn, onRefresh }: InteractiveFloorPlanProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(1)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [actionNotice, setActionNotice] = useState("")

  const rooms = getRooms()
  const floorRooms = rooms.filter((r) => r.floor === selectedFloor)

  const showNotice = (msg: string) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(""), 3000)
  }

  const handleCheckoutRoom = (roomNumber: string) => {
    updateRoomStatus(roomNumber, "cleaning", undefined)
    showNotice(`Room ${roomNumber} checked out! Status set to Housekeeping Cleaning.`)
    setSelectedRoom(null)
    if (onRefresh) onRefresh()
  }

  const handleMarkCleaned = (roomNumber: string) => {
    updateRoomStatus(roomNumber, "vacant", undefined)
    showNotice(`Room ${roomNumber} inspected and cleared! Now Vacant & Clean.`)
    setSelectedRoom(null)
    if (onRefresh) onRefresh()
  }

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "vacant":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/25 ring-emerald-500/30"
      case "occupied":
        return "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-500/25 ring-amber-500/30"
      case "cleaning":
        return "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/25 ring-cyan-500/30"
      case "maintenance":
        return "bg-rose-500/15 border-rose-500/40 text-rose-300 hover:border-rose-400 hover:bg-rose-500/25 ring-rose-500/30"
      default:
        return "bg-slate-800 border-slate-700 text-slate-300"
    }
  }

  const getStatusDot = (status: RoomStatus) => {
    switch (status) {
      case "vacant":
        return "bg-emerald-400 shadow-emerald-500/50"
      case "occupied":
        return "bg-amber-400 shadow-amber-500/50"
      case "cleaning":
        return "bg-cyan-400 shadow-cyan-500/50"
      case "maintenance":
        return "bg-rose-400 shadow-rose-500/50"
      default:
        return "bg-slate-400 shadow-slate-500/50"
    }
  }

  return (
    <div className="rounded-3xl bg-slate-950/90 border border-amber-500/30 p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-400/30">
              Live Architectural Blueprint
            </span>
            <span className="text-xs text-slate-400">• Philippine Standard Time Active</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-white mt-1">Interactive Hotel Floorplan Map</h3>
          <p className="text-xs text-slate-400">Click any suite on the 2D blueprint to inspect or dispatch actions</p>
        </div>

        {/* Floor Level Tabs */}
        <div className="inline-flex rounded-2xl bg-slate-900/90 p-1.5 border border-white/10">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedFloor(lvl)
                setSelectedRoom(null)
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFloor === lvl
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Level {lvl}
            </button>
          ))}
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-scale-in">
          <Check className="w-4 h-4 text-emerald-400" />
          {actionNotice}
        </div>
      )}

      {/* Floorplan 2D Architectural Layout */}
      <div className="relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6 min-h-[220px]">
        {/* Floor corridor indicator */}
        <div className="text-center text-[10px] uppercase font-mono tracking-[0.3em] text-slate-500 mb-4 border-b border-white/5 pb-2">
          — LEVEL {selectedFloor} SKYLINE WING CORRIDOR —
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {floorRooms.map((room) => {
            const isSelected = selectedRoom?.id === room.id
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedRoom(room)}
                className={`relative p-4 rounded-2xl border transition-all text-left group ${getStatusColor(
                  room.status
                )} ${isSelected ? "ring-2 ring-amber-400 scale-[1.03] shadow-lg shadow-amber-950/50" : ""}`}
              >
                {/* Live Status Pulsing Dot */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-lg text-white">Room {room.roomNumber}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shadow-sm animate-pulse ${getStatusDot(room.status)}`}
                    />
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-90">
                      {room.status}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 truncate font-medium">{room.classificationName}</p>

                {room.currentGuest && (
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="truncate text-amber-200/90 font-medium">
                      👤 {room.currentGuest.name.split(" ")[0]}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {room.currentGuest.rateType.toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail Inspector Drawer for Selected Room */}
      {selectedRoom && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 border border-amber-400/30 animate-fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
                {selectedRoom.roomNumber}
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-white">{selectedRoom.classificationName}</h4>
                <p className="text-xs text-slate-400">Floor {selectedRoom.floor} • Current Status: <strong className="capitalize text-amber-300">{selectedRoom.status}</strong></p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedRoom.status === "vacant" && onSelectRoomForCheckIn && (
                <Button
                  onClick={() => onSelectRoomForCheckIn(selectedRoom.roomNumber)}
                  className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 text-white font-bold text-xs shadow-md"
                >
                  <Key className="w-3.5 h-3.5 mr-1.5" />
                  Express Walk-In Check-In
                </Button>
              )}

              {selectedRoom.status === "occupied" && (
                <Button
                  onClick={() => handleCheckoutRoom(selectedRoom.roomNumber)}
                  className="rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 text-white font-bold text-xs shadow-md"
                >
                  Express Checkout Room
                </Button>
              )}

              {selectedRoom.status === "cleaning" && (
                <Button
                  onClick={() => handleMarkCleaned(selectedRoom.roomNumber)}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Mark Clean & Ready
                </Button>
              )}
            </div>
          </div>

          {selectedRoom.currentGuest && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-white/5">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Registered Guest</span>
                <span className="font-bold text-white">{selectedRoom.currentGuest.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Contact Phone</span>
                <span className="font-mono text-slate-300">{selectedRoom.currentGuest.phone || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Check-In Time</span>
                <span className="font-mono text-slate-300">{selectedRoom.currentGuest.checkIn}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Expected Check-Out</span>
                <span className="font-mono text-amber-300 font-bold">{selectedRoom.currentGuest.expectedCheckOut}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
            <span>Vacant / Clean</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
            <span>Housekeeping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm" />
            <span>Maintenance</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-amber-400">Total Rooms: {rooms.length} • Crown Jewel OS</span>
      </div>
    </div>
  )
}

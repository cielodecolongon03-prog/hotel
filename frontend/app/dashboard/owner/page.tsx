"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  Users,
  Star,
  Clock,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Building,
  Target,
  Award,
  Sliders,
  Check,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react"
import { ManageRatesModal } from "@/components/booking/ManageRatesModal"
import { formatCurrency } from "@/lib/rooms-data"

export default function OwnerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [isRatesOpen, setIsRatesOpen] = useState(false)
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false)
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const [goals, setGoals] = useState({
    monthlyRevenueTarget: "₱14,000,000",
    targetOccupancy: "92%",
    targetRevPAR: "₱14,500",
  })

  const showToast = (m: string) => {
    setToastMsg(m)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGoalsModalOpen(false)
    showToast("Executive business targets updated!")
  }

  const stats = [
    {
      title: "Total Gross Revenue (YTD)",
      value: "₱82.8M",
      change: "+18.4% YoY",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Portfolio Occupancy Rate",
      value: "89.2%",
      change: "+6.8% vs industry avg",
      trend: "up",
      icon: Building,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Guest Excellence Rating",
      value: "4.92 ★",
      change: "Five-Star Forbes standard",
      trend: "up",
      icon: Star,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Net Operating Margin",
      value: "38.5%",
      change: "+3.2% EBITDA gain",
      trend: "up",
      icon: TrendingUp,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ]

  const businessMetrics = [
    { metric: "Total Suites & Villas", value: "150", status: "100% Operational" },
    { metric: "Staff Headcount", value: "42", status: "Fully Rostered" },
    { metric: "Average Daily Rate (ADR)", value: "₱16,200", status: "Up +12%" },
    { metric: "RevPAR", value: "₱14,450", status: "Up +15%" },
  ]

  const recentAchievements = [
    { title: "2026 World Luxury Hotel Award", date: "September 2026", category: "Global Honors" },
    { title: "98.7% Cleanliness Index", date: "Quarterly Audit", category: "Hospitality Standard" },
    { title: "Q3 Revenue Target Exceeded", date: "Financials", category: "Fiscal Growth" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-sm font-semibold flex items-center gap-2 animate-scale-in">
            <Check className="w-4 h-4 text-emerald-400" />
            {toastMsg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Hotel Ownership & Board</p>
            <h1 className="mt-1 font-display text-4xl font-bold text-slate-900">Proprietor Executive Suite</h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Welcome, {user?.full_name || "Owner"}. Strategic property valuation, asset yield, and fiscal growth overview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setIsRatesOpen(true)}
              variant="outline"
              className="rounded-xl border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Room Rate Tariffs
            </Button>
            <Button
              onClick={() => setIsGoalsModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md"
            >
              <Target className="w-3.5 h-3.5 mr-1.5" />
              Set Fiscal Targets
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
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight size={14} className="mr-0.5" /> {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold font-display text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Metrics & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="font-display text-2xl text-slate-900">Key Yield & Performance Ratios</CardTitle>
                  <p className="text-xs text-slate-500">Asset efficiency & daily yield metrics</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFinancialModalOpen(true)}
                  className="text-xs rounded-xl"
                >
                  <BarChart3 className="w-3.5 h-3.5 mr-1" />
                  View P&L Folio
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {businessMetrics.map((metric) => (
                    <div key={metric.metric} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <p className="text-xs text-slate-500 font-medium mb-1">{metric.metric}</p>
                      <p className="text-2xl font-bold font-display text-slate-900">{metric.value}</p>
                      <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
                        {metric.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="font-display text-xl text-slate-900">Industry Accolades</CardTitle>
                <p className="text-xs text-slate-500">Prestige & certifications</p>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {recentAchievements.map((item) => (
                  <div key={item.title} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.date}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Executive Action Banner */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/20">
                Boardroom Strategy
              </span>
              <h3 className="font-display text-2xl font-bold">Executive Strategic Governance</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Access audited quarterly revenue statements, review room classification margins, or adjust financial performance benchmarks.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setIsFinancialModalOpen(true)}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl h-11 px-5"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 text-purple-700" />
                Financial Audit
              </Button>
              <Button
                onClick={() => setIsGoalsModalOpen(true)}
                className="border-2 border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl h-11 px-5 backdrop-blur-sm transition-all"
              >
                <Target className="w-4 h-4 mr-2 text-white" />
                Set Targets
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Set Goals Modal */}
      <Modal isOpen={isGoalsModalOpen} onClose={() => setIsGoalsModalOpen(false)} title="Configure Executive Business Targets">
        <form onSubmit={handleSaveGoals} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Monthly Gross Target</label>
            <input
              type="text"
              value={goals.monthlyRevenueTarget}
              onChange={(e) => setGoals({ ...goals, monthlyRevenueTarget: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Occupancy Benchmark</label>
            <input
              type="text"
              value={goals.targetOccupancy}
              onChange={(e) => setGoals({ ...goals, targetOccupancy: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target RevPAR</label>
            <input
              type="text"
              value={goals.targetRevPAR}
              onChange={(e) => setGoals({ ...goals, targetRevPAR: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
              required
            />
          </div>
          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsGoalsModalOpen(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-purple-600 text-white font-bold">
              Save Targets
            </Button>
          </div>
        </form>
      </Modal>

      {/* Financial Audit Modal */}
      <Modal isOpen={isFinancialModalOpen} onClose={() => setIsFinancialModalOpen(false)} title="Crown Jewel Financial Summary">
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Gross Room Revenue (YTD):</span>
              <strong className="text-slate-900">₱82,940,000.00</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Food & Beverage Services:</span>
              <strong className="text-slate-900">₱17,830,000.00</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Spa & Wellness Facility:</span>
              <strong className="text-slate-900">₱7,980,000.00</strong>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-sm">
              <span className="text-slate-800">Net Operating Surplus:</span>
              <span className="text-emerald-700">₱41,890,000.00 (50.5%)</span>
            </div>
          </div>
          <Button onClick={() => setIsFinancialModalOpen(false)} className="w-full rounded-xl bg-slate-900 text-white font-bold">
            Close Summary
          </Button>
        </div>
      </Modal>

      {isRatesOpen && (
        <ManageRatesModal isOpen={isRatesOpen} onClose={() => setIsRatesOpen(false)} />
      )}
    </DashboardLayout>
  )
}

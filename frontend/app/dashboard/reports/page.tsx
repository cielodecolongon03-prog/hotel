"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  CheckSquare,
  FileText,
  Sparkles,
  Check,
  Printer,
} from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()
  const [reports] = useState([
    { id: 1, name: "Monthly Performance & Yield Report", type: "Performance", date: "2026-09-24", status: "Ready" },
    { id: 2, name: "Q3 Comprehensive Financial Statement", type: "Financial", date: "2026-09-20", status: "Ready" },
    { id: 3, name: "Staff Productivity & Ratings Audit", type: "HR", date: "2026-09-18", status: "Ready" },
    { id: 4, name: "Guest Satisfaction & Quality Index", type: "Guest", date: "2026-09-15", status: "Ready" },
    { id: 5, name: "Housekeeping Turnover & Turnaround Folio", type: "Operations", date: "2026-09-10", status: "Ready" },
  ])
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isHRModalOpen, setIsHRModalOpen] = useState(false)
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false)
  const [isOperationalModalOpen, setIsOperationalModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reportSettings, setReportSettings] = useState({ type: "Financial", dateRange: "This Month", format: "PDF" })
  const [toastMsg, setToastMsg] = useState("")

  const showToast = (m: string) => {
    setToastMsg(m)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Performance": return "bg-blue-100 text-blue-700 border-blue-200"
      case "Financial": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "HR": return "bg-purple-100 text-purple-700 border-purple-200"
      case "Guest": return "bg-amber-100 text-amber-700 border-amber-200"
      case "Operations": return "bg-rose-100 text-rose-700 border-rose-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const handleGenerateReport = async (reportType: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    const dataStr = JSON.stringify(
      {
        hotel: "Crown Jewel Hotel & Luxury Residences",
        reportType,
        dateRange: reportSettings.dateRange,
        format: reportSettings.format,
        generatedBy: user?.full_name || "Manager",
        generatedAt: new Date().toISOString(),
        metrics: {
          adr: "$285.00",
          revPAR: "$254.00",
          occupancy: "89.2%",
          grossRevenueYTD: "$1,482,900.00",
        },
      },
      null,
      2
    )
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${reportType.toLowerCase().replace(/\s+/g, "-")}-report.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsLoading(false)
    setIsGenerateModalOpen(false)
    setIsHRModalOpen(false)
    setIsFinancialModalOpen(false)
    setIsOperationalModalOpen(false)
    showToast(`Generated and exported ${reportType} report!`)
  }

  const handleDownloadReport = async (reportName: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

    const dataStr = JSON.stringify(
      {
        reportName,
        hotel: "Crown Jewel Hotel",
        downloadedAt: new Date().toISOString(),
        status: "Official Record Certified",
      },
      null,
      2
    )
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${reportName.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsLoading(false)
    showToast(`Downloaded ${reportName}!`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 text-sm font-semibold flex items-center gap-2 animate-scale-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {toastMsg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Business Intelligence</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mt-1">Analytics & Fiscal Reports</h1>
            <p className="text-slate-600 text-sm mt-0.5">Generate operational folios, HR productivity, and financial statements.</p>
          </div>
          <Button
            onClick={() => setIsGenerateModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 shadow-md"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Revenue (MTD)</p>
                <p className="text-3xl font-bold font-display mt-1">$248K</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Occupancy Rate</p>
                <p className="text-3xl font-bold font-display mt-1">89.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Tasks Executed</p>
                <p className="text-3xl font-bold font-display mt-1">214</p>
              </div>
              <CheckSquare className="w-8 h-8 text-purple-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">Guest Score</p>
                <p className="text-3xl font-bold font-display mt-1">4.9 ★</p>
              </div>
              <BarChart3 className="w-8 h-8 text-amber-200" />
            </CardContent>
          </Card>
        </div>

        {/* Report Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Financial Statements</h3>
                  <p className="text-xs text-slate-500">RevPAR, ADR, Daily/Hourly breakdown</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl text-xs font-bold"
                onClick={() => setIsFinancialModalOpen(true)}
              >
                Generate Financials
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">HR & Staff Productivity</h3>
                  <p className="text-xs text-slate-500">Service ratings and attendance logs</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl text-xs font-bold"
                onClick={() => setIsHRModalOpen(true)}
              >
                Generate HR Audit
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Operational Efficiency</h3>
                  <p className="text-xs text-slate-500">Housekeeping & room turnovers</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl text-xs font-bold"
                onClick={() => setIsOperationalModalOpen(true)}
              >
                Generate Operations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ready Reports List */}
        <Card className="border-0 shadow-xl bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="font-display text-2xl text-slate-900">Certified Published Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {reports.map((report) => (
                <div key={report.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{report.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1"><Calendar size={13} /> {report.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report.name)}
                    disabled={isLoading}
                    className="text-xs rounded-xl"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download Folio
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Report Modal */}
        <Modal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} title="Generate Custom Property Report">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Report Category</label>
              <select
                value={reportSettings.type}
                onChange={(e) => setReportSettings({ ...reportSettings, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              >
                <option value="Financial">Financial Statement (Room Yield & Tariffs)</option>
                <option value="HR">HR & Employee Performance Audit</option>
                <option value="Operational">Housekeeping & Facilities Efficiency</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Time Horizon</label>
              <select
                value={reportSettings.dateRange}
                onChange={(e) => setReportSettings({ ...reportSettings, dateRange: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              >
                <option value="Today">Today (24h Activity)</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month (MTD)</option>
                <option value="This Quarter">This Quarter (Q3)</option>
                <option value="Fiscal Year">Current Fiscal Year</option>
              </select>
            </div>
            <div className="flex gap-3 pt-3">
              <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={() => handleGenerateReport(reportSettings.type)}
                className="flex-1 rounded-xl bg-blue-600 text-white font-bold"
              >
                Compile & Export
              </Button>
            </div>
          </div>
        </Modal>

        {/* Financial Modal */}
        <Modal isOpen={isFinancialModalOpen} onClose={() => setIsFinancialModalOpen(false)} title="Financial Statement Folios">
          <div className="space-y-3">
            <Button onClick={() => handleGenerateReport("Room Revenue & ADR")} variant="outline" className="w-full justify-start text-xs rounded-xl">
              <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
              Room Revenue & ADR (Daily vs Hourly Breakdown)
            </Button>
            <Button onClick={() => handleGenerateReport("Profit & Loss Statement")} variant="outline" className="w-full justify-start text-xs rounded-xl">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Profit & Loss Executive Balance Sheet
            </Button>
            <Button onClick={() => handleGenerateReport("Departmental Expenses")} variant="outline" className="w-full justify-start text-xs rounded-xl">
              <FileText className="w-4 h-4 mr-2 text-purple-600" />
              Operating Expenses Audit
            </Button>
          </div>
        </Modal>

        {/* HR Modal */}
        <Modal isOpen={isHRModalOpen} onClose={() => setIsHRModalOpen(false)} title="HR Staff Performance Reports">
          <div className="space-y-3">
            <Button onClick={() => handleGenerateReport("Employee Ratings Audit")} variant="outline" className="w-full justify-start text-xs rounded-xl">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              Staff Rating & Category Scorecards
            </Button>
            <Button onClick={() => handleGenerateReport("Shift Attendance")} variant="outline" className="w-full justify-start text-xs rounded-xl">
              <Calendar className="w-4 h-4 mr-2 text-amber-600" />
              Attendance & Shift Roster Compliance
            </Button>
          </div>
        </Modal>

        {/* Operational Modal */}
        <Modal isOpen={isOperationalModalOpen} onClose={() => setIsOperationalModalOpen(false)} title="Operational Efficiency Reports">
          <div className="space-y-3">
            <Button onClick={() => handleGenerateReport("Occupancy & Room Utilization")} variant="outline" className="w-full justify-start text-xs rounded-xl">
              <BarChart3 className="w-4 h-4 mr-2 text-teal-600" />
              Suite Utilization & Turnaround Metrics
            </Button>
            <Button onClick={() => handleGenerateReport("Service Request SLA Speed")} variant="outline" className="w-full justify-start text-xs rounded-xl">
              <CheckSquare className="w-4 h-4 mr-2 text-purple-600" />
              Housekeeping Response Time Audit
            </Button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

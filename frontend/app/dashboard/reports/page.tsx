"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Users, CheckSquare, FileText, X } from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()
  const [reports] = useState([
    { id: 1, name: "Monthly Performance Report", type: "Performance", date: "2024-09-01", status: "Ready" },
    { id: 2, name: "Q3 Financial Summary", type: "Financial", date: "2024-09-01", status: "Ready" },
    { id: 3, name: "Staff Productivity Analysis", type: "HR", date: "2024-08-28", status: "Ready" },
    { id: 4, name: "Guest Satisfaction Survey", type: "Guest", date: "2024-08-25", status: "Ready" },
    { id: 5, name: "Operational Efficiency Report", type: "Operations", date: "2024-08-20", status: "Ready" },
  ])
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isHRModalOpen, setIsHRModalOpen] = useState(false)
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false)
  const [isOperationalModalOpen, setIsOperationalModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reportSettings, setReportSettings] = useState({ type: "", dateRange: "This Month", format: "PDF" })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Performance": return "bg-blue-100 text-blue-700 border-blue-200"
      case "Financial": return "bg-green-100 text-green-700 border-green-200"
      case "HR": return "bg-purple-100 text-purple-700 border-purple-200"
      case "Guest": return "bg-amber-100 text-amber-700 border-amber-200"
      case "Operations": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleGenerateReport = async (reportType: string) => {
    setIsLoading(true)
    // Simulate report generation with 2-second delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate file download
    const dataStr = JSON.stringify({ reportType, dateRange: reportSettings.dateRange, format: reportSettings.format, generatedAt: new Date().toISOString() }, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType.toLowerCase().replace(' ', '-')}-report.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setIsLoading(false)
    return true
  }

  const handleDownloadReport = async (reportName: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const dataStr = JSON.stringify({ reportName, downloadedAt: new Date().toISOString() }, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportName.toLowerCase().replace(' ', '-')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setIsLoading(false)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
              <p className="text-gray-600">Generate and view hotel reports</p>
            </div>
            <Button 
              onClick={() => setIsGenerateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Revenue (MTD)</p>
                    <p className="text-3xl font-bold">$125K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Occupancy Rate</p>
                    <p className="text-3xl font-bold">87%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Tasks Completed</p>
                    <p className="text-3xl font-bold">186</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Guest Rating</p>
                    <p className="text-3xl font-bold">4.7</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Financial Reports</h3>
                    <p className="text-sm text-gray-600">Revenue & expenses</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsFinancialModalOpen(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">HR Reports</h3>
                    <p className="text-sm text-gray-600">Staff performance</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsHRModalOpen(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Operational Reports</h3>
                    <p className="text-sm text-gray-600">Daily operations</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsOperationalModalOpen(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{report.date}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(report.type)}`}>
                              {report.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-green-600 font-medium">{report.status}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownloadReport(report.name)}
                          disabled={isLoading}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Report Modal */}
          <Modal
            isOpen={isGenerateModalOpen}
            onClose={() => setIsGenerateModalOpen(false)}
            title="Generate Custom Report"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Report Type</label>
                <select
                  value={reportSettings.type}
                  onChange={(e) => setReportSettings({...reportSettings, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select report type</option>
                  <option value="Financial">Financial Report</option>
                  <option value="HR">HR Report</option>
                  <option value="Operational">Operational Report</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date Range</label>
                <select
                  value={reportSettings.dateRange}
                  onChange={(e) => setReportSettings({...reportSettings, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Quarter">This Quarter</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Format</label>
                <select
                  value={reportSettings.format}
                  onChange={(e) => setReportSettings({...reportSettings, format: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (reportSettings.type) {
                      handleGenerateReport(reportSettings.type)
                      setIsGenerateModalOpen(false)
                    }
                  }}
                  disabled={isLoading || !reportSettings.type}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
                >
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
          </Modal>

          {/* HR Reports Modal */}
          <Modal
            isOpen={isHRModalOpen}
            onClose={() => setIsHRModalOpen(false)}
            title="HR Reports"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => handleGenerateReport("Employee Performance")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Employee Performance Report
                </Button>
                <Button
                  onClick={() => handleGenerateReport("Attendance Report")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Attendance Report
                </Button>
                <Button
                  onClick={() => handleGenerateReport("Staffing Analysis")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Staffing Analysis
                </Button>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsHRModalOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>

          {/* Financial Reports Modal */}
          <Modal
            isOpen={isFinancialModalOpen}
            onClose={() => setIsFinancialModalOpen(false)}
            title="Financial Reports"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => handleGenerateReport("Revenue Report")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Revenue Report
                </Button>
                <Button
                  onClick={() => handleGenerateReport("Expense Report")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Expense Report
                </Button>
                <Button
                  onClick={() => handleGenerateReport("Profit & Loss")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Profit & Loss Statement
                </Button>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsFinancialModalOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>

          {/* Operational Reports Modal */}
          <Modal
            isOpen={isOperationalModalOpen}
            onClose={() => setIsOperationalModalOpen(false)}
            title="Operational Reports"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => handleGenerateReport("Occupancy Report")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Occupancy Report
                </Button>
                <Button
                  onClick={() => handleGenerateReport("Guest Satisfaction")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Guest Satisfaction Report
                </Button>
                <Button
                  onClick={() => handleGenerateReport("Operations Summary")}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Operations Summary
                </Button>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOperationalModalOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

"use client"

import React, { useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  Plus,
  Search,
  Mail,
  Phone,
  Briefcase,
  Star,
  Calendar,
  X,
  Check,
  Sparkles,
} from "lucide-react"

export default function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([
    { id: 1, name: "Maria Santos", email: "maria@crownjewel.com", phone: "+63 917 111 001", role: "Housekeeping Lead", department: "Housekeeping", hireDate: "2023-01-15", status: "Active", rating: 4.9 },
    { id: 2, name: "John Cruz", email: "john@crownjewel.com", phone: "+63 917 111 002", role: "Front Desk Officer", department: "Front Desk", hireDate: "2023-03-20", status: "Active", rating: 4.8 },
    { id: 3, name: "Ana Reyes", email: "ana@crownjewel.com", phone: "+63 917 111 003", role: "Maintenance Specialist", department: "Maintenance", hireDate: "2022-11-10", status: "Active", rating: 4.7 },
    { id: 4, name: "Robert Wilson", email: "robert@crownjewel.com", phone: "+63 917 111 004", role: "Night Duty Concierge", department: "Front Desk", hireDate: "2023-06-01", status: "Active", rating: 4.6 },
    { id: 5, name: "Emily Davis", email: "emily@crownjewel.com", phone: "+63 917 111 005", role: "Room Attendant", department: "Housekeeping", hireDate: "2023-08-15", status: "On Leave", rating: 4.5 },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Front Desk Officer",
    department: "Front Desk",
    hireDate: new Date().toISOString().split("T")[0],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const showToast = (m: string) => {
    setToastMsg(m)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "On Leave": return "bg-amber-100 text-amber-800 border-amber-200"
      case "Inactive": return "bg-rose-100 text-rose-800 border-rose-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.role.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDept = departmentFilter === "All" || e.department === departmentFilter
      const matchesStatus = statusFilter === "All" || e.status === statusFilter
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [employees, searchTerm, departmentFilter, statusFilter])

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const emp = {
      id: Date.now(),
      name: newEmployee.name.trim(),
      email: newEmployee.email.trim(),
      phone: newEmployee.phone.trim() || "+63 917 000 000",
      role: newEmployee.role,
      department: newEmployee.department,
      hireDate: newEmployee.hireDate,
      status: "Active",
      rating: 4.8,
    }

    setEmployees([emp, ...employees])
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      role: "Front Desk Officer",
      department: "Front Desk",
      hireDate: new Date().toISOString().split("T")[0],
    })
    setIsAddEmployeeModalOpen(false)
    setIsLoading(false)
    showToast(`Staff member "${emp.name}" added to roster!`)
  }

  const handleToggleStatus = (id: number) => {
    setEmployees(
      employees.map((e) => {
        if (e.id === id) {
          const next = e.status === "Active" ? "On Leave" : e.status === "On Leave" ? "Inactive" : "Active"
          return { ...e, status: next }
        }
        return e
      })
    )
    showToast("Employee status updated!")
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
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Human Capital</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mt-1">Staff Directory & Roster</h1>
            <p className="text-slate-600 text-sm mt-0.5">Manage hotel team members, assignments, and departmental ratings.</p>
          </div>
          <Button
            onClick={() => setIsAddEmployeeModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Staff</p>
                <p className="text-3xl font-bold font-display mt-1">{employees.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Active on Duty</p>
                <p className="text-3xl font-bold font-display mt-1">{employees.filter((e) => e.status === "Active").length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-emerald-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">On Leave</p>
                <p className="text-3xl font-bold font-display mt-1">{employees.filter((e) => e.status === "On Leave").length}</p>
              </div>
              <Calendar className="w-8 h-8 text-amber-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Avg Staff Rating</p>
                <p className="text-3xl font-bold font-display mt-1">4.8 ★</p>
              </div>
              <Star className="w-8 h-8 text-purple-200" />
            </CardContent>
          </Card>
        </div>

        {/* Directory Card */}
        <Card className="border-0 shadow-xl bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="font-display text-2xl text-slate-900">Hotel Staff Directory</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, role, email..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs w-60 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Department Filter */}
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredEmployees.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">No employees match the search filters.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{employee.name}</h4>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {employee.department}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail size={13} className="text-slate-400" />
                              {employee.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase size={13} className="text-slate-400" />
                              {employee.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-amber-600 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg">
                          <Star size={14} className="fill-amber-500 text-amber-500" />
                          <span>{employee.rating}</span>
                        </div>

                        {/* Status Button Toggle */}
                        <button
                          onClick={() => handleToggleStatus(employee.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${getStatusColor(
                            employee.status
                          )}`}
                          title="Click to toggle status"
                        >
                          {employee.status}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Employee Modal */}
        <Modal
          isOpen={isAddEmployeeModalOpen}
          onClose={() => setIsAddEmployeeModalOpen(false)}
          title="Onboard New Hotel Staff Member"
        >
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                required
                placeholder="e.g. Gabriel Mendoza"
                className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Official Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  required
                  placeholder="g.mendoza@crownjewel.com"
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="+63 917 555 000"
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                <select
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm"
                >
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Management">Management</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEmployeeModalOpen(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl bg-blue-600 text-white font-bold">
                {isLoading ? "Saving..." : "Add to Roster"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

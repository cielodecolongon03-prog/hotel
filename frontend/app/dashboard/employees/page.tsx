"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Plus, Search, Mail, Phone, MapPin, Briefcase, Star, Calendar, X } from "lucide-react"

export default function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([
    { id: 1, name: "Maria Santos", email: "maria@crownjewel.com", role: "Housekeeping", department: "Housekeeping", hireDate: "2023-01-15", status: "Active", rating: 4.9 },
    { id: 2, name: "John Cruz", email: "john@crownjewel.com", role: "Front Desk", department: "Front Desk", hireDate: "2023-03-20", status: "Active", rating: 4.8 },
    { id: 3, name: "Ana Reyes", email: "ana@crownjewel.com", role: "Maintenance", department: "Maintenance", hireDate: "2022-11-10", status: "Active", rating: 4.7 },
    { id: 4, name: "Robert Wilson", email: "robert@crownjewel.com", role: "Front Desk", department: "Front Desk", hireDate: "2023-06-01", status: "Active", rating: 4.6 },
    { id: 5, name: "Emily Davis", email: "emily@crownjewel.com", role: "Housekeeping", department: "Housekeeping", hireDate: "2023-08-15", status: "On Leave", rating: 4.5 },
  ])
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "Front Desk", department: "Front Desk", hireDate: "" })
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-200"
      case "On Leave": return "bg-amber-100 text-amber-700 border-amber-200"
      case "Inactive": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call with 2-second delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newEmployeeData = {
      id: employees.length + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      hireDate: newEmployee.hireDate,
      status: "Active",
      rating: 4.5
    }
    
    setEmployees([...employees, newEmployeeData])
    setNewEmployee({ name: "", email: "", role: "Front Desk", department: "Front Desk", hireDate: "" })
    setIsAddEmployeeModalOpen(false)
    setIsLoading(false)
  }

  return (
    <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Employees</h1>
              <p className="text-gray-600">Manage your hotel staff</p>
            </div>
            <Button 
              onClick={() => setIsAddEmployeeModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Staff</p>
                    <p className="text-3xl font-bold">{employees.length}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active</p>
                    <p className="text-3xl font-bold">{employees.filter(e => e.status === "Active").length}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">On Leave</p>
                    <p className="text-3xl font-bold">{employees.filter(e => e.status === "On Leave").length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Avg Rating</p>
                    <p className="text-3xl font-bold">4.7</p>
                  </div>
                  <Star className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employees List */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle>All Employees</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold">{employee.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{employee.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              <span>{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase size={14} />
                              <span>{employee.role}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star size={16} fill="currentColor" />
                          <span className="font-semibold">{employee.rating}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Employee Modal */}
          <Modal 
            isOpen={isAddEmployeeModalOpen} 
            onClose={() => setIsAddEmployeeModalOpen(false)}
            title="Add New Employee"
          >
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                <select
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Department</label>
                <select
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Management">Management</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Hire Date</label>
                <input
                  type="date"
                  value={newEmployee.hireDate}
                  onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
                >
                  {isLoading ? "Adding..." : "Add Employee"}
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </DashboardLayout>
  )
}

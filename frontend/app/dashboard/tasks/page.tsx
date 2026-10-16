"use client"

import React, { useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import {
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Check,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([
    { id: 1, title: "Clean Room 201 Deluxe Haven", assignedTo: "Maria Santos", priority: "High", status: "In Progress", dueDate: "2026-09-24", category: "Housekeeping" },
    { id: 2, title: "VIP Check-in Guest Lord Sterling", assignedTo: "John Cruz", priority: "Urgent", status: "Pending", dueDate: "2026-09-24", category: "Front Desk" },
    { id: 3, title: "Inspect Penthouse AC Cooling Unit", assignedTo: "Ana Reyes", priority: "Urgent", status: "Completed", dueDate: "2026-09-24", category: "Maintenance" },
    { id: 4, title: "Prepare Welcome Fruit Basket Villa 401", assignedTo: "Maria Santos", priority: "High", status: "Pending", dueDate: "2026-09-25", category: "Guest Services" },
    { id: 5, title: "Settle Folio Payment Room 101", assignedTo: "John Cruz", priority: "Medium", status: "In Progress", dueDate: "2026-09-24", category: "Front Desk" },
    { id: 6, title: "Replace Mini Bar Restock Penthouse 502", assignedTo: "Emily Davis", priority: "Low", status: "Pending", dueDate: "2026-09-25", category: "Housekeeping" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", assignedTo: "Maria Santos", priority: "Medium", dueDate: "", category: "Front Desk" })
  const [isLoading, setIsLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-700 border-red-200"
      case "High": return "bg-orange-100 text-orange-700 border-orange-200"
      case "Medium": return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200"
      case "Pending": return "bg-slate-100 text-slate-700 border-slate-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "All" || t.status === statusFilter
      const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const newTaskData = {
      id: Date.now(),
      title: newTask.title.trim(),
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      status: "Pending",
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      category: newTask.category,
    }

    setTasks([newTaskData, ...tasks])
    setNewTask({ title: "", assignedTo: "Maria Santos", priority: "Medium", dueDate: "", category: "Front Desk" })
    setIsNewTaskModalOpen(false)
    setIsLoading(false)
    showToast(`Task "${newTaskData.title}" created successfully!`)
  }

  const handleUpdateStatus = (id: number, nextStatus: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)))
    showToast(`Task marked as ${nextStatus}!`)
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id))
    showToast("Task removed.")
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
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Operations Workflow</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mt-1">Hotel Tasks & Orders</h1>
            <p className="text-slate-600 text-sm mt-0.5">Manage staff assignments, service requests, and maintenance schedules.</p>
          </div>
          <Button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Tasks</p>
                <p className="text-3xl font-bold font-display mt-1">{tasks.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Completed</p>
                <p className="text-3xl font-bold font-display mt-1">{tasks.filter((t) => t.status === "Completed").length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">In Progress</p>
                <p className="text-3xl font-bold font-display mt-1">{tasks.filter((t) => t.status === "In Progress").length}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-200" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-rose-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-xs font-bold uppercase tracking-wider">Urgent</p>
                <p className="text-3xl font-bold font-display mt-1">{tasks.filter((t) => t.priority === "Urgent").length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-rose-200" />
            </CardContent>
          </Card>
        </div>

        {/* Tasks List Card with Filter Controls */}
        <Card className="border-0 shadow-xl bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="font-display text-2xl text-slate-900">Task Directory</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tasks, staff, category..."
                    className="pl-9 pr-4 py-2 border border-slate-200 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-xs w-60 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="All">All Priorities</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                No tasks found matching current filters.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {task.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <User size={13} className="text-slate-400" />
                            <span>{task.assignedTo}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={13} className="text-slate-400" />
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                          {task.status !== "In Progress" && task.status !== "Completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(task.id, "In Progress")}
                              className="text-xs h-7 rounded-lg"
                            >
                              Start
                            </Button>
                          )}
                          {task.status !== "Completed" && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(task.id, "Completed")}
                              className="text-xs h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Check className="w-3 h-3 mr-1" /> Complete
                            </Button>
                          )}
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete task"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Task Modal */}
        <Modal
          isOpen={isNewTaskModalOpen}
          onClose={() => setIsNewTaskModalOpen(false)}
          title="Create New Hotel Task"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                placeholder="e.g. Inspect Penthouse 501 Balcony"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Department</label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Guest Services">Guest Services</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Assigned Staff</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Maria Santos">Maria Santos (Housekeeping)</option>
                  <option value="John Cruz">John Cruz (Front Desk)</option>
                  <option value="Ana Reyes">Ana Reyes (Maintenance)</option>
                  <option value="Robert Wilson">Robert Wilson (Front Desk)</option>
                  <option value="Emily Davis">Emily Davis (Housekeeping)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
              >
                {isLoading ? "Saving..." : "Create Task"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

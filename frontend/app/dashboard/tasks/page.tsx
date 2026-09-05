"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Plus, Filter, Search, Calendar, User, Clock, CheckCircle, AlertCircle, X } from "lucide-react"

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([
    { id: 1, title: "Clean Room 201", assignedTo: "Maria Santos", priority: "High", status: "In Progress", dueDate: "2024-09-05" },
    { id: 2, title: "Check-in Guest", assignedTo: "John Cruz", priority: "Medium", status: "Pending", dueDate: "2024-09-05" },
    { id: 3, title: "Fix AC in Room 305", assignedTo: "Ana Reyes", priority: "Urgent", status: "Completed", dueDate: "2024-09-04" },
    { id: 4, title: "Prepare VIP Suite", assignedTo: "Maria Santos", priority: "High", status: "Pending", dueDate: "2024-09-06" },
    { id: 5, title: "Guest Checkout", assignedTo: "John Cruz", priority: "Medium", status: "In Progress", dueDate: "2024-09-05" },
  ])
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", assignedTo: "", priority: "Medium", dueDate: "" })
  const [isLoading, setIsLoading] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-700 border-red-200"
      case "High": return "bg-orange-100 text-orange-700 border-orange-200"
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-200"
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200"
      case "Pending": return "bg-gray-100 text-gray-700 border-gray-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call with 2-second delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newTaskData = {
      id: tasks.length + 1,
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      status: "Pending",
      dueDate: newTask.dueDate
    }
    
    setTasks([...tasks, newTaskData])
    setNewTask({ title: "", assignedTo: "", priority: "Medium", dueDate: "" })
    setIsNewTaskModalOpen(false)
    setIsLoading(false)
  }

  return (
    <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
              <p className="text-gray-600">Manage and track all hotel tasks</p>
            </div>
            <Button 
              onClick={() => setIsNewTaskModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Tasks</p>
                    <p className="text-3xl font-bold">{tasks.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Completed</p>
                    <p className="text-3xl font-bold">{tasks.filter(t => t.status === "Completed").length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">In Progress</p>
                    <p className="text-3xl font-bold">{tasks.filter(t => t.status === "In Progress").length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Urgent</p>
                    <p className="text-3xl font-bold">{tasks.filter(t => t.priority === "Urgent").length}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle>All Tasks</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{task.assignedTo}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Task Modal */}
          <Modal 
            isOpen={isNewTaskModalOpen} 
            onClose={() => setIsNewTaskModalOpen(false)}
            title="Create New Task"
          >
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Assigned To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select staff member</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="John Cruz">John Cruz</option>
                  <option value="Ana Reyes">Ana Reyes</option>
                  <option value="Robert Wilson">Robert Wilson</option>
                  <option value="Emily Davis">Emily Davis</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
                >
                  {isLoading ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </DashboardLayout>
  )
}

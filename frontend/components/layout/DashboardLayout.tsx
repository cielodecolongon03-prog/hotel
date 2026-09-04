"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Star, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Crown,
  Bell,
  Search
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Employees", href: "/dashboard/employees", icon: Users },
    { name: "Ratings", href: "/dashboard/ratings", icon: Star },
    { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 hidden lg:block transition-all duration-300 ${
          sidebarOpen ? "w-[280px]" : "w-20"
        } ${mobileMenuOpen ? "block lg:hidden" : ""}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <motion.div
              animate={{
                opacity: sidebarOpen ? 1 : 0,
                width: sidebarOpen ? "auto" : 0,
              }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent whitespace-nowrap">
                Crown Jewel
              </span>
            </motion.div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex-shrink-0"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-50 to-amber-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span
                  className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                  }`}
                >
                  {item.name}
                </span>
              </a>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className={`space-y-3 transition-all duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">
                    {user?.full_name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user?.role || "Staff"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[280px]" : "lg:ml-20"}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                <Menu size={24} />
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.full_name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="font-medium text-gray-900">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user?.role || "Staff"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
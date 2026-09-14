"use client"

import React, { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardPath, getRoleLabel, resolveRole } from "@/lib/auth-routing"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/notifications/NotificationBell"
import { CleaningAlertPopup } from "@/components/notifications/CleaningAlertPopup"
import { PageMotion } from "@/components/layout/PageMotion"
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
  Search,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const role = resolveRole(user?.role, user?.email)

  const navigation = useMemo(() => {
    const dashboard = {
      name: "Dashboard",
      href: getDashboardPath(user?.role, user?.email),
      icon: LayoutDashboard,
    }

    if (role === "guest") {
      return [
        dashboard,
        { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }

    const staff = [
      dashboard,
      { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { name: "Employees", href: "/dashboard/employees", icon: Users },
      { name: "Ratings", href: "/dashboard/ratings", icon: Star },
      { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    return staff
  }, [role, user?.email, user?.role])

  const handleSignOut = async () => {
    await signOut()
    router.replace("/login")
  }

  const NavButtons = ({ compact = false }: { compact?: boolean }) => (
    <>
      {navigation.map((item) => {
        const active = pathname === item.href
        return (
          <button
            key={item.name}
            onClick={() => {
              router.push(item.href)
              setMobileMenuOpen(false)
            }}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              compact || sidebarOpen ? "justify-start" : "justify-center"
            } ${
              active
                ? "bg-gradient-to-r from-amber-50 to-blue-50 text-amber-800 shadow-sm ring-1 ring-amber-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <item.icon size={20} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span
              className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                compact || sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              {item.name}
            </span>
          </button>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#f8fafc_42%,_#eff6ff)]">
      <CleaningAlertPopup />

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full border-r border-white/60 bg-white/80 shadow-xl backdrop-blur-xl transition-all duration-300 lg:z-30 ${
          sidebarOpen ? "w-[280px]" : "w-20"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div
              className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
                sidebarOpen || mobileMenuOpen ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="block font-display text-lg font-semibold text-slate-900">
                  Crown Jewel
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-amber-700">
                  Hotel OS
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden flex-shrink-0 lg:flex"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <NavButtons compact={mobileMenuOpen} />
          </nav>

          <div className="border-t border-slate-100 p-4">
            <div className={`space-y-3 transition-all duration-300 ${sidebarOpen || mobileMenuOpen ? "opacity-100" : "opacity-0"}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{user?.full_name || "User"}</p>
                  <p className="truncate text-sm text-slate-500">{getRoleLabel(role)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[280px]" : "lg:ml-20"}`}>
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
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
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search rooms, guests, tasks..."
                  className="w-64 rounded-full border border-slate-200 bg-white/80 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 font-semibold text-white">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <div className="hidden lg:block">
                  <p className="font-medium text-slate-900">{user?.full_name || "User"}</p>
                  <p className="text-sm text-slate-500">{getRoleLabel(role)}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <PageMotion>{children}</PageMotion>
        </main>
      </div>
    </div>
  )
}

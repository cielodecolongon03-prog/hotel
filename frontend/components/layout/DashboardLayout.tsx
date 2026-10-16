"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardPath, getRoleLabel, resolveRole, isRouteAllowedForRole } from "@/lib/auth-routing"
import { getCurrency, setCurrency } from "@/lib/rooms-data"
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
  ExternalLink,
  Shield,
  CreditCard,
  DollarSign,
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
  const [curr, setCurr] = useState<"USD" | "PHP">(() => getCurrency())
  const [headerSearch, setHeaderSearch] = useState("")

  const role = resolveRole(user?.role, user?.email)

  // Enforce strict RBAC route-level protection
  useEffect(() => {
    if (user && pathname) {
      if (!isRouteAllowedForRole(user.role, user.email, pathname)) {
        const fallback = getDashboardPath(user.role, user.email)
        router.replace(fallback)
      }
    }
  }, [user, pathname, router])

  const handleToggleCurrency = () => {
    const next = curr === "USD" ? "PHP" : "USD"
    setCurrency(next)
    setCurr(next)
    // Dispatch storage event so components update
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"))
    }
  }

  const navigation = useMemo(() => {
    const dashboard = {
      name: role === "guest" ? "My Stay Folio" : "Dashboard",
      href: getDashboardPath(user?.role, user?.email),
      icon: LayoutDashboard,
    }

    if (role === "guest") {
      return [
        dashboard,
        { name: "Service Feedback", href: "/dashboard/feedback", icon: MessageSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }

    if (role === "housekeeping") {
      return [
        { name: "Housekeeping Board", href: "/dashboard/housekeeping", icon: LayoutDashboard },
        { name: "Cleaning Tasks", href: "/dashboard/tasks", icon: CheckSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }

    if (role === "maintenance") {
      return [
        { name: "Maintenance Desk", href: "/dashboard/maintenance", icon: LayoutDashboard },
        { name: "Work Orders & Tasks", href: "/dashboard/tasks", icon: CheckSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }

    if (role === "frontdesk") {
      return [
        { name: "Front Desk Command", href: "/dashboard/front-desk", icon: LayoutDashboard },
        { name: "Front Desk Tasks", href: "/dashboard/tasks", icon: CheckSquare },
        { name: "Staff Service Ratings", href: "/dashboard/ratings", icon: Star },
        { name: "Guest Feedback", href: "/dashboard/feedback", icon: MessageSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }

    if (role === "owner") {
      return [
        { name: "Executive Desk", href: "/dashboard/owner", icon: LayoutDashboard },
        { name: "Financial & Revenue Reports", href: "/dashboard/reports", icon: BarChart3 },
        { name: "Guest Ratings & Scores", href: "/dashboard/ratings", icon: Star },
        { name: "Guest Feedback", href: "/dashboard/feedback", icon: MessageSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }

    // Default for manager and admin (full operational access)
    return [
      dashboard,
      { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { name: "Employees", href: "/dashboard/employees", icon: Users },
      { name: "Ratings", href: "/dashboard/ratings", icon: Star },
      { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]
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

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full border-r border-white/60 bg-white/85 shadow-xl backdrop-blur-xl transition-all duration-300 lg:z-30 ${
          sidebarOpen ? "w-[280px]" : "w-20"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <Link
              href="/"
              className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
                sidebarOpen || mobileMenuOpen ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg text-white">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-display text-lg font-semibold text-slate-900">Crown Jewel</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-amber-700 font-bold">Hotel OS</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden flex-shrink-0 lg:flex"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <NavButtons compact={mobileMenuOpen} />

            {/* Link to Public Guest Portal */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                href="/"
                target="_blank"
                className={`group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-amber-50 hover:text-amber-800 transition ${
                  sidebarOpen ? "justify-start" : "justify-center"
                }`}
              >
                <ExternalLink size={18} className="flex-shrink-0 text-amber-600" />
                <span
                  className={`text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                  }`}
                >
                  View Guest Portal
                </span>
              </Link>
            </div>
          </nav>

          {/* User Profile & Sign Out Footer */}
          <div className="border-t border-slate-100 p-4">
            <div
              className={`space-y-3 transition-all duration-300 ${
                sidebarOpen || mobileMenuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white font-semibold shadow-md">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 text-sm">{user?.full_name || "Staff User"}</p>
                  <p className="truncate text-xs text-amber-700 font-semibold">{getRoleLabel(role)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full text-xs">
                <LogOut size={14} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[280px]" : "lg:ml-20"}`}>
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
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
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Search rooms, guests, tickets..."
                  className="w-64 rounded-full border border-slate-200 bg-white/90 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Currency Toggle */}
              <button
                onClick={handleToggleCurrency}
                className="px-3 py-1.5 rounded-full border border-slate-200 bg-white/80 text-xs font-bold text-slate-700 hover:border-amber-400 transition"
              >
                {curr === "USD" ? "💵 USD ($)" : "🇵🇭 PHP (₱)"}
              </button>

              <NotificationBell />

              <div className="hidden items-center gap-3 md:flex pl-2 border-l border-slate-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 font-bold text-white text-xs shadow-sm">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <div className="hidden lg:block">
                  <p className="font-semibold text-slate-900 text-xs truncate max-w-[140px]">
                    {user?.full_name || "Staff Member"}
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium">{getRoleLabel(role)}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <PageMotion>{children}</PageMotion>
        </main>
      </div>
    </div>
  )
}

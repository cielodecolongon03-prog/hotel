export function normalizeRoleKey(value?: string | null): string {
  return (value || "").toLowerCase().replace(/[-_\s]/g, "")
}

export function resolveRole(role?: string | null, email?: string | null): string {
  const haystack = `${normalizeRoleKey(role)} ${normalizeRoleKey(email)}`

  if (haystack.includes("admin")) return "admin"
  if (haystack.includes("frontdesk")) return "frontdesk"
  if (haystack.includes("housekeeping")) return "housekeeping"
  if (haystack.includes("maintenance")) return "maintenance"
  if (haystack.includes("owner")) return "owner"
  if (haystack.includes("guest")) return "guest"
  if (haystack.includes("manager")) return "manager"

  return "manager"
}

export function getDashboardPath(role?: string | null, email?: string | null): string {
  const resolved = resolveRole(role, email)
  const roleMap: Record<string, string> = {
    admin: "/dashboard/admin",
    manager: "/dashboard/manager",
    frontdesk: "/dashboard/front-desk",
    housekeeping: "/dashboard/housekeeping",
    maintenance: "/dashboard/maintenance",
    owner: "/dashboard/owner",
    guest: "/dashboard/guest",
  }

  return roleMap[resolved] || "/dashboard/manager"
}

export function extractRoleName(roles: unknown): string | undefined {
  if (!roles) return undefined
  if (Array.isArray(roles)) {
    return (roles[0] as { name?: string } | undefined)?.name
  }
  if (typeof roles === "object" && roles !== null && "name" in roles) {
    return (roles as { name?: string }).name
  }
  return undefined
}

export function isStaffRole(role?: string | null, email?: string | null): boolean {
  const resolved = resolveRole(role, email)
  return resolved !== "guest"
}

export function receivesCleaningAlerts(role?: string | null, email?: string | null): boolean {
  const resolved = resolveRole(role, email)
  // Strict requirement: Only Housekeeping receives cleaning approval notifications & alerts
  return resolved === "housekeeping"
}

export function getRoleLabel(role?: string | null): string {
  const labels: Record<string, string> = {
    admin: "Administrator",
    manager: "Hotel Manager",
    frontdesk: "Front Desk",
    housekeeping: "Housekeeping",
    maintenance: "Maintenance",
    owner: "Hotel Owner",
    guest: "Guest",
  }
  return labels[role || ""] || role || "Staff"
}

export const ROLE_ALLOWED_ROUTES: Record<string, string[]> = {
  admin: [
    "/dashboard/admin",
    "/dashboard/tasks",
    "/dashboard/employees",
    "/dashboard/ratings",
    "/dashboard/feedback",
    "/dashboard/reports",
    "/dashboard/settings",
  ],
  manager: [
    "/dashboard/manager",
    "/dashboard/tasks",
    "/dashboard/employees",
    "/dashboard/ratings",
    "/dashboard/feedback",
    "/dashboard/reports",
    "/dashboard/settings",
  ],
  frontdesk: [
    "/dashboard/front-desk",
    "/dashboard/tasks",
    "/dashboard/ratings",
    "/dashboard/feedback",
    "/dashboard/settings",
  ],
  housekeeping: [
    "/dashboard/housekeeping",
    "/dashboard/tasks",
    "/dashboard/settings",
  ],
  maintenance: [
    "/dashboard/maintenance",
    "/dashboard/tasks",
    "/dashboard/settings",
  ],
  owner: [
    "/dashboard/owner",
    "/dashboard/reports",
    "/dashboard/ratings",
    "/dashboard/feedback",
    "/dashboard/settings",
  ],
  guest: [
    "/dashboard/guest",
    "/dashboard/feedback",
    "/dashboard/settings",
  ],
}

export function isRouteAllowedForRole(role?: string | null, email?: string | null, pathname?: string | null): boolean {
  if (!pathname || pathname === "/dashboard") return true
  const resolved = resolveRole(role, email)
  const allowed = ROLE_ALLOWED_ROUTES[resolved]
  if (!allowed) return true
  
  return allowed.some((route) => pathname === route || pathname.startsWith(route + "/"))
}


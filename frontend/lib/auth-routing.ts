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
  return ["admin", "housekeeping", "manager", "frontdesk", "owner"].includes(resolved)
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

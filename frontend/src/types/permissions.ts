// ─── Resource-Action Permission System Types ─────────────────────────────
//
// A "resource" is any page, feature, or entity in the app.
// An "action" is what the user can do with that resource.
// "manage" is a super-action that grants read + write + delete.
//
// Usage example:
//   hasPermission(userPerms, "data", "read")  → true/false
//   can("data", "write")                      → true/false
//   <PermissionGuard resource="data" action="write">...</PermissionGuard>

// ─── Resources ───────────────────────────────────────────────────────────
// Each resource maps to a page or feature area in the app.
// Add new resources here when the app grows.

export type Resource =
  | "dashboard"
  | "profile"
  | "settings"
  | "data"
  | "data-report"
  | "showcase"
  | "users"
  | "roles"
  | "permissions"

// ─── Actions ─────────────────────────────────────────────────────────────

export type Action = "read" | "write" | "edit" | "delete" | "lock" | "export" | "import" | "approve" | "manage"

// ─── Permission ──────────────────────────────────────────────────────────

export interface Permission {
  resource: Resource
  action: Action
}

// ─── Role ────────────────────────────────────────────────────────────────
// A role is a named collection of permissions.
// Users can have multiple roles; their permissions accumulate.

export interface Role {
  id: string
  name: string
  displayName?: string
  permissions: Permission[]
}

// ─── Predefined Role Templates ───────────────────────────────────────────
// These map role IDs to their default permission sets.
// The backend can override or extend these per-user.

const ALL_RESOURCES: Resource[] = [
  "dashboard",
  "profile",
  "settings",
  "data",
  "data-report",
  "showcase",
  "users",
  "roles",
  "permissions",
]

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: ALL_RESOURCES.map((resource) => ({
    resource,
    action: "manage",
  })),

  editor: [
    { resource: "dashboard", action: "read" },
    { resource: "profile", action: "manage" },
    { resource: "settings", action: "read" },
    { resource: "data", action: "manage" },
    { resource: "data-report", action: "read" },
    { resource: "data-report", action: "write" },
    { resource: "showcase", action: "read" },
  ],

  viewer: [
    { resource: "dashboard", action: "read" },
    { resource: "profile", action: "manage" },
    { resource: "settings", action: "read" },
    { resource: "data", action: "read" },
    { resource: "data-report", action: "read" },
    { resource: "showcase", action: "read" },
  ],
}

// ─── Role Display Labels (shared across app) ────────────────────────────
// Single source of truth for role display names (Arabic).

export const ROLE_LABELS: Record<string, string> = {
  admin: "مسؤول الشعبة",
  editor: "محرر",
  viewer: "مشاهد",
  personalinfo: "الاضابير الشخصية",
  staff: "الملاكات",
  fingerprints: "البصمة",
  vacations: "إدارة الإجازات والغيابات",
  promotions: "العلاوات والترفيعات",
  data: "البيانات",
}

// ─── Resource Display Labels ─────────────────────────────────────────────

export const RESOURCE_LABELS: Record<Resource, string> = {
  dashboard: "لوحة التحكم",
  profile: "الملف الشخصي",
  settings: "الإعدادات",
  data: "البيانات",
  "data-report": "تقرير البيانات",
  showcase: "عرض المكونات",
  users: "المستخدمين",
  roles: "الأدوار",
  permissions: "الصلاحيات",
}

// ─── Action Display Labels ───────────────────────────────────────────────

export const ACTION_LABELS: Record<Action, string> = {
  read: "قراءة",
  write: "كتابة",
  edit: "تعديل",
  delete: "حذف",
  lock: "قفل",
  export: "تصدير",
  import: "استيراد",
  approve: "اعتماد",
  manage: "إدارة كاملة",
}

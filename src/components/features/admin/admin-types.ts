import type { Permission, Role } from "@/types/permissions"

// Extended user type for admin management (includes full details)
export interface AdminUser {
  id: number
  userName: string
  fullName: string
  role: string
  roles: Role[]
  permissions: Permission[]
  isTempPass: boolean
  createdAt?: string
  updatedAt?: string
}

// Form data for creating/editing a user
export interface AdminUserFormData {
  fullName: string
  userName: string
  password?: string
  roleIds: string[]
  permissions: Permission[]
}

// Role form data for creating/editing a role
export interface RoleFormData {
  id: string
  name: string
  displayName: string
  permissions: Permission[]
}

// Tab type for the admin page
export type AdminTab = "users" | "roles" | "permissions"

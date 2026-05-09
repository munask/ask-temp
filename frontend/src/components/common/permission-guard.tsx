"use client"

import { usePermissions } from "@/hooks/usePermissions"
import type { Resource, Action } from "@/types/permissions"

interface PermissionGuardProps {
  /** Check a specific resource + action permission (new way) */
  resource?: Resource
  action?: Action
  /** Check against role IDs (legacy way) */
  allowedRoles?: string[]
  /** Require authentication (default: true) */
  requireAuth?: boolean
  /** Content to show when permission check fails */
  fallback?: React.ReactNode
  children: React.ReactNode
  /** Optional wrapper className */
  className?: string
}

/**
 * Conditionally renders children based on user permissions.
 *
 * NEW WAY (resource-action):
 *   <PermissionGuard resource="data" action="write">
 *     <AddButton />
 *   </PermissionGuard>
 *
 * LEGACY WAY (role-based):
 *   <PermissionGuard allowedRoles={["admin", "editor"]}>
 *     <AdminPanel />
 *   </PermissionGuard>
 *
 * If both resource+action and allowedRoles are provided,
 * BOTH checks must pass (AND logic).
 */
export function PermissionGuard({
  resource,
  action,
  allowedRoles,
  requireAuth = true,
  fallback = null,
  children,
  className,
}: PermissionGuardProps) {
  const { isAuthenticated, can, hasAnyRole } = usePermissions()

  // Auth check
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  // Resource-action permission check
  if (resource && action) {
    if (!can(resource, action)) {
      return <>{fallback}</>
    }
  }

  // Legacy role check
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      return <>{fallback}</>
    }
  }

  if (className) {
    return <div className={className}>{children}</div>
  }

  return <>{children}</>
}

"use client"

import { useAuthStore } from "@/store/auth/authStore"

interface PermissionGuardProps {
  allowedRoles?: string[]
  requireAuth?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PermissionGuard({
  allowedRoles,
  requireAuth = true,
  fallback = null,
  children,
  className,
}: PermissionGuardProps) {
  const { user, isAuthenticated } = useAuthStore()

  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  if (className) {
    return <div className={className}>{children}</div>
  }

  return <>{children}</>
}

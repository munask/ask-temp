"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import {
  hasPermission,
  hasAnyPermission,
  collectPermissions,
  hasRoleId,
} from "@/lib/permissions";
import type { Resource, Action, Permission } from "@/types/permissions";

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Collect all permissions from roles + direct overrides
  const allPermissions: Permission[] = useMemo(() => {
    if (!user) return [];
    return collectPermissions(user.roles, user.permissions);
  }, [user]);

  // ─── New Resource-Action API ───────────────────────────────────────────

  /** Check if user can perform an action on a resource */
  const can = (resource: Resource, action: Action): boolean => {
    if (!isAuthenticated) return false;
    return hasPermission(allPermissions, resource, action);
  };

  /** Shortcut: can user read this resource? */
  const canRead = (resource: Resource): boolean => can(resource, "read");

  /** Shortcut: can user write (create/edit) this resource? */
  const canWrite = (resource: Resource): boolean => can(resource, "write");

  /** Shortcut: can user delete this resource? */
  const canDelete = (resource: Resource): boolean => can(resource, "delete");

  /** Shortcut: can user manage (all actions) this resource? */
  const canManage = (resource: Resource): boolean => can(resource, "manage");

  /** Check if user passes ANY of the given permission checks (OR logic) */
  const canAny = (
    checks: Array<{ resource: Resource; action: Action }>
  ): boolean => {
    if (!isAuthenticated) return false;
    return hasAnyPermission(allPermissions, checks);
  };

  // ─── Legacy Role-Based API (backward compat) ──────────────────────────

  /** Check if user has a specific role by ID */
  const hasRole = (roleId: string): boolean => {
    if (!isAuthenticated || !user?.roles) return false;
    return hasRoleId(user.roles, roleId);
  };

  /** Check if user has ANY of the given roles */
  const hasAnyRole = (roleIds: string[]): boolean => {
    if (!isAuthenticated || !user?.roles) return false;
    return roleIds.some((id) => hasRoleId(user.roles, id));
  };

  /** Check if user has the "admin" role */
  const isAdmin = (): boolean => hasRole("admin");

  /** Check if user has the "user" role */
  const isUser = (): boolean => hasRole("user");

  /**
   * @deprecated Use can(resource, action) instead.
   * Legacy method: check access by allowed role IDs.
   */
  const canAccess = (allowedRoles?: string[]): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return isAuthenticated;
    }
    return hasAnyRole(allowedRoles);
  };

  return {
    user,
    isAuthenticated,
    allPermissions,

    // New resource-action API
    can,
    canRead,
    canWrite,
    canDelete,
    canManage,
    canAny,

    // Legacy role-based API
    hasRole,
    hasAnyRole,
    isAdmin,
    isUser,
    canAccess,
  };
};

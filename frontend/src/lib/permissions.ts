import type { Permission, Resource, Action, Role } from "@/types/permissions"
import { ROLE_PERMISSIONS } from "@/types/permissions"

// ─── Action Hierarchy ────────────────────────────────────────────────────
// "manage" is a super-action that implies read, write, and delete.

export function actionGrants(granted: Action, required: Action): boolean {
  if (granted === "manage") return true
  return granted === required
}

// ─── Core Permission Check ───────────────────────────────────────────────
// Returns true if any permission in the list grants the requested action
// on the requested resource.

export function hasPermission(
  permissions: Permission[],
  resource: Resource,
  action: Action
): boolean {
  return permissions.some(
    (p) => p.resource === resource && actionGrants(p.action, action)
  )
}

// ─── Collect All Permissions ─────────────────────────────────────────────
// Gathers permissions from all roles + any direct per-user overrides.
// Falls back to ROLE_PERMISSIONS defaults if a role has no embedded perms.

export function collectPermissions(
  roles: Role[],
  directPermissions: Permission[] = []
): Permission[] {
  const rolePermissions = roles.flatMap((role) => {
    if (role.permissions && role.permissions.length > 0) {
      return role.permissions
    }
    return ROLE_PERMISSIONS[role.id] ?? []
  })

  return [...rolePermissions, ...directPermissions]
}

// ─── Check Multiple Permissions ──────────────────────────────────────────
// Returns true if ANY of the checks pass (OR logic).

export function hasAnyPermission(
  permissions: Permission[],
  checks: Array<{ resource: Resource; action: Action }>
): boolean {
  return checks.some((check) =>
    hasPermission(permissions, check.resource, check.action)
  )
}

// ─── Get Actions for a Resource ──────────────────────────────────────────
// Returns all actions the user can perform on a given resource.

export function getResourceActions(
  permissions: Permission[],
  resource: Resource
): Action[] {
  const actions = new Set<Action>()
  for (const p of permissions) {
    if (p.resource === resource) {
      actions.add(p.action)
      if (p.action === "manage") {
        actions.add("read")
        actions.add("write")
        actions.add("delete")
      }
    }
  }
  return Array.from(actions)
}

// ─── Check if user has a specific role ID ────────────────────────────────

export function hasRoleId(roles: Role[], roleId: string): boolean {
  return roles.some((r) => r.id === roleId)
}

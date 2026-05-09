# Permission System Documentation

## Overview

This app uses a **Hybrid RBAC** (Role-Based Access Control) system that combines:

- **Roles** — named groups of permissions (admin, editor, viewer)
- **Resource-Action Permissions** — fine-grained control over what users can do on each resource
- **Direct Overrides** — per-user permission overrides on top of role defaults

```
User
 └── has Role(s)        ← A user can have multiple roles
      └── Role has Permission(s)
           └── Permission = Resource + Action
                ├── Resource: "data", "settings", "data-report", etc.
                └── Action: "read", "write", "delete", "manage"
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Backend API                                                     │
│  Returns: { user: { roles: [...], permissions: [...] } }         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Auth Store (authStore.ts)                                       │
│  - normalizeUser() handles old/new format                        │
│  - Stores user + role cookie for middleware                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┼────────────────┐
              ▼            ▼                ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  usePermissions  │ │ Nav Filtering│ │  Middleware       │
│  Hook            │ │ (sidebar)    │ │  (server-side)    │
│  can(r, a)       │ │ per-resource │ │  role-based guard │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

---

## Quick Start

### 1. Check a Permission in a Component

```tsx
import { usePermissions } from "@/hooks/usePermissions"

function DataPage() {
  const { canRead, canWrite, canDelete } = usePermissions()

  return (
    <div>
      {canRead("data") && <DataTable />}
      {canWrite("data") && <AddDataButton />}
      {canDelete("data") && <DeleteButton />}
    </div>
  )
}
```

### 2. Guard Content with PermissionGuard

```tsx
import { PermissionGuard } from "@/components/common/permission-guard"

function Toolbar() {
  return (
    <div>
      <ExportButton />  {/* visible to everyone */}

      <PermissionGuard resource="data" action="write">
        <AddButton />
      </PermissionGuard>

      <PermissionGuard resource="data" action="delete" fallback={<span>No access</span>}>
        <DeleteAllButton />
      </PermissionGuard>
    </div>
  )
}
```

### 3. Legacy Role Check (backward compat)

```tsx
import { usePermissions } from "@/hooks/usePermissions"

function AdminPanel() {
  const { isAdmin, hasRole, hasAnyRole } = usePermissions()

  if (isAdmin()) {
    return <AdminDashboard />
  }

  if (hasAnyRole(["editor", "viewer"])) {
    return <ReadOnlyDashboard />
  }
}
```

---

## Core Concepts

### Resources

A **resource** is a page, feature area, or entity in the app. Defined in `src/types/permissions.ts`:

| Resource        | Description      | Route          |
|----------------|------------------|----------------|
| `dashboard`    | Dashboard page   | `/`            |
| `profile`      | User profile     | `/profile`     |
| `settings`     | App settings     | `/settings`    |
| `data`         | Data management  | `/data`        |
| `data-report`  | Data reports     | `/data-report` |
| `showcase`     | Component demo   | `/showcase`    |
| `users`        | User management  | —              |
| `roles`        | Role management  | —              |
| `permissions`  | Permission mgmt  | —              |

**To add a new resource**: Add it to the `Resource` union type in `src/types/permissions.ts` and add a label to `RESOURCE_LABELS`.

### Actions

An **action** is what the user can do with a resource:

| Action   | Description                        |
|----------|------------------------------------|
| `read`   | View / access the resource         |
| `write`  | Create or edit the resource        |
| `delete` | Delete the resource                |
| `manage` | Full control (implies all actions) |

The `manage` action is special — it automatically grants `read`, `write`, and `delete`.

### Permissions

A **permission** is a combination of resource + action:

```typescript
{ resource: "data", action: "write" }   // Can create/edit data
{ resource: "settings", action: "read" } // Can view settings
{ resource: "users", action: "manage" }  // Full control over users
```

### Roles

A **role** is a named collection of permissions:

```typescript
const ROLE_PERMISSIONS = {
  admin: [
    { resource: "dashboard", action: "manage" },
    { resource: "data", action: "manage" },
    // ... manage on ALL resources
  ],
  editor: [
    { resource: "dashboard", action: "read" },
    { resource: "data", action: "manage" },
    { resource: "data-report", action: "read" },
    { resource: "data-report", action: "write" },
  ],
  viewer: [
    { resource: "dashboard", action: "read" },
    { resource: "data", action: "read" },
    { resource: "data-report", action: "read" },
  ],
}
```

Users can have **multiple roles**. Permissions from all roles are accumulated.

---

## API Reference

### `usePermissions()` Hook

Location: `src/hooks/usePermissions.ts`

```typescript
const {
  // New resource-action API
  can,          // (resource, action) => boolean
  canRead,      // (resource) => boolean
  canWrite,     // (resource) => boolean
  canDelete,    // (resource) => boolean
  canManage,    // (resource) => boolean
  canAny,       // (checks[]) => boolean  (OR logic)

  // Legacy role-based API
  hasRole,      // (roleId) => boolean
  hasAnyRole,   // (roleIds[]) => boolean
  isAdmin,      // () => boolean
  isUser,       // () => boolean
  canAccess,    // (roleIds?) => boolean  (deprecated)

  // State
  user,           // User | null
  isAuthenticated, // boolean
  allPermissions, // Permission[]
} = usePermissions()
```

#### `can(resource, action)`

The primary permission check. Returns `true` if the user has the specified action on the resource.

```tsx
const { can } = usePermissions()

// Check specific action
if (can("data", "write")) {
  showEditForm()
}

// manage grants all actions
can("data", "manage")  // true → also grants read, write, delete
can("data", "read")    // true (because manage includes read)
```

#### `canRead(resource)` / `canWrite(resource)` / `canDelete(resource)` / `canManage(resource)`

Convenience shortcuts for `can(resource, action)`.

```tsx
const { canRead, canWrite } = usePermissions()

return (
  <div>
    {canRead("data") && <TableView />}
    {canWrite("data") && <EditButton />}
  </div>
)
```

#### `canAny(checks[])`

Check if the user satisfies **any** of the given permission checks (OR logic).

```tsx
const { canAny } = usePermissions()

// Show export if user can read data OR data-report
if (canAny([
  { resource: "data", action: "read" },
  { resource: "data-report", action: "read" },
])) {
  showExportButton()
}
```

### `<PermissionGuard>` Component

Location: `src/components/common/permission-guard.tsx`

Props:

| Prop          | Type                          | Default | Description                          |
|---------------|-------------------------------|---------|--------------------------------------|
| `resource`    | `Resource`                    | —       | Resource to check                    |
| `action`      | `Action`                      | —       | Action to check                      |
| `allowedRoles`| `string[]`                    | —       | Legacy: role IDs to check            |
| `requireAuth` | `boolean`                     | `true`  | Require authentication               |
| `fallback`    | `ReactNode`                   | `null`  | Content when check fails             |
| `className`   | `string`                      | —       | Wrapper class                        |
| `children`    | `ReactNode`                   | —       | Content when check passes            |

#### Resource-Action Mode (recommended)

```tsx
<PermissionGuard resource="data" action="write">
  <AddDataButton />
</PermissionGuard>
```

#### Legacy Role Mode

```tsx
<PermissionGuard allowedRoles={["admin", "editor"]}>
  <AdminPanel />
</PermissionGuard>
```

#### Combined (both must pass)

```tsx
{/* Must have data:write AND be admin or editor */}
<PermissionGuard
  resource="data"
  action="write"
  allowedRoles={["admin", "editor"]}
>
  <DangerousAction />
</PermissionGuard>
```

#### With Fallback

```tsx
<PermissionGuard
  resource="data"
  action="delete"
  fallback={<span className="text-muted">Not authorized</span>}
>
  <DeleteAllButton />
</PermissionGuard>
```

### Permission Utilities

Location: `src/lib/permissions.ts`

```typescript
import {
  hasPermission,       // (permissions, resource, action) => boolean
  collectPermissions,  // (roles, directPermissions) => Permission[]
  hasAnyPermission,    // (permissions, checks[]) => boolean
  getResourceActions,  // (permissions, resource) => Action[]
  actionGrants,        // (granted, required) => boolean
  hasRoleId,           // (roles, roleId) => boolean
} from "@/lib/permissions"
```

These are pure functions (no hooks) — use them outside React components or in custom logic.

---

## File Structure

```
src/
├── types/
│   └── permissions.ts          # Types, role templates, labels
├── lib/
│   └── permissions.ts           # Pure permission utility functions
├── hooks/
│   └── usePermissions.ts        # React hook for permission checks
├── components/
│   ├── common/
│   │   └── permission-guard.tsx # Declarative permission guard
│   └── layouts/
│       ├── navbarData.ts        # Nav items with permission metadata
│       └── app-sidebar.tsx      # Sidebar with permission filtering
├── store/
│   └── auth/
│       ├── authTypes.ts         # User type with roles/permissions
│       └── authStore.ts         # Auth store with normalizeUser()
├── middleware.ts                # Server-side role-based route guard
└── app/
    └── (home)/
        └── profile/
            └── page.tsx          # Displays user roles and permissions
```

---

## Backend API Contract

The backend should return user data in one of two formats:

### New Format (recommended)

```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": 1,
    "userName": "john",
    "fullName": "John Doe",
    "role": "admin",
    "roles": [
      {
        "id": "admin",
        "name": "Admin",
        "permissions": [
          { "resource": "dashboard", "action": "manage" },
          { "resource": "data", "action": "manage" }
        ]
      }
    ],
    "permissions": [],
    "isTempPass": false
  }
}
```

### Old Format (still supported)

```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": 1,
    "userName": "john",
    "fullName": "John Doe",
    "role": "admin",
    "isTempPass": false
  }
}
```

The `normalizeUser()` function in `authStore.ts` handles both formats automatically. When the old format is received, it looks up the role in `ROLE_PERMISSIONS` to build the permissions array.

---

## Navigation Filtering

Nav items in `src/components/layouts/navbarData.ts` are configured with permission metadata:

```typescript
{
  title: "البيانات",
  url: "/data",
  icon: Database,
  permission: { resource: "data", action: "read" },  // User needs data:read to see this
}
```

Items without `permission` are visible to all authenticated users. The sidebar automatically filters based on the current user's permissions using `getFilteredNavbarDataByPermission()`.

---

## Adding New Resources and Actions

### Step 1: Add the resource type

In `src/types/permissions.ts`:

```typescript
export type Resource =
  | "dashboard"
  | "profile"
  // ... existing resources
  | "reports"      // ← add new resource
```

### Step 2: Add labels

In `src/types/permissions.ts`:

```typescript
export const RESOURCE_LABELS: Record<Resource, string> = {
  // ... existing labels
  reports: "التقارير",  // ← add label
}
```

### Step 3: Add permissions to roles

In `src/types/permissions.ts`:

```typescript
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: ALL_RESOURCES.map(r => ({ resource: r, action: "manage" })),
  editor: [
    // ... existing permissions
    { resource: "reports", action: "read" },
    { resource: "reports", action: "write" },
  ],
  viewer: [
    // ... existing permissions
    { resource: "reports", action: "read" },
  ],
}
```

### Step 4: Add nav item (if it has a page)

In `src/components/layouts/navbarData.ts`:

```typescript
{
  title: "التقارير",
  url: "/reports",
  icon: FileBarChart,
  permission: { resource: "reports", action: "read" },
}
```

### Step 5: Use in page component

```tsx
import { usePermissions } from "@/hooks/usePermissions"

function ReportsPage() {
  const { canRead, canWrite } = usePermissions()

  return (
    <div>
      {canRead("reports") && <ReportsList />}
      {canWrite("reports") && <CreateReportButton />}
    </div>
  )
}
```

---

## Adding New Roles

### Step 1: Define the role permissions

In `src/types/permissions.ts`:

```typescript
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  // ... existing roles
  auditor: [
    { resource: "dashboard", action: "read" },
    { resource: "data", action: "read" },
    { resource: "data-report", action: "read" },
    { resource: "data-report", action: "write" },
  ],
}
```

### Step 2: Add display label

```typescript
export const ROLE_LABELS: Record<string, string> = {
  // ... existing labels
  auditor: "المدقق",
}
```

### Step 3: Update middleware route access

In `src/middleware.ts`:

```typescript
const ROLE_ROUTE_ACCESS: Record<string, string[]> = {
  // ... existing roles
  auditor: ['/', '/profile', '/settings', '/data', '/data-report'],
}
```

---

## Complete Example: Data Page

```tsx
// src/app/(home)/data/page.tsx
"use client"

import { usePermissions } from "@/hooks/usePermissions"
import { PermissionGuard } from "@/components/common/permission-guard"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Download } from "lucide-react"

function DataActions() {
  const { canWrite, canDelete } = usePermissions()

  return (
    <div className="flex gap-2">
      {/* Using the hook */}
      {canWrite("data") && (
        <Button>
          <Plus className="h-4 w-4" />
          إضافة بيانات
        </Button>
      )}

      {/* Using PermissionGuard */}
      <PermissionGuard resource="data" action="delete">
        <Button variant="destructive">
          <Trash2 className="h-4 w-4" />
          حذف الكل
        </Button>
      </PermissionGuard>

      {/* Read-only users can still export */}
      <PermissionGuard
        resource="data"
        action="read"
        fallback={<span className="text-muted text-sm">لا توجد صلاحية تصدير</span>}
      >
        <Button variant="outline">
          <Download className="h-4 w-4" />
          تصدير
        </Button>
      </PermissionGuard>
    </div>
  )
}
```

---

## Complete Example: Table with Row-Level Actions

```tsx
import { PermissionGuard } from "@/components/common/permission-guard"

function DataTable({ data }: { data: DataRecord[] }) {
  return (
    <table>
      {data.map(row => (
        <tr key={row.id}>
          <td>{row.value}</td>
          <td>
            {/* Only show edit button if user can write data */}
            <PermissionGuard resource="data" action="write">
              <Button size="sm" variant="ghost" onClick={() => editRow(row.id)}>
                تعديل
              </Button>
            </PermissionGuard>

            {/* Only show delete button if user can delete data */}
            <PermissionGuard resource="data" action="delete">
              <Button size="sm" variant="ghost" onClick={() => deleteRow(row.id)}>
                حذف
              </Button>
            </PermissionGuard>
          </td>
        </tr>
      ))}
    </table>
  )
}
```

---

## Complete Example: Conditional Rendering with `canAny`

```tsx
import { usePermissions } from "@/hooks/usePermissions"

function DashboardActions() {
  const { canAny, can } = usePermissions()

  // Show export section if user can read data OR data-report
  const canExport = canAny([
    { resource: "data", action: "read" },
    { resource: "data-report", action: "read" },
  ])

  return (
    <div>
      {canExport && <ExportSection />}
      {can("data", "manage") && <AdminSection />}
    </div>
  )
}
```

---

## Migration Guide (Old → New)

### Before (role-based only)

```tsx
const { hasRole } = usePermissions()
if (hasRole("admin")) { ... }
```

### After (resource-action)

```tsx
const { can } = usePermissions()
if (can("data", "write")) { ... }
```

### Before (PermissionGuard with roles)

```tsx
<PermissionGuard allowedRoles={["admin"]}>
  <Content />
</PermissionGuard>
```

### After (PermissionGuard with resource-action)

```tsx
<PermissionGuard resource="data" action="manage">
  <Content />
</PermissionGuard>
```

Both old and new approaches work simultaneously. Migrate gradually.

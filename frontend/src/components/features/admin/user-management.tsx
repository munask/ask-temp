"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import {
  Users,
  Shield,
  Key,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  ShieldCheck,
  Lock,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { FormModal } from "@/components/common/form-modal"
import { TextField, SelectField } from "@/components/common/form-fields"
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog"
import { useConfirmModal } from "@/components/common/confirm-modal"
import { toast } from "sonner"
import { useApiData } from "@/hooks/useApi"
import type { AdminUser, AdminUserFormData, RoleFormData, AdminTab } from "./admin-types"
import type { Permission, Role, Resource, Action } from "@/types/permissions"
import {
  ROLE_PERMISSIONS,
  ROLE_LABELS,
  RESOURCE_LABELS,
  ACTION_LABELS,
} from "@/types/permissions"
import { hasPermission } from "@/lib/permissions"

// ─── Constants ──────────────────────────────────────────────────────────

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

const ALL_ACTIONS: Action[] = ["read", "write", "edit", "delete", "lock", "export", "import", "approve", "manage"]

// ─── Helper Functions ────────────────────────────────────────────────────

function permKey(p: Permission): string {
  return `${p.resource}:${p.action}`
}

function permFromKey(key: string): Permission {
  const [resource, action] = key.split(":") as [Resource, Action]
  return { resource, action }
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-[1.5px] h-5 rounded-full"
        style={{
          background:
            "linear-gradient(to bottom, var(--brand-gradient-b), var(--brand-gradient-c))",
        }}
      />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  )
}

// ─── Users Tab ───────────────────────────────────────────────────────────

function UsersTab({
  users,
  roles,
  onUpdateUser,
  onDeleteUser,
  onAddUser,
}: {
  users: AdminUser[]
  roles: Role[]
  onUpdateUser: (user: AdminUser) => void
  onDeleteUser: (id: number) => void
  onAddUser: (data: AdminUserFormData) => void
}) {
  const [search, setSearch] = useState("")
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [permUser, setPermUser] = useState<AdminUser | null>(null)
  const [directPerms, setDirectPerms] = useState<Permission[]>([])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.userName.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    )
  }, [users, search])

  const openAdd = () => {
    setIsAddOpen(true)
  }

  const openEdit = (user: AdminUser) => {
    setEditUser(user)
  }

  const openPermissions = (user: AdminUser) => {
    setDirectPerms([...user.permissions])
    setPermUser(user)
  }

  const savePermissions = () => {
    if (!permUser) return
    onUpdateUser({ ...permUser, permissions: directPerms })
    setPermUser(null)
    toast.success("تم تحديث صلاحيات المستخدم بنجاح")
  }

  const togglePerm = (resource: Resource, action: Action) => {
    setDirectPerms((prev) => {
      const key = `${resource}:${action}`
      if (prev.some((p) => permKey(p) === key)) {
        return prev.filter((p) => permKey(p) !== key)
      }
      return [...prev, { resource, action }]
    })
  }

  const roleOptions = roles.map((r) => ({
    value: r.id,
    label: r.displayName || r.name,
  }))

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث باسم المستخدم أو الاسم الكامل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-8 text-right"
          />
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 ml-1.5" />
          إضافة مستخدم
        </Button>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full" dir="rtl">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-right px-4 py-3 text-sm font-medium">الاسم الكامل</th>
              <th className="text-right px-4 py-3 text-sm font-medium">اسم المستخدم</th>
              <th className="text-right px-4 py-3 text-sm font-medium">الدور</th>
              <th className="text-right px-4 py-3 text-sm font-medium">الأدوار</th>
              <th className="text-right px-4 py-3 text-sm font-medium">الحالة</th>
              <th className="text-right px-4 py-3 text-sm font-medium w-40">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  لا يوجد مستخدمين
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{user.fullName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.userName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">
                      {ROLE_LABELS[user.role] || user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((r) => (
                          <Badge key={r.id} variant="outline" className="text-xs">
                            {ROLE_LABELS[r.id] || r.displayName || r.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.isTempPass ? (
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                        <Lock className="h-3 w-3 ml-1" />
                        كلمة مؤقتة
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                        <Check className="h-3 w-3 ml-1" />
                        نشط
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openPermissions(user)} title="الصلاحيات">
                        <Key className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(user)} title="تعديل">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(user)}
                        title="حذف"
                        disabled={user.id === 1}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-muted-foreground">
        {filtered.length} مستخدم
      </div>

      {/* Add User Modal */}
      <FormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={() => {
          toast.success("تمت إضافة المستخدم بنجاح")
          setIsAddOpen(false)
        }}
        title="إضافة مستخدم جديد"
        maxWidth="sm:max-w-[480px]"
      >
        <AddUserForm roles={roleOptions} />
      </FormModal>

      {/* Edit User Modal */}
      <FormModal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        onSubmit={() => {
          toast.success("تم تحديث المستخدم بنجاح")
          setEditUser(null)
        }}
        title="تعديل المستخدم"
        maxWidth="sm:max-w-[480px]"
      >
        {editUser && <EditUserForm user={editUser} roles={roleOptions} />}
      </FormModal>

      {/* Delete User Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteUser(deleteTarget.id)
            setDeleteTarget(null)
          }
        }}
        title="حذف المستخدم"
        message={`هل أنت متأكد من حذف المستخدم "${deleteTarget?.fullName}"؟`}
        itemName={deleteTarget?.userName}
      />

      {/* User Permissions Modal */}
      <FormModal
        isOpen={!!permUser}
        onClose={() => setPermUser(null)}
        onSubmit={savePermissions}
        title={`صلاحيات: ${permUser?.fullName}`}
        maxWidth="sm:max-w-[600px]"
      >
        <UserPermissionsForm
          permissions={directPerms}
          onToggle={togglePerm}
          userRoles={permUser?.roles ?? []}
          allRoles={roles}
        />
      </FormModal>
    </div>
  )
}

// ─── Add User Form ───────────────────────────────────────────────────────

function AddUserForm({ roles }: { roles: { value: string; label: string }[] }) {
  const [fullName, setFullName] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")

  return (
    <div className="space-y-3">
      <TextField label="الاسم الكامل" value={fullName} onChange={setFullName} placeholder="أدخل الاسم الكامل" required />
      <TextField label="اسم المستخدم" value={userName} onChange={setUserName} placeholder="أدخل اسم المستخدم" required />
      <TextField label="كلمة المرور المؤقتة" value={password} onChange={setPassword} placeholder="سيتم إنشاء كلمة مرور مؤقتة" type="password" />
      <SelectField label="الدور" value={roleId} onChange={setRoleId} options={roles} placeholder="اختر الدور" required />
    </div>
  )
}

// ─── Edit User Form ──────────────────────────────────────────────────────

function EditUserForm({ user, roles }: { user: AdminUser; roles: { value: string; label: string }[] }) {
  const [fullName, setFullName] = useState(user.fullName)
  const [roleId, setRoleId] = useState(user.role)

  return (
    <div className="space-y-3">
      <TextField label="الاسم الكامل" value={fullName} onChange={setFullName} />
      <div className="space-y-1">
        <Label>اسم المستخدم</Label>
        <Input value={user.userName} disabled className="text-right bg-muted" />
      </div>
      <SelectField label="الدور" value={roleId} onChange={setRoleId} options={roles} />
    </div>
  )
}

// ─── User Permissions Form ───────────────────────────────────────────────

function UserPermissionsForm({
  permissions,
  onToggle,
  userRoles,
  allRoles,
}: {
  permissions: Permission[]
  onToggle: (resource: Resource, action: Action) => void
  userRoles: Role[]
  allRoles: Role[]
}) {
  const inheritedPerms = useMemo(() => {
    return userRoles.flatMap((r) => {
      const match = allRoles.find((ar) => ar.id === r.id)
      return match?.permissions ?? []
    })
  }, [userRoles, allRoles])

  const directKeys = new Set(permissions.map(permKey))
  const inheritedKeys = new Set(inheritedPerms.map(permKey))

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        الصلاحيات الموروثة من الأدوار تظهر بلون رمادي. الصلاحيات المباشرة تظهر بلون أساسي.
      </div>

      <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
        <table className="w-full" dir="rtl">
          <thead className="sticky top-0 bg-muted">
            <tr>
              <th className="text-right px-3 py-2 text-xs font-medium">المورد</th>
              {ALL_ACTIONS.map((action) => (
                <th key={action} className="text-center px-2 py-2 text-xs font-medium w-20">
                  {ACTION_LABELS[action]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_RESOURCES.map((resource) => (
              <tr key={resource} className="border-t">
                <td className="px-3 py-2 text-sm font-medium">
                  {RESOURCE_LABELS[resource]}
                </td>
                {ALL_ACTIONS.map((action) => {
                  const key = `${resource}:${action}`
                  const isInherited = inheritedKeys.has(key)
                  const isDirect = directKeys.has(key)
                  const isChecked = isDirect || isInherited

                  return (
                    <td key={action} className="text-center px-2 py-2">
                      <div className="flex justify-center">
                        <Switch
                          checked={isChecked}
                          disabled={isInherited && !isDirect}
                          onCheckedChange={() => onToggle(resource, action)}
                          className={isInherited ? "opacity-60" : ""}
                        />
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Roles Tab ───────────────────────────────────────────────────────────

function RolesTab({
  roles,
  onUpdateRole,
  onDeleteRole,
  onAddRole,
}: {
  roles: Role[]
  onUpdateRole: (role: Role) => void
  onDeleteRole: (id: string) => void
  onAddRole: (data: RoleFormData) => void
}) {
  const [editRole, setEditRole] = useState<Role | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
  const [editPerms, setEditPerms] = useState<Permission[]>([])
  const [showPermsRole, setShowPermsRole] = useState<Role | null>(null)

  const openAdd = () => setIsAddOpen(true)

  const openEdit = (role: Role) => {
    setEditRole(role)
    setEditPerms([...role.permissions])
  }

  const openPerms = (role: Role) => {
    setEditPerms([...role.permissions])
    setShowPermsRole(role)
  }

  const togglePerm = (resource: Resource, action: Action) => {
    setEditPerms((prev) => {
      const key = `${resource}:${action}`
      if (prev.some((p) => permKey(p) === key)) {
        return prev.filter((p) => permKey(p) !== key)
      }
      return [...prev, { resource, action }]
    })
  }

  const saveRolePerms = () => {
    if (!showPermsRole) return
    onUpdateRole({ ...showPermsRole, permissions: editPerms })
    setShowPermsRole(null)
    toast.success("تم تحديث صلاحيات الدور بنجاح")
  }

  const saveEdit = () => {
    if (!editRole) return
    onUpdateRole({ ...editRole, permissions: editPerms })
    setEditRole(null)
    toast.success("تم تحديث الدور بنجاح")
  }

  const getUserCount = (roleId: string) => {
    // In a real app, this would come from the backend
    return 0
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {roles.length} دور معرف
        </p>
        <Button onClick={openAdd} size="sm">
          <Plus className="h-4 w-4 ml-1.5" />
          إضافة دور
        </Button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{role.displayName || role.name}</h3>
                    <Badge variant="outline" className="text-xs font-mono">
                      {role.id}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mr-7">
                    {role.permissions.length} صلاحية
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2 mr-7">
                    {role.permissions.length > 0 ? (
                      Array.from(
                        new Map(
                          role.permissions.map((p) => [
                            p.resource,
                            p.action === "manage"
                              ? ["قراءة", "كتابة", "حذف", "إدارة"]
                              : [ACTION_LABELS[p.action]],
                          ])
                        ).entries()
                      ).map(([resource, actions]) => (
                        <Badge key={resource} variant="secondary" className="text-xs">
                          {RESOURCE_LABELS[resource as Resource]}: {actions.join(", ")}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">لا توجد صلاحيات</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPerms(role)} title="تعديل الصلاحيات">
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(role)} title="تعديل الدور" disabled={role.id === "admin"}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(role)}
                    title="حذف"
                    disabled={role.id === "admin"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Role Modal */}
      <FormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={() => {
          toast.success("تمت إضافة الدور بنجاح")
          setIsAddOpen(false)
        }}
        title="إضافة دور جديد"
      >
        <div className="space-y-3">
          <TextField label="معرف الدور (ID)" placeholder="مثال: manager" required />
          <TextField label="اسم الدور" placeholder="مثال: مدير القسم" required />
        </div>
      </FormModal>

      {/* Edit Role Modal */}
      <FormModal
        isOpen={!!editRole}
        onClose={() => setEditRole(null)}
        onSubmit={saveEdit}
        title="تعديل الدور"
      >
        {editRole && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>معرف الدور (ID)</Label>
              <Input value={editRole.id} disabled className="text-right bg-muted" />
            </div>
            <TextField
              label="اسم الدور"
              value={editRole.displayName || editRole.name}
              onChange={(v) => setEditRole({ ...editRole, displayName: v, name: v })}
            />
          </div>
        )}
      </FormModal>

      {/* Role Permissions Modal */}
      <FormModal
        isOpen={!!showPermsRole}
        onClose={() => setShowPermsRole(null)}
        onSubmit={saveRolePerms}
        title={`صلاحيات الدور: ${showPermsRole?.displayName || showPermsRole?.name}`}
        maxWidth="sm:max-w-[600px]"
      >
        <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
          <table className="w-full" dir="rtl">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="text-right px-3 py-2 text-xs font-medium">المورد</th>
                {ALL_ACTIONS.map((action) => (
                  <th key={action} className="text-center px-2 py-2 text-xs font-medium w-20">
                    {ACTION_LABELS[action]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_RESOURCES.map((resource) => (
                <tr key={resource} className="border-t">
                  <td className="px-3 py-2 text-sm font-medium">
                    {RESOURCE_LABELS[resource]}
                  </td>
                  {ALL_ACTIONS.map((action) => {
                    const key = `${resource}:${action}`
                    const isChecked = editPerms.some((p) => permKey(p) === key)

                    return (
                      <td key={action} className="text-center px-2 py-2">
                        <div className="flex justify-center">
                          <Switch
                            checked={isChecked}
                            onCheckedChange={() => togglePerm(resource, action)}
                          />
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormModal>

      {/* Delete Role Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteRole(deleteTarget.id)
            setDeleteTarget(null)
          }
        }}
        title="حذف الدور"
        message={`هل أنت متأكد من حذف الدور "${deleteTarget?.displayName || deleteTarget?.name}"؟`}
        itemName={deleteTarget?.id}
      />
    </div>
  )
}

// ─── Permissions Overview Tab ────────────────────────────────────────────

function PermissionsOverviewTab({ roles }: { roles: Role[] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        نظرة عامة على جميع الصلاحيات لكل دور. استخدم تبويب الأدوار لتعديل الصلاحيات.
      </p>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[700px]" dir="rtl">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-right px-4 py-3 text-sm font-medium sticky right-0 bg-muted/50">المورد</th>
              {roles.map((role) => (
                <th key={role.id} className="text-center px-3 py-3 text-sm font-medium min-w-[120px]">
                  {role.displayName || role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_RESOURCES.map((resource) => (
              <tr key={resource} className="border-t">
                <td className="px-4 py-3 text-sm font-medium sticky right-0 bg-background">
                  {RESOURCE_LABELS[resource]}
                </td>
                {roles.map((role) => {
                  const hasManage = hasPermission(role.permissions, resource, "manage")
                  const hasWrite = hasPermission(role.permissions, resource, "write")
                  const hasDelete = hasPermission(role.permissions, resource, "delete")
                  const hasRead = hasPermission(role.permissions, resource, "read")

                  if (hasManage) {
                    return (
                      <td key={role.id} className="text-center px-3 py-3">
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          إدارة كاملة
                        </Badge>
                      </td>
                    )
                  }

                  const actions: string[] = []
                  if (hasRead) actions.push("قراءة")
                  if (hasWrite) actions.push("كتابة")
                  if (hasDelete) actions.push("حذف")

                  if (actions.length === 0) {
                    return (
                      <td key={role.id} className="text-center px-3 py-3">
                        <span className="text-xs text-muted-foreground">—</span>
                      </td>
                    )
                  }

                  return (
                    <td key={role.id} className="text-center px-3 py-3">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {actions.map((a) => (
                          <Badge key={a} variant="outline" className="text-xs">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Admin Component ────────────────────────────────────────────────

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users")

  // Roles API
  const {
    data: rolesData,
    loading: rolesLoading,
    post: postRole,
    put: putRole,
    delete: deleteRoleApi,
    refetch: refetchRoles,
  } = useApiData<Role[]>('/api/roles', { enableFetch: true, pagination: false })

  // Users API
  const {
    data: usersData,
    loading: usersLoading,
    post: postUser,
    put: putUser,
    delete: deleteUserApi,
    refetch: refetchUsers,
  } = useApiData<{ items: AdminUser[] }>('/api/auth/users', { enableFetch: true, pagination: true })

  // Refetch on tab switch to ensure fresh data
  useEffect(() => {
    if (activeTab === "users") refetchUsers()
    if (activeTab === "roles") refetchRoles()
  }, [activeTab])

  const roles: Role[] = Array.isArray(rolesData) ? rolesData : []
  const users: AdminUser[] =
    (usersData as { data?: { items?: AdminUser[] } } | null)?.data?.items ?? []

  const handleAddUser = useCallback(async (data: AdminUserFormData) => {
    try {
      await postUser({ data: { fullName: data.fullName, userName: data.userName, roleIds: data.roleIds }, customEndpoint: '/api/auth/register' })
      toast.success("تمت إضافة المستخدم بنجاح")
    } catch {
      toast.error("فشل في إضافة المستخدم")
    }
  }, [postUser])

  const handleUpdateUser = useCallback(async (updated: AdminUser) => {
    try {
      await putUser({ data: { fullName: updated.fullName, role: updated.role }, customEndpoint: `/api/auth/users/${updated.id}` })
      toast.success("تم تحديث المستخدم بنجاح")
    } catch {
      toast.error("فشل في تحديث المستخدم")
    }
  }, [putUser])

  const handleDeleteUser = useCallback(async (id: number) => {
    try {
      await deleteUserApi({ data: { id }, customEndpoint: `/api/auth/users/${id}` })
      toast.success("تم حذف المستخدم بنجاح")
    } catch {
      toast.error("فشل في حذف المستخدم")
    }
  }, [deleteUserApi])

  const handleAddRole = useCallback(async (data: RoleFormData) => {
    try {
      await postRole({ data: { name: data.name, displayName: data.displayName } })
      toast.success("تمت إضافة الدور بنجاح")
    } catch {
      toast.error("فشل في إضافة الدور")
    }
  }, [postRole])

  const handleUpdateRole = useCallback(async (updated: Role) => {
    try {
      await putRole({ data: { displayName: updated.displayName }, customEndpoint: `/api/roles/${updated.id}` })
      toast.success("تم تحديث الدور بنجاح")
    } catch {
      toast.error("فشل في تحديث الدور")
    }
  }, [putRole])

  const handleDeleteRole = useCallback(async (id: string) => {
    try {
      await deleteRoleApi({ customEndpoint: `/api/roles/${id}` })
      toast.success("تم حذف الدور بنجاح")
    } catch {
      toast.error("فشل في حذف الدور")
    }
  }, [deleteRoleApi])

  return (
    <div className="space-y-6" dir="rtl">
      {/* Title */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{
            background:
              "linear-gradient(to left, var(--brand-text-from), var(--brand-text-to))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          لوحة الإدارة
        </h1>
        <p className="mt-1 text-muted-foreground">
          إدارة المستخدمين والأدوار والصلاحيات
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            {usersLoading ? (
              <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /><span className="text-sm text-muted-foreground">جاري التحميل...</span></div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">مستخدم</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            {rolesLoading ? (
              <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /><span className="text-sm text-muted-foreground">جاري التحميل...</span></div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{roles.length}</p>
                  <p className="text-xs text-muted-foreground">دور</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            {rolesLoading ? (
              <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Key className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(roles.flatMap((r) => r.permissions?.map((p) => p.resource) ?? [])).size}
                  </p>
                  <p className="text-xs text-muted-foreground">مورد مع صلاحيات</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)}>
        <TabsList>
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="h-4 w-4" />
            المستخدمين
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5">
            <Shield className="h-4 w-4" />
            الأدوار
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-1.5">
            <Key className="h-4 w-4" />
            الصلاحيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab
            users={users}
            roles={roles}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onAddUser={handleAddUser}
          />
        </TabsContent>

        <TabsContent value="roles">
          <RolesTab
            roles={roles}
            onUpdateRole={handleUpdateRole}
            onDeleteRole={handleDeleteRole}
            onAddRole={handleAddRole}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsOverviewTab roles={roles} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

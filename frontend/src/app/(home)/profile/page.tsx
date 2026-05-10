"use client"

import { useState, use } from "react"
import { ShieldCheck, Loader2, Lock, Eye, ChevronDown, ChevronUp, User, Shield, Clock, KeyRound } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth/authStore"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { ROLE_LABELS, RESOURCE_LABELS, ACTION_LABELS } from "@/types/permissions"
import type { Resource, Action } from "@/types/permissions"

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

function StatPill({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="profile-stat-pill flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2 transition-all hover:shadow-sm hover:-translate-y-0.5">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg"
        style={{
          background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
        }}
      >
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
        <p className="mt-0.5 text-sm font-semibold leading-none">{value}</p>
      </div>
    </div>
  )
}

interface PermissionRowProps {
  resource: Resource
  actions: Action[]
  index: number
}

const RESOURCE_COLORS: Partial<Record<Resource, string>> = {
  dashboard:    "border-l-[oklch(0.55_0.15_192)]",
  profile:      "border-l-[oklch(0.65_0.19_155)]",
  settings:     "border-l-[oklch(0.78_0.16_75)]",
  data:         "border-l-[oklch(0.28_0.09_240)]",
  "data-report":"border-l-[oklch(0.55_0.15_192)]",
  showcase:     "border-l-[oklch(0.72_0.16_185)]",
  users:        "border-l-[oklch(0.577_0.245_27.325)]",
  roles:        "border-l-[oklch(0.78_0.16_75)]",
  permissions:  "border-l-[oklch(0.55_0.15_192)]",
}

function PermissionRow({ resource, actions, index }: PermissionRowProps) {
  return (
    <div
      className={`profile-perm-row flex items-center justify-between rounded-lg border border-r-0 border-t-0 border-b-0 bg-card p-3 pr-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${RESOURCE_COLORS[resource] ?? "border-l-muted-foreground"} border-l-2`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className="text-sm font-medium">
        {RESOURCE_LABELS[resource] || resource}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((action) => (
          <Badge key={action} variant="secondary" className="text-[10px] px-2 py-0.5">
            {ACTION_LABELS[action] || action}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default function ProfilePage({
  params: paramsPromise,
}: {
  params: Promise<Record<string, string | string[]>>;
}) {
  use(paramsPromise)
  const { user } = useAuthStore()
  const { changePassword, loading } = useAuth()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPermissions, setShowPermissions] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!currentPassword) newErrors.currentPassword = "كلمة المرور الحالية مطلوبة"
    if (!newPassword) newErrors.newPassword = "كلمة المرور الجديدة مطلوبة"
    if (newPassword && newPassword.length < 6)
      newErrors.newPassword = "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "كلمة المرور غير متطابقة"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await changePassword({
        data: { currentPassword, newPassword },
        onSuccess: () => {
          toast.success("تم تغيير كلمة المرور بنجاح")
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          setErrors({})
        },
        onError: () => {
          toast.error("فشل في تغيير كلمة المرور")
        },
      })
    } catch {
      // handled by onError
    }
  }

  const userName = user?.userName ?? ""
  const fullName = user?.fullName ?? ""
  const role = user?.role ?? ""
  const initial = fullName?.charAt(0)?.toUpperCase() || "U"

  // Collect unique resource-action pairs for display
  const userPermissions = user?.permissions ?? []
  const rolePermissions = user?.roles?.flatMap(r => r.permissions ?? []) ?? []
  const allPerms = [...rolePermissions, ...userPermissions]

  // Deduplicate by resource+action
  const uniquePerms = Array.from(
    new Map(allPerms.map(p => [`${p.resource}:${p.action}`, p])).values()
  )

  // Group by resource
  const permsByResource = new Map<Resource, Action[]>()
  for (const p of uniquePerms) {
    const existing = permsByResource.get(p.resource) ?? []
    if (p.action === "manage") {
      existing.push("read", "write", "delete", "manage")
    } else {
      existing.push(p.action)
    }
    permsByResource.set(p.resource, [...new Set(existing)])
  }

  const roleCount = user?.roles?.length ?? 0
  const permCount = uniquePerms.length
  const lastLogin = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—"

  return (
    <div className="flex flex-col gap-8 p-6">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ring-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.04); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25%       { transform: translateX(-4px); }
          75%       { transform: translateX(4px); }
        }
        @keyframes unlock-spin {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-15deg); }
          75%  { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
        .fade-in-up { animation: fade-in-up 0.5s ease-out both; }
        .avatar-ring { animation: ring-pulse 3s ease-in-out infinite; }
        .btn-shimmer {
          background-size: 200% auto;
          transition: box-shadow 0.25s ease, background-position 0.3s ease;
        }
        .btn-shimmer:hover {
          background-image: linear-gradient(
            90deg,
            oklch(0.28 0.09 240 / 0) 0%,
            oklch(0.28 0.09 240 / 0.3) 50%,
            oklch(0.28 0.09 240 / 0) 100%
          );
          box-shadow: 0 4px 20px oklch(0.28 0.09 240 / 0.2);
          animation: shimmer 1.2s ease-in-out infinite;
        }
        .dark .btn-shimmer:hover {
          background-image: linear-gradient(
            90deg,
            oklch(0.72 0.16 185 / 0) 0%,
            oklch(0.72 0.16 185 / 0.35) 50%,
            oklch(0.72 0.16 185 / 0) 100%
          );
          box-shadow: 0 4px 20px oklch(0.72 0.16 185 / 0.25);
        }
        .error-shake { animation: shake 0.3s ease-in-out; }
        .unlock-anim { animation: unlock-spin 0.4s ease-in-out; }
        .perm-row { animation: fade-in-up 0.4s ease-out both; }
      `}</style>

      {/* Page title */}
      <div className="fade-in-up" style={{ animationDelay: "0ms" }}>
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
          الملف الشخصي
        </h1>
        <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
          <span>إدارة حسابك وتخصيص تجربتك</span>
        </div>
      </div>

      {/* ── Hero Profile Card ── */}
      <div
        className="fade-in-up rounded-2xl border bg-card p-6 relative overflow-hidden"
        style={{
          animationDelay: "80ms",
          background: "linear-gradient(145deg, var(--card), oklch(0.91 0.025 192 / 0.06))",
        }}
      >
        {/* Ambient glow blobs — dark: dimmer, lighter chroma */}
        <div
          className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--brand-gradient-a), transparent 70%)",
            filter: "blur(24px)",
            opacity: 0.25,
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--brand-gradient-b), transparent 70%)",
            filter: "blur(20px)",
            opacity: 0.2,
          }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full hidden dark:block"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.16 185 / 0.08), transparent 70%)",
            filter: "blur(32px)",
          }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar + ring */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <div className="relative">
              {/* Outer pulse ring — dimmed in dark mode via .profile-avatar-ring */}
              <div
                className="profile-avatar-ring avatar-ring absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b), var(--brand-gradient-c))",
                  transform: "scale(1.15)",
                  filter: "blur(8px)",
                }}
              />
              {/* Main avatar */}
              <div
                className="relative flex h-24 w-24 items-center justify-center rounded-full text-white text-3xl font-bold shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
                }}
              >
                {initial}
              </div>
            </div>

            {/* Name + username + role */}
            <div className="text-center sm:text-right">
              <h2 className="text-xl font-bold leading-tight">{fullName || "—"}</h2>
              <p className="text-sm text-muted-foreground">@{userName || "—"}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1"
                >
                  <ShieldCheck className="h-3 w-3" />
                  {ROLE_LABELS[role] || role || "—"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-border mx-2" />

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 sm:flex-1 sm:justify-end">
            <StatPill icon={KeyRound}     label="الصلاحيات"    value={String(permCount)} />
            <StatPill icon={Shield}       label="الأدوار"      value={String(roleCount || "—")} />
            <StatPill
              icon={Clock}
              label="آخر نشاط"
              value={lastLogin}
            />
          </div>
        </div>
      </div>

      {/* ── Two-column lower section ── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* ── Permissions Card ── */}
        <div className="fade-in-up lg:col-span-2" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="الصلاحيات" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPermissions(!showPermissions)}
              className="gap-1.5"
            >
              {showPermissions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {showPermissions ? "إخفاء" : "عرض الصلاحيات"}
            </Button>
          </div>

          {showPermissions ? (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {permsByResource.size === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground text-center">
                    لا توجد صلاحيات محددة (الوصول الافتراضي حسب الدور)
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {Array.from(permsByResource.entries()).map(([resource, actions], i) => (
                      <PermissionRow
                        key={resource}
                        resource={resource}
                        actions={actions}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-8 px-4">
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
                }}
              >
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                اضغط على "عرض الصلاحيات" لرؤية صلاحياتك
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {permsByResource.size} مورد / {permCount} صلاحية
              </p>
            </Card>
          )}
        </div>

        {/* ── Change Password Card ── */}
        <div className="fade-in-up lg:col-span-3" style={{ animationDelay: "240ms" }}>
          <SectionHeader title="تغيير كلمة المرور" />
          <Card className="mt-4">
            <CardHeader className="pb-4">
              <div className="profile-card-info-banner flex items-center gap-2.5 rounded-xl border bg-muted/30 px-4 py-3">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
                  }}
                >
                  <Lock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">أمان الحساب</p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-none">
                    استخدم كلمة مرور قوية تتكون من 6 أحرف على الأقل
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Row 1: current password (full width) */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value)
                      if (errors.currentPassword)
                        setErrors((prev) => ({ ...prev, currentPassword: "" }))
                    }}
                    placeholder="أدخل كلمة المرور الحالية"
                    className={errors.currentPassword ? "border-red-500 error-shake" : ""}
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-destructive">{errors.currentPassword}</p>
                  )}
                </div>

                {/* Row 2: new + confirm in two columns */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        if (errors.newPassword)
                          setErrors((prev) => ({ ...prev, newPassword: "" }))
                      }}
                      placeholder="6 أحرف على الأقل"
                      className={errors.newPassword ? "border-red-500 error-shake" : ""}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-destructive">{errors.newPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (errors.confirmPassword)
                          setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                      }}
                      placeholder="أعد إدخال كلمة المرور"
                      className={errors.confirmPassword ? "border-red-500 error-shake" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={loading.changePassword}
                    className="btn-shimmer bg-primary text-primary-foreground gap-2"
                  >
                    {loading.changePassword ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    تغيير كلمة المرور
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

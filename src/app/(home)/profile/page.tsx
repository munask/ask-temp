"use client"

import { useState } from "react"
import { ShieldCheck, Loader2, Lock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/auth/authStore"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

const ROLE_LABELS: Record<string, string> = {
  admin: "مسؤول",
  personalinfo: "الاضابير الشخصية",
  staff: "الملاكات",
  fingerprints: "البصمة",
  vacations: "إدارة الإجازات والغيابات",
  promotions: "العلاوات والترفيعات",
  data: "البيانات",
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

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { changePassword, loading } = useAuth()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  return (
    <div className="flex max-w-3xl flex-col gap-8 p-6">
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
          الملف الشخصي
        </h1>
        <p className="mt-1 text-muted-foreground">
          معلومات حسابك وإعدادات الأمان
        </p>
      </div>

      {/* User Info Card */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="معلومات المستخدم" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl text-white text-2xl font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
                }}
              >
                {initial}
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">الاسم الكامل</p>
                    <p className="font-medium">{fullName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">اسم المستخدم</p>
                    <p className="font-medium">{userName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">الدور</p>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <p className="font-medium">
                        {ROLE_LABELS[role] || role || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Change Password Card */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="تغيير كلمة المرور" />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>قم بتغيير كلمة المرور الخاصة بك للحفاظ على أمان حسابك</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
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
                  className={
                    errors.currentPassword ? "border-red-500" : ""
                  }
                />
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="أدخل كلمة المرور الجديدة"
                    className={
                      errors.newPassword ? "border-red-500" : ""
                    }
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {errors.newPassword}
                    </p>
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
                    className={
                      errors.confirmPassword ? "border-red-500" : ""
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={loading.changePassword}
                >
                  {loading.changePassword && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                  تغيير كلمة المرور
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

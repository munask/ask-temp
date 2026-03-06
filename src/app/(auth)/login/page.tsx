"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, TrendingUp, ShieldCheck, Loader2, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth/authStore";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/store/auth/authValidation";
import type { User, ChangePasswordData } from "@/store/auth/authTypes";
import { toast } from "sonner";

const features = [
  { icon: Users, text: "إدارة السجلات والبيانات بكفاءة عالية" },
  { icon: TrendingUp, text: "تقارير وتحليلات متعمقة وشاملة" },
  { icon: ShieldCheck, text: "أمان بيانات على مستوى المؤسسة" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { login, changePassword, loading } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({ userName: "", password: "" });
  const [changePasswordData, setChangePasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");

  const handleInputChange =
    (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handlePasswordChange =
    (field: keyof ChangePasswordData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setChangePasswordData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const formErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) formErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formErrors);
      return;
    }
    try {
      await login({
        data: formData,
        onSuccess: (response: unknown) => {
          const responseData = (response as Record<string, unknown>).data || response;
          const { access_token, user } = responseData as Record<string, unknown>;
          const typedUser = user as User;
          const typedToken = access_token as string;
          if (typedUser.isTempPass) {
            setLoggedInUser(typedUser);
            setAccessToken(typedToken);
            setChangePasswordData({ currentPassword: formData.password, newPassword: "" });
            setShowChangePassword(true);
            setErrors({});
          } else {
            setAuth(typedUser, typedToken);
            router.push("/");
          }
        },
        onError: () => {
          toast.error("فشل في تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.");
        },
      });
    } catch {
      // handled by onError
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePasswordData.newPassword.trim()) {
      setErrors({ newPassword: "كلمة المرور الجديدة مطلوبة" });
      return;
    }
    if (changePasswordData.newPassword.length < 6) {
      setErrors({ newPassword: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      return;
    }
    if (loggedInUser && accessToken) setAuth(loggedInUser, accessToken);
    try {
      await changePassword({
        data: changePasswordData,
        onSuccess: () => {
          toast.success("تم تغيير كلمة المرور بنجاح!");
          if (loggedInUser && accessToken) {
            setAuth(loggedInUser, accessToken);
            router.push("/");
          }
        },
        onError: () => {
          toast.error("فشل في تغيير كلمة المرور. يرجى المحاولة مرة أخرى.");
        },
      });
    } catch {
      // handled by onError
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* ── Left decorative panel ───────────────────────────────────── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-5/12 flex-col"
        style={{
          background:
            "linear-gradient(145deg, var(--brand-gradient-a), var(--brand-gradient-c))",
        }}
      >
        {/* Orbs */}
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--brand-orb-1), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 h-80 w-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, var(--brand-orb-2), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--brand-gradient-b), transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-gradient-b), var(--brand-gradient-a))",
              }}
            >
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">نظام الإدارة</span>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-5">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-white/80" />
                </div>
                <span className="text-sm text-white/80">{text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-xs text-white/45">
            نظام الإدارة — منصة متكاملة لإدارة البيانات والسجلات
          </p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────── */}
      <div className="relative flex w-full items-center justify-center bg-background p-6 lg:w-7/12">
        {/* Dot grid overlay */}
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />

        <Card className="relative z-10 w-full max-w-md shadow-xl">
          {!showChangePassword ? (
            /* ── Login form ── */
            <>
              <CardHeader className="items-center text-center">
                <div
                  className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
                  }}
                >
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
                <CardDescription>
                  أدخل بياناتك للوصول إلى لوحة التحكم
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="userName">اسم المستخدم</Label>
                    <Input
                      id="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handleInputChange("userName")}
                      placeholder="أدخل اسم المستخدم"
                      className={errors.userName ? "border-red-500" : ""}
                    />
                    {errors.userName && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.userName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      placeholder="أدخل كلمة المرور"
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full text-base font-semibold text-white shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
                    }}
                    disabled={loading.login}
                  >
                    {loading.login && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    تسجيل الدخول
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            /* ── Change temp password ── */
            <>
              <CardHeader className="items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <Lock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-2xl font-bold">تغيير كلمة المرور المؤقتة</CardTitle>
                <CardDescription>
                  مرحباً {loggedInUser?.fullName}، يجب تغيير كلمة المرور المؤقتة قبل المتابعة
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-4 flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    كلمة المرور الحالية مؤقتة ويجب تغييرها لأسباب أمنية
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={changePasswordData.currentPassword}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      كلمة المرور المؤقتة التي استخدمتها لتسجيل الدخول
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={changePasswordData.newPassword}
                      onChange={handlePasswordChange("newPassword")}
                      placeholder="أدخل كلمة المرور الجديدة"
                      className={errors.newPassword ? "border-red-500" : ""}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      يجب أن تكون كلمة المرور 6 أحرف على الأقل
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full text-base font-semibold text-white shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
                    }}
                    disabled={loading.changePassword}
                  >
                    {loading.changePassword && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                    تغيير كلمة المرور والمتابعة
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

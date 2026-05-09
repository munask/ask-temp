"use client"

import * as React from "react"
import { Check, ChevronLeft, ChevronRight, User, Building2, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common/page-header"
import { toastSuccess } from "@/components/common/toast-wrapper"

const STEPS = [
  { id: 1, title: "المعلومات الشخصية", icon: User },
  { id: 2, title: "بيانات العمل", icon: Building2 },
  { id: 3, title: "المستندات", icon: FileText },
  { id: 4, title: "التأكيد", icon: Sparkles },
] as const

export default function StepperFormPage({
  params: paramsPromise,
}: {
  params: Promise<Record<string, string | string[]>>;
}) {
  React.use(paramsPromise);
  const [currentStep, setCurrentStep] = React.useState(1)
  const [direction, setDirection] = React.useState<"forward" | "back">("forward")

  // Form state
  const [formData, setFormData] = React.useState({
    fullName: "", nationalId: "", email: "", phone: "",
    department: "", position: "", branch: "", startDate: "",
    notes: "", agreeTerms: false,
  })

  const updateField = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const goTo = (step: number) => {
    setDirection(step > currentStep ? "forward" : "back")
    setCurrentStep(step)
  }

  const handleSubmit = () => {
    toastSuccess("تم إرسال النموذج بنجاح!")
    goTo(1)
    setFormData({
      fullName: "", nationalId: "", email: "", phone: "",
      department: "", position: "", branch: "", startDate: "",
      notes: "", agreeTerms: false,
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="نموذج متعدد الخطوات"
        description="نمط الخطوات المتتالية (Wizard/Stepper) - مناسب للنماذج الطويلة والمعقدة"
      />

      <Card className="overflow-hidden">
        {/* Stepper header */}
        <div className="border-b bg-muted/30 px-6 py-5">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const Icon = step.icon
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => isCompleted && goTo(step.id)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isCompleted
                        ? "text-primary hover:bg-primary/10 cursor-pointer"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                        isActive
                          ? "bg-primary-foreground text-primary"
                          : isCompleted
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <Check className="size-4" /> : step.id}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium">{step.title}</div>
                      <div className="text-[11px] opacity-70">الخطوة {step.id} من {STEPS.length}</div>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={`hidden md:block flex-1 h-[2px] mx-2 rounded-full transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">التقدم</span>
              <Badge variant="outline">{Math.round((currentStep / STEPS.length) * 100)}%</Badge>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(currentStep / STEPS.length) * 100}%`,
                  background: "linear-gradient(90deg, var(--brand-gradient-a), var(--brand-gradient-b))",
                }}
              />
            </div>
          </div>

          {/* Step content with animation */}
          <div
            key={currentStep}
            className="animate-in fade-in duration-300"
            style={{
              animationDirection: direction === "back" ? "reverse" : "normal",
            }}
          >
            {currentStep === 1 && (
              <StepPersonalInfo formData={formData} updateField={updateField} />
            )}
            {currentStep === 2 && (
              <StepWorkInfo formData={formData} updateField={updateField} />
            )}
            {currentStep === 3 && (
              <StepDocuments formData={formData} updateField={updateField} />
            )}
            {currentStep === 4 && (
              <StepConfirmation formData={formData} />
            )}
          </div>

          <Separator className="my-6" />

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => goTo(currentStep - 1)}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronRight className="size-4" />
              السابق
            </Button>

            <div className="flex gap-1.5">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className={`size-2 rounded-full transition-all ${
                    currentStep === s.id
                      ? "bg-primary w-6"
                      : currentStep > s.id
                      ? "bg-primary/50"
                      : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            {currentStep < STEPS.length ? (
              <Button onClick={() => goTo(currentStep + 1)} className="gap-2">
                التالي
                <ChevronLeft className="size-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-2">
                <Sparkles className="size-4" />
                إرسال النموذج
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Step Components ────────────────────────────────────────────── */

function StepPersonalInfo({
  formData,
  updateField,
}: {
  formData: Record<string, string | boolean>
  updateField: (f: string, v: string | boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">المعلومات الشخصية</h3>
        <p className="text-sm text-muted-foreground mt-1">
          أدخل بياناتك الشخصية الأساسية
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">الاسم الكامل *</Label>
          <Input
            id="fullName"
            value={formData.fullName as string}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="أدخل الاسم الكامل"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalId">رقم الهوية *</Label>
          <Input
            id="nationalId"
            value={formData.nationalId as string}
            onChange={(e) => updateField("nationalId", e.target.value)}
            placeholder="أدخل رقم الهوية"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={formData.email as string}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="example@domain.com"
            dir="ltr"
            className="text-left"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone as string}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="07XX XXX XXXX"
            dir="ltr"
            className="text-left"
          />
        </div>
      </div>
    </div>
  )
}

function StepWorkInfo({
  formData,
  updateField,
}: {
  formData: Record<string, string | boolean>
  updateField: (f: string, v: string | boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">بيانات العمل</h3>
        <p className="text-sm text-muted-foreground mt-1">
          معلومات الوظيفة والقسم
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>القسم *</Label>
          <Select
            value={formData.department as string}
            onValueChange={(v) => updateField("department", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="it">تقنية المعلومات</SelectItem>
              <SelectItem value="hr">الموارد البشرية</SelectItem>
              <SelectItem value="finance">المالية</SelectItem>
              <SelectItem value="operations">العمليات</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>المسمى الوظيفي *</Label>
          <Select
            value={formData.position as string}
            onValueChange={(v) => updateField("position", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المسمى" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">مدير</SelectItem>
              <SelectItem value="developer">مطور</SelectItem>
              <SelectItem value="analyst">محلل</SelectItem>
              <SelectItem value="designer">مصمم</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>الفرع</Label>
          <Select
            value={formData.branch as string}
            onValueChange={(v) => updateField("branch", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الفرع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">الفرع الرئيسي</SelectItem>
              <SelectItem value="north">فرع الشمال</SelectItem>
              <SelectItem value="south">فرع الجنوب</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">تاريخ البدء</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate as string}
            onChange={(e) => updateField("startDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function StepDocuments({
  formData,
  updateField,
}: {
  formData: Record<string, string | boolean>
  updateField: (f: string, v: string | boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">المستندات والملاحظات</h3>
        <p className="text-sm text-muted-foreground mt-1">
          أضف أي ملاحظات إضافية أو مستندات داعمة
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="notes">ملاحظات إضافية</Label>
          <Textarea
            id="notes"
            value={formData.notes as string}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="أدخل أي ملاحظات أو تعليمات خاصة..."
            rows={5}
          />
        </div>

        <div className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50">
          <FileText className="mx-auto size-10 text-muted-foreground/60" />
          <p className="mt-3 text-sm font-medium">اسحب الملفات هنا أو انقر للرفع</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG حتى 10MB</p>
        </div>

        <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
          <input
            type="checkbox"
            checked={formData.agreeTerms as boolean}
            onChange={(e) => updateField("agreeTerms", e.target.checked)}
            className="size-4 rounded border-muted-foreground/30"
          />
          <span className="text-sm">
            أوافق على الشروط والأحكام وسياسة الخصوصية *
          </span>
        </label>
      </div>
    </div>
  )
}

function StepConfirmation({ formData }: { formData: Record<string, string | boolean> }) {
  const sections = [
    {
      title: "المعلومات الشخصية",
      items: [
        { label: "الاسم الكامل", value: formData.fullName },
        { label: "رقم الهوية", value: formData.nationalId },
        { label: "البريد الإلكتروني", value: formData.email },
        { label: "رقم الهاتف", value: formData.phone },
      ],
    },
    {
      title: "بيانات العمل",
      items: [
        { label: "القسم", value: formData.department },
        { label: "المسمى الوظيفي", value: formData.position },
        { label: "الفرع", value: formData.branch },
        { label: "تاريخ البدء", value: formData.startDate },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">تأكيد البيانات</h3>
        <p className="text-sm text-muted-foreground mt-1">
          راجع البيانات المدخلة قبل الإرسال
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border bg-muted/20 p-5">
            <h4 className="text-sm font-semibold mb-3 text-primary">{section.title}</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                <div key={item.label}>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <p className="text-sm font-medium mt-0.5">
                    {(item.value as string) || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {formData.notes && (
          <div className="rounded-xl border bg-muted/20 p-5">
            <h4 className="text-sm font-semibold mb-2 text-primary">الملاحظات</h4>
            <p className="text-sm text-muted-foreground">{formData.notes as string}</p>
          </div>
        )}
      </div>
    </div>
  )
}

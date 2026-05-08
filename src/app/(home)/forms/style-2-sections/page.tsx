"use client"

import * as React from "react"
import {
  ChevronDown,
  User,
  Building2,
  FileText,
  CreditCard,
  ShieldCheck,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/common/page-header"
import { toastSuccess } from "@/components/common/toast-wrapper"

interface SectionConfig {
  id: string
  title: string
  description: string
  icon: React.ElementType
  required: boolean
}

const SECTIONS: SectionConfig[] = [
  { id: "personal", title: "المعلومات الشخصية", description: "البيانات الأساسية للشخص", icon: User, required: true },
  { id: "work", title: "بيانات العمل", description: "معلومات الوظيفة والقسم", icon: Building2, required: true },
  { id: "documents", title: "المستندات المرفقة", description: "المستندات والشهادات", icon: FileText, required: false },
  { id: "payment", title: "معلومات الدفع", description: "بيانات الفوترة والدفع", icon: CreditCard, required: false },
  { id: "security", title: "الأمان والخصوصية", description: "إعدادات الأمان", icon: ShieldCheck, required: true },
]

export default function SectionsFormPage() {
  const [openSections, setOpenSections] = React.useState<Set<string>>(
    new Set(["personal"])
  )

  const [formData, setFormData] = React.useState({
    fullName: "", nationalId: "", email: "", phone: "", dob: "",
    department: "", position: "", branch: "", manager: "",
    documentType: "", documentNotes: "",
    paymentMethod: "", accountNumber: "", bankName: "",
    twoFactor: false, notifications: true, dataSharing: false,
  })

  const updateField = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const completedSections = React.useMemo(() => {
    const completed = new Set<string>()
    if (formData.fullName && formData.nationalId) completed.add("personal")
    if (formData.department && formData.position) completed.add("work")
    if (formData.paymentMethod) completed.add("payment")
    if (formData.twoFactor !== undefined) completed.add("security")
    return completed
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toastSuccess("تم حفظ النموذج بنجاح!")
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="نموذج بأقسام قابلة للطي"
        description="نمط الصفحة الواحدة مع أقسام قابلة للفتح والإغلاق - مناسب للنماذج المتوسطة"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              {completedSections.size} من {SECTIONS.length} مكتمل
            </Badge>
            <Button type="submit" form="sections-form" className="gap-2">
              <Send className="size-4" />
              حفظ النموذج
            </Button>
          </div>
        }
      />

      <form id="sections-form" onSubmit={handleSubmit} className="space-y-3">
        {SECTIONS.map((section, index) => {
          const isOpen = openSections.has(section.id)
          const isCompleted = completedSections.has(section.id)
          const Icon = section.icon

          return (
            <Card
              key={section.id}
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? "ring-1 ring-primary/20" : ""
              }`}
            >
              {/* Section header - clickable */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between p-5 text-right hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg ${
                      isCompleted
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <ShieldCheck className="size-5" />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{section.title}</span>
                      {section.required && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          مطلوب
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`size-5 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Section content - collapsible */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <Separator />
                  <CardContent className="p-5 pt-5">
                    {section.id === "personal" && (
                      <PersonalSection formData={formData} updateField={updateField} />
                    )}
                    {section.id === "work" && (
                      <WorkSection formData={formData} updateField={updateField} />
                    )}
                    {section.id === "documents" && (
                      <DocumentsSection formData={formData} updateField={updateField} />
                    )}
                    {section.id === "payment" && (
                      <PaymentSection formData={formData} updateField={updateField} />
                    )}
                    {section.id === "security" && (
                      <SecuritySection formData={formData} updateField={updateField} />
                    )}
                  </CardContent>
                </div>
              </div>
            </Card>
          )
        })}
      </form>
    </div>
  )
}

/* ─── Section Components ───────────────────────────────────────── */

function PersonalSection({
  formData,
  updateField,
}: {
  formData: Record<string, string | boolean>
  updateField: (f: string, v: string | boolean) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="s-fullName">الاسم الكامل *</Label>
        <Input id="s-fullName" value={formData.fullName as string} onChange={(e) => updateField("fullName", e.target.value)} placeholder="الاسم الثلاثي" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-nationalId">رقم الهوية *</Label>
        <Input id="s-nationalId" value={formData.nationalId as string} onChange={(e) => updateField("nationalId", e.target.value)} placeholder="رقم الهوية الوطنية" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-email">البريد الإلكتروني</Label>
        <Input id="s-email" type="email" value={formData.email as string} onChange={(e) => updateField("email", e.target.value)} placeholder="email@example.com" dir="ltr" className="text-left" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-phone">رقم الهاتف</Label>
        <Input id="s-phone" type="tel" value={formData.phone as string} onChange={(e) => updateField("phone", e.target.value)} placeholder="07XX XXX XXXX" dir="ltr" className="text-left" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-dob">تاريخ الميلاد</Label>
        <Input id="s-dob" type="date" value={formData.dob as string} onChange={(e) => updateField("dob", e.target.value)} />
      </div>
    </div>
  )
}

function WorkSection({
  formData,
  updateField,
}: {
  formData: Record<string, string | boolean>
  updateField: (f: string, v: string | boolean) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>القسم *</Label>
        <Select value={formData.department as string} onValueChange={(v) => updateField("department", v)}>
          <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="it">تقنية المعلومات</SelectItem>
            <SelectItem value="hr">الموارد البشرية</SelectItem>
            <SelectItem value="finance">المالية</SelectItem>
            <SelectItem value="operations">العمليات</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>المسمى الوظيفي *</Label>
        <Select value={formData.position as string} onValueChange={(v) => updateField("position", v)}>
          <SelectTrigger><SelectValue placeholder="اختر المسمى" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="manager">مدير</SelectItem>
            <SelectItem value="developer">مطور</SelectItem>
            <SelectItem value="analyst">محلل</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>الفرع</Label>
        <Select value={formData.branch as string} onValueChange={(v) => updateField("branch", v)}>
          <SelectTrigger><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="main">الرئيسي</SelectItem>
            <SelectItem value="north">الشمال</SelectItem>
            <SelectItem value="south">الجنوب</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-manager">المدير المباشر</Label>
        <Input id="s-manager" value={formData.manager as string} onChange={(e) => updateField("manager", e.target.value)} placeholder="اسم المدير" />
      </div>
    </div>
  )
}

function DocumentsSection({
  formData,
  updateField,
}: {
  formData: Record<string, string | boolean>
  updateField: (f: string, v: string | boolean) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>نوع المستند</Label>
          <Select value={formData.documentType as string} onValueChange={(v) => updateField("documentType", v)}>
            <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="certificate">شهادة علمية</SelectItem>
              <SelectItem value="experience">خبرة عملية</SelectItem>
              <SelectItem value="id">وثيقة هوية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-6 text-center">
        <FileText className="mx-auto size-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">اسحب الملفات هنا أو انقر للرفع</p>
      </div>
      <div className="space-y-1.5">
        <Label>ملاحظات على المستندات</Label>
        <Textarea value={formData.documentNotes as string} onChange={(e) => updateField("documentNotes", e.target.value)} placeholder="أضف ملاحظات..." rows={3} />
      </div>
    </div>
  )
}

function PaymentSection({
  formData,
  updateField,
}: {
  formData: Record<string, string | boolean>
  updateField: (f: string, v: string | boolean) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>طريقة الدفع</Label>
        <Select value={formData.paymentMethod as string} onValueChange={(v) => updateField("paymentMethod", v)}>
          <SelectTrigger><SelectValue placeholder="اختر طريقة الدفع" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="bank">تحويل بنكي</SelectItem>
            <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
            <SelectItem value="cash">نقدي</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-bankName">اسم البنك</Label>
        <Input id="s-bankName" value={formData.bankName as string} onChange={(e) => updateField("bankName", e.target.value)} placeholder="اسم البنك" />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="s-accountNumber">رقم الحساب / IBAN</Label>
        <Input id="s-accountNumber" value={formData.accountNumber as string} onChange={(e) => updateField("accountNumber", e.target.value)} placeholder="رقم الحساب" dir="ltr" className="text-left" />
      </div>
    </div>
  )
}

function SecuritySection({
  formData,
  updateField,
}: {
  formData: Record<string, string | boolean>
  updateField: (f: string, v: string | boolean) => void
}) {
  return (
    <div className="space-y-5">
      <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
        <div>
          <p className="text-sm font-medium">المصادقة الثنائية</p>
          <p className="text-xs text-muted-foreground mt-0.5">تفعيل التحقق بخطوتين لتأمين الحساب</p>
        </div>
        <Switch checked={formData.twoFactor as boolean} onCheckedChange={(v) => updateField("twoFactor", v)} />
      </label>
      <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
        <div>
          <p className="text-sm font-medium">الإشعارات</p>
          <p className="text-xs text-muted-foreground mt-0.5">استلام إشعارات عبر البريد والرسائل النصية</p>
        </div>
        <Switch checked={formData.notifications as boolean} onCheckedChange={(v) => updateField("notifications", v)} />
      </label>
      <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
        <div>
          <p className="text-sm font-medium">مشاركة البيانات</p>
          <p className="text-xs text-muted-foreground mt-0.5">السماح بمشاركة البيانات مع أطراف ثالثة</p>
        </div>
        <Switch checked={formData.dataSharing as boolean} onCheckedChange={(v) => updateField("dataSharing", v)} />
      </label>
    </div>
  )
}

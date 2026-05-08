"use client"

import * as React from "react"
import {
  Save,
  RotateCcw,
  Eye,
  Send,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/common/page-header"
import { toastSuccess, toastInfo } from "@/components/common/toast-wrapper"

export default function TwoColFormPage() {
  const [formData, setFormData] = React.useState({
    fullName: "", nationalId: "", email: "", phone: "", dob: "", gender: "",
    nationality: "", maritalStatus: "",
    department: "", position: "", branch: "", startDate: "", salary: "", contractType: "",
    degree: "", university: "", graduationYear: "", gpa: "",
    city: "", address: "", postalCode: "", country: "",
    skills: "", languages: "", experience: "",
    isActive: true, remoteWork: false,
  })

  const updateField = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleReset = () => {
    setFormData({
      fullName: "", nationalId: "", email: "", phone: "", dob: "", gender: "",
      nationality: "", maritalStatus: "",
      department: "", position: "", branch: "", startDate: "", salary: "", contractType: "",
      degree: "", university: "", graduationYear: "", gpa: "",
      city: "", address: "", postalCode: "", country: "",
      skills: "", languages: "", experience: "",
      isActive: true, remoteWork: false,
    })
    toastInfo("تم إعادة تعيين النموذج")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toastSuccess("تم حفظ البيانات بنجاح!")
  }

  const filledCount = Object.values(formData).filter(
    (v) => v !== "" && v !== false && v !== true
  ).length
  const totalFields = 22

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="نموذج بعمودين"
        description="نمط الشبكة ثنائية العمود - مناسب لعرض كمية كبيرة من الحقول بشكل منظم"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
              <RotateCcw className="size-3.5" />
              إعادة تعيين
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toastInfo("معاينة النموذج")}>
              <Eye className="size-3.5" />
              معاينة
            </Button>
            <Button size="sm" type="submit" form="twocol-form" className="gap-1.5">
              <Save className="size-3.5" />
              حفظ
            </Button>
          </div>
        }
      />

      {/* Progress bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">تقدم إدخال البيانات</span>
            <span className="font-medium">{filledCount} من {totalFields} حقل</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(filledCount / totalFields) * 100}%`,
                background: "linear-gradient(90deg, var(--brand-gradient-a), var(--brand-gradient-b))",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <form id="twocol-form" onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="personal" className="gap-1.5 text-xs">
              <User className="size-3.5" /> المعلومات الشخصية
            </TabsTrigger>
            <TabsTrigger value="work" className="gap-1.5 text-xs">
              <Briefcase className="size-3.5" /> بيانات العمل
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-1.5 text-xs">
              <GraduationCap className="size-3.5" /> التعليم
            </TabsTrigger>
            <TabsTrigger value="address" className="gap-1.5 text-xs">
              <MapPin className="size-3.5" /> العنوان
            </TabsTrigger>
            <TabsTrigger value="additional" className="gap-1.5 text-xs">
              <Globe className="size-3.5" /> إضافي
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField icon={User} label="الاسم الكامل" required>
                    <Input value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="الاسم الثلاثي" />
                  </FormField>
                  <FormField icon={Hash} label="رقم الهوية" required>
                    <Input value={formData.nationalId} onChange={(e) => updateField("nationalId", e.target.value)} placeholder="رقم الهوية" />
                  </FormField>
                  <FormField icon={Mail} label="البريد الإلكتروني">
                    <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="email@example.com" dir="ltr" className="text-left" />
                  </FormField>
                  <FormField icon={Phone} label="رقم الهاتف">
                    <Input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="07XX XXX XXXX" dir="ltr" className="text-left" />
                  </FormField>
                  <FormField icon={Calendar} label="تاريخ الميلاد">
                    <Input type="date" value={formData.dob} onChange={(e) => updateField("dob", e.target.value)} />
                  </FormField>
                  <FormField label="الجنس">
                    <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="الجنسية">
                    <Input value={formData.nationality} onChange={(e) => updateField("nationality", e.target.value)} placeholder="الجنسية" />
                  </FormField>
                  <FormField label="الحالة الاجتماعية">
                    <Select value={formData.maritalStatus} onValueChange={(v) => updateField("maritalStatus", v)}>
                      <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">أعزب</SelectItem>
                        <SelectItem value="married">متزوج</SelectItem>
                        <SelectItem value="divorced">مطلق</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="work" className="mt-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="size-4 text-primary" />
                  بيانات العمل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField label="القسم" required>
                    <Select value={formData.department} onValueChange={(v) => updateField("department", v)}>
                      <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">تقنية المعلومات</SelectItem>
                        <SelectItem value="hr">الموارد البشرية</SelectItem>
                        <SelectItem value="finance">المالية</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="المسمى الوظيفي" required>
                    <Select value={formData.position} onValueChange={(v) => updateField("position", v)}>
                      <SelectTrigger><SelectValue placeholder="اختر المسمى" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">مدير</SelectItem>
                        <SelectItem value="developer">مطور</SelectItem>
                        <SelectItem value="analyst">محلل</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="الفرع">
                    <Select value={formData.branch} onValueChange={(v) => updateField("branch", v)}>
                      <SelectTrigger><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">الرئيسي</SelectItem>
                        <SelectItem value="north">الشمال</SelectItem>
                        <SelectItem value="south">الجنوب</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField icon={Calendar} label="تاريخ البدء">
                    <Input type="date" value={formData.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
                  </FormField>
                  <FormField label="نوع العقد">
                    <Select value={formData.contractType} onValueChange={(v) => updateField("contractType", v)}>
                      <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">دائم</SelectItem>
                        <SelectItem value="temporary">مؤقت</SelectItem>
                        <SelectItem value="freelance">حر</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="الراتب">
                    <Input type="number" value={formData.salary} onChange={(e) => updateField("salary", e.target.value)} placeholder="0" dir="ltr" className="text-left" />
                  </FormField>
                </div>

                <Separator className="my-5" />

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={formData.isActive} onCheckedChange={(v) => updateField("isActive", v)} />
                    <span className="text-sm">موظف نشط</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={formData.remoteWork} onCheckedChange={(v) => updateField("remoteWork", v)} />
                    <span className="text-sm">عمل عن بُعد</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="size-4 text-primary" />
                  التعليم والمؤهلات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="الدرجة العلمية">
                    <Select value={formData.degree} onValueChange={(v) => updateField("degree", v)}>
                      <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highschool">ثانوية</SelectItem>
                        <SelectItem value="bachelor">بكالوريوس</SelectItem>
                        <SelectItem value="master">ماجستير</SelectItem>
                        <SelectItem value="phd">دكتوراه</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="الجامعة / المؤسسة">
                    <Input value={formData.university} onChange={(e) => updateField("university", e.target.value)} placeholder="اسم الجامعة" />
                  </FormField>
                  <FormField label="سنة التخرج">
                    <Input type="number" value={formData.graduationYear} onChange={(e) => updateField("graduationYear", e.target.value)} placeholder="2024" dir="ltr" className="text-left" />
                  </FormField>
                  <FormField label="المعدل التراكمي">
                    <Input value={formData.gpa} onChange={(e) => updateField("gpa", e.target.value)} placeholder="3.5 / 4.0" dir="ltr" className="text-left" />
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="mt-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  العنوان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="الدولة">
                    <Select value={formData.country} onValueChange={(v) => updateField("country", v)}>
                      <SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iq">العراق</SelectItem>
                        <SelectItem value="sa">السعودية</SelectItem>
                        <SelectItem value="ae">الإمارات</SelectItem>
                        <SelectItem value="jo">الأردن</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="المدينة">
                    <Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="اسم المدينة" />
                  </FormField>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>العنوان التفصيلي</Label>
                    <Textarea value={formData.address} onChange={(e) => updateField("address", e.target.value)} placeholder="العنوان بالتفصيل" rows={2} />
                  </div>
                  <FormField label="الرمز البريدي">
                    <Input value={formData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="الرمز البريدي" dir="ltr" className="text-left" />
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="mt-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  معلومات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>المهارات</Label>
                    <Textarea value={formData.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="اذكر مهاراتك مفصولة بفواصل..." rows={3} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>اللغات</Label>
                    <Textarea value={formData.languages} onChange={(e) => updateField("languages", e.target.value)} placeholder="اللغات ومستوى كل لغة..." rows={3} />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>الخبرات السابقة</Label>
                    <Textarea value={formData.experience} onChange={(e) => updateField("experience", e.target.value)} placeholder="اذكر خبراتك العملية السابقة..." rows={4} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

/* ─── Helper: Form field with icon ────────────────────────────── */

function FormField({
  icon: Icon,
  label,
  required,
  children,
}: {
  icon?: React.ElementType
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5 text-muted-foreground" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}

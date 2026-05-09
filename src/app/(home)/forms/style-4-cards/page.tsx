"use client"

import * as React from "react"
import {
  Plus,
  Trash2,
  GripVertical,
  User,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  Award,
  FileText,
  Send,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/common/page-header"
import { toastSuccess } from "@/components/common/toast-wrapper"

interface ExperienceEntry {
  id: string
  company: string
  role: string
  from: string
  to: string
  description: string
}

interface EducationEntry {
  id: string
  degree: string
  institution: string
  year: string
  gpa: string
}

interface SkillEntry {
  id: string
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

export default function CardFormPage({
  params: paramsPromise,
}: {
  params: Promise<Record<string, string | string[]>>;
}) {
  React.use(paramsPromise);
  const [experiences, setExperiences] = React.useState<ExperienceEntry[]>([
    { id: "1", company: "", role: "", from: "", to: "", description: "" },
  ])
  const [education, setEducation] = React.useState<EducationEntry[]>([
    { id: "1", degree: "", institution: "", year: "", gpa: "" },
  ])
  const [skills, setSkills] = React.useState<SkillEntry[]>([
    { id: "1", name: "", level: "intermediate" },
  ])

  const [basicInfo, setBasicInfo] = React.useState({
    fullName: "", email: "", phone: "", title: "", bio: "",
  })

  const addExperience = () =>
    setExperiences((prev) => [
      ...prev,
      { id: crypto.randomUUID(), company: "", role: "", from: "", to: "", description: "" },
    ])

  const removeExperience = (id: string) =>
    setExperiences((prev) => prev.filter((e) => e.id !== id))

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string) =>
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    )

  const addEducation = () =>
    setEducation((prev) => [
      ...prev,
      { id: crypto.randomUUID(), degree: "", institution: "", year: "", gpa: "" },
    ])

  const removeEducation = (id: string) =>
    setEducation((prev) => prev.filter((e) => e.id !== id))

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) =>
    setEducation((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    )

  const addSkill = () =>
    setSkills((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", level: "intermediate" },
    ])

  const removeSkill = (id: string) =>
    setSkills((prev) => prev.filter((s) => s.id !== id))

  const updateSkill = (id: string, field: keyof SkillEntry, value: string) =>
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toastSuccess("تم حفظ الملف الشخصي بنجاح!")
  }

  const levelLabels: Record<string, string> = {
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    expert: "خبير",
  }

  const levelColors: Record<string, string> = {
    beginner: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    intermediate: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    expert: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="نموذج مبني على البطاقات"
        description="نمط البطاقات المعيارية - مناسب لإدخال بيانات متكررة (خبرات، شهادات، مهارات)"
        actions={
          <Button type="submit" form="card-form" className="gap-2">
            <Send className="size-4" />
            حفظ الملف
          </Button>
        }
      />

      <form id="card-form" onSubmit={handleSubmit} className="space-y-5">
        {/* ─── Basic Info Card ──────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <User className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">المعلومات الأساسية</CardTitle>
                <CardDescription>البيانات الشخصية وطرق التواصل</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><User className="size-3.5 text-muted-foreground" /> الاسم الكامل *</Label>
                <Input value={basicInfo.fullName} onChange={(e) => setBasicInfo((p) => ({ ...p, fullName: e.target.value }))} placeholder="الاسم الكامل" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Mail className="size-3.5 text-muted-foreground" /> البريد الإلكتروني *</Label>
                <Input type="email" value={basicInfo.email} onChange={(e) => setBasicInfo((p) => ({ ...p, email: e.target.value }))} placeholder="email@example.com" dir="ltr" className="text-left" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Phone className="size-3.5 text-muted-foreground" /> رقم الهاتف</Label>
                <Input type="tel" value={basicInfo.phone} onChange={(e) => setBasicInfo((p) => ({ ...p, phone: e.target.value }))} placeholder="07XX XXX XXXX" dir="ltr" className="text-left" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Award className="size-3.5 text-muted-foreground" /> المسمى الوظيفي</Label>
                <Input value={basicInfo.title} onChange={(e) => setBasicInfo((p) => ({ ...p, title: e.target.value }))} placeholder="مثال: مطور أول" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label>نبذة شخصية</Label>
                <Textarea value={basicInfo.bio} onChange={(e) => setBasicInfo((p) => ({ ...p, bio: e.target.value }))} placeholder="اكتب نبذة مختصرة عن نفسك..." rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Experience Cards ─────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Building2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">الخبرات العملية</h3>
                <p className="text-xs text-muted-foreground">أضف خبراتك السابقة</p>
              </div>
              <Badge variant="outline">{experiences.length}</Badge>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addExperience} className="gap-1.5">
              <Plus className="size-3.5" />
              إضافة خبرة
            </Button>
          </div>

          {experiences.map((exp, index) => (
            <Card key={exp.id} className="relative group">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <GripVertical className="size-4 text-muted-foreground/40 cursor-grab" />
                    <span className="text-xs text-muted-foreground font-mono">{index + 1}</span>
                  </div>
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>الشركة / المؤسسة</Label>
                      <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="اسم الشركة" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>المسمى الوظيفي</Label>
                      <Input value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} placeholder="المسمى" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>من</Label>
                      <Input type="date" value={exp.from} onChange={(e) => updateExperience(exp.id, "from", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>إلى</Label>
                      <Input type="date" value={exp.to} onChange={(e) => updateExperience(exp.id, "to", e.target.value)} />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label>وصف المهام</Label>
                      <Textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} placeholder="وصف مختصر للمهام والإنجازات..." rows={2} />
                    </div>
                  </div>
                  {experiences.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── Education Cards ──────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">التعليم والمؤهلات</h3>
                <p className="text-xs text-muted-foreground">الشهادات والدرجات العلمية</p>
              </div>
              <Badge variant="outline">{education.length}</Badge>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addEducation} className="gap-1.5">
              <Plus className="size-3.5" />
              إضافة شهادة
            </Button>
          </div>

          {education.map((edu, index) => (
            <Card key={edu.id} className="relative group">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <GripVertical className="size-4 text-muted-foreground/40 cursor-grab" />
                    <span className="text-xs text-muted-foreground font-mono">{index + 1}</span>
                  </div>
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>الدرجة العلمية</Label>
                      <Select value={edu.degree} onValueChange={(v) => updateEducation(edu.id, "degree", v)}>
                        <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="highschool">ثانوية</SelectItem>
                          <SelectItem value="bachelor">بكالوريوس</SelectItem>
                          <SelectItem value="master">ماجستير</SelectItem>
                          <SelectItem value="phd">دكتوراه</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>المؤسسة التعليمية</Label>
                      <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="اسم الجامعة" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>سنة التخرج</Label>
                      <Input type="number" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} placeholder="2024" dir="ltr" className="text-left" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>المعدل</Label>
                      <Input value={edu.gpa} onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)} placeholder="3.5 / 4.0" dir="ltr" className="text-left" />
                    </div>
                  </div>
                  {education.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ─── Skills ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Award className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">المهارات</h3>
                <p className="text-xs text-muted-foreground">أضف مهاراتك مع تحديد المستوى</p>
              </div>
              <Badge variant="outline">{skills.length}</Badge>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSkill} className="gap-1.5">
              <Plus className="size-3.5" />
              إضافة مهارة
            </Button>
          </div>

          <Card>
            <CardContent className="p-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="group flex items-center gap-2 rounded-lg border bg-muted/30 p-3 transition-all hover:border-primary/30"
                  >
                    <span className="text-xs text-muted-foreground font-mono">{index + 1}</span>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        placeholder="اسم المهارة"
                        className="h-8 text-sm"
                      />
                      <Select value={skill.level} onValueChange={(v) => updateSkill(skill.id, "level", v)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">مبتدئ</SelectItem>
                          <SelectItem value="intermediate">متوسط</SelectItem>
                          <SelectItem value="advanced">متقدم</SelectItem>
                          <SelectItem value="expert">خبير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${levelColors[skill.level]}`}>
                        {levelLabels[skill.level]}
                      </span>
                      {skills.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeSkill(skill.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}

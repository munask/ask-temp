"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Footprints,
  Layers,
  LayoutGrid,
  CreditCard,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/page-header"

const FORM_STYLES = [
  {
    id: "style-1-stepper",
    title: "نموذج متعدد الخطوات",
    subtitle: "Wizard / Stepper",
    description: "نموذج مقسم إلى خطوات متتالية مع شريط تقدم. مناسب للنماذج الطويلة والمعقدة التي تحتاج إرشاد المستخدم خطوة بخطوة.",
    icon: Footprints,
    features: ["شريط تقدم مرئي", "خطوات قابلة للنقر", "حفظ تلقائي لكل خطوة", "مراجعة قبل الإرسال"],
    color: "from-blue-500 to-cyan-500",
    difficulty: "متقدم",
    bestFor: "التسجيل، الطلبات المعقدة، الإعداد الأولي",
  },
  {
    id: "style-2-sections",
    title: "أقسام قابلة للطي",
    subtitle: "Collapsible Sections",
    description: "صفحة واحدة مع أقسام يمكن فتحها وإغلاها بشكل مستقل. مناسب للنماذج المتوسطة التي تحتوي على مجموعات منطقية من الحقول.",
    icon: Layers,
    features: ["أقسام مستقلة", "مؤشر اكتمال كل قسم", "إمكانية الطي والفتح", "حفظ كامل للصفحة"],
    color: "from-purple-500 to-pink-500",
    difficulty: "متوسط",
    bestFor: "الملفات الشخصية، الإعدادات، نماذج البيانات",
  },
  {
    id: "style-3-twocol",
    title: "شبكة بعمودين",
    subtitle: "Two-Column Grid",
    description: "تخطيط شبكي مع تبويبات لتنظيم الحقول في أعمدة متعددة. مناسب لعرض كمية كبيرة من الحقول بشكل منظم ومتساوي.",
    icon: LayoutGrid,
    features: ["تبويبات متعددة", "شبكة عمودين أو ثلاثة", "حقول مع أيقونات", "شريط تقدم ذكي"],
    color: "from-emerald-500 to-teal-500",
    difficulty: "بسيط",
    bestFor: "نماذج الموظفين، البيانات التفصيلية، التقارير",
  },
  {
    id: "style-4-cards",
    title: "بطاقات معيارية",
    subtitle: "Card-Based Modular",
    description: "نموذج مبني على بطاقات قابلة للإضافة والحذف. مناسب لإدخال بيانات متكررة مثل الخبرات والشهادات والمهارات.",
    icon: CreditCard,
    features: ["إضافة/حذف ديناميكي", "سحب وإفلات", "عدد غير محدود من البطاقات", "مستويات مرئية"],
    color: "from-amber-500 to-orange-500",
    difficulty: "متقدم",
    bestFor: "السير الذاتية، الملفات الشخصية، نماذج المشاريع",
  },
]

export default function FormsIndexPage() {
  return (
    <div className="space-y-8" dir="rtl">
      <PageHeader
        title="معرض أنماط النماذج"
        description="4 أنماط مختلفة لتصميم نماذج الإدخال - اختر النمط المناسب لحالتك"
      />

      {/* Quick overview */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FORM_STYLES.map((style) => {
          const Icon = style.icon
          return (
            <Link key={style.id} href={`/forms/${style.id}`}>
              <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30">
                <CardContent className="p-5">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl mb-3"
                    style={{
                      background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    }}
                  >
                    <div
                      className={`bg-gradient-to-br ${style.color} flex size-12 items-center justify-center rounded-xl`}
                    >
                      <Icon className="size-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {style.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {style.subtitle}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Detailed cards */}
      <div className="space-y-4">
        {FORM_STYLES.map((style, index) => {
          const Icon = style.icon
          return (
            <Card key={style.id} className="overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Color accent */}
                <div className={`hidden lg:flex w-2 bg-gradient-to-b ${style.color}`} />

                <div className="flex-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-11 items-center justify-center rounded-lg bg-gradient-to-br ${style.color}`}>
                          <Icon className="size-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{style.title}</CardTitle>
                            <Badge variant="outline" className="text-[10px]">
                              {style.difficulty}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {style.subtitle} — {style.bestFor}
                          </CardDescription>
                        </div>
                      </div>
                      <Link href={`/forms/${style.id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          معاينة
                          <ArrowLeft className="size-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-5">
                    <p className="text-sm text-muted-foreground mb-4">
                      {style.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {style.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-[11px] font-normal">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

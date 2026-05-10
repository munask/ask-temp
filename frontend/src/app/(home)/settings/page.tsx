"use client"

import { cn } from "@/lib/utils"
import { use } from "react"
import { Check, Palette, TextCursor, Monitor, Sun, Moon } from "lucide-react"
import { useColorThemeStore } from "@/store/colorTheme/colorThemeStore"
import {
  useTypographyStore,
  FONT_FAMILY_MAP,
  FONT_SIZE_MAP,
  type FontId,
  type FontSize,
  type FontWeight,
} from "@/store/typography/typographyStore"
import { themes, type ThemeId } from "@/lib/themes"
import { Badge } from "@/components/ui/badge"

// ─── Theme data ───────────────────────────────────────────────────────────────

const themeIds: ThemeId[] = [
  "navy-teal",
  "royal-purple",
  "corporate-blue",
  "forest-green",
  "deep-olive",
  "crimson-rose",
  "slate-midnight",
  "golden-amber",
  "rose-quartz",
  "ocean-teal",
  "sunset-amber",
  "mint-fresh",
]

// ─── Font data ────────────────────────────────────────────────────────────────

const fonts: { id: FontId; label: string; arabicLabel: string; description: string }[] = [
  { id: "cairo", label: "Cairo", arabicLabel: "القاهرة", description: "عصري وهندسي" },
  { id: "tajawal", label: "Tajawal", arabicLabel: "تجوال", description: "نظيف وسلس" },
  { id: "ibm-plex", label: "IBM Plex", arabicLabel: "IBM بلكس", description: "مؤسسي ودقيق" },
  { id: "noto-sans", label: "Noto Sans", arabicLabel: "نوتو سانس", description: "محايد وشامل" },
]

// ─── Size data ───────────────────────────────────────────────────────────────

const fontSizes: { id: FontSize; sublabel: string; px: string }[] = [
  { id: "sm", sublabel: "صغير", px: "14px" },
  { id: "md", sublabel: "متوسط", px: "16px" },
  { id: "lg", sublabel: "كبير", px: "18px" },
  { id: "xl", sublabel: "كبير جداً", px: "20px" },
]

// ─── Weight data ─────────────────────────────────────────────────────────────

const fontWeights: { id: FontWeight; label: string }[] = [
  { id: "300", label: "نص رفيع" },
  { id: "400", label: "نص عادي" },
  { id: "500", label: "نص متوسط" },
  { id: "600", label: "نص شبه عريض" },
  { id: "700", label: "نص عريض" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage({
  params: paramsPromise,
}: {
  params: Promise<Record<string, string | string[]>>;
}) {
  use(paramsPromise)
  const { colorTheme, setColorTheme } = useColorThemeStore()
  const { fontId, fontSize, fontWeight, setFontId, setFontSize, setFontWeight } = useTypographyStore()

  return (
    <div className="flex flex-col gap-8 p-6">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fade-in-up 0.5s ease-out both; }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.20; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.05); }
        }
        .glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        .theme-card:hover { transform: translateY(-3px); }
        .theme-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .font-card:hover { transform: translateY(-2px); }
        .font-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .preview-card { transition: all 0.3s ease; }
        .pill-active { background: var(--primary) !important; color: var(--primary-foreground) !important; }
      `}</style>

      {/* Page title */}
      <div className="fade-in-up">
        <h1
          className="text-3xl font-bold"
          style={{
            background: "linear-gradient(to left, var(--brand-text-from), var(--brand-text-to))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          الإعدادات
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          تخصيص مظهر النظام وتفضيلاتك الشخصية
        </p>
      </div>

      {/* ── Appearance Hero Card ── */}
      <div
        className="fade-in-up relative overflow-hidden rounded-2xl border bg-card p-6"
        style={{ animationDelay: "60ms", background: "linear-gradient(145deg, var(--card), oklch(0.91 0.025 192 / 0.06))" }}
      >
        {/* Ambient glows */}
        <div
          className="glow-pulse pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--brand-gradient-a), transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        <div
          className="glow-pulse pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--brand-gradient-b), transparent 70%)",
            filter: "blur(20px)",
            animationDelay: "1s",
          }}
        />

        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
              }}
            >
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">المظهر العام</h2>
              <p className="text-xs text-muted-foreground leading-none">
                اختر سمة ألوان تناسب ذوقك
              </p>
            </div>
          </div>

          {/* Theme picker — scrollable grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {themeIds.map((id, i) => {
              const theme = themes[id]
              const selected = colorTheme === id
              return (
                <button
                  key={id}
                  onClick={() => setColorTheme(id)}
                  className={cn(
                    "theme-card relative flex flex-col gap-2 rounded-xl border-2 p-3 text-right",
                    selected
                      ? "border-primary shadow-md"
                      : "border-border hover:border-muted-foreground/50 hover:shadow-sm"
                  )}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {selected && (
                    <span className="absolute top-2 left-2 flex size-4 items-center justify-center rounded-full bg-primary">
                      <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
                    </span>
                  )}
                  {/* Color swatches */}
                  <div className="flex gap-1">
                    {theme.preview.map((color, j) => (
                      <div
                        key={j}
                        className="h-7 flex-1 rounded-md"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {/* Label */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold">{theme.label}</span>
                      {selected && (
                        <Badge className="text-[9px] px-1.5 py-0" variant="default">
                          نشط
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{theme.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Two-column: Font + Size/Weight ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Font Family Card */}
        <div className="fade-in-up" style={{ animationDelay: "120ms" }}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
              }}
            >
              <TextCursor className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">نوع الخط</h2>
              <p className="text-xs text-muted-foreground leading-none">اختر الخط العربي المناسب</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fonts.map((font) => {
              const selected = fontId === font.id
              return (
                <button
                  key={font.id}
                  onClick={() => setFontId(font.id)}
                  className={cn(
                    "font-card relative flex flex-col gap-1.5 rounded-xl border-2 p-4 text-right",
                    selected
                      ? "border-primary shadow-sm"
                      : "border-border hover:border-muted-foreground/40 hover:shadow-sm"
                  )}
                >
                  {selected && (
                    <span className="absolute top-2 left-2 flex size-4 items-center justify-center rounded-full bg-primary">
                      <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
                    </span>
                  )}
                  <div
                    className="text-xl"
                    style={{ fontFamily: FONT_FAMILY_MAP[font.id] }}
                  >
                    نظام السكرتارية
                  </div>
                  <div
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: FONT_FAMILY_MAP[font.id] }}
                  >
                    أبجد هوز حطي كلمن سعفص قرشت
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-semibold">{font.arabicLabel}</span>
                    {selected && (
                      <span className="rounded-full bg-primary px-1.5 py-px text-[9px] text-primary-foreground">
                        نشط
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{font.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Font Size + Weight stacked */}
        <div className="fade-in-up flex flex-col gap-6" style={{ animationDelay: "180ms" }}>
          {/* Size */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">حجم الخط</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {fontSizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFontSize(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-2.5 transition-all hover:-translate-y-0.5",
                    fontSize === s.id
                      ? "border-primary shadow-sm"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                >
                  <span
                    className="font-semibold"
                    style={{ fontSize: s.px, lineHeight: 1 }}
                  >
                    أ
                  </span>
                  <span className="text-[10px] text-muted-foreground">{s.sublabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-semibold">سماكة الخط</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {fontWeights.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setFontWeight(w.id as FontWeight)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-2.5 transition-all hover:-translate-y-0.5",
                    fontWeight === w.id
                      ? "border-primary shadow-sm"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                >
                  <span
                    className="font-bold"
                    style={{ fontWeight: Number(w.id), fontSize: "1rem", lineHeight: 1 }}
                  >
                    أ
                  </span>
                  <span className="text-[10px] text-muted-foreground">{w.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Preview Card ── */}
      <div className="fade-in-up" style={{ animationDelay: "240ms" }}>
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
            }}
          >
            <Sun className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight">معاينة مباشرة</h2>
            <p className="text-xs text-muted-foreground leading-none">
              شاهد كيف ستبدو العناصر بعد التعديل
            </p>
          </div>
        </div>
        <div
          className="preview-card rounded-2xl border bg-card p-6"
          style={{
            background: "linear-gradient(135deg, var(--card), oklch(0.91 0.025 192 / 0.04))",
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
              }}
            >
              <Moon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold" style={{ fontSize: FONT_SIZE_MAP[fontSize], fontWeight: Number(fontWeight) }}>
                الملف الشخصي
              </h3>
              <p className="text-muted-foreground" style={{ fontSize: FONT_SIZE_MAP[fontSize] }}>
                إدارة حسابك وتخصيص تجربتك
              </p>
            </div>
          </div>
          <div
            className="rounded-xl border bg-muted/30 p-4"
            style={{ lineHeight: 1.7, fontSize: FONT_SIZE_MAP[fontSize], fontWeight: Number(fontWeight) }}
          >
            هذا نص تجريبي بحجم الخط والسماكة المحددين. يمكنك قراءة هذا النص لمعرفة مدى ملاءمة الخط وحجمه وسماكته لك في صفحة الإعدادات.
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["primary", "secondary", "accent", "muted"].map((variant) => (
              <div
                key={variant}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1"
                style={{
                  background: `var(--${variant})`,
                  color: `var(--${variant}-foreground)`,
                  borderColor: `var(--border)`,
                  fontSize: "0.75rem",
                }}
              >
                {variant}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

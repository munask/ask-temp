"use client"

import { Check } from "lucide-react"
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

// ─── Shared local components ─────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-[1.5px] h-5 rounded-full"
        style={{ background: "linear-gradient(to bottom, var(--brand-gradient-b), var(--brand-gradient-c))" }}
      />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  )
}

interface OptionPillProps {
  selected: boolean
  onClick: () => void
  label: string
  sublabel?: string
  previewStyle?: React.CSSProperties
}

function OptionPill({ selected, onClick, label, sublabel, previewStyle }: OptionPillProps) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 px-4 py-3 text-right transition-all hover:shadow-sm hover:-translate-y-0.5 ${
        selected
          ? "border-primary shadow-sm"
          : "border-border hover:border-muted-foreground/40"
      }`}
    >
      {selected && (
        <span className="absolute top-1.5 left-1.5 flex size-4 items-center justify-center rounded-full bg-primary">
          <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
        </span>
      )}
      {previewStyle && (
        <div className="mb-1" style={previewStyle}>
          أ
        </div>
      )}
      <div className="text-sm font-medium">{label}</div>
      {sublabel && <div className="mt-0.5 text-[11px] text-muted-foreground">{sublabel}</div>}
    </button>
  )
}

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
]

// ─── Font data ────────────────────────────────────────────────────────────────

const fonts: { id: FontId; label: string; arabicLabel: string; description: string }[] = [
  { id: "cairo", label: "Cairo", arabicLabel: "القاهرة", description: "عصري وهندسي" },
  { id: "tajawal", label: "Tajawal", arabicLabel: "تجوال", description: "نظيف وسلس" },
  { id: "ibm-plex", label: "IBM Plex", arabicLabel: "IBM بلكس", description: "مؤسسي ودقيق" },
  { id: "noto-sans", label: "Noto Sans", arabicLabel: "نوتو سانس", description: "محايد وشامل" },
]

// ─── Size data ────────────────────────────────────────────────────────────────

const fontSizes: { id: FontSize; sublabel: string; px: string }[] = [
  { id: "sm", sublabel: "صغير", px: "14px" },
  { id: "md", sublabel: "متوسط", px: "16px" },
  { id: "lg", sublabel: "كبير", px: "18px" },
  { id: "xl", sublabel: "كبير جداً", px: "20px" },
]

// ─── Weight data ──────────────────────────────────────────────────────────────

const fontWeights: { id: FontWeight; label: string }[] = [
  { id: "300", label: "نص رفيع" },
  { id: "400", label: "نص عادي" },
  { id: "500", label: "نص متوسط" },
  { id: "600", label: "نص شبه عريض" },
  { id: "700", label: "نص عريض" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { colorTheme, setColorTheme } = useColorThemeStore()
  const { fontId, fontSize, fontWeight, setFontId, setFontSize, setFontWeight } = useTypographyStore()

  return (
    <div className="flex max-w-4xl flex-col gap-10 p-6">
      {/* Title */}
      <div>
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
        <p className="mt-1 text-muted-foreground">تخصيص مظهر النظام وتفضيلاتك</p>
      </div>

      {/* Section 1 — Color Theme */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="مظهر النظام" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {themeIds.map((id) => {
            const theme = themes[id]
            const selected = colorTheme === id
            return (
              <button
                key={id}
                onClick={() => setColorTheme(id)}
                className={`relative flex flex-col gap-3 rounded-xl border-2 p-4 text-right transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  selected ? "border-primary shadow-sm" : "border-border hover:border-muted-foreground/40"
                }`}
              >
                {selected && (
                  <span className="absolute top-2 left-2 flex size-4 items-center justify-center rounded-full bg-primary">
                    <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
                  </span>
                )}
                {/* Color swatches */}
                <div className="flex gap-1">
                  {theme.preview.map((color, i) => (
                    <div
                      key={i}
                      className="h-8 flex-1 rounded-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {/* Labels */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{theme.label}</span>
                    {selected && (
                      <span className="rounded-full bg-primary px-2 py-px text-[10px] text-primary-foreground">
                        نشط
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{theme.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Section 2 — Font Family */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="نوع الخط" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fonts.map((font) => {
            const selected = fontId === font.id
            return (
              <button
                key={font.id}
                onClick={() => setFontId(font.id)}
                className={`relative flex flex-col gap-2 rounded-xl border-2 p-4 text-right transition-all hover:shadow-sm hover:-translate-y-0.5 ${
                  selected ? "border-primary shadow-sm" : "border-border hover:border-muted-foreground/40"
                }`}
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
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{font.arabicLabel}</span>
                    {selected && (
                      <span className="rounded-full bg-primary px-2 py-px text-[10px] text-primary-foreground">
                        نشط
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{font.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Section 3 — Font Size */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="حجم الخط" />
        <div className="flex flex-wrap gap-3">
          {fontSizes.map((s) => (
            <OptionPill
              key={s.id}
              selected={fontSize === s.id}
              onClick={() => setFontSize(s.id)}
              label={s.sublabel}
              sublabel={`${s.sublabel} — ${s.px}`}
              previewStyle={{ fontSize: s.px, fontWeight: 600, lineHeight: 1 }}
            />
          ))}
        </div>
        {/* Live preview */}
        <div
          className="rounded-xl border bg-muted/40 p-5 text-right"
          style={{ fontSize: FONT_SIZE_MAP[fontSize], lineHeight: 1.7 }}
        >
          هذا مثال على النص بالحجم المحدد. يمكنك قراءة هذا النص لمعرفة مدى ملاءمة حجم الخط لك.
        </div>
      </section>

      {/* Section 4 — Font Weight */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="سماكة الخط" />
        <div className="flex flex-wrap gap-3">
          {fontWeights.map((w) => (
            <OptionPill
              key={w.id}
              selected={fontWeight === w.id}
              onClick={() => setFontWeight(w.id as FontWeight)}
              label={w.label}
              sublabel={w.id}
              previewStyle={{ fontWeight: Number(w.id), fontSize: "0.9rem" }}
            />
          ))}
        </div>
        {/* Live preview */}
        <div
          className="rounded-xl border bg-muted/40 p-5 text-right"
          style={{ fontWeight: Number(fontWeight), lineHeight: 1.7 }}
        >
          هذا مثال على النص بسماكة الخط المحددة. يمكنك قراءة هذا النص لمعرفة مدى ملاءمة سماكة الخط لك.
        </div>
      </section>
    </div>
  )
}

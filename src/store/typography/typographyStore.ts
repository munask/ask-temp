import { create } from "zustand"
import { persist } from "zustand/middleware"

export type FontId = "cairo" | "tajawal" | "ibm-plex" | "noto-sans"
export type FontSize = "sm" | "md" | "lg" | "xl"
export type FontWeight = "300" | "400" | "500" | "600" | "700"

export const FONT_FAMILY_MAP: Record<FontId, string> = {
  cairo: "var(--font-cairo), Cairo, sans-serif",
  tajawal: "var(--font-tajawal), Tajawal, sans-serif",
  "ibm-plex": "var(--font-ibm-plex), 'IBM Plex Sans Arabic', sans-serif",
  "noto-sans": "var(--font-noto-sans), 'Noto Sans Arabic', sans-serif",
}

export const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: "14px",
  md: "16px",
  lg: "18px",
  xl: "20px",
}

export const FONT_WEIGHT_MAP: Record<FontWeight, string> = {
  "300": "300",
  "400": "400",
  "500": "500",
  "600": "600",
  "700": "700",
}

interface TypographyStore {
  fontId: FontId
  fontSize: FontSize
  fontWeight: FontWeight
  setFontId: (id: FontId) => void
  setFontSize: (size: FontSize) => void
  setFontWeight: (weight: FontWeight) => void
}

export const useTypographyStore = create<TypographyStore>()(
  persist(
    (set) => ({
      fontId: "cairo",
      fontSize: "md",
      fontWeight: "400",
      setFontId: (id) => set({ fontId: id }),
      setFontSize: (size) => set({ fontSize: size }),
      setFontWeight: (weight) => set({ fontWeight: weight }),
    }),
    { name: "typography-settings" }
  )
)

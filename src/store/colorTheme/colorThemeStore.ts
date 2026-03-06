import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ThemeId } from "@/lib/themes"
// ThemeId is kept in sync with src/lib/themes.ts

interface ColorThemeStore {
  colorTheme: ThemeId
  setColorTheme: (id: ThemeId) => void
}

export const useColorThemeStore = create<ColorThemeStore>()(
  persist(
    (set) => ({
      colorTheme: "navy-teal",
      setColorTheme: (id) => set({ colorTheme: id }),
    }),
    { name: "color-theme" }
  )
)

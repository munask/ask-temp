"use client"

import { useEffect } from "react"
import { useColorThemeStore } from "@/store/colorTheme/colorThemeStore"
import { useTypographyStore, FONT_FAMILY_MAP, FONT_SIZE_MAP, FONT_WEIGHT_MAP } from "@/store/typography/typographyStore"
import { themes } from "@/lib/themes"
import { useTheme } from "@/context/theme-context"

export function ThemeApplicator() {
  const { colorTheme } = useColorThemeStore()
  const { fontId, fontSize, fontWeight } = useTypographyStore()
  const { resolvedTheme, mounted } = useTheme()

  // Apply color theme CSS variables
  useEffect(() => {
    if (!mounted) return

    const theme = themes[colorTheme]
    if (!theme) return

    const vars = resolvedTheme === "dark" ? theme.dark : theme.light
    const root = document.documentElement

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // Sync scrollbar vars — thumb follows the theme primary color
    root.style.setProperty("--sb-track-color", "transparent")
    root.style.setProperty("--sb-thumb-color", vars["--primary"] ?? "")
  }, [colorTheme, resolvedTheme, mounted])

  // Apply typography
  useEffect(() => {
    const body = document.body
    const root = document.documentElement

    body.style.fontFamily = FONT_FAMILY_MAP[fontId]
    root.style.fontSize = FONT_SIZE_MAP[fontSize]
    body.style.fontWeight = FONT_WEIGHT_MAP[fontWeight]
  }, [fontId, fontSize, fontWeight])

  return null
}

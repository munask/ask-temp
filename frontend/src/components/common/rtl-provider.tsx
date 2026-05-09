"use client"

import { cn } from "@/lib/utils"

interface RTLProviderProps {
  children: React.ReactNode
  dir?: "rtl" | "ltr"
  className?: string
}

export function RTLProvider({
  children,
  dir = "rtl",
  className,
}: RTLProviderProps) {
  return (
    <div dir={dir} className={cn("text-right", className)}>
      {children}
    </div>
  )
}

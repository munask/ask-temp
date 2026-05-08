"use client"

import { cn } from "@/lib/utils"

interface FormattedMessageProps {
  children: React.ReactNode
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "label"
  className?: string
}

export function FormattedMessage({
  children,
  as: Comp = "p",
  className,
}: FormattedMessageProps) {
  return (
    <Comp
      dir="rtl"
      className={cn(
        "text-right leading-relaxed",
        className
      )}
    >
      {children}
    </Comp>
  )
}

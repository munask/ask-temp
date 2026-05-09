"use client"

import { cn } from "@/lib/utils"

interface StatCardGridProps {
  children: React.ReactNode
  className?: string
}

export function StatCardGrid({ children, className }: StatCardGridProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  )
}

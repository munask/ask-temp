"use client"

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortHeaderProps {
  label: string
  active?: boolean
  direction?: "asc" | "desc"
  onSort: () => void
  className?: string
}

export function SortHeader({
  label,
  active = false,
  direction,
  onSort,
  className,
}: SortHeaderProps) {
  return (
    <th
      className={cn(
        "text-right cursor-pointer select-none hover:bg-muted/50 transition-colors",
        className
      )}
      onClick={onSort}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {!active && (
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
        )}
        {active && direction === "asc" && (
          <ArrowUp className="h-3.5 w-3.5 text-foreground" />
        )}
        {active && direction === "desc" && (
          <ArrowDown className="h-3.5 w-3.5 text-foreground" />
        )}
      </span>
    </th>
  )
}

"use client"

import { X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterBadge } from "@/components/common/filter-badge"
import { cn } from "@/lib/utils"

export interface ActiveFilter {
  key: string
  label: string
  value: string
}

interface ActiveFiltersProps {
  filters: ActiveFilter[]
  onRemove: (key: string) => void
  onClearAll: () => void
  className?: string
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)} dir="rtl">
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
      {filters.map((filter) => (
        <FilterBadge
          key={filter.key}
          label={filter.label}
          value={filter.value}
          onRemove={() => onRemove(filter.key)}
        />
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 text-xs text-muted-foreground hover:text-destructive"
      >
        <X className="h-3 w-3 ml-1" />
        مسح الكل
      </Button>
    </div>
  )
}

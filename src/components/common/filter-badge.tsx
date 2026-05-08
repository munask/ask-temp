"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FilterBadgeProps {
  label: string
  value: string
  onRemove: () => void
  className?: string
}

export function FilterBadge({
  label,
  value,
  onRemove,
  className,
}: FilterBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1 py-1 px-2.5 text-xs cursor-default", className)}
    >
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
      <button
        onClick={onRemove}
        className="mr-0.5 hover:text-destructive transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}

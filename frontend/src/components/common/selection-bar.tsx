"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BulkAction {
  label: string
  icon?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary"
  onClick: () => void
}

interface SelectionBarProps {
  count: number
  onClear: () => void
  actions?: BulkAction[]
  className?: string
}

export function SelectionBar({
  count,
  onClear,
  actions = [],
  className,
}: SelectionBarProps) {
  if (count === 0) return null

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2",
        className
      )}
      dir="rtl"
    >
      <span className="text-sm font-medium">
        {count} عنصر محدد
      </span>
      <div className="flex items-center gap-1 mr-2">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
            className="h-7 text-xs"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-7 text-xs mr-auto"
      >
        <X className="h-3.5 w-3.5 ml-1" />
        إلغاء التحديد
      </Button>
    </div>
  )
}

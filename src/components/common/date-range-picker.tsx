"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  from?: string
  to?: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  fromLabel?: string
  toLabel?: string
  className?: string
}

export function DateRangePicker({
  from = "",
  to = "",
  onFromChange,
  onToChange,
  fromLabel = "من تاريخ",
  toLabel = "إلى تاريخ",
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex items-end gap-2", className)} dir="rtl">
      <div className="flex-1 space-y-1">
        <Label className="text-xs text-muted-foreground">{fromLabel}</Label>
        <Input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <div className="flex-1 space-y-1">
        <Label className="text-xs text-muted-foreground">{toLabel}</Label>
        <Input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="h-8 text-xs"
        />
      </div>
    </div>
  )
}

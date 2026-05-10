"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"

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
        <DatePicker
          value={from}
          onChange={onFromChange}
        />
      </div>
      <div className="flex-1 space-y-1">
        <Label className="text-xs text-muted-foreground">{toLabel}</Label>
        <DatePicker
          value={to}
          onChange={onToChange}
        />
      </div>
    </div>
  )
}
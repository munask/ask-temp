"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker } from "@/components/common/date-range-picker"
import { SlidersHorizontal } from "lucide-react"

export type FilterFieldType = "text" | "date" | "select" | "dateRange"

export interface FilterFieldConfig {
  key: string
  label: string
  type: FilterFieldType
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface FiltersModalProps {
  fields: FilterFieldConfig[]
  values: Record<string, string>
  onApply: (values: Record<string, string>) => void
  onReset: () => void
  hasActive?: boolean
}

export function FiltersModal({
  fields,
  values,
  onApply,
  onReset,
  hasActive = false,
}: FiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<Record<string, string>>(values)

  const handleOpen = () => {
    setLocal(values)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(local)
    setOpen(false)
  }

  const handleReset = () => {
    const empty: Record<string, string> = {}
    fields.forEach((f) => {
      empty[f.key] = ""
    })
    setLocal(empty)
    onReset()
    setOpen(false)
  }

  const renderField = (field: FilterFieldConfig) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.key} className="space-y-1.5">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Input
              placeholder={field.placeholder || field.label}
              value={local[field.key] || ""}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="h-9"
            />
          </div>
        )
      case "date":
        return (
          <div key={field.key} className="space-y-1.5">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Input
              type="date"
              value={local[field.key] || ""}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="h-9"
            />
          </div>
        )
      case "select":
        return (
          <div key={field.key} className="space-y-1.5">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Select
              value={local[field.key] || ""}
              onValueChange={(val) =>
                setLocal((prev) => ({ ...prev, [field.key]: val }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={field.placeholder || field.label} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case "dateRange": {
        const fromKey = `${field.key}_from`
        const toKey = `${field.key}_to`
        return (
          <div key={field.key} className="space-y-1.5">
            <Label className="text-sm font-medium">{field.label}</Label>
            <DateRangePicker
              from={local[fromKey] || ""}
              to={local[toKey] || ""}
              onFromChange={(val) =>
                setLocal((prev) => ({ ...prev, [fromKey]: val }))
              }
              onToChange={(val) =>
                setLocal((prev) => ({ ...prev, [toKey]: val }))
              }
              fromLabel="من"
              toLabel="إلى"
            />
          </div>
        )
      }
    }
  }

  return (
    <>
      <Button variant="outline" onClick={handleOpen} className="relative">
        <SlidersHorizontal className="ml-2 h-4 w-4" />
        تصفية
        {hasActive && (
          <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-primary" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تصفية البيانات</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {fields.map(renderField)}
            <div className="flex justify-start gap-2 pt-3 border-t border-border">
              <Button onClick={handleApply} className="min-w-[80px]">تطبيق</Button>
              <Button variant="outline" onClick={handleReset} className="min-w-[80px]">
                إعادة تعيين
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

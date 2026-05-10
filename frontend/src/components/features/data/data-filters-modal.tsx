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
import { SlidersHorizontal } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"

export interface DataFilters {
  dateFrom: string
  dateTo: string
}

interface DataFiltersModalProps {
  filters: DataFilters
  onApply: (filters: DataFilters) => void
  onReset: () => void
}

export default function DataFiltersModal({ filters, onApply, onReset }: DataFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<DataFilters>(filters)

  const handleOpen = () => {
    setLocal(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(local)
    setOpen(false)
  }

  const handleReset = () => {
    const empty = { dateFrom: "", dateTo: "" }
    setLocal(empty)
    onReset()
    setOpen(false)
  }

  const hasActive = filters.dateFrom || filters.dateTo

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
        <DialogContent className="sm:max-w-[360px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تصفية السجلات</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <DatePicker
              label="من تاريخ"
              value={local.dateFrom}
              onChange={(date) => setLocal((prev) => ({ ...prev, dateFrom: date }))}
            />
            <DatePicker
              label="إلى تاريخ"
              value={local.dateTo}
              onChange={(date) => setLocal((prev) => ({ ...prev, dateTo: date }))}
            />
            <div className="flex justify-start gap-2 pt-2">
              <Button onClick={handleApply}>تطبيق</Button>
              <Button variant="outline" onClick={handleReset}>
                إعادة تعيين
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

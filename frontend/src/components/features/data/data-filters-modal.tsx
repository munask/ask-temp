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
import { SlidersHorizontal } from "lucide-react"

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
            <div className="space-y-1">
              <Label htmlFor="dateFrom">من تاريخ</Label>
              <Input
                id="dateFrom"
                type="date"
                value={local.dateFrom}
                onChange={(e) => setLocal((prev) => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dateTo">إلى تاريخ</Label>
              <Input
                id="dateTo"
                type="date"
                value={local.dateTo}
                onChange={(e) => setLocal((prev) => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
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

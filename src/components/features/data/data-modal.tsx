"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { DataRecord } from "./data-types"

interface DataModalProps {
  open: boolean
  onClose: () => void
  onAdd: (record: DataRecord) => void
  nextRowNumber: number
}

export default function DataModal({ open, onClose, onAdd, nextRowNumber }: DataModalProps) {
  const [value, setValue] = useState("")
  const [date, setDate] = useState("")
  const [errors, setErrors] = useState<{ value?: string; date?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { value?: string; date?: string } = {}
    if (!value.trim()) newErrors.value = "القيمة مطلوبة"
    if (!date) newErrors.date = "التاريخ مطلوب"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onAdd({ rowNumber: nextRowNumber, value: value.trim(), date })
    setValue("")
    setDate("")
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setValue("")
    setDate("")
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة سجل جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>رقم السطر</Label>
            <Input value={nextRowNumber} disabled className="text-right" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="value">القيمة</Label>
            <Input
              id="value"
              placeholder="أدخل القيمة..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (errors.value) setErrors((prev) => ({ ...prev, value: undefined }))
              }}
              className="text-right"
            />
            {errors.value && <p className="text-sm text-destructive">{errors.value}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
              }}
              className="text-right"
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>
          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit">إضافة</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

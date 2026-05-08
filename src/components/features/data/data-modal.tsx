"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useDataStore } from "@/store/data/dataStore"
import type { DataRecord } from "@/store/data/dataTypes"

interface DataModalProps {
  onAdd: (record: DataRecord) => void
  onUpdate: (record: DataRecord) => void
  nextRowNumber: number
}

export default function DataModal({
  onAdd,
  onUpdate,
  nextRowNumber,
}: DataModalProps) {
  const { isAddModalOpen, isEditModalOpen, selectedRecord, closeModals } =
    useDataStore()

  const isOpen = isAddModalOpen || isEditModalOpen
  const isEdit = isEditModalOpen && !!selectedRecord

  const [value, setValue] = useState("")
  const [date, setDate] = useState("")
  const [errors, setErrors] = useState<{ value?: string; date?: string }>({})

  useEffect(() => {
    if (isOpen) {
      if (isEdit && selectedRecord) {
        setValue(selectedRecord.value)
        setDate(selectedRecord.date)
      } else {
        setValue("")
        setDate("")
      }
      setErrors({})
    }
  }, [isOpen, isEdit, selectedRecord])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { value?: string; date?: string } = {}
    if (!value.trim()) newErrors.value = "القيمة مطلوبة"
    if (!date) newErrors.date = "التاريخ مطلوب"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (isEdit && selectedRecord) {
      onUpdate({
        ...selectedRecord,
        value: value.trim(),
        date,
      })
    } else {
      onAdd({
        id: Date.now(),
        rowNumber: nextRowNumber,
        value: value.trim(),
        date,
      })
    }

    setValue("")
    setDate("")
    setErrors({})
    closeModals()
  }

  const handleClose = () => {
    setValue("")
    setDate("")
    setErrors({})
    closeModals()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "تعديل السجل" : "إضافة سجل جديد"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>رقم السطر</Label>
            <Input
              value={isEdit ? selectedRecord?.rowNumber : nextRowNumber}
              disabled
              className="text-right"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="value">القيمة</Label>
            <Input
              id="value"
              placeholder="أدخل القيمة..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (errors.value)
                  setErrors((prev) => ({ ...prev, value: undefined }))
              }}
              className="text-right"
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                if (errors.date)
                  setErrors((prev) => ({ ...prev, date: undefined }))
              }}
              className="text-right"
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>
          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit">{isEdit ? "تحديث" : "إضافة"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  itemName?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  message,
  itemName,
  confirmText = "حذف",
  cancelText = "إلغاء",
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (isOpen) setConfirmed(false)
  }, [isOpen])

  const handleConfirm = () => {
    setConfirmed(true)
    onConfirm()
  }

  const handleClose = () => {
    if (!isLoading) {
      setConfirmed(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base mt-3 text-right">
            {message}
          </DialogDescription>
          {itemName && (
            <p className="text-sm font-medium bg-destructive/10 text-destructive rounded-md px-3 py-2 mt-2">
              {itemName}
            </p>
          )}
        </DialogHeader>
        <DialogFooter className="flex-row-reverse gap-2 sm:justify-start">
          <Button
            onClick={handleConfirm}
            variant="destructive"
            disabled={isLoading || confirmed}
            className="min-w-[80px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              confirmText
            )}
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

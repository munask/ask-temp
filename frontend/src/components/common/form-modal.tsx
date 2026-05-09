"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  title: string
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  maxWidth?: string
  children: React.ReactNode
  className?: string
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel = "حفظ",
  cancelLabel = "إلغاء",
  isLoading = false,
  maxWidth = "sm:max-w-[440px]",
  children,
  className,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(maxWidth, className)} dir="rtl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="space-y-4 pt-2"
        >
          {children}
          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"

interface DetailField {
  label: string
  value: React.ReactNode
}

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  fields: DetailField[]
  actions?: React.ReactNode
  side?: "left" | "right"
  className?: string
}

export function DetailDrawer({
  isOpen,
  onClose,
  title,
  description,
  fields,
  actions,
  side = "left",
  className,
}: DetailDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={side}
        className={cn("sm:max-w-md overflow-y-auto", className)}
        dir="rtl"
      >
        <SheetHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg text-right">{title}</SheetTitle>
              {description && (
                <SheetDescription className="text-right text-xs mt-0.5">
                  {description}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-4 flex-1">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {fields.map((field, index) => (
              <div key={index}>
                <div
                  className={cn(
                    "flex items-center justify-between gap-4 px-4 py-3",
                    index % 2 === 0 && "bg-muted/30",
                  )}
                >
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {field.label}
                  </span>
                  <span className="text-sm font-medium text-foreground text-left truncate">
                    {field.value || "—"}
                  </span>
                </div>
                {index < fields.length - 1 && (
                  <Separator />
                )}
              </div>
            ))}
          </div>
        </div>

        {actions && (
          <div className="px-6 pb-6 pt-2 border-t border-border mt-auto">
            <div className="flex gap-2">
              {actions}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

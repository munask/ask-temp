"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean
  label?: string
  fullPage?: boolean
  className?: string
  children?: React.ReactNode
}

export function LoadingOverlay({
  isLoading,
  label = "جاري التحميل...",
  fullPage = false,
  className,
  children,
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div
      className={cn(
        "relative",
        fullPage && "fixed inset-0 z-50",
        className
      )}
    >
      {(children || fullPage) && (
        <div className="absolute inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            {label && (
              <p className="text-sm text-muted-foreground">{label}</p>
            )}
          </div>
        </div>
      )}
      {!children && !fullPage && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            {label && (
              <p className="text-sm text-muted-foreground">{label}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

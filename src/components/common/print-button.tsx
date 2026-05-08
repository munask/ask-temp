"use client"

import { useRef } from "react"
import { flushSync } from "react-dom"
import { useReactToPrint } from "react-to-print"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>
  documentTitle?: string
  pageWidth?: number
  pageHeight?: number
  disabled?: boolean
  variant?: "default" | "outline" | "secondary" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  label?: string
}

export function PrintButton({
  contentRef,
  documentTitle = "تقرير",
  pageWidth = 297,
  pageHeight = 210,
  disabled = false,
  variant = "default",
  size = "default",
  className,
  label = "طباعة",
}: PrintButtonProps) {
  const internalRef = useRef<HTMLDivElement>(null)
  const ref = contentRef || internalRef

  const handlePrint = useReactToPrint({
    contentRef: ref,
    documentTitle,
    pageStyle: `
      @page { size: ${pageWidth}mm ${pageHeight}mm; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; } }
    `,
    onBeforePrint: async () => {
      flushSync(() => {})
    },
  })

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => handlePrint()}
      disabled={disabled}
      className={cn(className)}
    >
      <Printer className="size-3.5 ml-1.5" />
      {label}
    </Button>
  )
}

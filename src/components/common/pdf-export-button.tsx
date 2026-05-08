"use client"

import { useState, useCallback } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PdfExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>
  filename?: string
  disabled?: boolean
  variant?: "default" | "outline" | "secondary" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  label?: string
}

export function PdfExportButton({
  targetRef,
  filename = "تقرير",
  disabled = false,
  variant = "outline",
  size = "default",
  className,
  label = "تصدير PDF",
}: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = useCallback(async () => {
    if (!targetRef.current || isExporting) return
    setIsExporting(true)

    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 297
      const pageHeight = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      const pdf = new jsPDF("l", "mm", "a4")
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")
      pdf.save(`${filename}_${timestamp}.pdf`)
      toast.success("تم تصدير PDF بنجاح")
    } catch {
      toast.error("فشل في تصدير PDF")
    } finally {
      setIsExporting(false)
    }
  }, [targetRef, isExporting, filename])

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={cn(className)}
    >
      {isExporting ? (
        <>
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          جاري التصدير...
        </>
      ) : (
        <>
          <FileDown className="ml-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}

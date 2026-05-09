"use client"

import { useState } from "react"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

export interface ExcelColumn {
  key: string
  header: string
  width?: number
}

interface ExcelExportButtonProps {
  columns: ExcelColumn[]
  data: Record<string, unknown>[]
  filename?: string
  sheetName?: string
  creator?: string
  disabled?: boolean
  variant?: "default" | "outline" | "secondary" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  rtl?: boolean
}

export function ExcelExportButton({
  columns,
  data,
  filename,
  sheetName = "البيانات",
  creator = "نظام الإدارة",
  disabled = false,
  variant = "outline",
  size = "default",
  className,
  rtl = true,
}: ExcelExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (isExporting || data.length === 0) return
    setIsExporting(true)

    try {
      const wb = new ExcelJS.Workbook()
      wb.creator = creator

      const ws = wb.addWorksheet(sheetName, {
        views: [{ rightToLeft: rtl }],
      })

      ws.columns = columns.map((col) => ({
        key: col.key,
        header: col.header,
        width: col.width || 20,
      }))

      const headerRow = ws.getRow(1)
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FF374151" } }
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF3F4F6" },
        }
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          readingOrder: rtl ? "rtl" : "ltr",
        }
        cell.border = {
          top: { style: "thin", color: { argb: "FFD1D5DB" } },
          bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
          left: { style: "thin", color: { argb: "FFD1D5DB" } },
          right: { style: "thin", color: { argb: "FFD1D5DB" } },
        }
      })
      headerRow.height = 22

      data.forEach((row, idx) => {
        const excelRow = ws.addRow(row)
        const bgColor = idx % 2 === 0 ? "FFFFFFFF" : "FFF9FAFB"
        excelRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: bgColor },
          }
          cell.alignment = {
            horizontal: rtl ? "right" : "left",
            vertical: "middle",
            readingOrder: rtl ? "rtl" : "ltr",
          }
          cell.border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          }
        })
        excelRow.height = 18
      })

      const buffer = await wb.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")
      const name = filename || sheetName
      saveAs(blob, `${name}_${timestamp}.xlsx`)
      toast.success("تم تصدير البيانات بنجاح")
    } catch {
      toast.error("فشل في تصدير البيانات")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={disabled || isExporting || data.length === 0}
      className={className}
    >
      {isExporting ? (
        <>
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          جاري التصدير...
        </>
      ) : (
        <>
          <FileSpreadsheet className="ml-2 h-4 w-4" />
          تصدير Excel
        </>
      )}
    </Button>
  )
}

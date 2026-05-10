"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Trash2, FileSpreadsheet, Loader2 } from "lucide-react"
import DataTable from "./data-table"
import DataModal from "./data-modal"
import DataPagination from "./data-pagination"
import DataFiltersModal, { type DataFilters } from "./data-filters-modal"
import { useDataStore } from "@/store/data/dataStore"
import { useConfirmModal } from "@/components/common/confirm-modal"
import { useApiData } from "@/hooks/useApi"
import { toast } from "sonner"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import type { DataRecord } from "@/store/data/dataTypes"

const emptyFilters: DataFilters = { dateFrom: "", dateTo: "" }

export default function DataList() {
  const { openAddModal, openEditModal } = useDataStore()
  const { openConfirm, ConfirmModal: ConfirmModalComponent } =
    useConfirmModal()

  const [searchInput, setSearchInput] = useState("")
  const [filters, setFilters] = useState<DataFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isExporting, setIsExporting] = useState(false)

  const { data: apiData, loading, post, delete: del, get, updateParams } = useApiData<DataRecord>('/api/data', {
    enableFetch: false,
    pagination: true,
  })

  // Fetch when params change
  useEffect(() => {
    updateParams({
      page: currentPage,
      limit: perPage,
      search: searchInput,
      dateFrom: filters.dateFrom || '',
      dateTo: filters.dateTo || '',
    })
  }, [currentPage, perPage, searchInput, filters.dateFrom, filters.dateTo])

  const records = useMemo(() => {
    if (!apiData || !('items' in apiData.data)) return []
    return (apiData.data as { items: DataRecord[] }).items
  }, [apiData])

  const totalItems = useMemo(() => {
    if (!apiData || !('pagination' in apiData.data)) return 0
    return (apiData.data as { pagination: { total_items: number } }).pagination.total_items
  }, [apiData])

  const totalPages = useMemo(() => {
    const total = Math.ceil(totalItems / perPage)
    return Math.max(1, total)
  }, [totalItems, perPage])

  const safePage = Math.min(currentPage, totalPages)

  const handleAdd = useCallback(
    async (record: DataRecord) => {
      try {
        await post({
          data: { value: record.value, date: record.date },
          onSuccess: () => {
            toast.success("تمت إضافة السجل بنجاح")
            get()
          },
        })
      } catch {
        toast.error("فشل في إضافة السجل")
      }
    },
    [post, get]
  )

  const handleUpdate = useCallback(
    async (record: DataRecord) => {
      try {
        await updateParams({}, false)
        toast.success("تم تحديث السجل بنجاح")
      } catch {
        toast.error("فشل في تحديث السجل")
      }
    },
    []
  )

  const handleDelete = useCallback(
    (record: DataRecord) => {
      openConfirm({
        title: "حذف السجل",
        message: `هل أنت متأكد من حذف السجل "${record.value}"؟ لا يمكن التراجع عن هذا الإجراء.`,
        variant: "destructive",
        confirmText: "حذف",
        cancelText: "إلغاء",
        onConfirm: async () => {
          try {
            await del({ customEndpoint: `/data?id=${record.id}` })
            setSelectedIds((prev) => {
              const next = new Set(prev)
              next.delete(record.id)
              return next
            })
            toast.success("تم حذف السجل بنجاح")
          } catch {
            toast.error("فشل في حذف السجل")
          }
        },
      })
    },
    [del, openConfirm]
  )

  const handleBulkDelete = () => {
    const count = selectedIds.size
    openConfirm({
      title: "حذف السجلات المحددة",
      message: `هل أنت متأكد من حذف ${count} سجل محدد؟ لا يمكن التراجع عن هذا الإجراء.`,
      variant: "destructive",
      confirmText: `حذف ${count} سجل`,
      cancelText: "إلغاء",
      onConfirm: async () => {
        for (const id of selectedIds) {
          try {
            await del({ customEndpoint: `/data?id=${id}` })
          } catch {
            // continue
          }
        }
        setSelectedIds(new Set())
        toast.success(`تم حذف ${count} سجل بنجاح`)
      },
    })
  }

  const handleExcelExport = async () => {
    if (isExporting || records.length === 0) return
    setIsExporting(true)
    try {
      const wb = new ExcelJS.Workbook()
      wb.creator = "نظام الإدارة"
      const ws = wb.addWorksheet("البيانات", { views: [{ rightToLeft: true }] })

      ws.columns = [
        { key: "rowNumber", header: "رقم السطر", width: 14 },
        { key: "value", header: "القيمة", width: 36 },
        { key: "date", header: "التاريخ", width: 16 },
      ]

      const headerRow = ws.getRow(1)
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FF374151" } }
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } }
        cell.alignment = { horizontal: "center", vertical: "middle", readingOrder: "rtl" }
        cell.border = {
          top: { style: "thin", color: { argb: "FFD1D5DB" } },
          bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
          left: { style: "thin", color: { argb: "FFD1D5DB" } },
          right: { style: "thin", color: { argb: "FFD1D5DB" } },
        }
      })
      headerRow.height = 22

      records.forEach((r, idx) => {
        const row = ws.addRow({ rowNumber: r.rowNumber, value: r.value, date: r.date })
        const bgColor = idx % 2 === 0 ? "FFFFFFFF" : "FFF9FAFB"
        row.eachCell((cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } }
          cell.alignment = { horizontal: "right", vertical: "middle", readingOrder: "rtl" }
          cell.border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          }
        })
        row.height = 18
      })

      const buffer = await wb.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      saveAs(blob, `سجلات-البيانات_${timestamp}.xlsx`)
      toast.success("تم تصدير البيانات بنجاح")
    } catch {
      toast.error("فشل في تصدير البيانات")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">سجلات البيانات</h1>
        <span className="text-sm text-muted-foreground">{totalItems} سجل</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث برقم السطر أو القيمة..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setCurrentPage(1)
            }}
            className="pr-8 text-right w-full"
          />
        </div>

        <DataFiltersModal
          filters={filters}
          onApply={(f) => { setFilters(f); setCurrentPage(1) }}
          onReset={() => { setFilters(emptyFilters); setCurrentPage(1) }}
        />

        <Button variant="outline" onClick={handleExcelExport} disabled={isExporting || records.length === 0}>
          {isExporting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="ml-2 h-4 w-4" />}
          تصدير Excel
        </Button>

        {selectedIds.size > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            <Trash2 className="ml-2 h-4 w-4" />
            حذف المحدد ({selectedIds.size})
          </Button>
        )}

        <Button onClick={openAddModal}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة سجل
        </Button>
      </div>

      <DataTable
        records={records}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      <DataModal
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        nextRowNumber={totalItems + 1}
      />

      <ConfirmModalComponent />
    </div>
  )
}
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
import { toast } from "sonner"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import type { DataRecord } from "@/store/data/dataTypes"

const arabicValues = [
  "تقرير الميزانية",
  "بيانات الموظفين",
  "سجل المبيعات",
  "قائمة العملاء",
  "طلبات الشراء",
  "فواتير المورّدين",
  "كشف الرواتب",
  "تقرير المخزون",
  "بيانات المشاريع",
  "سجل العقود",
]

const arabicDates = [
  "2024-01-05",
  "2024-02-12",
  "2024-03-20",
  "2024-04-08",
  "2024-05-15",
  "2024-06-22",
  "2024-07-03",
  "2024-08-18",
  "2024-09-27",
  "2024-10-11",
  "2024-11-30",
  "2024-12-07",
]

const DUMMY_DATA: DataRecord[] = Array.from({ length: 97 }, (_, i) => ({
  id: i + 1,
  rowNumber: i + 1,
  value: arabicValues[i % arabicValues.length] + ` - ${i + 1}`,
  date: arabicDates[i % arabicDates.length],
}))

const emptyFilters: DataFilters = { dateFrom: "", dateTo: "" }

export default function DataList() {
  const { openAddModal, openEditModal } = useDataStore()
  const { openConfirm, ConfirmModal: ConfirmModalComponent } =
    useConfirmModal()

  const [records, setRecords] = useState<DataRecord[]>(DUMMY_DATA)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<DataFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isExporting, setIsExporting] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput)
      setCurrentPage(1)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput])

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        r.rowNumber.toString().includes(q) ||
        r.value.toLowerCase().includes(q) ||
        r.date.includes(q)

      const matchesFrom = !filters.dateFrom || r.date >= filters.dateFrom
      const matchesTo = !filters.dateTo || r.date <= filters.dateTo

      return matchesSearch && matchesFrom && matchesTo
    })
  }, [records, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const handleAdd = useCallback(
    (record: DataRecord) => {
      setRecords((prev) => [...prev, record])
      toast.success("تمت إضافة السجل بنجاح")
    },
    []
  )

  const handleUpdate = useCallback(
    (record: DataRecord) => {
      setRecords((prev) =>
        prev.map((r) => (r.id === record.id ? record : r))
      )
      toast.success("تم تحديث السجل بنجاح")
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
        onConfirm: () => {
          setRecords((prev) => prev.filter((r) => r.id !== record.id))
          setSelectedIds((prev) => {
            const next = new Set(prev)
            next.delete(record.id)
            return next
          })
          toast.success("تم حذف السجل بنجاح")
        },
      })
    },
    [openConfirm]
  )

  const handleBulkDelete = () => {
    const count = selectedIds.size
    openConfirm({
      title: "حذف السجلات المحددة",
      message: `هل أنت متأكد من حذف ${count} سجل محدد؟ لا يمكن التراجع عن هذا الإجراء.`,
      variant: "destructive",
      confirmText: `حذف ${count} سجل`,
      cancelText: "إلغاء",
      onConfirm: () => {
        setRecords((prev) => prev.filter((r) => !selectedIds.has(r.id)))
        setSelectedIds(new Set())
        toast.success(`تم حذف ${count} سجل بنجاح`)
      },
    })
  }

  const handleExcelExport = async () => {
    if (isExporting || filtered.length === 0) return
    setIsExporting(true)
    try {
      const wb = new ExcelJS.Workbook()
      wb.creator = "نظام الإدارة"
      const ws = wb.addWorksheet("البيانات", {
        views: [{ rightToLeft: true }],
      })

      ws.columns = [
        { key: "rowNumber", header: "رقم السطر", width: 14 },
        { key: "value", header: "القيمة", width: 36 },
        { key: "date", header: "التاريخ", width: 16 },
      ]

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
          readingOrder: "rtl",
        }
        cell.border = {
          top: { style: "thin", color: { argb: "FFD1D5DB" } },
          bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
          left: { style: "thin", color: { argb: "FFD1D5DB" } },
          right: { style: "thin", color: { argb: "FFD1D5DB" } },
        }
      })
      headerRow.height = 22

      filtered.forEach((r, idx) => {
        const row = ws.addRow({
          rowNumber: r.rowNumber,
          value: r.value,
          date: r.date,
        })
        const bgColor = idx % 2 === 0 ? "FFFFFFFF" : "FFF9FAFB"
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: bgColor },
          }
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            readingOrder: "rtl",
          }
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
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")
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
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">سجلات البيانات</h1>
        <span className="text-sm text-muted-foreground">
          {filtered.length} سجل
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث برقم السطر أو القيمة..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
            }}
            className="pr-8 text-right w-full"
          />
        </div>

        <DataFiltersModal
          filters={filters}
          onApply={(f) => {
            setFilters(f)
            setCurrentPage(1)
          }}
          onReset={() => {
            setFilters(emptyFilters)
            setCurrentPage(1)
          }}
        />

        <Button
          variant="outline"
          onClick={handleExcelExport}
          disabled={isExporting || filtered.length === 0}
        >
          {isExporting ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="ml-2 h-4 w-4" />
          )}
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
        records={paginated}
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
        nextRowNumber={records.length + 1}
      />

      <ConfirmModalComponent />
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import DataTable from "./data-table"
import DataModal from "./data-modal"
import DataPagination from "./data-pagination"
import DataFiltersModal, { type DataFilters } from "./data-filters-modal"
import type { DataRecord } from "./data-types"

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
  rowNumber: i + 1,
  value: arabicValues[i % arabicValues.length] + ` - ${i + 1}`,
  date: arabicDates[i % arabicDates.length],
}))

const emptyFilters: DataFilters = { dateFrom: "", dateTo: "" }

export default function DataList() {
  const [records, setRecords] = useState<DataRecord[]>(DUMMY_DATA)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<DataFilters>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

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

  const handleAdd = (record: DataRecord) => {
    setRecords((prev) => [...prev, record])
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Title */}
      <h1 className="text-2xl font-bold">سجلات البيانات</h1>

      {/* Toolbar: right→left: search | filters | add */}
      <div className="flex items-center gap-2">
        {/* Search — rightmost in RTL, takes remaining space */}
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث برقم السطر أو القيمة..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pr-8 text-right w-full"
          />
        </div>

        {/* Filters modal button */}
        <DataFiltersModal
          filters={filters}
          onApply={(f) => { setFilters(f); setCurrentPage(1) }}
          onReset={() => { setFilters(emptyFilters); setCurrentPage(1) }}
        />

        {/* Add modal button — leftmost in RTL */}
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة سجل
        </Button>
      </div>

      <DataTable records={paginated} />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      <DataModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
        nextRowNumber={records.length + 1}
      />
    </div>
  )
}

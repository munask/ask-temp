"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ArrowUpDown } from "lucide-react"
import type { DataRecord } from "@/store/data/dataTypes"

type SortKey = "rowNumber" | "value" | "date"
type SortDir = "asc" | "desc"

interface DataTableProps {
  records: DataRecord[]
  selectedIds: Set<number>
  onSelectionChange: (ids: Set<number>) => void
  onEdit: (record: DataRecord) => void
  onDelete: (record: DataRecord) => void
}

const columns: { key: SortKey; label: string }[] = [
  { key: "rowNumber", label: "رقم السطر" },
  { key: "value", label: "القيمة" },
  { key: "date", label: "التاريخ" },
]

export default function DataTable({
  records,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const allSelected =
    records.length > 0 && records.every((r) => selectedIds.has(r.id))

  const handleToggleAll = () => {
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(records.map((r) => r.id)))
    }
  }

  const handleToggleOne = (id: number) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onSelectionChange(next)
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return records
    return [...records].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal), "ar")
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [records, sortKey, sortDir])

  const colSpan = columns.length + 3

  if (sorted.length === 0) {
    return (
      <div className="border rounded-md" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              {columns.map((col) => (
                <TableHead key={col.key} className="text-right">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-28 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="text-center py-10 text-muted-foreground"
              >
                لا توجد سجلات.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="border rounded-md" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleToggleAll}
              />
            </TableHead>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="text-right cursor-pointer select-none hover:bg-muted/50 transition-colors"
                onClick={() => handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  <ArrowUpDown
                    className={`h-3.5 w-3.5 ${
                      sortKey === col.key
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                    }`}
                  />
                </span>
              </TableHead>
            ))}
            <TableHead className="w-28 text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((record) => (
            <TableRow
              key={record.id}
              data-state={selectedIds.has(record.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(record.id)}
                  onCheckedChange={() => handleToggleOne(record.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{record.rowNumber}</TableCell>
              <TableCell>{record.value}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onEdit(record)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onDelete(record)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

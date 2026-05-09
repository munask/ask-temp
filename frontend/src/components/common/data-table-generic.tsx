"use client"

import { useState, useMemo, useCallback } from "react"
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
import { Pencil, Trash2 } from "lucide-react"
import { SortHeader } from "@/components/common/sort-header"
import { cn } from "@/lib/utils"

export interface ColumnDef<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  width?: string
}

interface DataTableGenericProps<T extends { id: number | string }> {
  columns: ColumnDef<T>[]
  data: T[]
  selectedIds?: Set<number | string>
  onSelectionChange?: (ids: Set<number | string>) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onRowClick?: (row: T) => void
  emptyMessage?: string
  dir?: "rtl" | "ltr"
  className?: string
}

type SortDir = "asc" | "desc"

export function DataTableGeneric<T extends { id: number | string }>({
  columns,
  data,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onRowClick,
  emptyMessage = "لا توجد بيانات",
  dir = "rtl",
  className,
}: DataTableGenericProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const allSelected = useMemo(
    () => data.length > 0 && data.every((r) => selectedIds?.has(r.id)),
    [data, selectedIds]
  )

  const handleToggleAll = useCallback(() => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map((r) => r.id)))
    }
  }, [onSelectionChange, allSelected, data])

  const handleToggleOne = useCallback((id: number | string) => {
    if (!onSelectionChange) return
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange(next)
  }, [onSelectionChange, selectedIds])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey]
      const bVal = (b as Record<string, unknown>)[sortKey]
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal
      }
      const aStr = aVal == null ? "" : String(aVal)
      const bStr = bVal == null ? "" : String(bVal)
      const cmp = aStr.localeCompare(bStr, "ar")
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const hasActions = onEdit || onDelete
  const hasSelection = onSelectionChange !== undefined
  const colSpan = columns.length + (hasSelection ? 1 : 0) + (hasActions ? 1 : 0)

  return (
    <div className={cn("border rounded-md", className)} dir={dir}>
      <Table>
        <TableHeader>
          <TableRow>
            {hasSelection && (
              <TableHead className="w-10 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleToggleAll}
                  className="mx-auto"
                />
              </TableHead>
            )}
            {columns.map((col) =>
              col.sortable ? (
                <SortHeader
                  key={col.key}
                  label={col.label}
                  active={sortKey === col.key}
                  direction={sortKey === col.key ? sortDir : undefined}
                  onSort={() => handleSort(col.key)}
                />
              ) : (
                <TableHead
                  key={col.key}
                  className="text-right"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </TableHead>
              )
            )}
            {hasActions && (
              <TableHead className="w-28 text-right">الإجراءات</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="text-center py-10 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((row) => (
              <TableRow
                key={row.id}
                data-state={
                  selectedIds?.has(row.id) ? "selected" : undefined
                }
                className={onRowClick ? "cursor-pointer" : undefined}
                onClick={() => onRowClick?.(row)}
              >
                {hasSelection && (
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds?.has(row.id)}
                      onCheckedChange={() => handleToggleOne(row.id)}
                      className="mx-auto"
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

"use client"

import { Plus, SlidersHorizontal, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/common/search-input"
import { cn } from "@/lib/utils"

interface DataTableToolbarProps {
  onSearch: (value: string) => void
  searchPlaceholder?: string
  onFilterClick?: () => void
  hasActiveFilters?: boolean
  onExportClick?: () => void
  isExporting?: boolean
  onAddClick?: () => void
  addLabel?: string
  bulkActions?: React.ReactNode
  className?: string
}

export function DataTableToolbar({
  onSearch,
  searchPlaceholder = "ابحث...",
  onFilterClick,
  hasActiveFilters = false,
  onExportClick,
  isExporting = false,
  onAddClick,
  addLabel = "إضافة",
  bulkActions,
  className,
}: DataTableToolbarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} dir="rtl">
      <SearchInput onSearch={onSearch} placeholder={searchPlaceholder} />

      {onFilterClick && (
        <Button variant="outline" onClick={onFilterClick} className="relative">
          <SlidersHorizontal className="ml-2 h-4 w-4" />
          تصفية
          {hasActiveFilters && (
            <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      )}

      {onExportClick && (
        <Button
          variant="outline"
          onClick={onExportClick}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="ml-2 h-4 w-4" />
          )}
          تصدير Excel
        </Button>
      )}

      {bulkActions}

      {onAddClick && (
        <Button onClick={onAddClick}>
          <Plus className="ml-2 h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}

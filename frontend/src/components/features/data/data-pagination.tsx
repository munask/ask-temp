"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataPaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | "...")[] = []

  pages.push(1)

  if (currentPage <= 3) {
    pages.push(2, 3, 4, "...", totalPages)
  } else if (currentPage >= totalPages - 2) {
    pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
  }

  return pages
}

export default function DataPagination({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: DataPaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex items-center justify-between py-4" dir="rtl">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">صفوف في الصفحة</span>
        <Select
          value={String(perPage)}
          onValueChange={(val) => {
            onPerPageChange(Number(val))
            onPageChange(1)
          }}
        >
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>

        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground select-none">
              ...
            </span>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === currentPage ? "default" : "outline"}
              onClick={() => onPageChange(p as number)}
              className="w-8"
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          التالي
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

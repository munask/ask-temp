"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const SKELETON_WIDTHS = ["w-3/5", "w-2/3", "w-3/4", "w-4/5", "w-1/2"]

interface TableRowSkeletonProps {
  columns?: number
  rows?: number
  showCheckbox?: boolean
  showActions?: boolean
  className?: string
}

export function TableRowSkeleton({
  columns = 3,
  rows = 5,
  showCheckbox = false,
  showActions = false,
  className,
}: TableRowSkeletonProps) {
  return (
    <div className={cn("border rounded-md", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {showCheckbox && (
              <TableHead className="w-10">
                <Skeleton className="h-4 w-4" />
              </TableHead>
            )}
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="w-28">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {showCheckbox && (
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
              )}
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableCell key={colIdx}>
                  <Skeleton
                    className={cn("h-4", SKELETON_WIDTHS[(rowIdx + colIdx) % SKELETON_WIDTHS.length])}
                  />
                </TableCell>
              ))}
              {showActions && (
                <TableCell>
                  <div className="flex gap-1">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DataRecord } from "./data-types"

interface DataTableProps {
  records: DataRecord[]
}

export default function DataTable({ records }: DataTableProps) {
  if (records.length === 0) {
    return (
      <div className="border rounded-md" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-right">رقم السطر</TableHead>
              <TableHead className="text-right">القيمة</TableHead>
              <TableHead className="w-40 text-right">التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
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
            <TableHead className="w-24 text-right">رقم السطر</TableHead>
            <TableHead className="text-right">القيمة</TableHead>
            <TableHead className="w-40 text-right">التاريخ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.rowNumber}>
              <TableCell className="font-medium">{record.rowNumber}</TableCell>
              <TableCell>{record.value}</TableCell>
              <TableCell>{record.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

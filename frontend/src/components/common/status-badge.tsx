"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusVariant = "active" | "inactive" | "pending" | "approved" | "rejected" | "warning" | "default"

const statusConfig: Record<StatusVariant, { label: string; className: string }> = {
  active: {
    label: "نشط",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  inactive: {
    label: "غير نشط",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  },
  pending: {
    label: "قيد الانتظار",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  },
  approved: {
    label: "معتمد",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  rejected: {
    label: "مرفوض",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  warning: {
    label: "تحذير",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  default: {
    label: "عادي",
    className: "bg-secondary text-secondary-foreground",
  },
}

interface StatusBadgeProps {
  variant?: StatusVariant
  label?: string
  className?: string
  dot?: boolean
}

export function StatusBadge({
  variant = "default",
  label,
  className,
  dot = true,
}: StatusBadgeProps) {
  const config = statusConfig[variant]
  const displayLabel = label || config.label

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium text-xs", config.className, className)}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-green-600 dark:bg-green-400": variant === "active",
            "bg-gray-500 dark:bg-gray-400": variant === "inactive",
            "bg-yellow-600 dark:bg-yellow-400": variant === "pending",
            "bg-blue-600 dark:bg-blue-400": variant === "approved",
            "bg-red-600 dark:bg-red-400": variant === "rejected",
            "bg-orange-600 dark:bg-orange-400": variant === "warning",
            "bg-muted-foreground": variant === "default",
          })}
        />
      )}
      {displayLabel}
    </Badge>
  )
}

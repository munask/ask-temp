"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeLabel?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ElementType
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  trend = "neutral",
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
            }}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            <span
              className={cn(
                trend === "up" && "text-green-600 dark:text-green-400",
                trend === "down" && "text-red-600 dark:text-red-400",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </span>{" "}
            {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

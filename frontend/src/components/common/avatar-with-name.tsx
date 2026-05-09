"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AvatarWithNameProps {
  name: string
  subtitle?: string
  src?: string
  fallback?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AvatarWithName({
  name,
  subtitle,
  src,
  fallback,
  size = "md",
  className,
}: AvatarWithNameProps) {
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
  }

  const initials = fallback || name.slice(0, 2).toUpperCase()

  return (
    <div className={cn("flex items-center gap-2", className)} dir="rtl">
      <Avatar className={sizeClasses[size]}>
        {src && <AvatarImage src={src} alt={name} />}
        <AvatarFallback className="text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium leading-tight">{name}</span>
        {subtitle && (
          <span className="text-xs text-muted-foreground leading-tight">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}

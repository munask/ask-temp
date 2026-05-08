"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  isActive: boolean
  color?: string
  height?: number
  className?: string
}

export function ProgressIndicator({
  isActive,
  color,
  height = 3,
  className,
}: ProgressIndicatorProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      return
    }

    setProgress(20)

    const timer1 = setTimeout(() => setProgress(50), 200)
    const timer2 = setTimeout(() => setProgress(75), 500)
    const timer3 = setTimeout(() => setProgress(90), 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [isActive])

  if (!isActive && progress === 0) return null

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] overflow-hidden",
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full transition-all duration-500 ease-out"
        style={{
          width: `${progress}%`,
          background:
            color ||
            "linear-gradient(90deg, var(--brand-gradient-a), var(--brand-gradient-b))",
        }}
      />
    </div>
  )
}

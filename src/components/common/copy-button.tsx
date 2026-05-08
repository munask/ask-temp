"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  value: string
  label?: string
  copiedLabel?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showTooltip?: boolean
}

export function CopyButton({
  value,
  label = "نسخ",
  copiedLabel = "تم النسخ!",
  variant = "ghost",
  size = "sm",
  className,
  showTooltip = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  }

  const button = (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("gap-1.5", className)}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span className="text-xs">{copied ? copiedLabel : label}</span>
    </Button>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{copied ? copiedLabel : label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

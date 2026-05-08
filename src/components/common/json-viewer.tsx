"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
  data: unknown
  title?: string
  defaultExpanded?: boolean
  className?: string
}

export function JsonViewer({
  data,
  title,
  defaultExpanded = false,
  className,
}: JsonViewerProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString)
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-muted/30 overflow-hidden",
        className
      )}
      dir="ltr"
    >
      {(title || expanded) && (
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <span className="text-xs font-medium text-muted-foreground">
            {title || "JSON"}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 px-2 text-xs"
            >
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      )}
      {expanded && (
        <pre className="p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed">
          {jsonString}
        </pre>
      )}
      {!expanded && (
        <div className="px-3 py-2">
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            اضغط للتوسيع...
          </button>
        </div>
      )}
    </div>
  )
}

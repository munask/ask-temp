"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface DebouncedInputProps {
  value?: string
  onChange: (value: string) => void
  debounceMs?: number
  placeholder?: string
  type?: string
  disabled?: boolean
  className?: string
}

export function DebouncedInput({
  value: externalValue = "",
  onChange,
  debounceMs = 300,
  placeholder,
  type = "text",
  disabled = false,
  className,
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(externalValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedChange = useCallback(
    (val: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => onChange(val), debounceMs)
    },
    [onChange, debounceMs]
  )

  useEffect(() => {
    setLocalValue(externalValue)
  }, [externalValue])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocalValue(val)
    debouncedChange(val)
  }

  return (
    <input
      type={type}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  )
}

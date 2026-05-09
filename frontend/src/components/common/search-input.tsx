"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  onSearch: (value: string) => void
  placeholder?: string
  debounceMs?: number
  defaultValue?: string
  className?: string
}

export function SearchInput({
  onSearch,
  placeholder = "ابحث...",
  debounceMs = 300,
  defaultValue = "",
  className,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearch(value), debounceMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, onSearch, debounceMs])

  const handleClear = () => {
    setValue("")
    onSearch("")
  }

  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pr-8 pl-8 text-right w-full"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

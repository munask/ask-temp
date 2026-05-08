"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { UploadCloud, X, FileIcon, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilePreview {
  file: File
  url: string | null
  isImage: boolean
}

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  label?: string
  description?: string
  className?: string
  disabled?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileExtension(name: string): string {
  const parts = name.split(".")
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : ""
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/")
}

function createPreview(file: File): FilePreview {
  const img = isImageFile(file)
  return {
    file,
    url: img ? URL.createObjectURL(file) : null,
    isImage: img,
  }
}

export function FileUploadZone({
  onFilesSelected,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  label = "اسحب الملفات هنا أو اضغط للاختيار",
  description = "PNG, JPG, PDF حتى 10MB",
  className,
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previews, setPreviews] = useState<FilePreview[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Cleanup object URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url)
      })
    }
  }, [previews])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const validFiles = Array.from(files).filter((f) => f.size <= maxSize)
      const newPreviews = validFiles.map(createPreview)

      if (multiple) {
        setPreviews((prev) => [...prev, ...newPreviews])
        onFilesSelected([...previews.map((p) => p.file), ...validFiles])
      } else {
        previews.forEach((p) => {
          if (p.url) URL.revokeObjectURL(p.url)
        })
        setPreviews(newPreviews)
        onFilesSelected(validFiles)
      }
    },
    [maxSize, onFilesSelected, multiple, previews]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) handleFiles(e.dataTransfer.files)
  }

  const handleRemove = (index: number) => {
    const removed = previews[index]
    if (removed?.url) URL.revokeObjectURL(removed.url)
    const next = previews.filter((_, i) => i !== index)
    setPreviews(next)
    onFilesSelected(next.map((p) => p.file))
  }

  const handleClearAll = () => {
    previews.forEach((p) => {
      if (p.url) URL.revokeObjectURL(p.url)
    })
    setPreviews([])
    onFilesSelected([])
  }

  return (
    <div className={cn("space-y-3", className)} dir="rtl">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all",
          isDragging && "border-primary bg-primary/5 scale-[1.01]",
          !isDragging && !disabled && "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/20",
          disabled && "opacity-50 cursor-not-allowed",
          previews.length > 0 && "p-4"
        )}
      >
        <UploadCloud
          className={cn(
            "h-7 w-7 mb-2 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )}
        />
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="space-y-2">
          {/* Header with count and clear all */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {previews.length} {previews.length === 1 ? "ملف" : "ملفات"}
            </span>
            {multiple && previews.length > 1 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                إزالة الكل
              </button>
            )}
          </div>

          {/* Preview grid */}
          <div className={cn(
            "grid gap-2",
            previews.length === 1 && !multiple ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
          )}>
            {previews.map((preview, i) => (
              <div
                key={i}
                className={cn(
                  "group relative rounded-xl border border-border overflow-hidden bg-muted/20",
                  previews.length === 1 && !multiple ? "max-w-xs" : ""
                )}
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute top-1.5 left-1.5 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Preview content */}
                {preview.isImage && preview.url ? (
                  <div className={cn(
                    "relative overflow-hidden bg-muted/30",
                    previews.length === 1 && !multiple ? "h-48" : "h-28"
                  )}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.url}
                      alt={preview.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={cn(
                    "flex flex-col items-center justify-center bg-muted/30",
                    previews.length === 1 && !multiple ? "h-48" : "h-28"
                  )}>
                    <div className="flex flex-col items-center gap-1.5">
                      {preview.file.type === "application/pdf" ? (
                        <FileText className="w-8 h-8 text-red-500" />
                      ) : (
                        <FileIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                        {getFileExtension(preview.file.name)}
                      </span>
                    </div>
                  </div>
                )}

                {/* File info */}
                <div className="px-2.5 py-2">
                  <p className="text-xs font-medium truncate" title={preview.file.name}>
                    {preview.file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatFileSize(preview.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

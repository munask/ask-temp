"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface BaseFieldProps {
  label: string
  error?: string
  required?: boolean
  className?: string
}

interface TextFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: "text" | "number" | "email" | "password"
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  type = "text",
  className,
}: TextFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label>
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="text-right"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

interface DateFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function DateField({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  className,
}: DateFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label>
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="text-right"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

interface SelectFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  disabled,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label>
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="text-right">
          <SelectValue placeholder={placeholder || label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

interface TextAreaFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  rows?: number
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  rows = 3,
  className,
}: TextAreaFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label>
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="text-right resize-none"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

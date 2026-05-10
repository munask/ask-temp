'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CalendarIcon, AlertCircle, X } from 'lucide-react'
import { format, isValid } from 'date-fns'
import { cn } from '@/lib/utils'
import { DatePickerCalendar } from './date-picker-calendar'

interface DatePickerProps {
  /** Stored/emitted value in YYYY-MM-DD format (matches API) */
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  error?: string
  className?: string
  id?: string
}

function parseIso(str?: string): Date | null {
  if (!str) return null
  const d = new Date(str)
  return isValid(d) ? d : null
}

function daysInMonth(year: string, month: string): number {
  if (month.length < 2) return 31
  const mi = parseInt(month)
  if (mi < 1 || mi > 12) return 31
  const yi = parseInt(year)
  return new Date(yi >= 1900 ? yi : 2001, mi, 0).getDate()
}

export function DatePicker({
  value,
  onChange,
  placeholder: _placeholder,
  label,
  disabled = false,
  minDate,
  maxDate,
  error,
  className,
  id,
}: DatePickerProps) {
  const [yr, setYr]   = useState('')
  const [mo, setMo]   = useState('')
  const [dy, setDy]   = useState('')

  const [isOpen, setIsOpen]     = useState(false)
  const [calPos, setCalPos]     = useState({ top: 0, left: 0 })
  const [activeSeg, setActiveSeg] = useState<'yr' | 'mo' | 'dy' | null>(null)

  const wrapRef  = useRef<HTMLDivElement>(null)
  const calRef   = useRef<HTMLDivElement>(null)
  const yrRef    = useRef<HTMLInputElement>(null)
  const moRef    = useRef<HTMLInputElement>(null)
  const dyRef    = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const date = parseIso(value)
    if (date) {
      setYr(String(date.getFullYear()))
      setMo(String(date.getMonth() + 1).padStart(2, '0'))
      setDy(String(date.getDate()).padStart(2, '0'))
    } else if (!value) {
      setYr(''); setMo(''); setDy('')
    }
  }, [value])

  const getCalPos = useCallback(() => {
    if (!wrapRef.current) return { top: 0, left: 0 }
    const r = wrapRef.current.getBoundingClientRect()
    const CAL_H = 360, CAL_W = 288
    const vH = window.innerHeight, vW = window.innerWidth
    const flip = r.bottom + 8 + CAL_H > vH
    const top  = flip ? r.top - CAL_H - 8 : r.bottom + 8
    const left = Math.min(r.left, vW - CAL_W - 8)
    return { top: Math.max(8, top), left: Math.max(8, left) }
  }, [])

  useEffect(() => { if (isOpen) setCalPos(getCalPos()) }, [isOpen, getCalPos])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (wrapRef.current?.contains(t) || calRef.current?.contains(t)) return
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const emit = useCallback((year: string, month: string, day: string) => {
    if (year.length !== 4 || month.length !== 2 || day.length !== 2) return
    const yi = parseInt(year), mi = parseInt(month), di = parseInt(day)
    if (yi < 1900 || mi < 1 || mi > 12 || di < 1) return
    const date = new Date(yi, mi - 1, di)
    if (
      isValid(date) &&
      date.getFullYear() === yi &&
      date.getMonth()    === mi - 1 &&
      date.getDate()     === di
    ) {
      onChange?.(format(date, 'yyyy-MM-dd'))
    }
  }, [onChange])

  const beginDayWith = useCallback((digit: number, year: string, month: string) => {
    const max = daysInMonth(year, month)
    if (digit === 0) {
      setDy('0')
    } else if (digit * 10 > max) {
      if (digit <= max) {
        const dv = String(digit).padStart(2, '0')
        setDy(dv)
        emit(year, month, dv)
      }
    } else {
      setDy(String(digit))
    }
    dyRef.current?.focus()
  }, [emit])

  const onYearKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') return
    if (e.key === 'ArrowRight' && yr.length === 4) { e.preventDefault(); moRef.current?.focus(); return }
    if (e.key === 'Backspace') { e.preventDefault(); setYr(yr.slice(0, -1)); return }
    if (!/^\d$/.test(e.key)) return
    e.preventDefault()
    if (yr.length >= 4) return
    const next = yr + e.key
    setYr(next)
    if (next.length === 4 && parseInt(next) >= 1900) moRef.current?.focus()
  }

  const onMonthKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') return
    if (e.key === 'ArrowLeft')  { e.preventDefault(); yrRef.current?.focus(); return }
    if (e.key === 'ArrowRight' && mo.length === 2) { e.preventDefault(); dyRef.current?.focus(); return }
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (mo === '') yrRef.current?.focus()
      else setMo(mo.slice(0, -1))
      return
    }
    if (!/^\d$/.test(e.key)) return
    e.preventDefault()

    const n   = parseInt(e.key)
    const cur = mo.length === 2 ? '' : mo

    if (cur === '') {
      if (n === 0)      { setMo('0') }
      else if (n === 1) { setMo('1') }
      else {
        const m = '0' + n
        const max = daysInMonth(yr, m)
        const newDy = parseInt(dy) > max ? '' : dy
        if (newDy !== dy) setDy(newDy)
        setMo(m)
        emit(yr, m, newDy)
        dyRef.current?.focus()
      }
    } else if (cur === '0') {
      if (n >= 1 && n <= 9) {
        const m = '0' + n
        const max = daysInMonth(yr, m)
        const newDy = parseInt(dy) > max ? '' : dy
        if (newDy !== dy) setDy(newDy)
        setMo(m)
        emit(yr, m, newDy)
        dyRef.current?.focus()
      }
    } else {
      if (n <= 2) {
        const m = '1' + n
        const max = daysInMonth(yr, m)
        const newDy = parseInt(dy) > max ? '' : dy
        if (newDy !== dy) setDy(newDy)
        setMo(m)
        emit(yr, m, newDy)
        dyRef.current?.focus()
      } else {
        const m = '01'
        setMo(m)
        setDy('')
        beginDayWith(n, yr, m)
      }
    }
  }

  const onDayKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') return
    if (e.key === 'ArrowLeft') { e.preventDefault(); moRef.current?.focus(); return }
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (dy === '') moRef.current?.focus()
      else setDy(dy.slice(0, -1))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (dy.length === 1) {
        const d = parseInt(dy)
        if (d >= 1) {
          const max = daysInMonth(yr, mo)
          if (d <= max) {
            const dv = String(d).padStart(2, '0')
            setDy(dv)
            emit(yr, mo, dv)
            setIsOpen(false)
          }
        }
      } else if (dy.length === 2) {
        setIsOpen(false)
      }
      return
    }
    if (!/^\d$/.test(e.key)) return
    e.preventDefault()

    const digit = parseInt(e.key)
    const max   = daysInMonth(yr, mo)
    const cur   = dy.length === 2 ? '' : dy

    if (cur === '') {
      if (digit === 0) {
        setDy('0')
      } else if (digit * 10 > max) {
        if (digit <= max) {
          const dv = String(digit).padStart(2, '0')
          setDy(dv)
          emit(yr, mo, dv)
        }
      } else {
        setDy(String(digit))
      }
    } else {
      const first    = parseInt(cur)
      const combined = first * 10 + digit

      if (first === 0) {
        if (digit >= 1) {
          const dv = '0' + digit
          if (parseInt(dv) <= max) { setDy(dv); emit(yr, mo, dv) }
        }
      } else if (combined > max) {
        const clampedSecond = max - first * 10
        if (clampedSecond >= 0) {
          const dv = String(first) + String(clampedSecond)
          setDy(dv)
          emit(yr, mo, dv)
        }
      } else if (combined >= 1) {
        const dv = String(combined).padStart(2, '0')
        setDy(dv)
        emit(yr, mo, dv)
      }
    }
  }

  const onCalSelect = (date: Date) => {
    const y = String(date.getFullYear())
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    setYr(y); setMo(m); setDy(d)
    onChange?.(format(date, 'yyyy-MM-dd'))
    setIsOpen(false)
  }

  const clear = () => { setYr(''); setMo(''); setDy(''); onChange?.(''); setIsOpen(false) }

  const hasValue = !!(yr || mo || dy)

  const segmentClass = 'bg-transparent outline-none text-center placeholder:text-muted-foreground/50 caret-transparent rounded transition-colors'
  const segActive    = 'bg-primary/15 text-primary'

  return (
    <div className={cn('relative flex flex-col w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div
        ref={wrapRef}
        onClick={(e) => {
          const tag = (e.target as HTMLElement).tagName
          if (tag !== 'INPUT' && tag !== 'BUTTON') yrRef.current?.focus()
        }}
        className={cn(
          'relative flex items-center w-full h-9 pl-10 bg-card dark:bg-input/30 border rounded-md shadow-xs cursor-text',
          'text-sm text-foreground transition-[color,box-shadow]',
          hasValue && !disabled ? 'pr-8' : 'pr-3',
          error
            ? 'border-destructive focus-within:ring-[3px] focus-within:ring-destructive/20'
            : 'border-input focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        )}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <CalendarIcon className={cn('w-4 h-4', error ? 'text-destructive' : 'text-muted-foreground')} />
        </div>

        <div className="flex items-center gap-px flex-1">
          <input
            ref={yrRef}
            id={id}
            type="text"
            inputMode="numeric"
            value={yr}
            onChange={() => {}}
            onKeyDown={onYearKey}
            onFocus={() => { if (!disabled) { setIsOpen(true); setActiveSeg('yr') } }}
            onBlur={() => setActiveSeg(null)}
            placeholder="YYYY"
            disabled={disabled}
            className={cn(segmentClass, 'w-11 px-0.5', activeSeg === 'yr' && segActive)}
          />
          <span className="text-muted-foreground/60 select-none">/</span>
          <input
            ref={moRef}
            type="text"
            inputMode="numeric"
            value={mo}
            onChange={() => {}}
            onKeyDown={onMonthKey}
            onFocus={() => { if (!disabled) { setIsOpen(true); setActiveSeg('mo') } }}
            onBlur={() => setActiveSeg(null)}
            placeholder="MM"
            disabled={disabled}
            className={cn(segmentClass, 'w-7 px-0.5', activeSeg === 'mo' && segActive)}
          />
          <span className="text-muted-foreground/60 select-none">/</span>
          <input
            ref={dyRef}
            type="text"
            inputMode="numeric"
            value={dy}
            onChange={() => {}}
            onKeyDown={onDayKey}
            onFocus={() => { if (!disabled) { setIsOpen(true); setActiveSeg('dy') } }}
            onBlur={() => setActiveSeg(null)}
            placeholder="DD"
            disabled={disabled}
            className={cn(segmentClass, 'w-7 px-0.5', activeSeg === 'dy' && segActive)}
          />
        </div>

        {hasValue && !disabled && (
          <button
            type="button"
            onClick={clear}
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1.5 text-xs text-destructive font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      {isOpen && createPortal(
        <div
          ref={calRef}
          className="fixed z-[9999]"
          style={{ top: calPos.top, left: calPos.left, pointerEvents: 'auto' }}
          data-datepicker-calendar=""
        >
          <DatePickerCalendar
            selectedDate={parseIso(value)}
            onSelect={onCalSelect}
            onClose={() => setIsOpen(false)}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>,
        document.body,
      )}
    </div>
  )
}
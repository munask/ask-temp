'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval,
} from 'date-fns'
import { cn } from '@/lib/utils'

interface DatePickerCalendarProps {
  selectedDate: Date | null
  onSelect: (date: Date) => void
  onClose: () => void
  minDate?: Date
  maxDate?: Date
}

const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

const AR_WEEKDAYS = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمس', 'جمع', 'سبت']

type View = 'days' | 'months' | 'years'

export function DatePickerCalendar({
  selectedDate, onSelect, onClose, minDate, maxDate,
}: DatePickerCalendarProps) {
  const [current, setCurrent] = useState(selectedDate || new Date())
  const [view, setView]       = useState<View>('days')
  const [yearBase, setYearBase] = useState(() => {
    const y = (selectedDate || new Date()).getFullYear()
    return Math.floor(y / 16) * 16
  })

  const isDisabled = (date: Date) => {
    if (minDate) { const mn = new Date(minDate); mn.setHours(0,0,0,0); if (date < mn) return true }
    if (maxDate) { const mx = new Date(maxDate); mx.setHours(23,59,59,999); if (date > mx) return true }
    return false
  }

  const monthStart = startOfMonth(current)
  const allDays    = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end:   endOfWeek(endOfMonth(monthStart)),
  })

  const curYear  = current.getFullYear()
  const curMonth = current.getMonth()
  const years    = Array.from({ length: 16 }, (_, i) => yearBase + i)

  const todayDisabled = isDisabled(new Date())

  const NavBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
    >
      {children}
    </button>
  )

  return (
    <div dir="rtl" className="w-72 bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
      <div dir="ltr" className="flex items-center justify-between px-4 py-3 border-b border-border">
        {view === 'days' ? (
          <>
            <NavBtn onClick={() => setCurrent(subMonths(current, 1))}>
              <ChevronLeft className="w-5 h-5" />
            </NavBtn>
            <div className="flex items-center gap-1" dir="rtl">
              <button
                type="button"
                onClick={() => setView('months')}
                className="font-semibold text-sm text-foreground hover:text-primary px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
              >
                {AR_MONTHS[curMonth]}
              </button>
              <button
                type="button"
                onClick={() => { setYearBase(Math.floor(curYear / 16) * 16); setView('years') }}
                className="font-semibold text-sm text-foreground hover:text-primary px-1.5 py-0.5 rounded hover:bg-muted transition-colors tabular-nums"
              >
                {curYear}
              </button>
            </div>
            <NavBtn onClick={() => setCurrent(addMonths(current, 1))}>
              <ChevronRight className="w-5 h-5" />
            </NavBtn>
          </>
        ) : (
          <>
            <NavBtn onClick={() => view === 'months' ? setCurrent(subMonths(current, 12)) : setYearBase(b => b - 16)}>
              <ChevronLeft className="w-5 h-5" />
            </NavBtn>
            <button
              type="button"
              onClick={() => setView('days')}
              className="font-semibold text-sm text-foreground hover:text-primary px-2 py-0.5 rounded hover:bg-muted transition-colors tabular-nums"
              dir="rtl"
            >
              {view === 'months' ? String(curYear) : `${yearBase} – ${yearBase + 15}`}
            </button>
            <NavBtn onClick={() => view === 'months' ? setCurrent(addMonths(current, 12)) : setYearBase(b => b + 16)}>
              <ChevronRight className="w-5 h-5" />
            </NavBtn>
          </>
        )}
      </div>

      {view === 'days' && (
        <div className="p-2">
          <div className="grid grid-cols-7 mb-2 text-center text-xs font-medium text-muted-foreground">
            {AR_WEEKDAYS.map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {allDays.map((date) => {
              const selected = selectedDate && isSameDay(date, selectedDate)
              const inMonth  = isSameMonth(date, monthStart)
              const isToday  = isSameDay(date, new Date())
              const disabled = isDisabled(date)
              return (
                <button
                  key={date.toString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(date)}
                  className={cn(
                    'relative h-10 flex items-center justify-center text-sm transition-all bg-background tabular-nums',
                    !inMonth  ? 'text-muted-foreground/40' : 'text-foreground',
                    selected  ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-bold z-10' : 'hover:bg-muted',
                    isToday && !selected ? 'text-primary font-semibold' : '',
                    disabled  ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
                  )}
                >
                  {date.getDate()}
                  {isToday && !selected && (
                    <span className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {view === 'months' && (
        <div className="p-3 grid grid-cols-3 gap-2">
          {AR_MONTHS.map((name, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setCurrent(new Date(curYear, i, 1)); setView('days') }}
              className={cn(
                'py-2.5 rounded-lg text-sm font-medium transition-colors',
                i === curMonth
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground',
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {view === 'years' && (
        <div className="p-3 grid grid-cols-4 gap-2">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => { setCurrent(new Date(y, curMonth, 1)); setView('days') }}
              className={cn(
                'py-2 rounded-lg text-sm font-medium transition-colors tabular-nums',
                y === curYear
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground',
              )}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 bg-muted/50 border-t border-border flex justify-between">
        <button
          type="button"
          disabled={todayDisabled}
          onClick={() => !todayDisabled && onSelect(new Date())}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          اليوم
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          إغلاق
        </button>
      </div>
    </div>
  )
}

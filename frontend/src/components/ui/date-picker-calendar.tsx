'use client'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameDay, isSameMonth, isValid, parseISO } from 'date-fns'
import { ar } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface DatePickerCalendarProps {
  selectedDate?: Date | null
  onSelect: (date: Date) => void
  onClose: () => void
  minDate?: Date
  maxDate?: Date
}

const WEEKdays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

export function DatePickerCalendar({ selectedDate, onSelect, onClose, minDate, maxDate }: DatePickerCalendarProps) {
  const [view, setView] = React.useState<Date>(selectedDate && isValid(selectedDate) ? selectedDate : new Date())

  const prevMonth = () => setView((v) => subMonths(v, 1))
  const nextMonth = () => setView((v) => addMonths(v, 1))

  const start = startOfWeek(startOfMonth(view), { weekStartsOn: 0 })
  const end   = endOfWeek(endOfMonth(view), { weekStartsOn: 0 })

  const days: Date[] = []
  let d = start
  while (d <= end) {
    days.push(d)
    d = new Date(d.getTime() + 86400000)
  }

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  return (
    <div className="w-[288px] rounded-lg border bg-card shadow-xl" dir="rtl">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <button onClick={prevMonth} className="p-1 hover:bg-accent rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium">
          {format(view, 'MMMM yyyy', { locale: ar })}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-accent rounded">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b">
        {WEEKdays.map((d) => (
          <div key={d} className="py-1.5 text-center text-xs text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 p-1.5 gap-0.5">
        {days.map((day) => {
          const disabled = isDisabled(day)
          const selected = selectedDate && isValid(selectedDate) && isSameDay(day, selectedDate)
          const inMonth  = isSameMonth(day, view)
          const today    = isSameDay(day, new Date())

          return (
            <button
              key={day.toISOString()}
              disabled={disabled}
              onClick={() => !disabled && onSelect(day)}
              className={cn(
                'h-8 w-full rounded text-sm transition-colors',
                'hover:bg-accent',
                !inMonth && 'text-muted-foreground/50',
                disabled && 'opacity-30 cursor-not-allowed hover:bg-transparent',
                selected && 'bg-primary text-primary-foreground hover:bg-primary',
                today && !selected && 'bg-accent font-medium',
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      {/* Today shortcut */}
      <div className="p-2 border-t">
        <button
          onClick={() => onSelect(new Date())}
          className="w-full py-1.5 text-xs text-muted-foreground hover:bg-accent rounded"
        >
          اليوم
        </button>
      </div>
    </div>
  )
}
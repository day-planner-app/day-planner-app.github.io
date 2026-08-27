import type { PlannerView } from '../types'

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export function startOfSundayWeek(date: Date): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay())
  return start
}

export function startOfMonth(date: Date): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  start.setDate(1)
  return start
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function addMonths(date: Date, amount: number): Date {
  const next = new Date(date)
  const day = next.getDate()
  next.setDate(1)
  next.setMonth(next.getMonth() + amount)
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  next.setDate(Math.min(day, lastDay))
  next.setHours(0, 0, 0, 0)
  return next
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b)
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function getWeekDays(anchor: Date): Date[] {
  const start = startOfSundayWeek(anchor)
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

export function getMultiDays(anchor: Date, count = 3): Date[] {
  const start = new Date(anchor)
  start.setHours(0, 0, 0, 0)
  return Array.from({ length: count }, (_, index) => addDays(start, index))
}

export function getMonthGridDays(anchor: Date): Date[] {
  const start = startOfSundayWeek(startOfMonth(anchor))
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

export function daysForView(view: PlannerView, selectedDate: Date): Date[] {
  switch (view) {
    case 'day':
      return getMultiDays(selectedDate, 1)
    case 'multi-day':
      return getMultiDays(selectedDate, 3)
    case 'week':
      return getWeekDays(selectedDate)
    case 'month':
      return getMonthGridDays(selectedDate)
  }
}

export function shiftSelectedDate(view: PlannerView, selectedDate: Date, direction: 1 | -1): Date {
  switch (view) {
    case 'day':
      return addDays(selectedDate, direction)
    case 'multi-day':
      return addDays(selectedDate, direction * 3)
    case 'week':
      return addDays(selectedDate, direction * 7)
    case 'month':
      return addMonths(selectedDate, direction)
  }
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatDayTitle(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRangeTitle(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.getDate()}, ${end.getFullYear()}`
  }

  if (sameYear) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`
  }

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export function formatViewTitle(view: PlannerView, selectedDate: Date, visibleDays: Date[]): string {
  switch (view) {
    case 'day':
      return formatDayTitle(selectedDate)
    case 'multi-day': {
      const start = visibleDays[0]!
      const end = visibleDays[visibleDays.length - 1]!
      return formatRangeTitle(start, end)
    }
    case 'week': {
      const start = visibleDays[0]!
      const end = visibleDays[visibleDays.length - 1]!
      if (isSameMonth(start, end)) {
        return formatMonthYear(start)
      }
      return formatRangeTitle(start, end)
    }
    case 'month':
      return formatMonthYear(selectedDate)
  }
}

export function navUnitLabel(view: PlannerView): string {
  switch (view) {
    case 'day':
      return 'day'
    case 'multi-day':
      return '3 days'
    case 'week':
      return 'week'
    case 'month':
      return 'month'
  }
}

export function formatClock(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return minutes === 0 ? `${hour12}:00 ${period}` : `${hour12}:${String(minutes).padStart(2, '0')} ${period}`
}

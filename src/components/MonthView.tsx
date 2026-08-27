import type { TimeBlock } from '../types'
import { isSameDay, isSameMonth, WEEKDAY_LABELS } from '../lib/week'
import { DayTimeline } from './DayTimeline'

type MonthViewProps = {
  days: Date[]
  focusMonth: Date
  today: Date
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onOpenDay: (date: Date) => void
  blocksByDay: TimeBlock[][]
}

export const MonthView = ({
  days,
  focusMonth,
  today,
  selectedDate,
  onSelectDate,
  onOpenDay,
  blocksByDay,
}: MonthViewProps) => {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-2 pb-24 sm:px-4">
      <div className="grid grid-cols-7 gap-1 pb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-xs font-semibold text-base-content/45"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1.5">
        {days.map((day, index) => (
          <DayTimeline
            key={day.toISOString()}
            day={day}
            density="compact"
            muted={!isSameMonth(day, focusMonth)}
            selected={isSameDay(day, selectedDate)}
            isToday={isSameDay(day, today)}
            blocks={blocksByDay[index] ?? []}
            onSelect={() => onSelectDate(day)}
            onOpenDay={() => onOpenDay(day)}
          />
        ))}
      </div>
    </section>
  )
}

import type { TimeBlock } from '../types'
import { isSameDay, WEEKDAY_LABELS } from '../lib/week'
import { MoonIcon, SunIcon } from './Icons'
import { DayTimeline, type TimelineDensity } from './DayTimeline'

type TimelineGridProps = {
  days: Date[]
  today: Date
  selectedDate: Date
  onSelectDate: (date: Date) => void
  blocksByDay: TimeBlock[][]
  density?: TimelineDensity
}

const columnClass = (count: number) => {
  if (count <= 1) return 'grid-cols-1'
  if (count <= 3) return 'grid-cols-1 sm:grid-cols-3'
  return 'grid-cols-7'
}

export const TimelineGrid = ({
  days,
  today,
  selectedDate,
  onSelectDate,
  blocksByDay,
  density = 'full',
}: TimelineGridProps) => {
  const weekFloor = days.length >= 7 ? 'lg:min-w-[72rem]' : ''

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-auto">
      <div className={`flex min-h-0 flex-1 flex-col ${weekFloor}`}>
        <div className={`grid gap-1 px-2 pb-3 sm:px-4 ${columnClass(days.length)}`}>
          {days.map((day, index) => {
            const selected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, today)

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => onSelectDate(day)}
                className="flex flex-col items-center gap-1 rounded-box py-2 hover:bg-base-100/70"
              >
                <span className="text-xs font-semibold text-base-content/45">
                  {WEEKDAY_LABELS[day.getDay()]}
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-extrabold ${
                    selected
                      ? 'bg-neutral text-neutral-content'
                      : isToday
                        ? 'ring-2 ring-primary'
                        : ''
                  }`}
                >
                  {day.getDate()}
                </span>
                <span className="ritual-stack mt-1 flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-content">
                    <SunIcon width={11} height={11} />
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-content">
                    <MoonIcon width={11} height={11} />
                  </span>
                </span>
                <span className="sr-only">
                  {isToday ? 'Today' : ''} column {index + 1}
                </span>
              </button>
            )
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-24 sm:px-4">
          <div className={`grid min-h-full gap-2 ${columnClass(days.length)}`}>
            {days.map((day, index) => (
              <DayTimeline
                key={day.toISOString()}
                day={day}
                density={density}
                selected={isSameDay(day, selectedDate)}
                isToday={isSameDay(day, today)}
                blocks={blocksByDay[index] ?? []}
                onSelect={() => onSelectDate(day)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

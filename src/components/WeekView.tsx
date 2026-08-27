import type { TimeBlock } from '../types'
import { formatClock, isSameDay, WEEKDAY_LABELS } from '../lib/week'
import { MoonIcon, RepeatIcon, SunIcon } from './Icons'

type WeekViewProps = {
  days: Date[]
  today: Date
  selectedDate: Date
  onSelectDate: (date: Date) => void
  blocksByDay: TimeBlock[][]
}

export const WeekView = ({
  days,
  today,
  selectedDate,
  onSelectDate,
  blocksByDay,
}: WeekViewProps) => {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-auto">
      <div className="flex min-h-0 min-w-[72rem] flex-1 flex-col">
        <div className="grid grid-cols-7 gap-1 px-2 pb-3 sm:px-4">
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
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-content">
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
          <div className="grid min-h-full grid-cols-7 gap-2">
            {days.map((day, index) => (
              <DayColumn
                key={day.toISOString()}
                selected={isSameDay(day, selectedDate)}
                blocks={blocksByDay[index] ?? []}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type DayColumnProps = {
  selected: boolean
  blocks: TimeBlock[]
}

const DayColumn = ({ selected, blocks }: DayColumnProps) => {
  return (
    <article
      className={`rounded-box min-h-[32rem] bg-base-100 px-1 py-4 ${
        selected ? 'ring-1 ring-base-300' : ''
      }`}
    >
      <ul className="timeline timeline-vertical timeline-compact day-timeline w-full">
        {blocks.flatMap((block, index) => {
          const isLast = index === blocks.length - 1
          const items = [
            <li key={block.id} className={!isLast && blocks.length <= 3 ? 'min-h-36' : ''}>
              {index > 0 ? <hr /> : null}
              <div className="timeline-middle">
                <BlockNode kind={block.kind} />
              </div>
              <div className="timeline-end mb-8 w-full min-w-0 pr-1">
                <p className="flex items-center gap-1 text-[11px] font-semibold text-base-content/45">
                  {formatClock(block.start)}
                  {block.kind !== 'task' ? <RepeatIcon /> : null}
                </p>
                <p className="text-sm font-bold leading-tight">{block.title}</p>
              </div>
              {!isLast ? <hr /> : null}
            </li>,
          ]

          if (index === 0 && blocks.length === 2) {
            items.push(
              <li key={`${block.id}-interval`} className="min-h-28">
                <hr />
                <div className="timeline-middle">
                  <span className="h-1.5 w-1.5 rounded-full bg-base-300" />
                </div>
                <div className="timeline-end text-[11px] leading-snug text-base-content/35">
                  Interval over. What&apos;s next?
                </div>
                <hr />
              </li>,
            )
          }

          return items
        })}
      </ul>
    </article>
  )
}

const BlockNode = ({ kind }: { kind: TimeBlock['kind'] }) => {
  if (kind === 'wake') {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-content">
        <SunIcon />
      </span>
    )
  }

  if (kind === 'sleep') {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-content">
        <MoonIcon />
      </span>
    )
  }

  return <span className="h-3 w-3 rounded-full bg-base-300" />
}

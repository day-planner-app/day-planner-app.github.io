import type { TimeBlock } from '../types'
import { formatClock } from '../lib/week'
import { MoonIcon, RepeatIcon, SunIcon } from './Icons'

export type TimelineDensity = 'full' | 'compact'

type DayTimelineProps = {
  day: Date
  blocks: TimeBlock[]
  selected: boolean
  isToday: boolean
  density: TimelineDensity
  muted?: boolean
  onSelect: () => void
  onOpenDay?: () => void
}

export const DayTimeline = ({
  day,
  blocks,
  selected,
  isToday,
  density,
  muted = false,
  onSelect,
  onOpenDay,
}: DayTimelineProps) => {
  if (density === 'compact') {
    return (
      <CompactDayCell
        day={day}
        blocks={blocks}
        selected={selected}
        isToday={isToday}
        muted={muted}
        onSelect={onSelect}
        onOpenDay={onOpenDay}
      />
    )
  }

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

type CompactDayCellProps = {
  day: Date
  blocks: TimeBlock[]
  selected: boolean
  isToday: boolean
  muted: boolean
  onSelect: () => void
  onOpenDay?: () => void
}

const CompactDayCell = ({
  day,
  blocks,
  selected,
  isToday,
  muted,
  onSelect,
  onOpenDay,
}: CompactDayCellProps) => {
  const tasks = blocks.filter((block) => block.kind === 'task')
  const visibleTasks = tasks.slice(0, 2)
  const extraCount = tasks.length - visibleTasks.length

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      className={`flex min-h-28 cursor-pointer flex-col gap-1 rounded-box bg-base-100 p-2 text-left transition-colors hover:bg-base-100/80 ${
        selected ? 'ring-1 ring-base-300' : ''
      } ${muted ? 'opacity-45' : ''}`}
    >
      <div className="flex items-center justify-between gap-1">
        <button
          type="button"
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold ${
            selected
              ? 'bg-neutral text-neutral-content'
              : isToday
                ? 'ring-2 ring-primary'
                : ''
          }`}
          onClick={(event) => {
            event.stopPropagation()
            onSelect()
            onOpenDay?.()
          }}
          aria-label={`Open ${day.toLocaleDateString()} in day view`}
        >
          {day.getDate()}
        </button>
        <span className="ritual-stack flex items-center">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-content">
            <SunIcon width={9} height={9} />
          </span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-secondary-content">
            <MoonIcon width={9} height={9} />
          </span>
        </span>
      </div>

      <ul className="mt-1 flex flex-1 flex-col gap-0.5 overflow-hidden">
        {visibleTasks.map((task) => (
          <li key={task.id} className="truncate text-[11px] font-semibold leading-tight text-base-content/75">
            {task.title}
          </li>
        ))}
        {extraCount > 0 ? (
          <li className="text-[10px] font-semibold text-base-content/45">+{extraCount}</li>
        ) : null}
      </ul>
    </div>
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

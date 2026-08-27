import type { ReactNode } from 'react'
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
      className={`@container rounded-box min-h-[32rem] min-w-0 bg-base-100 px-1 py-4 ${
        selected ? 'ring-1 ring-base-300' : ''
      }`}
    >
      <ul className="timeline timeline-vertical timeline-compact day-timeline w-full">
        {blocks.flatMap((block, index) => {
          const isLast = index === blocks.length - 1
          const rowHeight = isLast
            ? ''
            : blocks.length <= 3
              ? 'min-h-24 @min-[7.5rem]:min-h-36'
              : 'min-h-20 @min-[7.5rem]:min-h-28'
          const items = [
            <li key={block.id} className={rowHeight}>
              {index > 0 ? <hr /> : null}
              <div className="timeline-middle">
                <BlockNode kind={block.kind} />
              </div>
              <div className="timeline-end w-full min-w-0 pr-1">
                <p className="flex items-center gap-1 text-[10px] font-semibold whitespace-nowrap text-base-content/45 @min-[7.5rem]:text-[11px]">
                  {formatClock(block.start)}
                  {block.kind !== 'task' ? (
                    <RepeatIcon className="hidden shrink-0 @min-[7.5rem]:block" />
                  ) : null}
                </p>
                <p className="sr-only text-sm font-bold leading-tight break-words @min-[7.5rem]:not-sr-only">
                  {block.title}
                </p>
              </div>
              {!isLast ? <hr /> : null}
            </li>,
          ]

          if (index === 0 && blocks.length === 2) {
            items.push(
              <li key={`${block.id}-interval`} className="min-h-16 @min-[7.5rem]:min-h-28">
                <hr />
                <div className="timeline-middle">
                  <NodeSlot>
                    <span className="h-1.5 w-1.5 rounded-full bg-base-300" />
                  </NodeSlot>
                </div>
                <div className="timeline-end hidden text-[11px] leading-snug text-base-content/35 @min-[7.5rem]:block">
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
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-content">
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

// Every node occupies the same slot so daisyUI's auto-sized middle column keeps
// the dashed rail and the text edge on one axis, whatever the node inside is.
const NodeSlot = ({ children }: { children: ReactNode }) => (
  <span className="flex h-7 w-7 shrink-0 items-center justify-center @min-[7.5rem]:h-9 @min-[7.5rem]:w-9">
    {children}
  </span>
)

const BlockNode = ({ kind }: { kind: TimeBlock['kind'] }) => {
  if (kind === 'wake') {
    return (
      <NodeSlot>
        <span className="flex h-full w-full items-center justify-center rounded-full bg-accent text-accent-content">
          <SunIcon className="h-3.5 w-3.5 @min-[7.5rem]:h-4 @min-[7.5rem]:w-4" />
        </span>
      </NodeSlot>
    )
  }

  if (kind === 'sleep') {
    return (
      <NodeSlot>
        <span className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-secondary-content">
          <MoonIcon className="h-3.5 w-3.5 @min-[7.5rem]:h-4 @min-[7.5rem]:w-4" />
        </span>
      </NodeSlot>
    )
  }

  return (
    <NodeSlot>
      <span className="h-3 w-3 rounded-full bg-base-300" />
    </NodeSlot>
  )
}

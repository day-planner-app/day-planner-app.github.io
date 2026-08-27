import { useMemo, useState } from 'react'
import { InboxPanel } from './components/InboxPanel'
import { MonthView } from './components/MonthView'
import { PlannerHeader } from './components/PlannerHeader'
import { TimelineGrid } from './components/TimelineGrid'
import { blocksForDate } from './data/samplePlan'
import { PlusIcon } from './components/Icons'
import {
  daysForView,
  formatViewTitle,
  navUnitLabel,
  shiftSelectedDate,
} from './lib/week'
import type { InboxTask, PlannerView } from './types'

const App = () => {
  const today = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])

  const [selectedDate, setSelectedDate] = useState(today)
  const [view, setView] = useState<PlannerView>('week')
  const [inboxOpen, setInboxOpen] = useState(true)
  const [inboxTasks, setInboxTasks] = useState<InboxTask[]>([])

  const visibleDays = useMemo(() => daysForView(view, selectedDate), [view, selectedDate])
  const blocksByDay = useMemo(
    () => visibleDays.map((day) => blocksForDate(day)),
    [visibleDays],
  )
  const title = useMemo(
    () => formatViewTitle(view, selectedDate, visibleDays),
    [view, selectedDate, visibleDays],
  )

  const shift = (direction: 1 | -1) => {
    setSelectedDate(shiftSelectedDate(view, selectedDate, direction))
  }

  const jumpToToday = () => {
    setSelectedDate(today)
  }

  const openDayView = (date: Date) => {
    setSelectedDate(date)
    setView('day')
  }

  const focusInbox = () => {
    setInboxOpen(true)
    window.setTimeout(() => {
      document.getElementById('inbox-input')?.focus()
    }, 0)
  }

  return (
    <div className="flex min-h-svh flex-col bg-base-200">
      <PlannerHeader
        inboxOpen={inboxOpen}
        onToggleInbox={() => setInboxOpen((open) => !open)}
        title={title}
        view={view}
        navUnit={navUnitLabel(view)}
        onViewChange={setView}
        onPrev={() => shift(-1)}
        onNext={() => shift(1)}
        onToday={jumpToToday}
      />

      <div className={`drawer min-h-0 flex-1 ${inboxOpen ? 'lg:drawer-open' : ''}`}>
        <input
          id="inbox-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={inboxOpen}
          onChange={() => setInboxOpen((open) => !open)}
        />

        <div className="drawer-content flex min-h-0 min-w-0 flex-col">
          {view === 'month' ? (
            <MonthView
              days={visibleDays}
              focusMonth={selectedDate}
              today={today}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onOpenDay={openDayView}
              blocksByDay={blocksByDay}
            />
          ) : (
            <TimelineGrid
              days={visibleDays}
              today={today}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              blocksByDay={blocksByDay}
            />
          )}

          <div className="fab">
            <button
              type="button"
              className="btn btn-lg btn-circle btn-primary"
              aria-label="Add to inbox"
              onClick={focusInbox}
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        <div className="drawer-side z-30 h-full">
          <label htmlFor="inbox-drawer" aria-label="Close inbox" className="drawer-overlay lg:hidden" />
          <InboxPanel
            tasks={inboxTasks}
            onAddTask={(taskTitle) =>
              setInboxTasks((current) => [{ id: crypto.randomUUID(), title: taskTitle }, ...current])
            }
          />
        </div>
      </div>
    </div>
  )
}

export default App

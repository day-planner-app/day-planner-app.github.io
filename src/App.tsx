import { useMemo, useState } from 'react'
import { InboxPanel } from './components/InboxPanel'
import { PlannerHeader } from './components/PlannerHeader'
import { WeekView } from './components/WeekView'
import { blocksForDate } from './data/samplePlan'
import { PlusIcon } from './components/Icons'
import { addDays, getWeekDays, isSameDay, startOfSundayWeek } from './lib/week'
import type { InboxTask, PlannerView } from './types'

const App = () => {
  const today = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])

  const [anchorDate, setAnchorDate] = useState(today)
  const [selectedDate, setSelectedDate] = useState(today)
  const [view, setView] = useState<PlannerView>('week')
  const [inboxOpen, setInboxOpen] = useState(true)
  const [inboxTasks, setInboxTasks] = useState<InboxTask[]>([])

  const days = useMemo(() => getWeekDays(anchorDate), [anchorDate])
  const blocksByDay = useMemo(() => days.map((day) => blocksForDate(day)), [days])

  const shiftWeek = (amount: number) => {
    const nextAnchor = addDays(startOfSundayWeek(anchorDate), amount * 7)
    setAnchorDate(nextAnchor)
    const nextDays = getWeekDays(nextAnchor)
    if (!nextDays.some((day) => isSameDay(day, selectedDate))) {
      const todayInWeek = nextDays.find((day) => isSameDay(day, today))
      setSelectedDate(todayInWeek ?? nextDays[0]!)
    }
  }

  const jumpToToday = () => {
    setAnchorDate(today)
    setSelectedDate(today)
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
        monthLabelDate={anchorDate}
        view={view}
        onViewChange={setView}
        onPrevWeek={() => shiftWeek(-1)}
        onNextWeek={() => shiftWeek(1)}
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
          {view === 'week' ? (
            <WeekView
              days={days}
              today={today}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date)
                setAnchorDate(date)
              }}
              blocksByDay={blocksByDay}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="card w-full max-w-md bg-base-100 shadow-none">
                <div className="card-body text-center">
                  <h2 className="card-title justify-center">
                    {view === 'month' ? 'Month view is next' : 'This view is next'}
                  </h2>
                  <p className="text-base-content/60">
                    Week view is first: Sunday through Saturday, with wake and sleep as the day&apos;s
                    bookends. Day, multi-day, and month will use the same timeline.
                  </p>
                  <div className="card-actions justify-center">
                    <button type="button" className="btn btn-primary" onClick={() => setView('week')}>
                      Back to week
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
            onAddTask={(title) =>
              setInboxTasks((current) => [{ id: crypto.randomUUID(), title }, ...current])
            }
          />
        </div>
      </div>
    </div>
  )
}

export default App

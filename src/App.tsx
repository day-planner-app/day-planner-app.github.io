import { useMemo, useState } from 'react'
import { MonthView } from './components/MonthView'
import { PlannerHeader } from './components/PlannerHeader'
import { TimelineGrid } from './components/TimelineGrid'
import { blocksForDate } from './data/samplePlan'
import {
  daysForView,
  formatViewTitle,
  navUnitLabel,
  shiftSelectedDate,
} from './lib/week'
import type { PlannerView } from './types'

const App = () => {
  const today = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])

  const [selectedDate, setSelectedDate] = useState(today)
  const [view, setView] = useState<PlannerView>('week')

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

  return (
    <div className="flex min-h-svh flex-col bg-base-200">
      <PlannerHeader
        title={title}
        view={view}
        navUnit={navUnitLabel(view)}
        onViewChange={setView}
        onPrev={() => shift(-1)}
        onNext={() => shift(1)}
        onToday={jumpToToday}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
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
      </div>
    </div>
  )
}

export default App

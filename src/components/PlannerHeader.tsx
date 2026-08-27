import type { PlannerView } from '../types'
import { ArrowLeftIcon, ArrowRightIcon, ChevronIcon } from './Icons'

type PlannerHeaderProps = {
  title: string
  view: PlannerView
  navUnit: string
  onViewChange: (view: PlannerView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onNewDay?: () => void
}

const views: Array<{ id: PlannerView; label: string }> = [
  { id: 'day', label: 'Day' },
  { id: 'multi-day', label: '3 Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

export const PlannerHeader = ({
  title,
  view,
  navUnit,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onNewDay,
}: PlannerHeaderProps) => {
  return (
    <header className="navbar min-h-16 gap-3 bg-transparent px-3 py-2 lg:px-5">
      <div className="navbar-start w-auto shrink-0">
        {onNewDay ? (
          <button type="button" className="btn btn-ghost rounded-full" onClick={onNewDay}>
            New day
          </button>
        ) : null}
      </div>

      <div className="navbar-center flex flex-1 items-center justify-center gap-3">
        <div className="dropdown">
          <button type="button" tabIndex={0} className="btn btn-ghost gap-1 text-lg font-extrabold">
            {title}
            <ChevronIcon />
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box z-20 mt-2 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <button type="button" onClick={onToday}>
                Jump to today
              </button>
            </li>
          </ul>
        </div>
        <div className="join">
          <button
            type="button"
            className="btn btn-ghost join-item btn-square"
            aria-label={`Previous ${navUnit}`}
            onClick={onPrev}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            className="btn btn-ghost join-item btn-square"
            aria-label={`Next ${navUnit}`}
            onClick={onNext}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div className="navbar-end w-auto min-w-0 shrink gap-2">
        <select
          className="select select-sm w-28 rounded-full border-none bg-base-100 sm:hidden"
          value={view}
          onChange={(event) => onViewChange(event.target.value as PlannerView)}
          aria-label="Calendar view"
        >
          {views.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <div className="join hidden overflow-hidden rounded-full bg-base-100 sm:inline-flex">
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`btn join-item border-none shadow-none ${
                view === item.id ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

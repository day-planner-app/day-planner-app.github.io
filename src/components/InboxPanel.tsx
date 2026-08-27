import { useState, type FormEvent } from 'react'
import type { InboxTask } from '../types'
import { PlusIcon, ThoughtsIcon } from './Icons'

type InboxPanelProps = {
  tasks: InboxTask[]
  onAddTask: (title: string) => void
}

export const InboxPanel = ({ tasks, onAddTask }: InboxPanelProps) => {
  const [draft, setDraft] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const title = draft.trim()
    if (!title) return
    onAddTask(title)
    setDraft('')
  }

  return (
    <aside className="flex min-h-full w-80 flex-col bg-base-200 p-4">
      <form className="relative" onSubmit={submit}>
        <input
          id="inbox-input"
          type="text"
          className="input w-full rounded-full border-none bg-base-100 pr-12 shadow-none"
          placeholder="Add a new inbox task..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary btn-circle btn-sm absolute top-1/2 right-1.5 -translate-y-1/2"
          aria-label="Add inbox task"
        >
          <PlusIcon width={16} height={16} />
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-content">
            <ThoughtsIcon />
          </span>
          <h2 className="text-lg font-extrabold">Your unstructured thoughts</h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/55">
            Capture tasks and thoughts as they come. Move them to your timeline when you are ready
            to schedule.
          </p>
        </div>
      ) : (
        <ul className="mt-4 flex flex-1 flex-col gap-2 overflow-auto">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-box bg-base-100 px-4 py-3 text-sm font-medium">
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

import type { TimeBlock } from '../types'
import { toDateKey } from '../lib/week'

const weekdayTasks: Record<number, Array<Pick<TimeBlock, 'title' | 'start'>>> = {
  0: [{ title: 'Slow morning', start: '10:00' }],
  1: [
    { title: 'Deep work', start: '09:30' },
    { title: 'Team sync', start: '14:00' },
  ],
  2: [{ title: 'Focus block', start: '11:00' }],
  3: [
    { title: 'Planning review', start: '09:15' },
    { title: 'Walk outside', start: '16:30' },
  ],
  4: [{ title: 'Ship checklist', start: '13:00' }],
  5: [{ title: 'Wrap the week', start: '15:00' }],
  6: [],
}

export function blocksForDate(date: Date): TimeBlock[] {
  const key = toDateKey(date)
  const extras = (weekdayTasks[date.getDay()] ?? []).map((item, index) => ({
    id: `${key}-task-${index}`,
    title: item.title,
    start: item.start,
    kind: 'task' as const,
  }))

  return [
    { id: `${key}-wake`, title: 'Wake up', start: '08:00', kind: 'wake' },
    ...extras,
    { id: `${key}-sleep`, title: 'Go to bed', start: '22:00', kind: 'sleep' },
  ]
}

export type PlannerView = 'day' | 'multi-day' | 'week' | 'month'

export type BlockKind = 'wake' | 'sleep' | 'task'

export type TimeBlock = {
  id: string
  title: string
  start: string
  kind: BlockKind
}

export type InboxTask = {
  id: string
  title: string
}

export type PlanIntent = {
  title: string
  category: 'work' | 'personal'
  durationMinutes: number
}

export type DayPlan = Record<string, TimeBlock[]>

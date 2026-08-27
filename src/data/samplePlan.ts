import type { DayPlan, TimeBlock } from '../types'
import { toDateKey } from '../lib/week'
import { defaultBlocksForDate } from '../lib/schedule'

export function blocksForDate(date: Date, planByDate: DayPlan = {}): TimeBlock[] {
  const key = toDateKey(date)
  return planByDate[key] ?? defaultBlocksForDate(date)
}

import type { TimeBlock } from '../types'
import { MOCK_PLAN_DELAY_MS } from './plannerSettings'
import { parseIntent, scheduleIntent, withDayBookends } from './schedule'

/**
 * Mock planner agent. Swap this module for a real model API later —
 * keep the same `planDay(intent, date) => Promise<TimeBlock[]>` contract.
 */
export async function planDay(intentText: string, date: Date): Promise<TimeBlock[]> {
  await delay(MOCK_PLAN_DELAY_MS)

  const intent = parseIntent(intentText)
  const scheduled = scheduleIntent(date, intent, [])
  return withDayBookends(date, scheduled)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

import type { PlanIntent, TimeBlock } from '../types'
import { toDateKey } from './week'
import {
  BREAK_MINUTES,
  DEFAULT_PERSONAL_DURATION_MINUTES,
  DEFAULT_WORK_DURATION_MINUTES,
  PERSONAL_EVENING_START,
  POMODORO_MINUTES,
  SLEEP_TIME,
  WAKE_TIME,
  WORK_END,
  WORK_START,
} from './plannerSettings'

const PERSONAL_KEYWORDS = [
  'gym',
  'workout',
  'run',
  'running',
  'yoga',
  'dinner',
  'lunch with',
  'walk',
  'meditate',
  'meditation',
  'personal',
  'errand',
  'shop',
  'shopping',
  'cook',
  'hike',
  'swim',
  'coffee with',
  'date',
  'family',
]

const GYM_LIKE = ['gym', 'workout', 'run', 'running', 'yoga', 'swim', 'hike']

export function minutesFromClock(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function clockFromMinutes(total: number): string {
  const clamped = Math.max(0, Math.min(total, 24 * 60 - 1))
  const hours = Math.floor(clamped / 60)
  const minutes = clamped % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function parseIntent(raw: string): PlanIntent {
  const trimmed = raw.trim()
  const lower = trimmed.toLowerCase()
  const category: PlanIntent['category'] = PERSONAL_KEYWORDS.some((keyword) =>
    lower.includes(keyword),
  )
    ? 'personal'
    : 'work'

  const durationMinutes =
    parseDurationMinutes(lower) ??
    (category === 'work' ? DEFAULT_WORK_DURATION_MINUTES : DEFAULT_PERSONAL_DURATION_MINUTES)

  const title = cleanTitle(trimmed)

  return { title, category, durationMinutes }
}

function parseDurationMinutes(text: string): number | null {
  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i)
  if (hourMatch) {
    return Math.round(Number(hourMatch[1]) * 60)
  }

  const minuteMatch = text.match(/(\d+)\s*(?:minutes?|mins?|m)\b/i)
  if (minuteMatch) {
    return Number(minuteMatch[1])
  }

  const aboutMatch = text.match(/about\s+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)?/i)
  if (aboutMatch) {
    const value = Number(aboutMatch[1])
    return value <= 10 ? Math.round(value * 60) : Math.round(value)
  }

  return null
}

function cleanTitle(raw: string): string {
  return (
    raw
      .replace(/\babout\s+\d+(?:\.\d+)?\s*(?:hours?|hrs?|h|minutes?|mins?|m)\b/gi, '')
      .replace(/\bfor\s+\d+(?:\.\d+)?\s*(?:hours?|hrs?|h|minutes?|mins?|m)\b/gi, '')
      .replace(/\b\d+(?:\.\d+)?\s*(?:hours?|hrs?|h|minutes?|mins?|m)\b/gi, '')
      .replace(/[,.]+$/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim() || 'Focus block'
  )
}

type Window = { start: number; end: number }

function workWindows(date: Date): Window[] {
  const day = date.getDay()
  if (day === 0 || day === 6) return []
  return [{ start: minutesFromClock(WORK_START), end: minutesFromClock(WORK_END) }]
}

function personalWindows(date: Date, preferEvening: boolean): Window[] {
  const day = date.getDay()
  const wake = minutesFromClock(WAKE_TIME)
  const sleep = minutesFromClock(SLEEP_TIME)
  const workStart = minutesFromClock(WORK_START)
  const workEnd = minutesFromClock(WORK_END)
  const evening = minutesFromClock(PERSONAL_EVENING_START)

  if (day === 0 || day === 6) {
    return [{ start: wake, end: sleep }]
  }

  const morning: Window = { start: wake, end: workStart }
  const afterWork: Window = { start: preferEvening ? evening : workEnd, end: sleep }
  return preferEvening ? [afterWork, morning] : [afterWork, morning]
}

function occupiedIntervals(blocks: TimeBlock[]): Window[] {
  return blocks
    .filter((block) => block.kind === 'task')
    .map((block) => {
      const start = minutesFromClock(block.start)
      return { start, end: start + POMODORO_MINUTES }
    })
    .sort((a, b) => a.start - b.start)
}

function findSlot(windows: Window[], occupied: Window[], duration: number): number | null {
  for (const window of windows) {
    let cursor = window.start
    const relevant = occupied.filter(
      (slot) => slot.end > window.start && slot.start < window.end,
    )

    for (const busy of relevant) {
      if (busy.start - cursor >= duration && cursor + duration <= window.end) {
        return cursor
      }
      cursor = Math.max(cursor, busy.end)
    }

    if (window.end - cursor >= duration) {
      return cursor
    }
  }
  return null
}

function pomodoroChunks(durationMinutes: number): number[] {
  if (durationMinutes <= POMODORO_MINUTES) {
    return [durationMinutes]
  }

  const full = Math.floor(durationMinutes / POMODORO_MINUTES)
  const remainder = durationMinutes % POMODORO_MINUTES
  const chunks = Array.from({ length: full }, () => POMODORO_MINUTES)
  if (remainder >= 10) {
    chunks.push(remainder)
  } else if (remainder > 0 && chunks.length > 0) {
    chunks[chunks.length - 1] = (chunks[chunks.length - 1] ?? POMODORO_MINUTES) + remainder
  }
  return chunks.length > 0 ? chunks : [durationMinutes]
}

function placeChunks(
  date: Date,
  intent: PlanIntent,
  windows: Window[],
  existing: TimeBlock[],
): TimeBlock[] {
  const key = toDateKey(date)
  const chunks = pomodoroChunks(intent.durationMinutes)
  const placed: TimeBlock[] = []
  const occupied = occupiedIntervals(existing)
  let labelIndex = 1

  for (const chunk of chunks) {
    let start = findSlot(windows, occupied, chunk)
    if (start === null) {
      const lastEnd = occupied.reduce((max, slot) => Math.max(max, slot.end), minutesFromClock(WAKE_TIME))
      const sleep = minutesFromClock(SLEEP_TIME)
      start = Math.min(lastEnd + BREAK_MINUTES, sleep - chunk)
    }

    const block: TimeBlock = {
      id: `${key}-planned-${crypto.randomUUID().slice(0, 8)}`,
      title: chunks.length > 1 ? `${intent.title} (${labelIndex}/${chunks.length})` : intent.title,
      start: clockFromMinutes(start),
      kind: 'task',
    }
    placed.push(block)
    const padBreak = labelIndex < chunks.length ? BREAK_MINUTES : 0
    occupied.push({ start, end: start + chunk + padBreak })
    occupied.sort((a, b) => a.start - b.start)
    labelIndex += 1
  }

  return placed
}

export function scheduleIntent(date: Date, intent: PlanIntent, existing: TimeBlock[]): TimeBlock[] {
  const preferEvening = GYM_LIKE.some((keyword) => intent.title.toLowerCase().includes(keyword))
  const windows =
    intent.category === 'work' ? workWindows(date) : personalWindows(date, preferEvening)

  const effectiveWindows =
    windows.length > 0
      ? windows
      : personalWindows(date, preferEvening)

  return placeChunks(date, intent, effectiveWindows, existing)
}

export function withDayBookends(date: Date, tasks: TimeBlock[]): TimeBlock[] {
  const key = toDateKey(date)
  const wake: TimeBlock = {
    id: `${key}-wake`,
    title: 'Wake up',
    start: WAKE_TIME,
    kind: 'wake',
  }
  const sleep: TimeBlock = {
    id: `${key}-sleep`,
    title: 'Go to bed',
    start: SLEEP_TIME,
    kind: 'sleep',
  }

  return [wake, ...tasks, sleep].sort(
    (a, b) => minutesFromClock(a.start) - minutesFromClock(b.start),
  )
}

export function defaultBlocksForDate(date: Date): TimeBlock[] {
  return withDayBookends(date, [])
}

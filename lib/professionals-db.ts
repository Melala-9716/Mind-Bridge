import { format } from 'date-fns'

export type WeeklyDaySchedule = {
  day: string
  available: boolean
  start: string
  end: string
}

export type ProfessionalRecord = {
  id: string
  full_name: string
  /** Not returned by public listing API — optional when loaded from restricted sources. */
  email?: string
  password?: string
  specialization: string
  hospital: string
  city: string
  languages: string[]
  weekly_schedule: WeeklyDaySchedule[]
  created_at: string
  rating?: number | null
  bio?: string | null
}

export const WEEKDAYS_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

/** Default Mon–Fri 08:00–17:00, weekends off (registration + API fallback). */
export const DEFAULT_WEEKLY_SCHEDULE: WeeklyDaySchedule[] = [
  { day: 'Monday', available: true, start: '08:00', end: '17:00' },
  { day: 'Tuesday', available: true, start: '08:00', end: '17:00' },
  { day: 'Wednesday', available: true, start: '08:00', end: '17:00' },
  { day: 'Thursday', available: true, start: '08:00', end: '17:00' },
  { day: 'Friday', available: true, start: '08:00', end: '17:00' },
  { day: 'Saturday', available: false, start: '08:00', end: '17:00' },
  { day: 'Sunday', available: false, start: '08:00', end: '17:00' },
]

const DAY_INDEX: Record<string, number> = WEEKDAYS_ORDER.reduce(
  (acc, d, i) => {
    acc[d] = i
    return acc
  },
  {} as Record<string, number>,
)

const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
}

function dayOrderIndex(day: string): number {
  const i = DAY_INDEX[day]
  return i === undefined ? -1 : i
}

function coerceDayEntry(raw: unknown, fallbackDay: string): WeeklyDaySchedule {
  if (!raw || typeof raw !== 'object') {
    return { day: fallbackDay, available: false, start: '08:00', end: '17:00' }
  }
  const o = raw as Record<string, unknown>
  const day = typeof o.day === 'string' && o.day ? o.day : fallbackDay
  const start = typeof o.start === 'string' && o.start ? o.start : '08:00'
  const end = typeof o.end === 'string' && o.end ? o.end : '17:00'
  const available = o.available === true
  return { day, available, start, end }
}

/** Normalize Supabase `jsonb` weekly_schedule into a fixed Mon–Sun array. */
export function normalizeWeeklySchedule(raw: unknown): WeeklyDaySchedule[] {
  const byDay = new Map<string, WeeklyDaySchedule>()
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const e = coerceDayEntry(item, 'Monday')
      if (DAY_INDEX[e.day] !== undefined) {
        byDay.set(e.day, e)
      }
    }
  }
  return WEEKDAYS_ORDER.map((day) => {
    const found = byDay.get(day)
    if (found) return { ...found }
    return { ...DEFAULT_WEEKLY_SCHEDULE[DAY_INDEX[day]] }
  })
}

function parseTimeToMinutes(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim())
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h < 0 || h > 23 || min < 0 || min > 59) return null
  return h * 60 + min
}

export function isValidDayTimeRange(start: string, end: string): boolean {
  const a = parseTimeToMinutes(start)
  const b = parseTimeToMinutes(end)
  if (a === null || b === null) return false
  return b > a
}

function formatHhMmToAmPm(hhmm: string): string {
  const mins = parseTimeToMinutes(hhmm)
  if (mins === null) return hhmm
  const h24 = Math.floor(mins / 60)
  const m = mins % 60
  const period = h24 >= 12 ? 'PM' : 'AM'
  let h12 = h24 % 12
  if (h12 === 0) h12 = 12
  const mm = m.toString().padStart(2, '0')
  return `${h12}:${mm} ${period}`
}

export function formatTimeWindowCatalog(start: string, end: string): string {
  return `${formatHhMmToAmPm(start)} - ${formatHhMmToAmPm(end)}`
}

function formatDayRangeLabel(days: string[]): string {
  if (days.length === 0) return ''
  if (days.length === 1) return DAY_SHORT[days[0]] ?? days[0].slice(0, 3)
  const first = days[0]
  const last = days[days.length - 1]
  const a = DAY_SHORT[first] ?? first
  const b = DAY_SHORT[last] ?? last
  return `${a} – ${b}`
}

export type ProfessionalAvailabilityLiveState = 'available_now' | 'limited_availability' | 'offline'

const LIVE_STATE_LABEL: Record<ProfessionalAvailabilityLiveState, string> = {
  available_now: 'Available Now',
  limited_availability: 'Limited Availability',
  offline: 'Offline',
}

export function getProfessionalAvailabilityLiveStateLabel(
  state: ProfessionalAvailabilityLiveState,
): string {
  return LIVE_STATE_LABEL[state]
}

/**
 * Uses the visitor’s local clock vs today’s schedule window [start, end).
 * `offline` = no working days; `available_now` = today on and now inside hours;
 * otherwise `limited_availability` (has hours elsewhere / later today / not in window).
 */
export function getProfessionalAvailabilityLiveState(
  schedule: unknown,
  referenceDate: Date = new Date(),
): ProfessionalAvailabilityLiveState {
  const normalized = normalizeWeeklySchedule(schedule)
  const anyWorking = normalized.some((d) => d.available && isValidDayTimeRange(d.start, d.end))
  if (!anyWorking) return 'offline'

  const todayName = format(referenceDate, 'EEEE')
  const today = normalized.find((d) => d.day === todayName)
  const nowM = referenceDate.getHours() * 60 + referenceDate.getMinutes()

  if (today?.available && isValidDayTimeRange(today.start, today.end)) {
    const s = parseTimeToMinutes(today.start)
    const e = parseTimeToMinutes(today.end)
    if (s !== null && e !== null && nowM >= s && nowM < e) {
      return 'available_now'
    }
  }

  return 'limited_availability'
}

export function initialsFromFullName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase() || '?'
}

/** Humanize stored specialization slug e.g. psychiatrist → Psychiatrist */
export function formatSpecializationTitle(raw: string): string {
  const s = raw.trim()
  if (!s) return 'Professional'
  const spaced = s.replace(/-/g, ' ')
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Summary for filters / legacy copy (comma-separated days). */
export function buildAvailabilitySummary(schedule: WeeklyDaySchedule[] | null | undefined): string {
  const normalized = schedule ? normalizeWeeklySchedule(schedule) : []
  if (!normalized.length) return 'Availability not set'
  const availableDays = normalized.filter((item) => item.available).map((item) => item.day)
  if (availableDays.length === 0) return 'Currently unavailable'
  if (availableDays.length === 7) return 'Available all week'
  return `Available: ${availableDays.join(', ')}`
}

export type AvailabilityCardText = {
  /** One or two lines for UI (e.g. “Available Today…” or “Available: Mon–Fri…”). */
  lines: string[]
}

/**
 * Card copy from real `weekly_schedule`: prefers “Available Today • Until …” when applicable,
 * otherwise grouped weekday ranges with times (e.g. Mon–Fri • 8:00 AM – 5:00 PM).
 */
export function formatProfessionalAvailabilityForCard(
  schedule: unknown,
  referenceDate: Date = new Date(),
): AvailabilityCardText {
  const normalized = normalizeWeeklySchedule(schedule)
  const available = normalized.filter((d) => d.available)
  if (available.length === 0) {
    return { lines: ['Currently unavailable'] }
  }

  const todayName = format(referenceDate, 'EEEE')
  const today = normalized.find((d) => d.day === todayName)
  if (today?.available && isValidDayTimeRange(today.start, today.end)) {
    return {
      lines: [`Available Today • Until ${formatHhMmToAmPm(today.end)}`],
    }
  }

  const groups: { days: string[]; start: string; end: string }[] = []
  for (const d of normalized) {
    if (!d.available || !isValidDayTimeRange(d.start, d.end)) continue
    const last = groups[groups.length - 1]
    const dIdx = dayOrderIndex(d.day)
    const lastDay = last?.days[last.days.length - 1]
    const lastIdx = lastDay !== undefined ? dayOrderIndex(lastDay) : -2
    const consecutive = last !== undefined && dIdx === lastIdx + 1
    if (last && consecutive && last.start === d.start && last.end === d.end) {
      last.days.push(d.day)
    } else {
      groups.push({ days: [d.day], start: d.start, end: d.end })
    }
  }

  if (groups.length === 0) {
    return { lines: ['Availability not set'] }
  }

  const parts = groups.map(
    (g) => `${formatDayRangeLabel(g.days)} • ${formatTimeWindowCatalog(g.start, g.end)}`,
  )
  return { lines: [parts.join(' · ')] }
}

/** Split sorted day names into consecutive runs (Mon–Wed, Fri, …). */
function splitDaysIntoConsecutiveRuns(sortedDays: string[]): string[][] {
  const runs: string[][] = []
  let cur: string[] = []
  for (const d of sortedDays) {
    if (cur.length === 0) {
      cur = [d]
      continue
    }
    const last = cur[cur.length - 1]!
    if (dayOrderIndex(d) === dayOrderIndex(last) + 1) cur.push(d)
    else {
      runs.push(cur)
      cur = [d]
    }
  }
  if (cur.length) runs.push(cur)
  return runs
}

/** Comma-separated ranges, e.g. `Mon – Fri, Sun` for non–same-slot groups. */
function formatDayChunkList(sortedDays: string[]): string {
  const runs = splitDaysIntoConsecutiveRuns(sortedDays)
  return runs.map((r) => formatDayRangeLabel(r)).join(', ')
}

/**
 * Full-week compact summary for directory cards (no “today only” shortcut).
 * Each hours block: line of days, then line of times (e.g. Mon – Fri / 8–5).
 */
export function formatWeeklyScheduleFullWeekCardSummary(schedule: unknown): string[] {
  const normalized = normalizeWeeklySchedule(schedule)
  const bySlot = new Map<string, string[]>()
  for (const d of normalized) {
    if (!d.available || !isValidDayTimeRange(d.start, d.end)) continue
    const key = `${d.start}|${d.end}`
    if (!bySlot.has(key)) bySlot.set(key, [])
    bySlot.get(key)!.push(d.day)
  }
  if (bySlot.size === 0) return ['No weekly hours set']

  const blocks = [...bySlot.entries()].map(([key, days]) => {
    const [start, end] = key.split('|')
    const sorted = [...new Set(days)].sort((a, b) => dayOrderIndex(a) - dayOrderIndex(b))
    return { start, end, sorted }
  })
  blocks.sort((a, b) => dayOrderIndex(a.sorted[0]!) - dayOrderIndex(b.sorted[0]!))

  const out: string[] = []
  for (const b of blocks) {
    out.push(formatDayChunkList(b.sorted))
    out.push(formatTimeWindowCatalog(b.start, b.end))
  }
  return out
}

export type ProfileScheduleRow = {
  day: string
  timeLabel: string
  detail?: string
  variant: 'active' | 'offline' | 'limited'
}

/** One row per weekday for profile / weekly table UI. */
export function getWeeklyScheduleProfileRows(schedule: unknown): ProfileScheduleRow[] {
  const normalized = normalizeWeeklySchedule(schedule)
  return normalized.map((d) => {
    if (!d.available) {
      return { day: d.day, timeLabel: 'Offline', variant: 'offline' as const }
    }
    if (!isValidDayTimeRange(d.start, d.end)) {
      return { day: d.day, timeLabel: 'Offline', variant: 'offline' as const }
    }
    const s = parseTimeToMinutes(d.start)
    const e = parseTimeToMinutes(d.end)
    const mins = s !== null && e !== null ? e - s : 0
    if (mins <= 240) {
      return {
        day: d.day,
        timeLabel: 'Limited hours',
        detail: formatTimeWindowCatalog(d.start, d.end),
        variant: 'limited' as const,
      }
    }
    return { day: d.day, timeLabel: formatTimeWindowCatalog(d.start, d.end), variant: 'active' as const }
  })
}

export const PROFESSIONAL_BIO_PLACEHOLDER =
  'This professional has not added a bio yet. You can learn more about their practice from their weekly availability and languages listed above.'

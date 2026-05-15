'use client'

import { CalendarClock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { WeeklyDaySchedule } from '@/lib/professionals-db'
import { WEEKDAYS_ORDER } from '@/lib/professionals-db'

type ProfessionalWeeklyScheduleFormProps = {
  value: WeeklyDaySchedule[]
  onChange: (next: WeeklyDaySchedule[]) => void
}

export function ProfessionalWeeklyScheduleForm({ value, onChange }: ProfessionalWeeklyScheduleFormProps) {
  const rowFor = (day: string) => value.find((d) => d.day === day)

  const updateDay = (day: string, patch: Partial<WeeklyDaySchedule>) => {
    onChange(value.map((d) => (d.day === day ? { ...d, ...patch } : d)))
  }

  return (
    <Card className="border border-border/90 bg-gradient-to-b from-muted/30 to-background p-4 sm:p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
          <CalendarClock className="h-4 w-4 text-primary" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Weekly Availability Schedule</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Choose which days you accept sessions and your hours. Patients will see this on your public profile.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {WEEKDAYS_ORDER.map((day) => {
          const row =
            rowFor(day) ?? ({ day, available: false, start: '08:00', end: '17:00' } satisfies WeeklyDaySchedule)
          const disabled = !row.available
          return (
            <div
              key={day}
              className={cn(
                'rounded-xl border px-3 py-3 sm:px-4 transition-colors',
                row.available
                  ? 'border-primary/30 bg-background shadow-sm'
                  : 'border-border/70 bg-muted/20',
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Switch
                    id={`weekly-avail-${day}`}
                    checked={row.available}
                    onCheckedChange={(checked) =>
                      updateDay(day, {
                        available: checked,
                        ...(checked
                          ? {
                              start: row.start || '08:00',
                              end: row.end || '17:00',
                            }
                          : {}),
                      })
                    }
                    aria-label={`${day} available`}
                  />
                  <Label
                    htmlFor={`weekly-avail-${day}`}
                    className="text-sm font-medium text-foreground cursor-pointer truncate"
                  >
                    {day}
                  </Label>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground w-10 shrink-0 sm:text-xs">
                      Start
                    </span>
                    <Input
                      type="time"
                      step={60}
                      value={row.start}
                      disabled={disabled}
                      onChange={(e) => updateDay(day, { start: e.target.value })}
                      className="h-9 w-[7.25rem] text-sm tabular-nums bg-background disabled:opacity-50"
                      aria-label={`${day} start time`}
                    />
                  </div>
                  <span
                    className="text-muted-foreground text-xs px-0.5 select-none hidden sm:inline"
                    aria-hidden
                  >
                    →
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground w-10 shrink-0 sm:text-xs">
                      End
                    </span>
                    <Input
                      type="time"
                      step={60}
                      value={row.end}
                      disabled={disabled}
                      onChange={(e) => updateDay(day, { end: e.target.value })}
                      className="h-9 w-[7.25rem] text-sm tabular-nums bg-background disabled:opacity-50"
                      aria-label={`${day} end time`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

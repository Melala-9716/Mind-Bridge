'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ProfileScheduleRow } from '@/lib/professionals-db'

const rowVariant: Record<ProfileScheduleRow['variant'], string> = {
  active: 'bg-emerald-500/8 border-emerald-500/15 text-foreground',
  limited: 'bg-amber-500/8 border-amber-500/15 text-foreground',
  offline: 'bg-muted/40 border-border/60 text-muted-foreground',
}

const dotVariant: Record<ProfileScheduleRow['variant'], string> = {
  active: 'bg-emerald-500',
  limited: 'bg-amber-500',
  offline: 'bg-muted-foreground/40',
}

export function ProfessionalWeeklyScheduleTable({ rows }: { rows: ProfileScheduleRow[] }) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-sm">
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground">Weekly availability</h2>
        <p className="mt-1 text-xs text-muted-foreground">Hours saved from registration — shown exactly as configured.</p>
      </div>
      <div className="divide-y divide-border/50">
        {rows.map((row) => (
          <div
            key={row.day}
            className={cn(
              'grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[minmax(0,9rem)_1fr] sm:items-center sm:gap-4',
              rowVariant[row.variant],
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn('h-2 w-2 shrink-0 rounded-full', dotVariant[row.variant])} aria-hidden />
              <span className="text-sm font-semibold text-foreground">{row.day}</span>
            </div>
            <div className="min-w-0 pl-4 sm:pl-0">
              <p className="text-sm font-medium leading-snug">{row.timeLabel}</p>
              {row.detail ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{row.detail}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

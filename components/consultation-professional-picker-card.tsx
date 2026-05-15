'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { initialsFromFullName, type ProfessionalAvailabilityLiveState } from '@/lib/professionals-db'

export type ConsultationPickerStatus = ProfessionalAvailabilityLiveState

function statusLabel(state: ConsultationPickerStatus): string {
  if (state === 'available_now') return 'Available'
  if (state === 'limited_availability') return 'Busy'
  return 'Offline'
}

const statusTone: Record<ConsultationPickerStatus, string> = {
  available_now:
    'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100',
  limited_availability:
    'border-amber-500/25 bg-amber-500/10 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-50',
  offline: 'border-border/60 bg-muted/60 text-muted-foreground',
}

export type ConsultationProfessionalPickerCardProps = {
  legalName: string
  displayName: string
  displayRole: string
  languages: string[]
  status: ConsultationPickerStatus
  isSelected: boolean
  onSelect: () => void
}

export function ConsultationProfessionalPickerCard({
  legalName,
  displayName,
  displayRole,
  languages,
  status,
  isSelected,
  onSelect,
}: ConsultationProfessionalPickerCardProps) {
  const initials = initialsFromFullName(legalName)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-xl border bg-card/90 p-3 text-left shadow-sm backdrop-blur-sm transition-all duration-300 ease-out',
        'hover:border-primary/35 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isSelected
          ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_8px_28px_hsl(var(--primary)/0.18)] ring-2 ring-primary/25'
          : 'border-border/70',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tracking-wide text-primary-foreground shadow-sm transition-colors duration-300',
            isSelected
              ? 'bg-gradient-to-br from-primary to-primary/80'
              : 'bg-gradient-to-br from-primary/85 to-primary/65',
          )}
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-foreground">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{displayRole}</p>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none tracking-tight',
                statusTone[status],
              )}
            >
              {statusLabel(status)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {languages.length > 0 ? (
              languages.map((lang) => (
                <Badge
                  key={lang}
                  variant="secondary"
                  className="h-5 rounded-md px-1.5 text-[10px] font-normal text-muted-foreground"
                >
                  {lang}
                </Badge>
              ))
            ) : (
              <span className="text-[10px] text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

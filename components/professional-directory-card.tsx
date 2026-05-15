'use client'

import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProfessionalAvailabilityLiveState } from '@/lib/professionals-db'
import { formatSpecializationTitle, getProfessionalAvailabilityLiveStateLabel, initialsFromFullName } from '@/lib/professionals-db'

export type ProfessionalPublicCardModel = {
  id: string
  name: string
  displayName?: string
  role: string
  displayRole?: string
  hospital: string
  city: string
  languages: string[]
  /** Full-week compact lines from `weekly_schedule` (not “today only”). */
  weeklyScheduleSummaryLines: string[]
  liveState: ProfessionalAvailabilityLiveState
  rating: number
}

const statusBadgeClass: Record<ProfessionalAvailabilityLiveState, string> = {
  available_now:
    'border-emerald-400/70 bg-emerald-500/20 text-emerald-900 dark:border-emerald-500/50 dark:bg-emerald-500/15 dark:text-emerald-50',
  limited_availability:
    'border-amber-400/70 bg-amber-400/20 text-amber-950 dark:border-amber-500/50 dark:bg-amber-400/12 dark:text-amber-50',
  offline: 'border-border bg-muted/90 text-muted-foreground dark:bg-muted/40',
}

const shellClassName = cn(
  'relative flex h-full flex-col rounded-2xl border border-white/50 bg-white/60 p-5 text-left shadow-[0_8px_32px_rgba(15,23,42,0.07)] backdrop-blur-xl',
  'dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
  'transition-all duration-300 ease-out will-change-transform',
  'hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_48px_rgba(15,23,42,0.12)]',
  'dark:hover:border-primary/30 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
)

type ProfessionalDirectoryCardProps = {
  professional: ProfessionalPublicCardModel
  variant?: 'directory' | 'picker'
  isSelected?: boolean
  onPickerSelect?: () => void
  /** When false, hides “View Profile” (e.g. on the profile page itself). */
  showViewProfile?: boolean
}

export function ProfessionalDirectoryCard({
  professional: prof,
  variant = 'directory',
  isSelected,
  onPickerSelect,
  showViewProfile = true,
}: ProfessionalDirectoryCardProps) {
  const title = prof.displayName ?? prof.name
  const roleLine = prof.displayRole ?? formatSpecializationTitle(prof.role)
  const initials = initialsFromFullName(prof.name)
  const cityLabel = prof.city.replace(/-/g, ' ')
  const consultationHref = `/consultation?professionalId=${encodeURIComponent(prof.id)}&professional=${encodeURIComponent(prof.name)}&type=${encodeURIComponent(prof.role)}`

  const body = (
    <>
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/75 text-base font-bold tracking-wide text-primary-foreground shadow-md ring-2 ring-white/50 dark:ring-white/10"
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          <Badge className="mt-2 rounded-full border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary hover:bg-primary/15">
            {roleLine}
          </Badge>
        </div>
      </div>

      <div className="mt-5 space-y-1 border-t border-border/50 pt-4">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground/90">{prof.hospital}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary/70" aria-hidden />
          <span className="capitalize">{cityLabel}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Languages</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {prof.languages.length > 0 ? (
            prof.languages.map((lang) => (
              <Badge key={`${prof.id}-${lang}`} variant="outline" className="rounded-md border-border/70 text-[11px] font-normal">
                {lang}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weekly schedule</p>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground whitespace-pre-line">
          {prof.weeklyScheduleSummaryLines.join('\n')}
        </p>
        <div
          className={cn(
            'mt-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-tight',
            statusBadgeClass[prof.liveState],
          )}
        >
          {getProfessionalAvailabilityLiveStateLabel(prof.liveState)}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-4">
        <Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden />
        <span className="text-base font-bold tabular-nums tracking-tight text-foreground">{prof.rating.toFixed(1)}</span>
      </div>

      {variant === 'directory' && (
        <div className={cn('mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch', !showViewProfile && 'sm:flex-col')}>
          {showViewProfile ? (
            <Button variant="outline" size="default" className="flex-1 rounded-xl border-border/80 bg-background/80 shadow-sm" asChild>
              <Link href={`/professionals/${prof.id}`}>View Profile</Link>
            </Button>
          ) : null}
          <Button
            size="default"
            className={cn(
              'rounded-xl font-semibold shadow-md transition-all duration-200',
              'hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
              showViewProfile ? 'flex-1' : 'w-full',
            )}
            asChild
          >
            <Link href={consultationHref}>Book Session</Link>
          </Button>
        </div>
      )}
    </>
  )

  if (variant === 'picker') {
    return (
      <button
        type="button"
        onClick={onPickerSelect}
        className={cn(
          shellClassName,
          'p-4 sm:p-5',
          isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background dark:ring-offset-background',
        )}
      >
        {body}
      </button>
    )
  }

  return <div className={cn(shellClassName, 'sm:p-6')}>{body}</div>
}

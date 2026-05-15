'use client'

import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Demo-only baseline “ratings” (not persisted, not from any server). */
const DEMO_BASE_RATINGS: readonly number[] = [5, 4, 5, 4, 5]

type ProfessionalPatientReviewsPanelProps = {
  /** Reserved for layout / future use; rating UI is fully local. */
  professionalId: string
}

export function ProfessionalPatientReviewsPanel({ professionalId }: ProfessionalPatientReviewsPanelProps) {
  void professionalId

  const [sessionRatings, setSessionRatings] = useState<number[]>(() => [...DEMO_BASE_RATINGS])
  const [rating, setRating] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { displayAverage, count } = useMemo(() => {
    const n = sessionRatings.length
    if (n === 0) return { displayAverage: null as number | null, count: 0 }
    const sum = sessionRatings.reduce((a, b) => a + b, 0)
    return { displayAverage: sum / n, count: n }
  }, [sessionRatings])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    if (rating < 1 || rating > 5) {
      setError('Please choose a star rating.')
      return
    }
    setSessionRatings((prev) => [...prev, rating])
    setSuccess(true)
    setRating(0)
  }

  return (
    <Card className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <h2 className="text-base font-semibold tracking-tight text-foreground">Rate this professional</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Demo only — stars update this page in memory only. Nothing is sent or stored.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
        {displayAverage !== null ? (
          <>
            <div className="flex items-center gap-1" aria-hidden>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    'h-5 w-5',
                    n <= Math.round(displayAverage) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30',
                  )}
                />
              ))}
            </div>
            <span className="text-lg font-bold tabular-nums text-foreground">{displayAverage.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              demo average · {count} sample{count !== 1 ? 's' : ''}
            </span>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No demo ratings.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-border/50 pt-6">
        <div className="flex flex-wrap items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setSuccess(false)
                setRating(n)
              }}
              className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`${n} out of 5 stars`}
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  n <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/35',
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-xs text-muted-foreground">{rating > 0 ? `${rating} / 5` : 'Tap stars to rate'}</span>
        </div>

        <Button type="submit" className="rounded-xl">
          Submit rating
        </Button>

        {success ? (
          <p
            role="status"
            className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-900 dark:text-emerald-100"
          >
            Rating submitted successfully
          </p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </form>
    </Card>
  )
}

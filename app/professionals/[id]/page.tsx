'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { ProfessionalPatientReviewsPanel } from '@/components/professional-patient-reviews-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  formatSpecializationTitle,
  initialsFromFullName,
  type ProfessionalRecord,
} from '@/lib/professionals-db'
import { readProfessionalSession, subscribeProfessionalSession } from '@/lib/professional-auth-storage'
import { siteCopy } from '@/lib/site-copy'

export default function ProfessionalProfilePage() {
  const t = siteCopy
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params?.id[0] : ''

  const isViewingOwnProfile = useSyncExternalStore(
    subscribeProfessionalSession,
    () => {
      const auth = readProfessionalSession()
      return Boolean(auth?.id && id && auth.id === id)
    },
    () => false,
  )

  const [record, setRecord] = useState<ProfessionalRecord | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/professionals', { cache: 'no-store' })
      const payload = (await response.json()) as { professionals?: ProfessionalRecord[] }
      if (!response.ok || !Array.isArray(payload.professionals)) {
        setRecord(null)
        setNotFound(true)
        return
      }
      const row = payload.professionals.find((p) => p.id === id)
      if (!row) {
        setRecord(null)
        setNotFound(true)
        return
      }
      setRecord(row)
      setNotFound(false)
    } catch {
      setRecord(null)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const initials = record ? initialsFromFullName(record.full_name) : ''
  const cityLabel = record ? record.city.replace(/-/g, ' ') : ''
  /** Demo-only static display (not loaded from reviews or persisted ratings). */
  const profileRatingDisplay = 4.8
  const bioText = record?.bio?.trim()
  const consultationHref = record
    ? `/consultation?professionalId=${encodeURIComponent(record.id)}&professional=${encodeURIComponent(record.full_name)}&type=${encodeURIComponent(record.specialization)}`
    : '/consultation'

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-background to-background dark:from-slate-950/90">
      <Navigation />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {isViewingOwnProfile ? (
              <>
                <Button variant="default" size="sm" className="gap-2 rounded-full px-3 shadow-sm" asChild>
                  <Link href="/professional/dashboard/profile">
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    {t.viewProfileBackDashboard}
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full border-dashed"
                  onClick={() => router.back()}
                >
                  {t.viewProfileGoBack}
                </Button>
              </>
            ) : null}
            <Button variant="ghost" size="sm" className="gap-2 rounded-full px-2" asChild>
              <Link href="/professionals">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {t.viewProfileBrowseDirectory}
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <Card className="rounded-2xl border border-border/60 p-12 text-center text-sm text-muted-foreground shadow-sm">
            {t.viewProfileLoading}
          </Card>
        ) : notFound || !record ? (
          <Card className="rounded-2xl border border-dashed border-border/80 p-10 text-center shadow-sm">
            <p className="font-medium text-foreground">{t.viewProfileNotFoundTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.viewProfileNotFoundDesc}</p>
            <Button className="mt-6 rounded-xl" asChild>
              <Link href="/professionals">{t.viewProfileBrowseDirectory}</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-lg backdrop-blur-md">
              <div className="border-b border-border/60 bg-gradient-to-br from-primary/12 via-transparent to-transparent px-6 py-8 sm:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/75 text-2xl font-bold tracking-wide text-primary-foreground shadow-inner ring-4 ring-white/60 dark:ring-white/10">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{record.full_name}</h1>
                      <Badge className="mt-2 rounded-full border-primary/25 bg-primary/12 px-3 py-0.5 text-xs font-semibold text-primary">
                        {formatSpecializationTitle(record.specialization)}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium leading-snug text-foreground/90">{record.hospital}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 capitalize">
                        <MapPin className="h-4 w-4 text-primary/70" aria-hidden />
                        {cityLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {record.languages?.length ? (
                        record.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="rounded-md text-xs font-normal">
                            {lang}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">{t.viewProfileLanguagesMissing}</span>
                      )}
                    </div>
                    {bioText ? (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground line-clamp-4">{bioText}</p>
                    ) : null}
                    <div className="flex items-center gap-2 pt-2">
                      <Star className="h-6 w-6 fill-amber-400 text-amber-400" aria-hidden />
                      <span className="text-xl font-bold tabular-nums text-foreground">{profileRatingDisplay.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">{t.viewProfileDemoRating}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button className="rounded-xl shadow-md" asChild>
                        <Link href={consultationHref}>{t.bookSession}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <ProfessionalPatientReviewsPanel professionalId={record.id} />
          </div>
        )}
      </div>
    </div>
  )
}

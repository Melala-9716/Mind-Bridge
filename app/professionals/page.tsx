'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { ProfessionalDirectoryCard, type ProfessionalPublicCardModel } from '@/components/professional-directory-card'
import { ProfessionalDirectorySkeletonGrid } from '@/components/professional-directory-skeleton'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { BriefcaseMedical } from 'lucide-react'
import {
  formatSpecializationTitle,
  normalizeWeeklySchedule,
  type ProfessionalRecord,
} from '@/lib/professionals-db'
import { professionalRecordToPublicCard } from '@/lib/professional-card-map'
import { siteCopy, type SiteCopy } from '@/lib/site-copy'

const AVAILABILITY_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

function weekdayLabel(day: string, t: SiteCopy): string {
  switch (day) {
    case 'Monday':
      return t.weekdayMonday
    case 'Tuesday':
      return t.weekdayTuesday
    case 'Wednesday':
      return t.weekdayWednesday
    case 'Thursday':
      return t.weekdayThursday
    case 'Friday':
      return t.weekdayFriday
    case 'Saturday':
      return t.weekdaySaturday
    case 'Sunday':
      return t.weekdaySunday
    default:
      return day
  }
}

type ListedProfessional = ProfessionalPublicCardModel & {
  availabilityDays: string[]
}

function mapRecordToListed(item: ProfessionalRecord): ListedProfessional {
  const schedule = normalizeWeeklySchedule(item.weekly_schedule)
  return {
    ...professionalRecordToPublicCard(item),
    availabilityDays: schedule.filter((d) => d.available).map((d) => d.day),
  }
}

export default function ProfessionalsPage() {
  const t = siteCopy
  const [professionals, setProfessionals] = useState<ListedProfessional[]>([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedAvailabilityDay, setSelectedAvailabilityDay] = useState('any')

  const loadProfessionals = useCallback(async () => {
    try {
      const response = await fetch('/api/professionals', { cache: 'no-store' })
      const payload = (await response.json()) as { professionals?: ProfessionalRecord[]; error?: string }
      if (response.ok && Array.isArray(payload.professionals)) {
        setProfessionals(payload.professionals.map(mapRecordToListed))
      } else {
        console.error('[professionals page] /api/professionals failed:', response.status, payload)
        setProfessionals([])
      }
    } catch (err) {
      console.error('[professionals page] /api/professionals network error:', err)
      setProfessionals([])
    } finally {
      setInitialLoad(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('mindbridge:professionals-refresh')) {
      sessionStorage.removeItem('mindbridge:professionals-refresh')
    }
    void loadProfessionals()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void loadProfessionals()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [loadProfessionals])

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((prof) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        prof.name.toLowerCase().includes(q) ||
        prof.role.toLowerCase().includes(q) ||
        formatSpecializationTitle(prof.role).toLowerCase().includes(q)
      const matchesRole = selectedRole === 'all' || prof.role.toLowerCase() === selectedRole.toLowerCase()
      const matchesLanguage =
        selectedLanguage === 'all' ||
        (selectedLanguage === 'Other'
          ? prof.languages.some((lang) => !['English', 'Amharic', 'Oromo', 'Afaan Oromo'].includes(lang))
          : prof.languages.some((lang) => lang.toLowerCase() === selectedLanguage.toLowerCase()))
      const matchesAvailability =
        selectedAvailabilityDay === 'any' || prof.availabilityDays.includes(selectedAvailabilityDay)
      return matchesSearch && matchesRole && matchesLanguage && matchesAvailability
    })
  }, [professionals, searchQuery, selectedRole, selectedLanguage, selectedAvailabilityDay])

  const roleOptions = useMemo(() => {
    const roles = new Set<string>()
    professionals.forEach((prof) => {
      if (prof.role) roles.add(prof.role)
    })
    return Array.from(roles)
  }, [professionals])

  const showDatabaseEmpty = !initialLoad && professionals.length === 0
  const showNoFilterMatch = !initialLoad && professionals.length > 0 && filteredProfessionals.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-background to-background dark:from-slate-950/80 dark:via-background dark:to-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.mentalHealthProfessionals}</h1>
          <p className="text-lg text-muted-foreground">{t.professionalsLiveSource}</p>
        </div>

        <div className="mb-8 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm dark:bg-card/50">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{t.searchNameOrRole}</label>
              <Input
                placeholder={t.searchProfessionalPlaceholder}
                className="bg-background/90"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{t.professionalRole}</label>
              <select
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-foreground"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">{t.allRolesOption}</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {formatSpecializationTitle(role)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{t.languages}</label>
              <select
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-foreground"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="all">{t.allLanguagesOption}</option>
                <option value="English">English</option>
                <option value="Amharic">Amharic</option>
                <option value="Oromo">Oromo</option>
                <option value="Other">{t.otherLanguage}</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{t.availabilityDayFilter}</label>
              <select
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-foreground"
                value={selectedAvailabilityDay}
                onChange={(e) => setSelectedAvailabilityDay(e.target.value)}
              >
                <option value="any">{t.anyAvailabilityDay}</option>
                {AVAILABILITY_DAYS.map((day) => (
                  <option key={day} value={day}>
                    {weekdayLabel(day, t)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {initialLoad ? (
          <ProfessionalDirectorySkeletonGrid count={6} />
        ) : showDatabaseEmpty ? (
          <Card className="rounded-2xl border border-dashed border-border/80 bg-card/60 py-20 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto flex max-w-md flex-col items-center px-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background shadow-inner">
                <BriefcaseMedical className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-foreground">{t.noProfessionalsRegistered}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.noProfessionalsRegisteredDesc}</p>
            </div>
          </Card>
        ) : showNoFilterMatch ? (
          <Card className="rounded-2xl border border-border/70 bg-card/70 py-14 text-center shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-foreground">{t.noProfessionalsFilterMatch}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.noProfessionalsFilterHint}</p>
          </Card>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {t.showingProfessionalsCount.replace('{count}', String(filteredProfessionals.length))}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionals.map((prof) => (
                <ProfessionalDirectoryCard key={prof.id} professional={prof} variant="directory" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

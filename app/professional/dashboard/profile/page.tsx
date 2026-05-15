'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ExternalLink, AlertCircle, X } from 'lucide-react'
import { ProfessionalWeeklyScheduleForm } from '@/components/professional-weekly-schedule-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DEFAULT_WEEKLY_SCHEDULE,
  isValidDayTimeRange,
  normalizeWeeklySchedule,
  type ProfessionalRecord,
  type WeeklyDaySchedule,
} from '@/lib/professionals-db'

import {
  PROFESSIONAL_AUTH_KEY,
  readProfessionalSession,
  type ProfessionalAuthStored,
} from '@/lib/professional-auth-storage'

type Session = Pick<ProfessionalAuthStored, 'id' | 'full_name'>

const LANGUAGE_OPTIONS = [
  'English',
  'Amharic',
  'Afaan Oromo',
  'Somali',
  'Tigrinya',
  'Gurage',
  'Sidama',
  'Hadiyya',
  'Gamo',
  'Wolaita',
  'Kaffa',
  'Berta',
  'Nuer',
  'Maale',
  'Daasanach',
] as const

export default function ProfessionalDashboardProfilePage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [hospital, setHospital] = useState('')
  const [city, setCity] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [customLanguage, setCustomLanguage] = useState('')
  const [bio, setBio] = useState('')
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyDaySchedule[]>(
    DEFAULT_WEEKLY_SCHEDULE.map((d) => ({ ...d })),
  )
  const [password, setPassword] = useState('')

  const load = useCallback(async () => {
    const s = readProfessionalSession()
    if (!s) {
      setLoading(false)
      return
    }
    setSession(s)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/professionals', { cache: 'no-store' })
      const payload = (await res.json()) as { professionals?: ProfessionalRecord[] }
      const row = Array.isArray(payload.professionals)
        ? payload.professionals.find((p) => p.id === s.id)
        : undefined
      if (!row) {
        setError('Could not load your profile from the directory.')
        return
      }
      const allowed = ['psychiatrist', 'psychologist', 'counselor', 'therapist', 'social-worker'] as const
      const rawSpec = row.specialization?.trim().toLowerCase().replace(/\s+/g, '-') || 'psychologist'
      setFullName(row.full_name ?? '')
      setSpecialization(allowed.includes(rawSpec as (typeof allowed)[number]) ? rawSpec : 'psychologist')
      setHospital(row.hospital ?? '')
      setCity(row.city ?? '')
      setLanguages(Array.isArray(row.languages) ? [...row.languages] : [])
      setBio(typeof row.bio === 'string' ? row.bio : '')
      setWeeklySchedule(normalizeWeeklySchedule(row.weekly_schedule))
    } catch {
      setError('Network error while loading profile.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    )
  }

  const addCustomLanguage = () => {
    const t = customLanguage.trim()
    if (!t) return
    if (languages.some((l) => l.toLowerCase() === t.toLowerCase())) {
      setCustomLanguage('')
      return
    }
    setLanguages((prev) => [...prev, t])
    setCustomLanguage('')
  }

  const scheduleValid = useMemo(() => {
    const anyDay = weeklySchedule.some((d) => d.available)
    if (!anyDay) return false
    return !weeklySchedule.some((d) => d.available && !isValidDayTimeRange(d.start, d.end))
  }, [weeklySchedule])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!session?.id) return
    if (!fullName.trim() || !specialization.trim() || !hospital.trim() || !city.trim()) {
      setError('Full name, specialization, hospital, and city are required.')
      return
    }
    if (languages.length === 0) {
      setError('Select at least one language.')
      return
    }
    if (!scheduleValid) {
      setError('Fix your weekly schedule: pick at least one day and ensure end time is after start time.')
      return
    }
    if (!password.trim()) {
      setError('Enter your account password to save changes.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/professionals/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          fullName: fullName.trim(),
          specialization: specialization.trim(),
          hospital: hospital.trim(),
          city: city.trim(),
          languages,
          bio,
          weeklySchedule,
        }),
      })
      const payload = (await res.json()) as {
        error?: string
        professional?: ProfessionalRecord
      }
      if (!res.ok) {
        setError(payload.error ?? 'Could not save.')
        return
      }

      if (payload.professional && typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem(PROFESSIONAL_AUTH_KEY)
          const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
          localStorage.setItem(
            PROFESSIONAL_AUTH_KEY,
            JSON.stringify({
              ...prev,
              ...payload.professional,
              id: session.id,
            }),
          )
          sessionStorage.setItem('mindbridge:professionals-refresh', '1')
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new Event('professional-auth-updated'))
      }

      setPassword('')
      toast.success('Profile updated successfully')
      void load()
    } catch {
      setError('Could not save.')
    } finally {
      setSaving(false)
    }
  }

  if (!session && !loading) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Your profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Updates apply to your public listing, consultation picker, and booking links immediately after you save.
          </p>
        </div>
        {session?.id ? (
          <Button variant="outline" size="sm" className="shrink-0 gap-2 rounded-xl shadow-sm" asChild>
            <Link href={`/professionals/${session.id}`}>
              <ExternalLink className="h-4 w-4" aria-hidden />
              View public profile
            </Link>
          </Button>
        ) : null}
      </div>

      {loading ? (
        <Card className="rounded-2xl border border-border/70 p-12 text-center text-sm text-muted-foreground shadow-sm">
          Loading your profile…
        </Card>
      ) : (
        <form onSubmit={(e) => void handleSave(e)} className="space-y-6">
          <Card className="rounded-2xl border border-border/70 p-5 shadow-md sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="dash-fullName">Full name</Label>
                <Input
                  id="dash-fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label>Specialization</Label>
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                    <SelectItem value="psychologist">Psychologist</SelectItem>
                    <SelectItem value="counselor">Counselor</SelectItem>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="social-worker">Social Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dash-city">City</Label>
                <Input
                  id="dash-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-xl"
                  placeholder="e.g. addis-ababa or Addis Ababa"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="dash-hospital">Hospital / clinic</Label>
                <Input
                  id="dash-hospital"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Languages</Label>
                {languages.length > 0 ? (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="gap-1 rounded-lg pr-1 text-xs font-medium">
                        {lang}
                        <button
                          type="button"
                          className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                          aria-label={`Remove ${lang}`}
                          onClick={() => setLanguages((prev) => prev.filter((l) => l !== lang))}
                        >
                          <X className="h-3 w-3 opacity-70" aria-hidden />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <Badge
                      key={lang}
                      variant={languages.includes(lang) ? 'default' : 'outline'}
                      className="cursor-pointer rounded-lg px-3 py-1 text-xs font-medium"
                      onClick={() => toggleLanguage(lang)}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Input
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    placeholder="Other language"
                    className="max-w-xs rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCustomLanguage()
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" className="rounded-xl" onClick={addCustomLanguage}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="dash-bio">Bio</Label>
                <Textarea
                  id="dash-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={6}
                  maxLength={4000}
                  className="rounded-xl text-sm"
                  placeholder="How you work, who you serve, and what patients can expect…"
                />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5">
              <ProfessionalWeeklyScheduleForm value={weeklySchedule} onChange={setWeeklySchedule} />
            </div>

            <div className="mt-8 space-y-2 border-t border-border/60 pt-6">
              <Label htmlFor="dash-password">Account password (required to save)</Label>
              <PasswordInput
                id="dash-password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="max-w-md rounded-xl"
              />
            </div>

            {error ? (
              <Alert variant="destructive" className="mt-4 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-8 text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => void load()} disabled={saving}>
                Reset from server
              </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}

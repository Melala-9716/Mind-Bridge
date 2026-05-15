'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { ProfessionalWeeklyScheduleForm } from '@/components/professional-weekly-schedule-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import {
  DEFAULT_WEEKLY_SCHEDULE,
  normalizeWeeklySchedule,
  type ProfessionalRecord,
  type WeeklyDaySchedule,
} from '@/lib/professionals-db'

type Auth = { id: string; email?: string; full_name?: string }

export default function EditProfessionalProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params?.id[0] : ''

  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState('')
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyDaySchedule[]>(
    DEFAULT_WEEKLY_SCHEDULE.map((d) => ({ ...d })),
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false)
      setAllowed(false)
      return
    }
    let auth: Auth | null = null
    try {
      const raw = localStorage.getItem('professionalAuth')
      if (raw) auth = JSON.parse(raw) as Auth
    } catch {
      auth = null
    }
    if (!auth?.id || auth.id !== id) {
      setAllowed(false)
      setLoading(false)
      return
    }
    setAllowed(true)
    setLoading(true)
    try {
      const res = await fetch('/api/professionals', { cache: 'no-store' })
      const payload = (await res.json()) as { professionals?: ProfessionalRecord[] }
      const row = Array.isArray(payload.professionals) ? payload.professionals.find((p) => p.id === id) : undefined
      if (row) {
        setBio(typeof row.bio === 'string' ? row.bio : '')
        setWeeklySchedule(normalizeWeeklySchedule(row.weekly_schedule))
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!password.trim()) {
      setError('Enter your account password to save changes.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/professionals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          bio,
          weeklySchedule,
        }),
      })
      const payload = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(payload.error ?? 'Could not save.')
        return
      }
      router.push(`/professionals/${id}`)
    } catch {
      setError('Could not save.')
    } finally {
      setSaving(false)
    }
  }

  if (!loading && !allowed) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <Card className="rounded-2xl border border-dashed p-8">
            <p className="font-medium text-foreground">Sign in as this professional to edit</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in from Professional Access, then open this page again.
            </p>
            <Button className="mt-6 rounded-xl" asChild>
              <Link href="/professional-login">Go to professional login</Link>
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-background to-background">
      <Navigation />
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-6 gap-2 rounded-full px-2" asChild>
          <Link href={`/professionals/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </Link>
        </Button>

        {loading ? (
          <Card className="rounded-2xl p-10 text-center text-sm text-muted-foreground">Loading…</Card>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="rounded-2xl border border-border/70 p-5 shadow-sm sm:p-6">
              <h1 className="text-lg font-semibold text-foreground">Edit profile</h1>
              <p className="mt-1 text-xs text-muted-foreground">Update your public bio and weekly hours.</p>

              <div className="mt-5 space-y-2">
                <Label htmlFor="bio">About you</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  maxLength={2500}
                  placeholder="Brief bio for patients (specialties, approach, populations you serve)…"
                  className="rounded-xl bg-background text-sm"
                />
              </div>

              <div className="mt-6">
                <ProfessionalWeeklyScheduleForm value={weeklySchedule} onChange={setWeeklySchedule} />
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="pw">Account password (required to save)</Label>
                <PasswordInput
                  id="pw"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {error ? (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Button type="submit" className="mt-6 w-full rounded-xl" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </Card>
          </form>
        )}
      </div>
    </div>
  )
}

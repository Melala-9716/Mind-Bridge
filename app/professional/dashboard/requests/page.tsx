'use client'

import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Inbox, Loader2, Mail, Phone, User, Calendar, MessageSquare, Languages } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { readProfessionalSession } from '@/lib/professional-auth-storage'

type ConsultationRequestRow = {
  id: string
  professional_id: string
  full_name: string | null
  email: string | null
  phone: string | null
  message: string | null
  preferred_time: string | null
  contact_method: string | null
  preferred_languages: string[] | null
  status: string
  created_at: string
}

function formatPreferredTimeDisplay(value: string | null) {
  if (!value) return '—'
  const v = value.toLowerCase()
  if (v === 'today') return 'Today'
  if (v === 'this-week') return 'This week'
  if (v === 'flexible') return 'Flexible'
  return value
}

function statusBadgeClass(status: string) {
  const s = status.toLowerCase()
  if (s === 'accepted') return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100'
  if (s === 'declined') return 'border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-100'
  return 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-50'
}

export default function ProfessionalDashboardRequestsPage() {
  const [session, setSession] = useState(() => readProfessionalSession())
  const [requests, setRequests] = useState<ConsultationRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [actingId, setActingId] = useState<string | null>(null)

  useEffect(() => {
    setSession(readProfessionalSession())
  }, [])

  const load = useCallback(async () => {
    const s = readProfessionalSession()
    setSession(s)
    if (!s?.id) {
      setRequests([])
      setLoading(false)
      return
    }
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch(`/api/professionals/${encodeURIComponent(s.id)}/consultation-requests`, {
        cache: 'no-store',
      })
      const payload = (await res.json()) as { requests?: ConsultationRequestRow[]; error?: string }
      if (!res.ok) {
        setLoadError(payload.error ?? 'Could not load requests.')
        setRequests([])
        return
      }
      setRequests(Array.isArray(payload.requests) ? payload.requests : [])
    } catch {
      setLoadError('Network error while loading requests.')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const updateStatus = async (requestId: string, status: 'accepted' | 'declined') => {
    if (!password.trim()) {
      toast.error('Enter your account password to accept or decline.')
      return
    }
    setActingId(requestId)
    try {
      const res = await fetch(`/api/consultation-requests/${encodeURIComponent(requestId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, status }),
      })
      const payload = (await res.json()) as { error?: string; request?: ConsultationRequestRow }
      if (!res.ok) {
        toast.error(payload.error ?? 'Could not update request.')
        return
      }
      toast.success(status === 'accepted' ? 'Request accepted.' : 'Request declined.')
      setPassword('')
      if (payload.request) {
        setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, ...payload.request } : r)))
      } else {
        await load()
      }
    } catch {
      toast.error('Network error. Try again.')
    } finally {
      setActingId(null)
    }
  }

  if (!session?.id) {
    return (
      <Card className="rounded-2xl border border-border/70 p-10 text-center shadow-md">
        <Inbox className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">Sign in as a professional to view consultation requests.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Consultation requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Online session requests from users who chose you in the directory. Accept or decline using your account
          password below.
        </p>
      </div>

      <Card className="rounded-2xl border border-border/70 p-4 shadow-sm sm:p-5">
        <Label htmlFor="req-account-password" className="text-xs font-medium text-muted-foreground">
          Account password (for accept / decline)
        </Label>
        <PasswordInput
          id="req-account-password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 max-w-md rounded-xl"
          placeholder="••••••••"
        />
      </Card>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span className="text-sm">Loading requests…</span>
        </div>
      ) : loadError ? (
        <Card className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button type="button" variant="outline" className="mt-4 rounded-xl" onClick={() => void load()}>
            Retry
          </Button>
        </Card>
      ) : requests.length === 0 ? (
        <Card className="rounded-2xl border border-dashed border-border/80 p-10 text-center">
          <Inbox className="mx-auto h-10 w-10 text-primary/70" aria-hidden />
          <p className="mt-4 text-sm text-muted-foreground">
            No consultation requests yet. When someone books you from the consultation form, their request will appear
            here.
          </p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => {
            const langs = Array.isArray(r.preferred_languages) ? r.preferred_languages : []
            const pending = r.status === 'pending'
            return (
              <li key={r.id}>
                <Card className="rounded-2xl border border-border/80 p-4 shadow-md sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{r.full_name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">Request ID · {r.id.slice(0, 8)}…</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`rounded-full capitalize ${statusBadgeClass(r.status)}`}>
                      {r.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="flex gap-2 rounded-xl bg-muted/40 px-3 py-2">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Contact</p>
                        {r.email ? (
                          <p className="break-words text-foreground">
                            <span className="text-muted-foreground">Email: </span>
                            {r.email}
                          </p>
                        ) : null}
                        {r.phone ? (
                          <p className={`break-words text-foreground ${r.email ? 'mt-1' : ''}`}>
                            <span className="text-muted-foreground">Phone: </span>
                            {r.phone}
                          </p>
                        ) : null}
                        {!r.email && !r.phone ? <p className="text-foreground">—</p> : null}
                      </div>
                    </div>
                    <div className="flex gap-2 rounded-xl bg-muted/40 px-3 py-2">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Preferred time</p>
                        <p className="text-foreground">{formatPreferredTimeDisplay(r.preferred_time)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 rounded-xl bg-muted/40 px-3 py-2">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Contact method</p>
                        <p className="capitalize text-foreground">{r.contact_method ?? '—'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 rounded-xl bg-muted/40 px-3 py-2">
                      <Languages className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Preferred languages</p>
                        <p className="text-foreground">{langs.length ? langs.join(', ') : '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 rounded-xl border border-border/70 bg-card px-3 py-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Reason for consultation</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{r.message ?? '—'}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    Submitted {format(new Date(r.created_at), 'MMM d, yyyy · h:mm a')}
                  </p>

                  {pending ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-xl"
                        disabled={actingId === r.id}
                        onClick={() => void updateStatus(r.id, 'accepted')}
                      >
                        {actingId === r.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                            Updating…
                          </>
                        ) : (
                          'Accept'
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        disabled={actingId === r.id}
                        onClick={() => void updateStatus(r.id, 'declined')}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : null}
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

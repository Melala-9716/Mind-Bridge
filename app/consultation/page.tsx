'use client'

import { Suspense, useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { CheckCircle2, AlertCircle, X, Globe, ChevronDown, History, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteCopy } from '@/lib/site-copy'
import { ConsultationProfessionalPickerCard } from '@/components/consultation-professional-picker-card'
import { ConsultationProfessionalPickerSkeleton } from '@/components/consultation-professional-picker-skeleton'
import { getProfessionalAvailabilityLiveState, type ProfessionalAvailabilityLiveState, type ProfessionalRecord } from '@/lib/professionals-db'

type ConsultationStatus = 'pending' | 'accepted' | 'declined'

type ConsultationRequestRecord = {
  id: string
  concernTitle: string
  professionalName: string
  submittedAt: string
  preferredLanguagesDisplay: string
  preferredContact: 'chat' | 'phone' | 'email'
  status: ConsultationStatus
}

const HISTORY_STORAGE_KEY = 'mindbridge-consultation-request-history'

const CONSULTATION_REQUEST_ID_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function normalizeRemoteConsultationStatus(raw: string | null | undefined): ConsultationStatus {
  const s = (raw ?? '').toLowerCase()
  if (s === 'accepted') return 'accepted'
  if (s === 'declined') return 'declined'
  return 'pending'
}

function readStoredHistory(): ConsultationRequestRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ConsultationRequestRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function concernTitleFromText(text: string) {
  const line = text.trim().split(/\n/)[0]?.trim() || ''
  if (!line) return 'Consultation request'
  return line.length > 90 ? `${line.slice(0, 87)}…` : line
}

function formatPreferredContact(contact: string) {
  const c = contact?.toLowerCase()
  if (c === 'email') return 'Email'
  if (c === 'chat') return 'Chat'
  if (c === 'phone') return 'Phone'
  return contact?.charAt(0).toUpperCase() + contact?.slice(1)
}

function StatusOutcomePanel({
  status,
  preferredContact,
}: {
  status: ConsultationStatus
  preferredContact: 'chat' | 'phone' | 'email'
}) {
  const contactLabel = formatPreferredContact(preferredContact)

  if (status === 'accepted') {
    return (
      <div className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3 py-3 text-sm shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/35">
        <p className="font-medium text-emerald-900 dark:text-emerald-100">
          Your consultation request has been accepted.
        </p>
        <p className="mt-1 text-xs text-emerald-800/90 dark:text-emerald-200/85">
          The professional will contact you using your preferred communication method.
        </p>
        <p className="mt-2 text-xs font-medium text-emerald-900/80 dark:text-emerald-100/90">
          Preferred contact: {contactLabel}
        </p>
      </div>
    )
  }

  if (status === 'declined') {
    return (
      <div className="mt-3 rounded-xl border border-rose-200/80 bg-rose-50/90 px-3 py-3 text-sm shadow-sm dark:border-rose-900/50 dark:bg-rose-950/35">
        <p className="font-medium text-rose-900 dark:text-rose-100">Your request was declined.</p>
        <p className="mt-1 text-xs text-rose-800/90 dark:text-rose-200/85">
          Please try another professional or submit a new request.
        </p>
      </div>
    )
  }

  return null
}

function StatusBadge({ status }: { status: ConsultationStatus }) {
  const map = {
    pending: {
      emoji: '🟡',
      label: 'Pending',
      className:
        'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100',
    },
    accepted: {
      emoji: '🟢',
      label: 'Accepted',
      className:
        'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100',
    },
    declined: {
      emoji: '🔴',
      label: 'Declined',
      className:
        'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100',
    },
  } as const
  const cfg = map[status]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-sm ${cfg.className}`}
    >
      <span aria-hidden>{cfg.emoji}</span>
      {cfg.label}
    </span>
  )
}

type ConsultationFormState = {
  fullName: string
  email: string
  phone: string
  mainConcern: string
  professionalType: string
  selectedProfessional: string
  /** UUID of the directory professional receiving this request (required for Supabase). */
  selectedProfessionalId: string
  availability: string
  preferredContact: string
  preferredLanguages: string[]
}

type ConsultationPickerProfessional = {
  id: string
  name: string
  role: string
  languages: string[]
  displayName: string
  displayRole: string
  liveState: ProfessionalAvailabilityLiveState
}

function mapTypeQueryToFormValue(typeRaw: string | null): string {
  if (!typeRaw) return ''
  const t = typeRaw.toLowerCase()
  if (t.includes('psychiatrist')) return 'psychiatrist'
  if (t.includes('psychologist')) return 'psychologist'
  if (t.includes('counselor')) return 'counselor'
  if (t.includes('therapist')) return 'therapist'
  if (t.includes('social')) return 'social-worker'
  return t.replace(/\s+/g, '-')
}

function normalizeLanguageTag(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}

function ConsultationPageContent() {
  const t = siteCopy
  const searchParams = useSearchParams()
  const professionalIdParam = searchParams.get('professionalId') ?? searchParams.get('id') ?? ''
  const nameParamFromUrl = searchParams.get('professional')?.trim() ?? ''
  const typeParamFromUrl = searchParams.get('type') ?? ''
  const formRef = useRef<HTMLFormElement>(null)
  const [requestHistory, setRequestHistory] = useState<ConsultationRequestRecord[]>([])
  const [historyHydrated, setHistoryHydrated] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const requestHistoryRef = useRef<ConsultationRequestRecord[]>([])

  useEffect(() => {
    requestHistoryRef.current = requestHistory
  }, [requestHistory])

  const refreshHistoryStatuses = useCallback(async () => {
    const entries = requestHistoryRef.current
    if (entries.length === 0) return

    const results = await Promise.all(
      entries.map(async (entry) => {
        if (!CONSULTATION_REQUEST_ID_UUID_RE.test(entry.id)) return null
        try {
          const res = await fetch(`/api/consultation-requests/${encodeURIComponent(entry.id)}`, {
            cache: 'no-store',
          })
          if (!res.ok) return null
          const data = (await res.json()) as { id?: string; status?: string }
          if (data.id !== entry.id) return null
          return { id: entry.id, status: normalizeRemoteConsultationStatus(data.status) }
        } catch {
          return null
        }
      }),
    )

    setRequestHistory((prev) => {
      let changed = false
      const next = prev.map((e) => {
        const u = results.find((r): r is { id: string; status: ConsultationStatus } => r !== null && r.id === e.id)
        if (!u || u.status === e.status) return e
        changed = true
        return { ...e, status: u.status }
      })
      return changed ? next : prev
    })
  }, [])

  const [submitted, setSubmitted] = useState(false)
  const [showRedirectMsg, setShowRedirectMsg] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submittingRequest, setSubmittingRequest] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<ConsultationFormState>({
    fullName: '',
    email: '',
    phone: '',
    mainConcern: '',
    professionalType: '',
    selectedProfessional: '',
    selectedProfessionalId: '',
    availability: '',
    preferredContact: '',
    preferredLanguages: []
  })

  const [professionals, setProfessionals] = useState<ConsultationPickerProfessional[]>([])
  const [professionalsLoading, setProfessionalsLoading] = useState(true)

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [otherLanguageOpen, setOtherLanguageOpen] = useState(false)
  const [languageDraft, setLanguageDraft] = useState('')
  const languageOptions = ['English', 'Amharic', 'Afaan Oromo', 'Somali', 'Tigrinya', 'Gurage', 'Sidama', 'Hadiyya', 'Gamo', 'Wolaita', 'Kaffa', 'Berta', 'Nuer', 'Maale', 'Daasanach']

  const addPreferredLanguage = useCallback((raw: string) => {
    const value = normalizeLanguageTag(raw)
    if (!value) return
    const key = value.toLowerCase()
    setFormData((prev) => {
      if (prev.preferredLanguages.some((l) => l.toLowerCase() === key)) return prev
      return { ...prev, preferredLanguages: [...prev.preferredLanguages, value] }
    })
  }, [])

  const removePreferredLanguage = useCallback((lang: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.filter((l) => l !== lang),
    }))
  }, [])

  const commitLanguageDraft = useCallback(() => {
    const value = normalizeLanguageTag(languageDraft)
    if (!value) return
    addPreferredLanguage(value)
    setLanguageDraft('')
  }, [languageDraft, addPreferredLanguage])

  const handleLanguageDraftKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        commitLanguageDraft()
        return
      }
      if (e.key === 'Backspace' && !languageDraft && formData.preferredLanguages.length > 0) {
        const last = formData.preferredLanguages[formData.preferredLanguages.length - 1]
        removePreferredLanguage(last)
      }
    },
    [languageDraft, formData.preferredLanguages, commitLanguageDraft, removePreferredLanguage],
  )

  // Pre-select professional from URL (Book Session on /professionals). Runs again when the
  // directory loads so `professionalId` can resolve to the canonical `full_name` used in form state.
  // IMPORTANT: depend on primitive query strings, not the `searchParams` object — its identity can
  // change every render in the App Router and caused setFormData → re-render loops (~1s).
  useEffect(() => {
    if (!professionalIdParam && !nameParamFromUrl && !typeParamFromUrl) return

    let selectedName = nameParamFromUrl
    let mappedType = mapTypeQueryToFormValue(typeParamFromUrl)
    let resolvedProfessionalId = professionalIdParam

    if (professionalIdParam && professionals.length > 0) {
      const match = professionals.find((p) => p.id === professionalIdParam)
      if (match) {
        selectedName = match.name
        if (!mappedType && match.role) {
          mappedType = String(match.role).toLowerCase().replace(/\s+/g, '-')
        }
      }
    }

    if (!resolvedProfessionalId && nameParamFromUrl && professionals.length > 0) {
      const byName = professionals.find((p) => p.name === nameParamFromUrl)
      if (byName) {
        resolvedProfessionalId = byName.id
        if (!selectedName) selectedName = byName.name
      }
    }

    setFormData((prev) => {
      const nextSelected = selectedName || prev.selectedProfessional
      const nextType = mappedType || prev.professionalType
      const nextId = resolvedProfessionalId || prev.selectedProfessionalId
      if (
        nextSelected === prev.selectedProfessional &&
        nextType === prev.professionalType &&
        nextId === prev.selectedProfessionalId
      ) {
        return prev
      }
      return {
        ...prev,
        selectedProfessional: nextSelected,
        professionalType: nextType,
        selectedProfessionalId: nextId,
      }
    })

    if (nameParamFromUrl || professionalIdParam) {
      const timer = setTimeout(() => setShowRedirectMsg(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [professionalIdParam, nameParamFromUrl, typeParamFromUrl, professionals])

  useEffect(() => {
    try {
      if (!historyHydrated) return
      if (typeof window === 'undefined') return
      sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(requestHistory))
    } catch {
      /* ignore */
    }
  }, [requestHistory, historyHydrated])

  useEffect(() => {
    // Load request history only after mount to avoid hydration mismatches.
    setRequestHistory(readStoredHistory())
    setHistoryHydrated(true)
  }, [])

  useEffect(() => {
    if (!historyHydrated) return
    void refreshHistoryStatuses()
    if (typeof window === 'undefined') return
    const intervalId = window.setInterval(() => void refreshHistoryStatuses(), 12_000)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void refreshHistoryStatuses()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [historyHydrated, refreshHistoryStatuses])

  useEffect(() => {
    if (!historyOpen || !historyHydrated) return
    void refreshHistoryStatuses()
  }, [historyOpen, historyHydrated, refreshHistoryStatuses])

  useEffect(() => {
    let cancelled = false

    const fetchProfessionals = async () => {
      if (typeof window !== 'undefined' && sessionStorage.getItem('mindbridge:professionals-refresh')) {
        try {
          sessionStorage.removeItem('mindbridge:professionals-refresh')
        } catch {
          /* ignore */
        }
      }
      setProfessionalsLoading(true)
      try {
        const response = await fetch('/api/professionals', { cache: 'no-store' })
        const payload = await response.json()
        if (!response.ok || !Array.isArray(payload.professionals)) {
          console.error('[consultation] /api/professionals failed:', response.status, payload)
          if (!cancelled) setProfessionals([])
          return
        }
        const rows = payload.professionals as ProfessionalRecord[]
        if (!cancelled) {
          setProfessionals(
            rows.map((p) => ({
              id: p.id,
              name: p.full_name,
              role: p.specialization,
              languages: Array.isArray(p.languages) ? p.languages : [],
              displayName: p.full_name,
              displayRole: p.specialization,
              liveState: getProfessionalAvailabilityLiveState(p.weekly_schedule),
            })),
          )
        }
      } catch (err) {
        console.error('[consultation] /api/professionals network error:', err)
        if (!cancelled) setProfessionals([])
      } finally {
        if (!cancelled) setProfessionalsLoading(false)
      }
    }

    void fetchProfessionals()
    return () => {
      cancelled = true
    }
  }, [])

  const focusConsultationForm = useCallback(() => {
    setHistoryOpen(false)
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const first = formRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]), textarea, select, button[type="button"]',
      )
      first?.focus()
    })
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectProfessional = (prof: ConsultationPickerProfessional) => {
    setFormData((prev) => ({
      ...prev,
      selectedProfessional: prof.name,
      selectedProfessionalId: prof.id,
      professionalType: prof.role
        ? String(prof.role).toLowerCase().replace(/\s+/g, '-')
        : prev.professionalType,
    }))
  }

  const handleCancel = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      mainConcern: '',
      professionalType: '',
      selectedProfessional: '',
      selectedProfessionalId: '',
      availability: '',
      preferredContact: '',
      preferredLanguages: [],
    })
    setError('')
    setLanguageDraft('')
    setOtherLanguageOpen(false)
    setShowLanguageDropdown(false)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setError('')

    if (languageDraft.trim()) {
      addPreferredLanguage(languageDraft)
      setLanguageDraft('')
    }
    
    // Validate that at least email or phone is provided
    if (!formData.email && !formData.phone) {
      setError('Please provide either an email or phone number')
      return
    }

    if (!formData.selectedProfessionalId.trim()) {
      setError('Please select a professional from the directory list.')
      return
    }

    if (
      formData.fullName.trim() &&
      formData.mainConcern.trim() &&
      formData.selectedProfessional &&
      formData.availability &&
      formData.preferredContact
    ) {
      setShowConfirmation(true)
    } else {
      setError('Please fill in all required fields')
    }
  }

  const handleConfirmSubmit = async () => {
    if (!formData.selectedProfessionalId.trim()) {
      setError('Please select a professional from the directory list.')
      setShowConfirmation(false)
      return
    }

    const contact = formData.preferredContact as 'chat' | 'phone' | 'email'
    const langs =
      formData.preferredLanguages.length > 0 ? formData.preferredLanguages.join(', ') : '—'

    setError('')
    setSubmittingRequest(true)
    try {
      const res = await fetch('/api/consultation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professional_id: formData.selectedProfessionalId,
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.mainConcern.trim(),
          preferred_time: formData.availability,
          contact_method: formData.preferredContact,
          preferred_languages: formData.preferredLanguages,
        }),
      })
      const payload = (await res.json()) as { error?: string; request?: { id?: string; status?: string } }

      if (!res.ok) {
        setError(typeof payload.error === 'string' ? payload.error : 'Could not submit your request.')
        setShowConfirmation(false)
        return
      }

      const serverId =
        typeof payload.request?.id === 'string' && payload.request.id
          ? payload.request.id
          : typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `req-${Date.now()}`

      const entry: ConsultationRequestRecord = {
        id: serverId,
        concernTitle: concernTitleFromText(formData.mainConcern),
        professionalName: formData.selectedProfessional,
        submittedAt: new Date().toISOString(),
        preferredLanguagesDisplay: langs,
        preferredContact: contact,
        status: normalizeRemoteConsultationStatus(payload.request?.status),
      }

      setRequestHistory((prev) => [entry, ...prev])
      window.setTimeout(() => void refreshHistoryStatuses(), 0)
      setShowConfirmation(false)
      setSubmitted(true)
    } catch {
      setError('Network error while submitting. Please try again.')
      setShowConfirmation(false)
    } finally {
      setSubmittingRequest(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Navigation />

        {submitted ? (
          <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
            <div className="flex items-center justify-center min-h-80 sm:min-h-96">
              <Card className="p-4 sm:p-6 md:p-8 lg:p-12 text-center w-full animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-12 sm:w-14 md:w-16 lg:w-16 text-primary mx-auto mb-2 sm:mb-3 md:mb-4" />
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-foreground mb-1.5 sm:mb-2 md:mb-2">
                  Your request has been submitted successfully.
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 md:mb-6">
                  Your consultation request will be shared with the selected professional based on your preferences.
                </p>
                <p className="mx-auto mb-6 max-w-md text-xs text-muted-foreground leading-relaxed">
                  Your request has been sent to the professional and stored securely. You can still open{' '}
                  <strong className="font-medium text-foreground">Request History</strong> on this device for a quick
                  local copy of what you submitted.
                </p>

                <div className="flex flex-col gap-2 sm:gap-3 mb-6 max-w-sm mx-auto">
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    className="w-full rounded-xl shadow-md text-xs sm:text-sm py-2 sm:py-2.5 gap-2"
                    onClick={() => setHistoryOpen(true)}
                  >
                    <History className="h-4 w-4 shrink-0" />
                    View Request History
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl text-xs sm:text-sm py-2 sm:py-2.5"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit another request
                  </Button>
                </div>

                <div className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-6 mt-4 sm:mt-6 md:mt-8 shadow-sm">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-2 sm:mb-3 md:mb-4">
                    What&apos;s Next?
                  </h3>
                  <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-2.5"
                      onClick={() => (window.location.href = '/professionals')}
                    >
                      View Recommended Professionals
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-2.5"
                      onClick={() => (window.location.href = '/emergency')}
                    >
                      Go to Emergency Contacts
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-2.5"
                      onClick={() => (window.location.href = '/')}
                    >
                      Back to Home
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Redirect Message */}
        {showRedirectMsg && formData.selectedProfessional && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-primary">
                Preparing your session request with {formData.selectedProfessional}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Details have been pre-filled from their profile
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">{t.onlineSessionRequest}</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            {t.completeFormForSession}
          </p>
        </div>

        <Card className="p-4 sm:p-6 md:p-8 border-border mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">{t.selectAProfessional}</h2>
          <p className="text-xs text-muted-foreground mb-3 sm:mb-4 max-w-xl">
            Tap a name to select — full profiles, schedules, and contact details are on the{' '}
            <a href="/professionals" className="font-medium text-primary underline-offset-2 hover:underline">
              Professionals
            </a>{' '}
            page.
          </p>

          {professionalsLoading ? (
            <ConsultationProfessionalPickerSkeleton count={4} />
          ) : professionals.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {professionals.map((prof) => (
                <ConsultationProfessionalPickerCard
                  key={prof.id}
                  legalName={prof.name}
                  displayName={prof.displayName}
                  displayRole={prof.displayRole}
                  languages={prof.languages}
                  status={prof.liveState}
                  isSelected={formData.selectedProfessional === prof.name}
                  onSelect={() => handleSelectProfessional(prof)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/15 p-5 text-center text-xs text-muted-foreground sm:text-sm">
              No registered professionals available yet.
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-6 md:p-8 border-border">
          <div className="mb-6 flex flex-col gap-3 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                Consultation request
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Complete the form to reach out securely. Track submissions anytime from your history — stored only on this device.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-xl border-primary/25 bg-primary/[0.06] shadow-sm transition-colors hover:bg-primary/10"
              onClick={() => setHistoryOpen(true)}
            >
              <History className="h-4 w-4 shrink-0" aria-hidden />
              View Request History
            </Button>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* SELECTED PROFESSIONAL SUMMARY */}
            {formData.selectedProfessional && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                <p className="text-xs text-muted-foreground">Selected Professional:</p>
                <p className="font-semibold text-sm sm:text-base text-foreground">{formData.selectedProfessional}</p>
                <p className="text-xs text-muted-foreground capitalize">{formData.professionalType}</p>
              </div>
            )}

            {/* USER INPUT SECTION */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">{t.yourInformation}</h2>
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                    {t.fullName} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t.yourFullName}
                    required
                    className="bg-background text-xs sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                    {t.contactInformation} <span className="text-destructive">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-1.5">{t.provideEmailOrPhone}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.email}
                      className="bg-background text-xs sm:text-sm"
                    />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.phone}
                      className="bg-background text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CONCERN SECTION */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">{t.reasonForConsultation}</h2>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                {t.describeReasonForConsultation} <span className="text-destructive">*</span>
              </label>
              <textarea
                name="mainConcern"
                value={formData.mainConcern}
                onChange={handleChange}
                placeholder={t.brieflyDescribeSupport}
                required
                className="w-full px-2.5 sm:px-3 py-2 rounded-md border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            {/* AVAILABILITY SECTION */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2.5 sm:mb-4">{t.whenAvailable}</h2>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">
                {t.preferredTimeframe} <span className="text-destructive">*</span>
              </label>
              <div className="space-y-2">
                {['today', 'this-week', 'flexible'].map((option) => (
                  <label key={option} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-border hover:bg-card cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="availability"
                      value={option}
                      checked={formData.availability === option}
                      onChange={handleChange}
                      required
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-xs sm:text-sm text-foreground">
                        {option === 'today' && t.today}
                        {option === 'this-week' && t.thisWeek}
                        {option === 'flexible' && t.flexible}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* PREFERRED CONTACT METHOD SECTION */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2.5 sm:mb-4">{t.preferredContactMethod}</h2>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">
                {t.howPreferContact} <span className="text-destructive">*</span>
              </label>
              <div className="space-y-2">
                {['chat', 'phone', 'email'].map((option) => (
                  <label key={option} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-border hover:bg-card cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={option}
                      checked={formData.preferredContact === option}
                      onChange={handleChange}
                      required
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-xs sm:text-sm text-foreground capitalize">
                        {option === 'chat' ? t.chat
                        :option === 'phone' ? t.phone
                        :option === 'email' ? t.email
                        :option}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* PREFERRED LANGUAGE SECTION */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2.5 sm:mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t.preferredLanguages}
              </h2>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">
                {t.selectLanguages} <span className="text-destructive">*</span>
              </label>
              
              {/* Tag input — one full value per Enter */}
              <div
                className={cn(
                  'mb-3 flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border-2 border-border bg-card px-3 py-2',
                  'focus-within:ring-2 focus-within:ring-primary',
                )}
              >
                {formData.preferredLanguages.map((lang) => (
                  <Badge
                    key={lang}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {lang}
                    <button
                      type="button"
                      aria-label={`Remove ${lang}`}
                      onClick={() => removePreferredLanguage(lang)}
                      className="rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  type="text"
                  value={languageDraft}
                  onChange={(e) => setLanguageDraft(e.target.value)}
                  onKeyDown={handleLanguageDraftKeyDown}
                  placeholder={
                    formData.preferredLanguages.length
                      ? 'Add another language, press Enter'
                      : 'e.g. Amharic — press Enter to add'
                  }
                  className="min-w-[140px] flex-1 border-0 bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Preset language dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-border bg-card text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all flex items-center justify-between hover:border-primary/50"
                >
                  <span className="text-left">
                    {(formData?.preferredLanguages?.length || 0) === 0 
                      ? t.selectLanguages
                      : `${formData.preferredLanguages.length} language${formData.preferredLanguages.length !== 1 ? 's' : ''} selected`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showLanguageDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          if (formData.preferredLanguages.includes(lang)) {
                            removePreferredLanguage(lang)
                          } else {
                            addPreferredLanguage(lang)
                          }
                        }}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-primary/10 transition-colors border-b border-border/50 ${
                          formData.preferredLanguages.includes(lang)
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-foreground'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.preferredLanguages.includes(lang)}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0"
                        />
                        <span>{lang}</span>
                        {formData.preferredLanguages.includes(lang) && (
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-primary flex-shrink-0" />
                        )}
                      </button>
                    ))}
                    
                    {/* Divider */}
                    <div className="border-b border-border/50" />
                    
                    {/* Others — custom language (one tag per Enter) */}
                    <div className="p-3 sm:p-4 border-b border-border/50">
                      <button
                        type="button"
                        onClick={() => {
                          setOtherLanguageOpen((open) => {
                            const next = !open
                            if (next) setShowLanguageDropdown(true)
                            return next
                          })
                        }}
                        className={cn(
                          'w-full px-2 sm:px-3 py-2.5 sm:py-3 text-left text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-primary/10 transition-colors rounded-md',
                          otherLanguageOpen ? 'bg-primary/10 text-primary font-medium' : 'text-foreground',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={otherLanguageOpen}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0"
                        />
                        <span>Others (type your language)</span>
                        {otherLanguageOpen && (
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-primary flex-shrink-0" />
                        )}
                      </button>
                      
                      {/* Custom Language Input */}
                      {otherLanguageOpen && (
                        <div className="mt-2 sm:mt-3">
                          <input
                            type="text"
                            placeholder="Type language name..."
                            value={languageDraft}
                            onChange={(e) => setLanguageDraft(e.target.value)}
                            onKeyDown={handleLanguageDraftKeyDown}
                            className="w-full px-2 sm:px-3 py-2 rounded-md border border-primary bg-primary/5 text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                          />
                          <p className="text-xs text-muted-foreground mt-1.5">
                            Press Enter to add the full name as one language (e.g. Amharic).
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-4">
              <Button type="submit" size="sm" className="w-full text-xs sm:text-sm py-2 sm:py-2.5">
                {t.submitSessionRequest}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
                onClick={handleCancel}
              >
                {t.cancel}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-destructive">{error}</p>
              </div>
            )}
          </form>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 sm:p-4 mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong>For emergencies:</strong> Please use the <a href="/emergency" className="text-primary font-medium hover:underline">Emergency page</a> for immediate support.
            </p>
          </div>
        </Card>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex-1">Confirm Request</h2>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  You are about to submit your consultation request to a mental health professional. Your preferred contact method will be shared.
                </p>
                <div className="bg-muted/50 border border-border rounded-lg p-3 sm:p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Request Details</p>
                  <div className="text-xs sm:text-sm text-foreground space-y-1.5">
                    <p><strong>Full Name:</strong> {formData.fullName}</p>
                    <p><strong>Email:</strong> {formData.email || '-'}</p>
                    <p><strong>Phone:</strong> {formData.phone || '-'}</p>
                    <p className="break-words"><strong>Main Concern:</strong> {formData.mainConcern.substring(0, 50)}{formData.mainConcern.length > 50 ? '...' : ''}</p>
                    <p><strong>Type:</strong> {formData.professionalType}</p>
                    <p><strong>Professional:</strong> {formData.selectedProfessional}</p>
                    <p><strong>Availability:</strong> {formData.availability === 'today' ? 'Today' : formData.availability === 'this-week' ? 'This Week' : 'Flexible'}</p>
                    <p><strong>Contact:</strong> {formData.preferredContact.charAt(0).toUpperCase() + formData.preferredContact.slice(1)}</p>
                    <p><strong>Languages:</strong> {formData.preferredLanguages.length > 0 ? formData.preferredLanguages.join(', ') : '-'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <Button
                  type="button"
                  onClick={() => void handleConfirmSubmit()}
                  size="sm"
                  disabled={submittingRequest}
                  className="w-full text-xs sm:text-sm py-2"
                >
                  {submittingRequest ? (
                    <>
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden />
                      Submitting…
                    </>
                  ) : (
                    <>✅ Yes, Submit</>
                  )}
                </Button>
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs sm:text-sm py-2"
                >
                  ❌ Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
        )}
      </div>

      <Drawer direction="right" open={historyOpen} onOpenChange={setHistoryOpen}>
        <DrawerContent
          className={cn(
            'ml-auto flex h-[100dvh] max-h-[100dvh] flex-col gap-0 rounded-none border-l bg-background p-0 shadow-2xl sm:max-w-[420px] sm:rounded-l-2xl',
            'data-[vaul-drawer-direction=right]:w-[min(100vw-0.5rem,420px)]',
            'duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-8 data-[state=open]:slide-in-from-right-8',
          )}
        >
          <DrawerHeader className="border-b border-border/70 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent px-5 pb-4 pt-6 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1 pr-2">
                <DrawerTitle className="text-xl font-semibold tracking-tight text-foreground">
                  Request history
                </DrawerTitle>
                <DrawerDescription className="text-sm leading-relaxed text-muted-foreground">
                  Your requests on this device sync with the server every few seconds so status updates (pending,
                  accepted, or declined) stay current after the professional responds.
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full" aria-label="Close history">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex min-h-0 flex-1 flex-col">
            {requestHistory.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center animate-in fade-in zoom-in-95 duration-300">
                <span className="text-5xl leading-none" aria-hidden>
                  📭
                </span>
                <p className="mt-6 text-base font-semibold text-foreground">No consultation requests yet.</p>
                <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                  Submit a consultation request to connect with a mental health professional.
                </p>
                <Button type="button" className="mt-8 rounded-xl px-6 shadow-md" onClick={focusConsultationForm}>
                  Request Consultation
                </Button>
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-4 pb-4">
                  {requestHistory.map((entry, idx) => (
                    <li
                      key={entry.id}
                      className={cn(
                        'rounded-2xl border border-border/90 bg-card p-4 shadow-md shadow-black/[0.06] ring-1 ring-black/[0.03] transition-shadow duration-300 animate-in fade-in slide-in-from-right-3 dark:shadow-black/25 dark:ring-white/[0.04]',
                        idx === 0 && 'border-primary/30 shadow-lg shadow-primary/[0.08]',
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="font-semibold leading-snug text-foreground">{entry.concernTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground/90">{entry.professionalName}</span>
                          </p>
                        </div>
                        <StatusBadge status={entry.status} />
                      </div>

                      <dl className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 sm:gap-x-4">
                        <div className="space-y-0.5">
                          <dt className="font-semibold text-foreground/75">Date submitted</dt>
                          <dd className="tabular-nums">{format(new Date(entry.submittedAt), 'MMM d, yyyy · h:mm a')}</dd>
                        </div>
                        <div className="space-y-0.5">
                          <dt className="font-semibold text-foreground/75">Preferred language</dt>
                          <dd className="break-words">{entry.preferredLanguagesDisplay}</dd>
                        </div>
                      </dl>

                      <StatusOutcomePanel status={entry.status} preferredContact={entry.preferredContact} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading consultation…</p>
        </div>
      }
    >
      <ConsultationPageContent />
    </Suspense>
  )
}

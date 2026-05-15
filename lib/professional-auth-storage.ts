export const PROFESSIONAL_AUTH_KEY = 'professionalAuth'

export type ProfessionalAuthStored = {
  id: string
  full_name?: string
  specialization?: string
  hospital?: string
  city?: string
  languages?: string[]
  weekly_schedule?: unknown
  bio?: string | null
  created_at?: string
  rating?: number | null
}

/**
 * Parsed session cached by raw localStorage string so callers (especially
 * useSyncExternalStore getSnapshot) see a stable object reference until the
 * stored JSON actually changes — avoids infinite re-render loops.
 */
let sessionSnapshotCache: { raw: string | null; session: ProfessionalAuthStored | null } | null =
  null

export function readProfessionalSession(): ProfessionalAuthStored | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROFESSIONAL_AUTH_KEY)
    if (sessionSnapshotCache !== null && sessionSnapshotCache.raw === raw) {
      return sessionSnapshotCache.session
    }
    if (!raw) {
      sessionSnapshotCache = { raw: null, session: null }
      return null
    }
    const o = JSON.parse(raw) as ProfessionalAuthStored
    const session = o?.id ? o : null
    sessionSnapshotCache = { raw, session }
    return session
  } catch {
    sessionSnapshotCache = { raw: null, session: null }
    return null
  }
}

/** Call after updating `professionalAuth` in localStorage so subscribers sync immediately. */
export function notifyProfessionalSessionChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('professional-auth-updated'))
}

/** Subscribe to session changes from this tab (explicit events only). */
export function subscribeProfessionalSession(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = () => onChange()
  window.addEventListener('professional-auth-updated', handler)
  return () => {
    window.removeEventListener('professional-auth-updated', handler)
  }
}

/**
 * Detects failures from @supabase/supabase-js when its internal `fetch` to the
 * Supabase REST API cannot complete (DNS, TLS, wrong URL, offline, paused project, etc.).
 * These often surface as `TypeError: fetch failed` in Node (undici).
 */
export function isSupabaseUndiciFetchFailure(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = (err.message || '').toLowerCase()
  if (msg.includes('fetch failed')) return true
  if (msg.includes('networkerror') || msg.includes('failed to fetch')) return true

  const c = err.cause
  if (c instanceof Error) {
    const cm = (c.message || '').toUpperCase()
    if (
      cm.includes('ECONNREFUSED') ||
      cm.includes('ENOTFOUND') ||
      cm.includes('ETIMEDOUT') ||
      cm.includes('ECONNRESET') ||
      cm.includes('CERT') ||
      cm.includes('SSL') ||
      cm.includes('UNABLE_TO_VERIFY')
    ) {
      return true
    }
  }
  return false
}

export type PublicConnectivityError = {
  error: string
  code: 'SUPABASE_FETCH_FAILED' | 'SUPABASE_UNEXPECTED'
  hints: string[]
  /** Present only when NODE_ENV === 'development' — never put secrets here */
  debugMessage?: string
  /** Dev-only: booleans / host string only */
  envSummary?: ReturnType<typeof getSupabaseEnvDiagnostics>
}

export function errorMessageLooksLikeUndiciFetch(message: string | undefined | null): boolean {
  if (!message) return false
  const m = message.toLowerCase()
  return m.includes('fetch failed') || m.includes('failed to fetch') || m.includes('networkerror')
}

export function publicConnectivityErrorFromUnknown(err: unknown): PublicConnectivityError {
  const dev = process.env.NODE_ENV === 'development'
  const envSummary = dev ? getSupabaseEnvDiagnostics() : undefined

  if (isSupabaseUndiciFetchFailure(err)) {
    return {
      error:
        'Cannot reach Supabase from the server. Check NEXT_PUBLIC_SUPABASE_URL, your network, VPN/firewall, and that the Supabase project is not paused.',
      code: 'SUPABASE_FETCH_FAILED',
      hints: [
        'NEXT_PUBLIC_SUPABASE_URL must be the full https URL from Supabase → Project Settings → API.',
        'SUPABASE_SERVICE_ROLE_KEY must be set for API routes (never expose it to the browser).',
        'After editing .env.local, restart `npm run dev` / `pnpm dev` so Turbopack picks up changes.',
        'If you use a proxy or corporate network, try another network or disable VPN to test.',
      ],
      debugMessage: err instanceof Error ? err.message : String(err),
      envSummary,
    }
  }

  const message = err instanceof Error ? err.message : 'Unexpected server error'
  return {
    error: message,
    code: 'SUPABASE_UNEXPECTED',
    hints: ['Check server logs for [professionals/register].'],
    debugMessage: err instanceof Error ? err.stack ?? err.message : String(err),
    envSummary,
  }
}

/** Safe diagnostics: host only, no keys. */
export function getSupabaseEnvDiagnostics(): {
  hasPublicUrl: boolean
  urlHost: string | null
  urlLooksInvalid: boolean
  hasServiceRoleKey: boolean
  hasAnonKey: boolean
} {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  let urlHost: string | null = null
  let urlLooksInvalid = false
  if (raw) {
    try {
      const u = new URL(raw)
      urlHost = u.host || null
      if (u.protocol !== 'https:') urlLooksInvalid = true
    } catch {
      urlLooksInvalid = true
    }
  }
  return {
    hasPublicUrl: Boolean(raw),
    urlHost,
    urlLooksInvalid,
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()),
  }
}

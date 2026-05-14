import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client (service role).
 * Use only in Route Handlers, Server Actions, or other trusted server code.
 */
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!supabaseUrl) {
    console.error('[Supabase server] NEXT_PUBLIC_SUPABASE_URL is missing or empty (.env.local).')
  }
  if (!supabaseServiceRoleKey) {
    console.error('[Supabase server] SUPABASE_SERVICE_ROLE_KEY is missing or empty (.env.local).')
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase server env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (in .env.local)',
    )
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

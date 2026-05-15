import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { DEFAULT_WEEKLY_SCHEDULE } from '@/lib/professionals-db'
import {
  errorMessageLooksLikeUndiciFetch,
  getSupabaseEnvDiagnostics,
  isSupabaseUndiciFetchFailure,
  publicConnectivityErrorFromUnknown,
} from '@/lib/supabase-connection-error'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

type RegisterPayload = {
  fullName: string
  email: string
  password: string
  specialization: string
  hospital: string
  city: string
  languages: string[]
  weeklySchedule?: unknown
  bio?: string
}

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

function connectivityResponseFromThrown(err: unknown) {
  const body = publicConnectivityErrorFromUnknown(err)
  const status = body.code === 'SUPABASE_FETCH_FAILED' ? 503 : 500
  console.error('[professionals/register] Supabase transport error:', {
    code: body.code,
    diagnostics: getSupabaseEnvDiagnostics(),
    message: err instanceof Error ? err.message : String(err),
    cause: err instanceof Error && err.cause instanceof Error ? err.cause.message : undefined,
  })
  return NextResponse.json(body, { status })
}

export async function POST(req: Request) {
  let body: RegisterPayload
  try {
    body = (await req.json()) as RegisterPayload
  } catch (parseErr) {
    console.error('[professionals/register] Invalid JSON body:', parseErr)
    return NextResponse.json({ error: 'Invalid JSON body', code: 'INVALID_JSON' }, { status: 400 })
  }

  try {
    if (
      !body.fullName?.trim() ||
      !body.email?.trim() ||
      !body.password?.trim() ||
      !body.specialization?.trim() ||
      !body.hospital?.trim() ||
      !body.city?.trim()
    ) {
      return NextResponse.json({ error: 'Missing required fields', code: 'VALIDATION' }, { status: 400 })
    }

    const cityTrimmed = body.city.trim()
    if (cityTrimmed.toLowerCase() === 'other') {
      return NextResponse.json(
        { error: 'Please enter your city name when selecting Other.', code: 'VALIDATION' },
        { status: 400 },
      )
    }

    let supabase: ReturnType<typeof getSupabaseServerClient>
    try {
      supabase = getSupabaseServerClient()
    } catch (configErr) {
      console.error('[professionals/register] Supabase not configured:', configErr)
      return NextResponse.json(
        {
          error:
            'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to .env.local (see .env.example), then restart the dev server.',
          code: 'SUPABASE_NOT_CONFIGURED',
          envSummary: process.env.NODE_ENV === 'development' ? getSupabaseEnvDiagnostics() : undefined,
        },
        { status: 503 },
      )
    }

    const email = body.email.trim().toLowerCase()

    let existing: { id: string } | null = null
    let existingError: { message: string; code?: string; details?: string; hint?: string } | null = null

    try {
      const res = await supabase.from('professionals').select('id').eq('email', email).maybeSingle()
      existing = res.data as { id: string } | null
      existingError = res.error
    } catch (netErr) {
      console.error('[professionals/register] lookup threw:', netErr)
      return connectivityResponseFromThrown(netErr)
    }

    if (existingError) {
      if (errorMessageLooksLikeUndiciFetch(existingError.message)) {
        console.error('[professionals/register] Supabase lookup fetch failed:', existingError.message)
        return connectivityResponseFromThrown(new Error(existingError.message))
      }
      console.error('[professionals/register] Supabase lookup error:', existingError)
      return NextResponse.json(
        {
          error: existingError.message,
          code: existingError.code ?? 'SUPABASE_QUERY',
          details: existingError.details ?? undefined,
          hint: existingError.hint ?? undefined,
        },
        { status: 500 },
      )
    }

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists', code: 'EMAIL_TAKEN' }, { status: 409 })
    }

    const normalizedLanguages = (Array.isArray(body.languages) ? body.languages : [])
      .map((l) => (typeof l === 'string' ? l.trim() : String(l).trim()))
      .filter(Boolean)

    const weeklyScheduleRaw =
      Array.isArray(body.weeklySchedule) && body.weeklySchedule.length > 0
        ? body.weeklySchedule
        : DEFAULT_WEEKLY_SCHEDULE

    let weekly_schedule: typeof DEFAULT_WEEKLY_SCHEDULE
    try {
      weekly_schedule = JSON.parse(JSON.stringify(weeklyScheduleRaw)) as typeof DEFAULT_WEEKLY_SCHEDULE
    } catch (e) {
      console.error('[professionals/register] weekly_schedule JSON clone failed:', e)
      weekly_schedule = DEFAULT_WEEKLY_SCHEDULE
    }

    const bioText = typeof body.bio === 'string' ? body.bio.trim() : ''

    const insertData = {
      full_name: body.fullName.trim(),
      email,
      password: hashPassword(body.password),
      specialization: body.specialization.trim(),
      hospital: body.hospital.trim(),
      city: cityTrimmed,
      weekly_schedule,
      languages: normalizedLanguages.length > 0 ? normalizedLanguages : ([] as string[]),
      bio: bioText,
    }

    let data: { id: string; full_name: string; bio?: string | null } | null = null
    let insertError: { message: string; code?: string; details?: string; hint?: string } | null = null

    try {
      const res = await supabase.from('professionals').insert([insertData]).select('id, full_name, bio').single()
      data = res.data as typeof data
      insertError = res.error
    } catch (netErr) {
      console.error('[professionals/register] insert threw:', netErr)
      return connectivityResponseFromThrown(netErr)
    }

    console.log('[professionals/register] INSERT RESULT:', { ok: !insertError, code: insertError?.code ?? null })

    if (insertError) {
      if (errorMessageLooksLikeUndiciFetch(insertError.message)) {
        console.error('[professionals/register] Supabase insert fetch failed:', insertError.message)
        return connectivityResponseFromThrown(new Error(insertError.message))
      }

      console.error(
        '[professionals/register] INSERT ERROR:',
        JSON.stringify(
          {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint,
          },
          null,
          2,
        ),
      )

      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'An account with this email already exists', code: 'EMAIL_TAKEN' }, { status: 409 })
      }

      const msg = insertError.message || 'Registration could not be completed.'
      const missingBio =
        /bio/i.test(msg) && (/schema cache/i.test(msg) || /column/i.test(msg) || /PGRST/i.test(msg))
      const userMessage = missingBio
        ? 'Database is missing the professionals.bio column. In the Supabase SQL editor, run: ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS bio text; (see supabase/migrations/), then try again.'
        : msg

      return NextResponse.json(
        {
          error: userMessage,
          code: insertError.code ?? 'SUPABASE_INSERT',
          details: insertError.details ?? undefined,
          hint: insertError.hint ?? undefined,
        },
        { status: 500 },
      )
    }

    if (!data) {
      console.error('[professionals/register] Insert returned no row')
      return NextResponse.json(
        { error: 'Registration failed: no row returned from database.', code: 'NO_ROW' },
        { status: 500 },
      )
    }

    return NextResponse.json({ professional: data, code: 'OK' }, { status: 201 })
  } catch (error) {
    if (isSupabaseUndiciFetchFailure(error)) {
      return connectivityResponseFromThrown(error)
    }
    console.error('[professionals/register] unexpected error:', error)
    const body = publicConnectivityErrorFromUnknown(error)
    return NextResponse.json(body, { status: body.code === 'SUPABASE_FETCH_FAILED' ? 503 : 500 })
  }
}

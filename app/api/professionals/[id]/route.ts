import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const body = (await req.json()) as {
      password?: string
      fullName?: string
      specialization?: string
      hospital?: string
      city?: string
      languages?: string[]
      bio?: string
      weeklySchedule?: unknown
    }

    if (!body.password?.trim()) {
      return NextResponse.json({ error: 'Password is required to save changes.' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { data: row, error: fetchErr } = await supabase
      .from('professionals')
      .select('id, password')
      .eq('id', id)
      .maybeSingle()

    if (fetchErr || !row || typeof row.password !== 'string') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (hashPassword(body.password) !== row.password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const patch: Record<string, unknown> = {}

    if (typeof body.fullName === 'string' && body.fullName.trim()) {
      patch.full_name = body.fullName.trim()
    }
    if (typeof body.specialization === 'string' && body.specialization.trim()) {
      patch.specialization = body.specialization.trim()
    }
    if (typeof body.hospital === 'string' && body.hospital.trim()) {
      patch.hospital = body.hospital.trim()
    }
    if (typeof body.city === 'string' && body.city.trim()) {
      patch.city = body.city.trim()
    }
    if (Array.isArray(body.languages)) {
      patch.languages = body.languages.map((l) => String(l).trim()).filter(Boolean)
    }
    if (typeof body.bio === 'string') {
      patch.bio = body.bio.trim() || null
    }
    if (body.weeklySchedule !== undefined) {
      patch.weekly_schedule = body.weeklySchedule
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const { error: updateErr } = await supabase.from('professionals').update(patch).eq('id', id)
    if (updateErr) {
      console.error('[PATCH /api/professionals/:id] update:', updateErr)
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    const { data: updated, error: readErr } = await supabase
      .from('professionals')
      .select('id, full_name, specialization, hospital, city, languages, weekly_schedule, bio, created_at, rating')
      .eq('id', id)
      .maybeSingle()

    if (readErr) {
      console.error('[PATCH /api/professionals/:id] read-back:', readErr)
      return NextResponse.json({ ok: true, professional: { id } }, { status: 200 })
    }

    return NextResponse.json({ ok: true, professional: updated ?? { id } }, { status: 200 })
  } catch (e) {
    console.error('[PATCH /api/professionals/:id]', e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

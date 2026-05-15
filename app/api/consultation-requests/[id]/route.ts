import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

/** Public status read for the consultation page (UUID acts as an opaque handle). */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id: requestId } = await ctx.params
    if (!requestId || !UUID_RE.test(requestId)) {
      return NextResponse.json({ error: 'Invalid request id' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('consultation_requests')
      .select('id, status')
      .eq('id', requestId)
      .maybeSingle()

    if (error || !data?.id) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
    }

    const status = typeof data.status === 'string' ? data.status.toLowerCase() : 'pending'
    return NextResponse.json({ id: data.id, status }, { status: 200 })
  } catch (e) {
    console.error('[GET /api/consultation-requests/:id]', e)
    return NextResponse.json({ error: 'Failed to load status' }, { status: 500 })
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id: requestId } = await ctx.params
    if (!requestId || !UUID_RE.test(requestId)) {
      return NextResponse.json({ error: 'Invalid request id' }, { status: 400 })
    }

    const body = (await req.json()) as { password?: string; status?: string }
    const password = typeof body.password === 'string' ? body.password : ''
    const status = typeof body.status === 'string' ? body.status.trim().toLowerCase() : ''

    if (!password.trim()) {
      return NextResponse.json({ error: 'Password is required to update this request.' }, { status: 400 })
    }
    if (status !== 'accepted' && status !== 'declined') {
      return NextResponse.json({ error: 'Status must be accepted or declined.' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { data: reqRow, error: reqErr } = await supabase
      .from('consultation_requests')
      .select('id, professional_id, status')
      .eq('id', requestId)
      .maybeSingle()

    if (reqErr || !reqRow?.professional_id) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
    }

    if (reqRow.status !== 'pending') {
      return NextResponse.json({ error: 'This request has already been responded to.' }, { status: 409 })
    }

    const { data: prof, error: profErr } = await supabase
      .from('professionals')
      .select('id, password')
      .eq('id', reqRow.professional_id)
      .maybeSingle()

    if (profErr || !prof || typeof prof.password !== 'string') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (hashPassword(password) !== prof.password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const { error: updateErr } = await supabase
      .from('consultation_requests')
      .update({ status })
      .eq('id', requestId)

    if (updateErr) {
      console.error('[PATCH /api/consultation-requests/:id]', updateErr)
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    const { data: updated, error: readErr } = await supabase
      .from('consultation_requests')
      .select(
        'id, professional_id, full_name, email, phone, message, preferred_time, contact_method, preferred_languages, status, created_at',
      )
      .eq('id', requestId)
      .maybeSingle()

    if (readErr) {
      return NextResponse.json({ ok: true, status }, { status: 200 })
    }

    return NextResponse.json({ ok: true, request: updated }, { status: 200 })
  } catch (e) {
    console.error('[PATCH /api/consultation-requests/:id]', e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

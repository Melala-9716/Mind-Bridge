import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type CreateBody = {
  professional_id?: string
  full_name?: string
  email?: string
  phone?: string
  message?: string
  preferred_time?: string
  contact_method?: string
  preferred_languages?: unknown
}

const CONSULTATION_REQUEST_COLUMNS =
  'id, professional_id, full_name, email, phone, message, preferred_time, contact_method, preferred_languages, status, created_at' as const

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateBody
    const professionalId = typeof body.professional_id === 'string' ? body.professional_id.trim() : ''
    const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const preferredTime = typeof body.preferred_time === 'string' ? body.preferred_time.trim() : ''
    const contactMethod = typeof body.contact_method === 'string' ? body.contact_method.trim() : ''

    if (!professionalId || !UUID_RE.test(professionalId)) {
      return NextResponse.json({ error: 'A valid professional is required.' }, { status: 400 })
    }
    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    }
    if (!email && !phone) {
      return NextResponse.json({ error: 'Provide an email and/or phone number.' }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ error: 'Please describe your reason for consultation.' }, { status: 400 })
    }
    if (!preferredTime) {
      return NextResponse.json({ error: 'Preferred time is required.' }, { status: 400 })
    }
    if (!contactMethod) {
      return NextResponse.json({ error: 'Preferred contact method is required.' }, { status: 400 })
    }

    const langs = Array.isArray(body.preferred_languages)
      ? body.preferred_languages.map((l) => String(l).trim()).filter(Boolean)
      : []

    const supabase = getSupabaseServerClient()

    const { data: prof, error: profErr } = await supabase.from('professionals').select('id').eq('id', professionalId).maybeSingle()

    if (profErr || !prof) {
      console.error('[POST /api/consultation-requests] professional lookup:', profErr)
      return NextResponse.json({ error: 'Professional not found.' }, { status: 404 })
    }

    const { data: row, error: insertErr } = await supabase
      .from('consultation_requests')
      .insert([
        {
          professional_id: professionalId,
          full_name: fullName,
          email: email || null,
          phone: phone || null,
          message,
          preferred_time: preferredTime,
          contact_method: contactMethod,
          preferred_languages: langs,
          status: 'pending',
        },
      ])
      .select(CONSULTATION_REQUEST_COLUMNS)
      .single()

    if (insertErr) {
      console.error('[POST /api/consultation-requests] insert:', insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    return NextResponse.json({ request: row }, { status: 201 })
  } catch (e) {
    console.error('[POST /api/consultation-requests]', e)
    const message = e instanceof Error ? e.message : 'Failed to submit request'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

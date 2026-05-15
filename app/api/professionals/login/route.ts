import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

type LoginPayload = {
  /** Full name as registered (case-insensitive match). */
  fullName: string
  password: string
}

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginPayload
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''

    if (!fullName || !body.password?.trim()) {
      return NextResponse.json({ error: 'Full name and password are required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const passwordHash = hashPassword(body.password)

    const { data: rows, error } = await supabase
      .from('professionals')
      .select(
        'id, full_name, specialization, hospital, city, languages, weekly_schedule, created_at, rating, password',
      )
      .ilike('full_name', fullName)

    if (error) {
      console.error('[POST /api/professionals/login] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const listRaw = Array.isArray(rows) ? rows : []
    const needle = fullName.toLowerCase()
    const list = listRaw.filter((r) => typeof r.full_name === 'string' && r.full_name.trim().toLowerCase() === needle)
    const row = list.find((r) => typeof r.password === 'string' && r.password === passwordHash)

    if (!row) {
      return NextResponse.json({ error: 'Invalid name or password' }, { status: 401 })
    }

    const professional = {
      id: row.id,
      full_name: row.full_name,
      specialization: row.specialization,
      hospital: row.hospital,
      city: row.city,
      languages: row.languages,
      weekly_schedule: row.weekly_schedule,
      created_at: row.created_at,
      rating: row.rating,
    }

    console.log('[POST /api/professionals/login] OK:', { id: professional.id, full_name: professional.full_name })

    return NextResponse.json({ professional }, { status: 200 })
  } catch (e) {
    console.error('[POST /api/professionals/login] Exception:', e)
    const message = e instanceof Error ? e.message : 'Login failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

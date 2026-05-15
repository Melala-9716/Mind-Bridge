import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    if (!id || !UUID_RE.test(id)) {
      return NextResponse.json({ error: 'Invalid professional id' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('consultation_requests')
      .select(
        'id, professional_id, full_name, email, phone, message, preferred_time, contact_method, preferred_languages, status, created_at',
      )
      .eq('professional_id', id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('[GET /api/professionals/:id/consultation-requests]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ requests: data ?? [] }, { status: 200 })
  } catch (e) {
    console.error('[GET /api/professionals/:id/consultation-requests]', e)
    return NextResponse.json({ error: 'Failed to load requests' }, { status: 500 })
  }
}

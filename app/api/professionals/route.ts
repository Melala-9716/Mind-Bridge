import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('professionals')
      .select('id, full_name, specialization, hospital, city, languages, weekly_schedule, bio, created_at, rating')
      .order('created_at', { ascending: false })

    console.log('[GET /api/professionals] FETCH RESULT:', {
      count: data?.length ?? 0,
      error: error ?? null,
    })

    if (error) {
      console.error('[GET /api/professionals] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ professionals: data ?? [] }, { status: 200 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch professionals'
    console.error('[GET /api/professionals] Exception:', e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

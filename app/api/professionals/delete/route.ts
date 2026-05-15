import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

type DeleteBody = {
  professionalId?: string
  password?: string
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as DeleteBody
    const professionalId = body.professionalId?.trim()
    const password = body.password?.trim()

    if (!professionalId || !password) {
      return NextResponse.json(
        { error: 'professionalId and password are required to delete an account.' },
        { status: 400 },
      )
    }

    const supabase = getSupabaseServerClient()
    const { data: row, error: fetchErr } = await supabase
      .from('professionals')
      .select('id, password')
      .eq('id', professionalId)
      .maybeSingle()

    if (fetchErr) {
      console.error('[DELETE /api/professionals/delete] lookup:', fetchErr)
      return NextResponse.json({ error: fetchErr.message }, { status: 500 })
    }

    if (!row || typeof row.password !== 'string') {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
    }

    if (hashPassword(password) !== row.password) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    const { error: delErr } = await supabase.from('professionals').delete().eq('id', professionalId)

    if (delErr) {
      console.log('SUPABASE DELETE ERROR:', delErr)
      return NextResponse.json(
        { error: delErr.message || 'Could not delete account.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    console.error('[DELETE /api/professionals/delete]', e)
    const message = e instanceof Error ? e.message : 'Delete failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

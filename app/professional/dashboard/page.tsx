'use client'

import { useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/** Client redirect runs once on mount — avoids repeated server `redirect()` RSC work. */
export default function ProfessionalDashboardIndexPage() {
  const router = useRouter()
  const routerRef = useRef(router)
  routerRef.current = router
  const ran = useRef(false)

  useLayoutEffect(() => {
    if (ran.current) return
    ran.current = true
    routerRef.current.replace('/professional/dashboard/profile')
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50/30 to-background dark:from-slate-950/50">
      <p className="text-sm text-muted-foreground">Opening your dashboard…</p>
    </div>
  )
}

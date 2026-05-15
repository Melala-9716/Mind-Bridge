'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import { readProfessionalSession } from '@/lib/professional-auth-storage'
import {
  ProfessionalDashboardHeader,
  type ProfessionalDashboardSession,
} from '@/components/professional-dashboard-header'

/**
 * Auth gate runs ONCE on mount (empty dependency array).
 * No subscribe / no redirect useEffect — those patterns re-ran with router
 * churn and caused navigation storms after login.
 */
export default function ProfessionalDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const routerRef = useRef(router)
  routerRef.current = router

  const [session, setSession] = useState<ProfessionalDashboardSession | null>(null)
  const [ready, setReady] = useState(false)
  const sentToLogin = useRef(false)

  useLayoutEffect(() => {
    const s = readProfessionalSession()
    if (!s) {
      if (!sentToLogin.current) {
        sentToLogin.current = true
        routerRef.current.replace('/professional-login')
      }
      setSession(null)
    } else {
      setSession(s)
    }
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50/30 to-background dark:from-slate-950/50">
        <p className="text-sm text-muted-foreground">Loading dashboard…</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50/30 to-background dark:from-slate-950/50">
        <p className="text-sm text-muted-foreground">Redirecting…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/25 via-background to-background dark:from-slate-950/40">
      <ProfessionalDashboardHeader session={session} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      <Toaster position="top-center" richColors closeButton />
    </div>
  )
}

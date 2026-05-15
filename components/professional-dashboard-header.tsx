'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BriefcaseMedical, Inbox, LogOut, Trash2, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import {
  PROFESSIONAL_AUTH_KEY,
  readProfessionalSession,
  subscribeProfessionalSession,
  type ProfessionalAuthStored,
} from '@/lib/professional-auth-storage'

export type ProfessionalDashboardSession = ProfessionalAuthStored

const nav = [
  { href: '/professional/dashboard/profile', label: 'Profile', icon: UserCircle },
  { href: '/professional/dashboard/requests', label: 'Requests', icon: Inbox },
] as const

export function ProfessionalDashboardHeader({ session: sessionProp }: { session: ProfessionalDashboardSession }) {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState(sessionProp)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setSession(sessionProp)
  }, [sessionProp])

  useEffect(() => {
    return subscribeProfessionalSession(() => {
      const next = readProfessionalSession()
      if (!next || next.id !== sessionProp.id) return
      setSession((prev) => {
        if (
          prev.full_name === next.full_name &&
          prev.specialization === next.specialization &&
          prev.hospital === next.hospital &&
          prev.city === next.city
        ) {
          return prev
        }
        return next
      })
    })
  }, [sessionProp.id])

  const displayName = session.full_name?.trim() || 'Professional'

  const handleLogout = () => {
    try {
      localStorage.removeItem(PROFESSIONAL_AUTH_KEY)
    } catch {
      /* ignore */
    }
    toast.success('Logged out successfully')
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Enter your password to delete your account.')
      return
    }
    setDeleting(true)
    try {
      const res = await fetch('/api/professionals/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: session.id,
          password: deletePassword,
        }),
      })
      const payload = (await res.json()) as { error?: string }
      if (!res.ok) {
        toast.error(payload.error ?? 'Could not delete account.')
        return
      }
      try {
        localStorage.removeItem(PROFESSIONAL_AUTH_KEY)
        sessionStorage.setItem('mindbridge:professionals-refresh', '1')
      } catch {
        /* ignore */
      }
      toast.success('Account deleted successfully')
      setDeleteOpen(false)
      router.push('/')
    } catch {
      toast.error('Network error. Try again.')
    } finally {
      setDeleting(false)
      setDeletePassword('')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-inner">
              <BriefcaseMedical className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <Badge className="rounded-full border-emerald-500/30 bg-emerald-500/10 px-2 py-0 text-[10px] font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-100">
                  Professional
                </Badge>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1 sm:justify-end" aria-label="Professional dashboard">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Button
                  key={href}
                  variant={active ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'rounded-xl gap-1.5 text-xs sm:text-sm',
                    active && 'shadow-md ring-1 ring-primary/20',
                  )}
                  asChild
                >
                  <Link href={href}>
                    <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                    {label}
                  </Link>
                </Button>
              )
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 sm:border-t-0 sm:pt-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-border shadow-sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Log out
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="rounded-xl shadow-sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Delete account
            </Button>
          </div>
        </div>
      </header>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl border-border/80 shadow-xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
            <AlertDialogDescription className="text-left leading-relaxed">
              This action is permanent. All your profile data, schedule, and consultation history will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="delete-account-password">Confirm with your password</Label>
            <PasswordInput
              id="delete-account-password"
              autoComplete="current-password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="rounded-xl"
              placeholder="••••••••"
            />
          </div>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={deleting}
              onClick={() => void handleDeleteAccount()}
            >
              {deleting ? 'Deleting…' : 'Delete account'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

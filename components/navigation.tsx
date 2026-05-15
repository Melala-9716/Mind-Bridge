'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart, Menu, X } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { siteCopy } from '@/lib/site-copy'

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const links = useMemo(
    () => [
      { href: '/', label: siteCopy.nav.home },
      { href: '/organizations', label: siteCopy.nav.organizations },
      { href: '/professionals', label: siteCopy.nav.professionals },
      { href: '/consultation', label: siteCopy.nav.consultation },
      { href: '/recovery', label: siteCopy.nav.recovery },
      { href: '/daily-code', label: siteCopy.nav.dailyCode },
      { href: '/self-care', label: siteCopy.nav.selfCare },
      { href: '/emergency', label: siteCopy.nav.emergency },
      { href: '/professional-login', label: siteCopy.nav.professionalLogin },
    ],
    [],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl shrink-0">
            <Heart className="w-6 h-6 text-primary" aria-hidden />
            <span className="hidden sm:inline">MindBridge</span>
          </Link>

          <div className="hidden md:flex flex-1 flex-wrap items-center justify-end gap-1 min-w-0">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {mounted && (
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
            )}

            <button type="button" onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md hover:bg-muted" aria-expanded={isOpen} aria-label="Menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border/60 mt-1 pt-3">
            <div className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

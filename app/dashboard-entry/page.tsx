'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, AlertCircle } from 'lucide-react'

export default function DashboardEntryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <Card className="p-8 sm:p-12 shadow-2xl border-blue-100 dark:border-blue-900">
          {/* Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 sm:p-5">
              <span className="text-4xl sm:text-5xl">🩺</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-bold text-center text-foreground mb-3 sm:mb-4">
            Professional Dashboard
          </h1>
          <p className="text-center text-sm text-blue-600 dark:text-blue-400 font-semibold mb-6 sm:mb-8 uppercase tracking-wide">
            Demo Access
          </p>

          {/* Description */}
          <div className="space-y-6 mb-8 sm:mb-10">
            <p className="text-center text-base sm:text-lg text-foreground leading-relaxed font-medium">
              This is a demo interface showing how mental health professionals manage consultation requests.
            </p>
            <p className="text-center text-base sm:text-lg text-foreground leading-relaxed">
              Actions inside the dashboard are simulated.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/professional-dashboard" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-base h-12 font-semibold flex items-center justify-center gap-2">
                👉 Enter Demo Dashboard
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full text-base h-12 font-semibold">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8">
          Part of MindBridge Ethiopia — Connecting mental health professionals with those seeking support
        </p>
      </div>
    </div>
  )
}

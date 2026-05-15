'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { AlertTriangle, ArrowRight } from 'lucide-react'

export default function DashboardWarningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Warning Card */}
        <Card className="p-8 sm:p-12 shadow-2xl border-red-200 dark:border-red-900">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 sm:p-5">
              <AlertTriangle className="w-8 sm:w-10 h-8 sm:h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2 sm:mb-3">
            Demo Environment Notice
          </h1>
          <p className="text-center text-sm text-red-600 dark:text-red-400 font-semibold mb-6 sm:mb-8 uppercase tracking-wide">
            Important Information
          </p>

          {/* Warning Content */}
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-800 space-y-4">
              <div>
                <h2 className="font-semibold text-foreground text-base sm:text-lg mb-2">You are entering a demonstration dashboard</h2>
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  The Professional Dashboard is a simulated interface created for demonstration purposes. It showcases how mental health professionals would interact with consultation requests and manage patient information in the MindBridge Ethiopia system.
                </p>
              </div>

              <div className="border-t border-red-200 dark:border-red-800 pt-4">
                <p className="font-semibold text-foreground text-sm sm:text-base mb-3">Please note:</p>
                <ul className="space-y-2 text-sm sm:text-base text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span>All data displayed is fictional and for demo purposes only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span>No real consultation requests or patient information is involved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span>Actions like accepting or declining requests are simulated only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span>This is not connected to any real healthcare system</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 sm:p-5 border border-blue-200 dark:border-blue-800">
              <p className="text-sm sm:text-base text-foreground">
                <span className="font-semibold">Demo Features:</span> You can view requests, review patient details, accept/decline consultations, and manage your professional profile. All interactions are simulated for learning and demonstration purposes.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/professional-dashboard" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-base h-12 font-semibold flex items-center justify-center gap-2">
                I Understand, Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard-entry" className="flex-1">
              <Button variant="outline" className="w-full text-base h-12 font-semibold">
                Go Back
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8">
          MindBridge Ethiopia — Advancing Mental Health Services
        </p>
      </div>
    </div>
  )
}

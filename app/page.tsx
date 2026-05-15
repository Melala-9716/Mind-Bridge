'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { usePerformanceMonitoring } from '@/hooks/use-performance-monitoring'
import { Heart, Users, Building2, BookOpen, AlertCircle, Briefcase } from 'lucide-react'
import dynamic from 'next/dynamic'
import { siteCopy } from '@/lib/site-copy'
import { useMemo } from 'react'

const RateAppFeedback = dynamic(() => import('@/components/rate-app-feedback').then((mod) => ({ default: mod.RateAppFeedback })), {
  loading: () => <div className="h-20" />,
  ssr: true,
})

export default function Home() {
  usePerformanceMonitoring('Homepage')
  const t = siteCopy

  const features = useMemo(
    () => [
      { icon: Building2, title: t.mentalHealthOrgs, description: t.mentalHealthOrgsDesc, href: '/organizations' },
      { icon: Users, title: t.professionalDirectory, description: t.professionalDirectoryDesc, href: '/professionals' },
      { icon: Briefcase, title: t.requestConsultation, description: t.requestConsultationDesc, href: '/consultation' },
      { icon: BookOpen, title: t.selfCareTools, description: t.selfCareToolsDesc, href: '/self-care' },
      { icon: AlertCircle, title: t.crisisSupport, description: t.crisisSupportDesc, href: '/emergency' },
    ],
    [t],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <Navigation />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 rounded-full p-4">
                <Heart className="w-12 h-12 text-primary" aria-hidden />
              </div>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-foreground text-balance">{t.heroTitle}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">{t.homeLead}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/emergency">
              <Button size="lg" className="px-8">
                {t.crisisSupport}
              </Button>
            </Link>
            <Link href="/organizations">
              <Button size="lg" variant="outline" className="px-8">
                {t.getStarted}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.comprehensiveTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.comprehensiveDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link key={index} href={feature.href || '#'}>
                  <div className="bg-background rounded-lg p-8 border border-border hover:border-primary/50 hover:shadow-md transition-all h-full cursor-pointer">
                    <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                      <Icon className="w-6 h-6 text-primary" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.quickAccess}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/professionals">
            <Button variant="outline" className="w-full">
              {t.findProfessionals}
            </Button>
          </Link>
          <Link href="/organizations">
            <Button variant="outline" className="w-full">
              {t.browseOrganizations}
            </Button>
          </Link>
          <Link href="/self-care">
            <Button variant="outline" className="w-full">
              {t.quickSelfCareTools}
            </Button>
          </Link>
          <Link href="/consultation">
            <Button variant="outline" className="w-full">
              {t.consultationRequest}
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.whatOurUsersSay}</h2>
          <p className="text-lg text-muted-foreground">{t.homeTestimonialIntro}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="bg-background rounded-lg p-8 border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: '0s' }}
          >
            <div className="flex gap-1 mb-4" aria-hidden>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="text-foreground mb-6 italic">{t.homeTestimonialQuote1}</p>
            <div>
              <p className="font-semibold text-foreground">{t.homeTestimonialAuthor1}</p>
              <p className="text-sm text-muted-foreground">{t.homeTestimonialRole1}</p>
            </div>
          </div>

          <div
            className="bg-background rounded-lg p-8 border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex gap-1 mb-4" aria-hidden>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="text-foreground mb-6 italic">{t.homeTestimonialQuote2}</p>
            <div>
              <p className="font-semibold text-foreground">{t.homeTestimonialAuthor2}</p>
              <p className="text-sm text-muted-foreground">{t.homeTestimonialRole2}</p>
            </div>
          </div>

          <div
            className="bg-background rounded-lg p-8 border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex gap-1 mb-4" aria-hidden>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="text-foreground mb-6 italic">{t.homeTestimonialQuote3}</p>
            <div>
              <p className="font-semibold text-foreground">{t.homeTestimonialAuthor3}</p>
              <p className="text-sm text-muted-foreground">{t.homeTestimonialRole3}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.helpImprove}</h2>
              <p className="text-lg text-muted-foreground">{t.feedbackDescription}</p>
            </div>
            <div className="w-full lg:w-auto">
              <RateAppFeedback />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>{t.homeFooterRights}</p>
        </div>
      </footer>
    </div>
  )
}

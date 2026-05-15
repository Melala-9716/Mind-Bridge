'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Phone } from 'lucide-react'
import { siteCopy } from '@/lib/site-copy'

interface EmergencyContact {
  id: string
  name: string
  description: string
  phone: string
  category: string
  priority: 'critical' | 'high'
}

export default function EmergencyPage() {
  const t = siteCopy

  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Police Emergency',
      description: 'General police emergency response for immediate safety threats',
      phone: '+251 991',
      category: 'Police',
      priority: 'critical',
    },
    {
      id: '2',
      name: 'Fire Emergency Services',
      description: 'Fire and rescue emergency support services',
      phone: '+251 939',
      category: 'Emergency',
      priority: 'critical',
    },
    {
      id: '3',
      name: 'Ambulance (Addis Ababa)',
      description: 'Emergency medical ambulance service for immediate medical transport',
      phone: '+251 907',
      category: 'Emergency',
      priority: 'critical',
    },
    {
      id: '4',
      name: 'Amanuel Mental Specialized Hospital',
      description: 'Largest mental health hospital in Ethiopia providing comprehensive psychiatric care',
      phone: '+251 11 155 2070',
      category: 'Mental Health',
      priority: 'critical',
    },
    {
      id: '5',
      name: "St. Paul's Hospital - Psychiatry Unit",
      description: 'Psychiatric consultation and mental health emergency services',
      phone: '+251 11 276 3414',
      category: 'Mental Health',
      priority: 'high',
    },
    {
      id: '6',
      name: 'Tikur Anbessa Specialized Hospital',
      description: 'Major referral hospital with comprehensive mental health services',
      phone: '+251 11 551 4898',
      category: 'Mental Health',
      priority: 'high',
    },
    {
      id: '7',
      name: 'Yekatit 12 Hospital Medical College',
      description: 'Mental health diagnosis and treatment services',
      phone: '+251 11 551 7077',
      category: 'Mental Health',
      priority: 'high',
    },
    {
      id: '8',
      name: 'Jimma University Medical Center',
      description: 'Regional hospital with psychiatric care for western Ethiopia',
      phone: '+251 47 111 2222',
      category: 'Mental Health',
      priority: 'high',
    },
    {
      id: '9',
      name: 'Hawassa University Comprehensive Hospital',
      description: 'General and specialized mental health services for southern Ethiopia',
      phone: '+251 46 220 1511',
      category: 'Mental Health',
      priority: 'high',
    },
    {
      id: '10',
      name: 'Ethiopian Women Lawyers Association (EWLA)',
      description: 'Legal aid and support for women facing violence and abuse',
      phone: '+251 11 155 1155',
      category: "Women's Support",
      priority: 'critical',
    },
  ]

  const criticalContacts = emergencyContacts.filter((c) => c.priority === 'critical')
  const otherContacts = emergencyContacts.filter((c) => c.priority === 'high')

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <Navigation />

      {/* Emotional Support Banner */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-xl font-semibold">
            {t.emergencyCrisisIntro}
          </p>
        </div>
      </section>

      {/* Critical Action Cards - TOP PRIORITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {/* Emergency Services Card */}
          <div className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl p-8 text-center shadow-lg transition-all">
            <p className="text-sm font-medium mb-2 opacity-90">{t.emergencyServicesLabel}</p>
            <h2 className="text-4xl font-bold mb-4">{t.emergencyCallTitle}</h2>
            <p className="text-sm opacity-90">{t.emergencyCallSubtitle}</p>
          </div>

          {/* Hospital Card */}
          <div className="bg-orange-600 text-white rounded-xl p-8 text-center shadow-lg transition-all">
            <p className="text-sm font-medium mb-2 opacity-90">{t.emergencyImmediateLabel}</p>
            <h2 className="text-4xl font-bold mb-4">{t.emergencyHospitalTitle}</h2>
            <p className="text-sm opacity-90">{t.emergencyHospitalSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Immediate Emergency Contacts */}
      <section className="bg-destructive/5 border-t border-b border-destructive/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t.emergencyHotlinesTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalContacts.map((contact) => (
              <a key={contact.id} href={`tel:${contact.phone}`}>
                <div className="bg-white dark:bg-slate-900 border-2 border-destructive rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                  <h3 className="font-bold text-lg text-foreground mb-1">{contact.name}</h3>
                  <p className="text-sm text-destructive font-semibold mb-3">{contact.category}</p>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{contact.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-destructive" />
                      <span className="text-lg font-bold text-destructive">{contact.phone}</span>
                    </div>
                    <Button className="w-full bg-destructive hover:bg-destructive/90">
                      {t.emergencyCopyNumber}
                    </Button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mental Health Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">{t.emergencyMentalHealthServicesTitle}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherContacts.map((contact) => (
            <a key={contact.id} href={`tel:${contact.phone}`}>
              <div className="bg-card border-2 border-primary/30 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full flex flex-col cursor-pointer">
                <h3 className="font-bold text-lg text-foreground mb-2">{contact.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{contact.category}</p>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">{contact.description}</p>
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">{contact.phone}</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    {t.emergencyCopyNumber}
                  </Button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* What to Do in Crisis - Simple Steps */}
      <section className="bg-blue-50 dark:bg-blue-950/20 border-t border-blue-200 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-foreground mb-2">{t.emergencyCrisisStepsTitle}</h2>
          <p className="text-muted-foreground mb-8">{t.emergencyCrisisStepsLead}</p>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-semibold text-foreground">{t.emergencyStep1Title}</p>
                <p className="text-sm text-muted-foreground">{t.emergencyStep1Body}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-semibold text-foreground">{t.emergencyStep2Title}</p>
                <p className="text-sm text-muted-foreground">{t.emergencyStep2Body}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-semibold text-foreground">{t.emergencyStep3Title}</p>
                <p className="text-sm text-muted-foreground">{t.emergencyStep3Body}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">4</span>
              <div>
                <p className="font-semibold text-foreground">{t.emergencyStep4Title}</p>
                <p className="text-sm text-muted-foreground">{t.emergencyStep4Body}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex-shrink-0">✓</span>
              <div>
                <p className="font-semibold text-foreground">{t.emergencyStep5Title}</p>
                <p className="text-sm text-muted-foreground">{t.emergencyStep5Body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8">{t.emergencyAfterTitle}</h2>
        <p className="text-muted-foreground mb-6">{t.emergencyAfterLead}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/self-care">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t.selfCareTools}
            </Button>
          </Link>
          <Link href="/professionals">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t.findProfessionals}
            </Button>
          </Link>
          <Link href="/recovery">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t.nav.recovery}
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t.emergencyBackHome}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p className="text-sm">{t.emergencyFooterLine1}</p>
          <p className="text-xs mt-2">{t.emergencyFooterLine2}</p>
        </div>
      </footer>
    </div>
  )
}

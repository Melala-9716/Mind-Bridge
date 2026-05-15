'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function ProfessionalDashboardPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
            Professional System Overview
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
            Professional Dashboard
            <span className="text-blue-600 dark:text-blue-400"> (Demo)</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            View how mental health professionals manage consultation requests on MindBridge Ethiopia. This is a simulated view of the professional system workflow.
          </p>
          <Link href="/professional-dashboard">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
              Enter Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-2 text-center">Professional Workflow Preview</h2>
        <p className="text-muted-foreground text-center mb-12">This simulates how professionals interact with the system</p>
        
        {/* Preview Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
            
            {/* 1. Incoming Requests Panel */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <h3 className="font-bold text-foreground">Incoming Requests</h3>
              </div>
              
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-red-500">
                <p className="font-semibold text-foreground">Abebe</p>
                <p className="text-sm text-muted-foreground">Anxiety / Academic Stress</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">📧 Email</p>
                <p className="text-xs text-muted-foreground mt-1">12 min ago</p>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-500">
                <p className="font-semibold text-foreground">Hana</p>
                <p className="text-sm text-muted-foreground">Work Stress / Sleep Issues</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">☎️ Phone</p>
                <p className="text-xs text-muted-foreground mt-1">25 min ago</p>
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <p className="font-semibold text-foreground">Dawit</p>
                <p className="text-sm text-muted-foreground">Burnout / Depression</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">💬 Chat</p>
                <p className="text-xs text-muted-foreground mt-1">45 min ago</p>
              </Card>
            </div>

            {/* 2. Request Details Panel */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h3 className="font-bold text-foreground">Request Details</h3>
              </div>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Client Name</p>
                    <p className="font-bold text-lg text-foreground">Abebe Kebede</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Primary Concern</p>
                    <p className="font-semibold text-foreground">Anxiety / Academic Stress</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-blue-600">abebe.kebede@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                    <p className="font-semibold text-foreground">+251 911 234 567</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Preferred Language</p>
                    <p className="font-semibold text-foreground">Amharic</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Message Preview</p>
                    <p className="text-sm text-foreground mt-2 italic">
                      "I've been experiencing severe anxiety about my exams and can't focus on my studies..."
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 3. Chat Preview & Actions Panel */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <h3 className="font-bold text-foreground">Actions</h3>
              </div>

              {/* Chat Bubbles Preview */}
              <Card className="p-4 space-y-3 mb-4 bg-muted/30">
                <div className="flex justify-start">
                  <div className="max-w-xs px-4 py-2 bg-gray-300 dark:bg-gray-600 text-foreground rounded-lg rounded-bl-none text-sm">
                    Hello, I need help with my anxiety
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-xs px-4 py-2 bg-blue-500 text-white rounded-lg rounded-br-none text-sm">
                    Of course, let's work through this together
                  </div>
                </div>
              </Card>

              {/* Status & Action Buttons */}
              <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-foreground">Available Today</span>
                  </div>
                  
                  <div className="flex gap-3 flex-col">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Request
                    </Button>
                    <Button variant="outline" className="w-full">
                      Decline Request
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📥</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Manage Requests</h3>
                <p className="text-muted-foreground">Receive and manage consultation requests from clients with detailed information</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Accept/Decline</h3>
                <p className="text-muted-foreground">Quickly accept or decline consultation requests based on availability</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Client Details</h3>
                <p className="text-muted-foreground">View comprehensive client information including concerns and preferences</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Multi-Language</h3>
                <p className="text-muted-foreground">Support for multiple languages including English and Amharic</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore?</h2>
          <p className="text-blue-100 mb-8 text-lg">Enter the professional dashboard and see how MindBridge empowers mental health professionals</p>
          <Link href="/professional-dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Enter Professional Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Note */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <span className="font-semibold">Note:</span> This is a preview and demonstration of the professional system. All data and interactions are simulated for demonstration purposes only.
          </p>
        </div>
      </section>
    </div>
  )
}

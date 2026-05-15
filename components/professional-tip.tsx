'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Mood = 'good' | 'okay' | 'low' | 'stressed' | null

interface Tip {
  text: string
  mood: Mood
  category: string
  source: 'Mental Health Professional' | 'Clinical Psychologist' | 'Wellness Expert'
}

const moodTips: Record<string, Tip[]> = {
  good: [
    { text: 'Keep up what\'s working — small positive habits build long-term stability.', mood: 'good', category: 'Balance', source: 'Mental Health Professional' },
    { text: 'Share your positive mood with someone who needs it.', mood: 'good', category: 'Connection', source: 'Wellness Expert' },
    { text: 'Reflect on what made today good — remember these moments.', mood: 'good', category: 'Growth', source: 'Clinical Psychologist' },
    { text: 'Use this energy to prepare for challenging moments ahead.', mood: 'good', category: 'Balance', source: 'Mental Health Professional' },
    { text: 'Celebrate the small wins — they add up over time.', mood: 'good', category: 'Self-Care', source: 'Wellness Expert' },
  ],
  okay: [
    { text: 'Try one small positive action to gently improve your mood.', mood: 'okay', category: 'Growth', source: 'Mental Health Professional' },
    { text: 'You\'re doing better than you think — keep going.', mood: 'okay', category: 'Balance', source: 'Wellness Expert' },
    { text: 'Sometimes "okay" is enough — honor where you are today.', mood: 'okay', category: 'Self-Care', source: 'Clinical Psychologist' },
    { text: 'Reach out to someone — connection can lift your mood.', mood: 'okay', category: 'Connection', source: 'Mental Health Professional' },
    { text: 'Take one small step forward, no matter how tiny.', mood: 'okay', category: 'Growth', source: 'Wellness Expert' },
  ],
  low: [
    { text: 'Start with one small step — even a little progress matters.', mood: 'low', category: 'Self-Care', source: 'Mental Health Professional' },
    { text: 'You don\'t have to feel better immediately — be patient with yourself.', mood: 'low', category: 'Self-Care', source: 'Clinical Psychologist' },
    { text: 'Talk to someone you trust — you don\'t have to carry this alone.', mood: 'low', category: 'Connection', source: 'Mental Health Professional' },
    { text: 'Gentle movement like a short walk can help shift your mood.', mood: 'low', category: 'Self-Care', source: 'Wellness Expert' },
    { text: 'This feeling is temporary — reach out for support.', mood: 'low', category: 'Connection', source: 'Mental Health Professional' },
  ],
  stressed: [
    { text: 'Slow your breathing and focus on one task at a time.', mood: 'stressed', category: 'Stress', source: 'Clinical Psychologist' },
    { text: 'Break large tasks into smaller steps to reduce overwhelm.', mood: 'stressed', category: 'Stress', source: 'Mental Health Professional' },
    { text: 'Take a 5-minute break — your mind needs a pause.', mood: 'stressed', category: 'Stress', source: 'Wellness Expert' },
    { text: 'Focus on what you can control right now, not everything at once.', mood: 'stressed', category: 'Stress', source: 'Mental Health Professional' },
    { text: 'It\'s okay to say no — protecting your time is important.', mood: 'stressed', category: 'Stress', source: 'Clinical Psychologist' },
  ],
  default: [
    { text: 'Check in with yourself — how are you really feeling today?', mood: null, category: 'Awareness', source: 'Mental Health Professional' },
    { text: 'Your mental health matters — take a moment for yourself.', mood: null, category: 'Self-Care', source: 'Wellness Expert' },
    { text: 'Small moments of care add up to big changes.', mood: null, category: 'Growth', source: 'Mental Health Professional' },
  ]
}

const moodColors: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  good: { 
    bg: 'bg-emerald-50 dark:bg-emerald-950/20', 
    text: 'text-emerald-700 dark:text-emerald-400', 
    border: 'border-emerald-200 dark:border-emerald-800',
    tag: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
  },
  okay: { 
    bg: 'bg-blue-50 dark:bg-blue-950/20', 
    text: 'text-blue-700 dark:text-blue-400', 
    border: 'border-blue-200 dark:border-blue-800',
    tag: 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
  },
  low: { 
    bg: 'bg-amber-50 dark:bg-amber-950/20', 
    text: 'text-amber-700 dark:text-amber-400', 
    border: 'border-amber-200 dark:border-amber-800',
    tag: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
  },
  stressed: { 
    bg: 'bg-red-50 dark:bg-red-950/20', 
    text: 'text-red-700 dark:text-red-400', 
    border: 'border-red-200 dark:border-red-800',
    tag: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800'
  },
  default: { 
    bg: 'bg-slate-50 dark:bg-slate-950/20', 
    text: 'text-slate-700 dark:text-slate-400', 
    border: 'border-slate-200 dark:border-slate-800',
    tag: 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'
  }
}

const categoryMoodMap: Record<string, string> = {
  'Balance': 'good',
  'Connection': 'okay',
  'Growth': 'okay',
  'Self-Care': 'low',
  'Stress': 'stressed',
  'Awareness': 'default'
}

export function ProfessionalTip({ selectedMood }: { selectedMood?: Mood }) {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Select tips based on mood or use default
    let tipsToUse: Tip[] = moodTips.default
    let moodKey = 'default'
    
    if (selectedMood && selectedMood in moodTips) {
      tipsToUse = moodTips[selectedMood]
      moodKey = selectedMood
    }
    
    // Rotate tip daily based on date
    const today = new Date().getDate()
    const tipIndex = today % tipsToUse.length
    setCurrentTip(tipsToUse[tipIndex])
  }, [selectedMood])

  if (!mounted || !currentTip) return null

  const colorScheme = moodColors[selectedMood || 'default']
  const moodLabel = selectedMood ? selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1) : 'Check In'

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Today's Tip from a Professional</h2>
        {!selectedMood && (
          <p className="text-muted-foreground text-sm">Check in to get a personalized tip based on your mood</p>
        )}
      </div>

      <Card className={`p-6 sm:p-8 border-2 transition-all duration-500 ${colorScheme.border} ${colorScheme.bg}`}>
        <div className="space-y-6">
          {/* Mood Indicator */}
          {selectedMood && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${colorScheme.tag}`}>
                {moodLabel}
              </span>
              <span className={`text-xs font-medium ${colorScheme.text}`}>Personalized for you</span>
            </div>
          )}

          {/* Tip Text */}
          <p className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
            {currentTip.text}
          </p>

          {/* Source and Category */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-muted-foreground italic">
              — {currentTip.source}
            </p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colorScheme.tag}`}>
              {currentTip.category}
            </span>
          </div>

          {/* Connection to Stories */}
          <div className="border-t border-border pt-6 space-y-4">
            <p className="text-foreground font-medium text-sm">
              Want to see how others handled this?
            </p>
            <Link href={`/recovery?theme=${currentTip.category.toLowerCase()}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                Read a related story →
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  )
}

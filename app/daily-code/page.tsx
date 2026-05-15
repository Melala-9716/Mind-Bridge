'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { ProfessionalTip } from '@/components/professional-tip'
import { Card } from '@/components/ui/card'

type Mood = 'good' | 'okay' | 'low' | 'stressed' | null

const moodOptions = [
  { value: 'good', emoji: '😊', label: 'Good', description: 'Feeling positive' },
  { value: 'okay', emoji: '😐', label: 'Okay', description: 'Neutral' },
  { value: 'low', emoji: '😔', label: 'Low', description: 'Struggling' },
  { value: 'stressed', emoji: '😣', label: 'Stressed', description: 'Overwhelmed' },
]

export default function DailyCode() {
  const [selectedMood, setSelectedMood] = useState<Mood>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Daily Mental Health Tips</h1>
          <p className="text-lg text-muted-foreground mb-8">Check in with how you're feeling to get personalized guidance</p>
        </div>

        {/* Mood Check-In */}
        <Card className="p-8 mb-12 bg-white/50 dark:bg-card/50">
          <h2 className="text-2xl font-bold text-foreground mb-2">How are you feeling today?</h2>
          <p className="text-muted-foreground mb-6">Select your mood to get a personalized tip</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value as Mood)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                  selectedMood === mood.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 bg-background/50'
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="font-semibold text-sm text-foreground">{mood.label}</span>
                <span className="text-xs text-muted-foreground">{mood.description}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => setSelectedMood(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear selection
              </button>
            </div>
          )}
        </Card>

        {/* Professional Tip - Shows based on selected mood */}
        <ProfessionalTip selectedMood={selectedMood} />

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mt-12">
          <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-3">Daily Rotation</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Tips rotate daily based on your mood. Come back tomorrow for new guidance tailored to how you're feeling.
            </p>
          </Card>

          <Card className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-3">Read Stories</h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-300">
              After each tip, you can read recovery stories from people who've faced similar challenges. Connect and learn.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

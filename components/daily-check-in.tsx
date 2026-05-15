'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type MoodType = 'good' | 'okay' | 'low' | 'stressed' | null

const moodConfig = {
  good: {
    emoji: '😊',
    label: 'Good',
    message: 'That\'s wonderful! Keep riding this positive wave.',
    suggestions: [
      'Share your joy with someone',
      'Read an inspiring recovery story'
    ]
  },
  okay: {
    emoji: '😐',
    label: 'Okay',
    message: 'That\'s perfectly normal. You\'re doing just fine.',
    suggestions: [
      'Take a short walk',
      'Try a quick breathing exercise'
    ]
  },
  low: {
    emoji: '😔',
    label: 'Low',
    message: 'It\'s okay to have difficult days. You\'re not alone in this.',
    suggestions: [
      'Reach out to someone you trust',
      'Read a recovery story for inspiration'
    ]
  },
  stressed: {
    emoji: '😣',
    label: 'Stressed',
    message: 'It\'s okay to feel overwhelmed. Let\'s slow things down.',
    suggestions: [
      'Try a 1-minute breathing exercise',
      'Take a break from screens'
    ]
  }
}

export function DailyCheckIn() {
  const [selectedMood, setSelectedMood] = useState<MoodType>(null)
  const [showMessage, setShowMessage] = useState(false)

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood)
    setShowMessage(true)
  }

  const currentMood = selectedMood ? moodConfig[selectedMood] : null

  return (
    <section className="bg-gradient-to-b from-blue-50/50 to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How are you feeling today?
          </h2>
          <p className="text-lg text-muted-foreground">
            Check in with yourself and get personalized support
          </p>
        </div>

        {/* Mood Selection Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(moodConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleMoodSelect(key as MoodType)}
              className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 ${
                selectedMood === key
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-card border-2 border-border hover:border-primary/50 hover:shadow-md text-foreground'
              }`}
            >
              <span className="text-4xl mb-2">{config.emoji}</span>
              <span className="font-semibold text-sm">{config.label}</span>
            </button>
          ))}
        </div>

        {/* Response Message */}
        {showMessage && currentMood && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="bg-white/80 dark:bg-card/80 backdrop-blur p-8 mb-6 border-primary/30">
              <p className="text-center text-lg text-foreground mb-6 leading-relaxed">
                {currentMood.message}
              </p>
              
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground text-center">
                  Here's what might help:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {currentMood.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg p-4 text-center"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Thanks for checking in today
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMood(null)
                    setShowMessage(false)
                  }}
                  className="text-xs"
                >
                  Change mood
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}

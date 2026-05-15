'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wind, Zap, Lightbulb, RefreshCw, BookOpen, Droplets } from 'lucide-react'
import { siteCopy } from '@/lib/site-copy'

interface BreathingMode {
  name: string
  description: string
  inhale: number
  hold: number
  exhale: number
  cycles: number
}

const breathingModes: BreathingMode[] = [
  { name: 'Calm', description: 'Slow, deep breathing', inhale: 4, hold: 4, exhale: 6, cycles: 5 },
  { name: 'Focus', description: 'Balanced breathing', inhale: 4, hold: 4, exhale: 4, cycles: 5 },
  { name: 'Sleep', description: 'Extra slow breathing', inhale: 4, hold: 7, exhale: 8, cycles: 4 },
]

const moodResets = [
  { mood: 'I feel stressed', color: 'border-orange-400 bg-orange-50 dark:bg-orange-950', exercise: 'Box Breathing: Inhale 4, hold 4, exhale 4. Repeat 5 times.' },
  { mood: 'I feel overwhelmed', color: 'border-purple-400 bg-purple-50 dark:bg-purple-950', exercise: '5-4-3-2-1 Grounding: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.' },
  { mood: 'I can\'t focus', color: 'border-blue-400 bg-blue-50 dark:bg-blue-950', exercise: 'Focus Breathing: 4-4-4 breathing for 5 cycles to reset your mind.' },
  { mood: 'I need calm', color: 'border-green-400 bg-green-50 dark:bg-green-950', exercise: '4-7-8 Breathing: A powerful relaxation technique. Inhale 4, hold 7, exhale 8.' },
]

const quickActions = [
  { label: 'Take a 2-minute pause', icon: Wind },
  { label: 'Stretch reminder', icon: RefreshCw },
  { label: 'Drink water', icon: Droplets },
  { label: 'Reset my mind', icon: Lightbulb },
]

export default function SelfCare() {
  const t = siteCopy
  const [selectedMode, setSelectedMode] = useState<BreathingMode>(breathingModes[0])
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [phaseTime, setPhaseTime] = useState(0)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [journalText, setJournalText] = useState('')
  const [circleScale, setCircleScale] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  useEffect(() => {
    if (!isBreathing) return

    const phaseValues = {
      inhale: selectedMode.inhale,
      hold: selectedMode.hold,
      exhale: selectedMode.exhale,
    }

    const currentPhaseDuration = phaseValues[breathingPhase]
    const interval = setInterval(() => {
      setPhaseTime(prev => {
        if (prev >= currentPhaseDuration - 1) {
          const phases: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale']
          const currentIndex = phases.indexOf(breathingPhase)
          const nextPhase = phases[(currentIndex + 1) % phases.length]
          setBreathingPhase(nextPhase)
          setCircleScale(nextPhase === 'inhale' ? 1.5 : nextPhase === 'hold' ? 1.5 : 1)
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isBreathing, breathingPhase, selectedMode])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveJournal = () => {
    if (!journalText.trim()) return

    const entry = {
      id: Date.now(),
      text: journalText,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }

    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]')
    entries.unshift(entry)
    localStorage.setItem('journalEntries', JSON.stringify(entries))

    setSaved(true)
    setJournalText('')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">{t.selfCarePageTitle}</h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-xl text-muted-foreground">{t.selfCarePageLead}</p>
        </div>

        {/* Quick Calm Tools Section */}
        <section className="mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8 text-center">Quick Calm Tools</h2>
          
          {/* Guided Breathing */}
          <div className="mb-6 sm:mb-8 md:mb-8">
            <Card className="p-4 sm:p-6 md:p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 text-center">Breathing Exercise</h3>
              <p className="text-xs sm:text-sm md:text-base text-center text-muted-foreground mb-4 sm:mb-6 md:mb-8">Simple guided breathing: Inhale 4s → Hold 4s → Exhale 4s</p>
            
            {/* Breathing Circle */}
            <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-8">
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div
                  className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-semibold text-center transition-transform duration-1000"
                  style={{
                    transform: `scale(${circleScale})`,
                  }}
                >
                  <div>
                    <div className="text-xs sm:text-sm md:text-base capitalize text-white/90">{breathingPhase}</div>
                    <div className="text-xl sm:text-2xl md:text-2xl font-bold">{phaseTime}</div>
                  </div>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex gap-2 sm:gap-3 md:gap-3 mb-4 sm:mb-6 md:mb-6 flex-wrap justify-center">
                {breathingModes.map(mode => (
                  <Button
                    key={mode.name}
                    variant={selectedMode.name === mode.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedMode(mode)
                      setIsBreathing(false)
                      setPhaseTime(0)
                      setBreathingPhase('inhale')
                      setCircleScale(1)
                    }}
                  >
                    {mode.name}
                  </Button>
                ))}
              </div>

              <div className="text-center mb-4 sm:mb-6 md:mb-6">
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-1">{selectedMode.description}</p>
                <p className="text-xs sm:text-xs md:text-sm text-muted-foreground">{selectedMode.inhale}-{selectedMode.hold}-{selectedMode.exhale} breathing</p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setIsBreathing(!isBreathing)
                  if (!isBreathing) {
                    setPhaseTime(0)
                    setBreathingPhase('inhale')
                    setCircleScale(1.5)
                  }
                }}
                className="gap-2"
              >
                <Wind className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5" />
                {isBreathing ? 'Stop' : 'Start'} Breathing
              </Button>
            </div>
          </Card>
        </div>
        </section>

        {/* Emotional Support Section */}
        <section className="mb-8 sm:mb-16 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-8 text-center">Remember</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              'You are not alone',
              'It\'s okay to not feel okay',
              'Progress takes time',
              'You are stronger than you think',
              'Small steps count',
              'Be kind to yourself'
            ].map((message, idx) => (
              <Card key={idx} className="p-3 sm:p-6 bg-white/50 dark:bg-card/50 text-center border-primary/20">
                <p className="text-xs sm:text-base lg:text-lg font-semibold text-foreground italic">{message}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Daily Self-Care Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">{t.selfCareDailyTips}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '💧', title: 'Drink water', description: 'Stay hydrated throughout the day' },
              { emoji: '🚶', title: 'Take a short walk', description: 'Move your body and get fresh air' },
              { emoji: '💬', title: 'Talk to someone', description: 'Reach out to someone you trust' },
              { emoji: '📱', title: 'Break from screens', description: 'Give your eyes and mind a rest' },
              { emoji: '📝', title: 'Write it down', description: 'Journal your thoughts and feelings' },
              { emoji: '😴', title: 'Rest well', description: 'Prioritize quality sleep' }
            ].map((tip, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{tip.emoji}</span>
                  <button className="text-lg">🤍</button>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Mood Reset Cards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Need an Instant Reset?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {moodResets.map((item, idx) => (
              <Card
                key={idx}
                className={`p-6 cursor-pointer border-2 transition-all ${
                  selectedMood === item.mood
                    ? `${item.color} ring-2 ring-offset-2`
                    : `${item.color} hover:shadow-lg`
                }`}
                onClick={() => setSelectedMood(selectedMood === item.mood ? null : item.mood)}
              >
                <h3 className="font-semibold text-foreground mb-2">{item.mood}</h3>
                {selectedMood === item.mood && (
                  <p className="text-sm text-foreground mt-4 p-3 bg-white/50 dark:bg-white/10 rounded">{item.exercise}</p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Relief Actions */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-5 md:mb-6">Quick Relief Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
            {quickActions.map((action, idx) => {
              const IconComponent = action.icon
              return (
                <Button
                  key={idx}
                  variant={selectedAction === action.label ? 'default' : 'outline'}
                  size="sm"
                  className="h-16 sm:h-20 md:h-24 flex flex-col items-center justify-center gap-1 sm:gap-1.5 md:gap-2 hover:bg-primary/10 text-xs sm:text-xs md:text-sm"
                  onClick={() => setSelectedAction(selectedAction === action.label ? null : action.label)}
                >
                  <IconComponent className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
                  <span className="text-xs sm:text-xs md:text-sm text-center line-clamp-2">{action.label}</span>
                </Button>
              )
            })}
          </div>
          
          {selectedAction && (
            <Card className="p-3 sm:p-4 md:p-6 bg-primary/5 border-primary/30">
              <h3 className="font-semibold text-sm sm:text-base md:text-base text-foreground mb-2 sm:mb-2 md:mb-3">{selectedAction}</h3>
              <p className="text-xs sm:text-sm md:text-sm text-muted-foreground">
                {selectedAction === 'Take a 2-minute pause' && 'Step away from what you\'re doing. Find a quiet space. Close your eyes and take slow, deep breaths. This simple pause can reset your mind and reduce stress.'}
                {selectedAction === 'Stretch reminder' && 'Stand up and do some gentle stretches. Reach your arms up, touch your toes, rotate your shoulders. Physical movement helps release tension and improves blood flow.'}
                {selectedAction === 'Drink water' && 'Hydration is essential for mental clarity. Drink a full glass of water slowly. Proper hydration can improve focus, mood, and overall well-being.'}
                {selectedAction === 'Reset my mind' && 'Close your eyes for 30 seconds. Think of a peaceful place. Take three deep breaths. Open your eyes. This quick reset can help you refocus and feel more calm.'}
              </p>
            </Card>
          )}
        </div>

        {/* Journaling Section */}
        <section className="mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8 text-center">Journaling Prompts</h2>
          <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
              {[
                'What\'s been on your mind today?',
                'What made you feel even a little better?',
                'What are you grateful for?',
                'What did you learn about yourself today?',
                'What would help you feel better right now?'
              ].map((prompt, idx) => (
                <div key={idx} className="p-2 sm:p-3 md:p-4 bg-white/80 dark:bg-card/80 rounded-lg border-l-4 border-primary">
                  <p className="text-xs sm:text-sm md:text-base text-foreground font-medium">{prompt}</p>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 md:mb-4 text-center">Take time to reflect and write about what comes to mind</p>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value.slice(0, 500))}
              placeholder="Write your thoughts here..."
              className="w-full h-32 sm:h-36 md:h-40 p-3 sm:p-4 md:p-4 rounded-lg border border-border bg-background text-xs sm:text-sm md:text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              disabled={!mounted}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3 sm:mt-4 md:mt-4">
              <p className="text-xs sm:text-xs md:text-sm text-muted-foreground">
                {journalText.length} / 500 characters
              </p>
              <div className="flex gap-2 items-center w-full sm:w-auto">
                {saved && (
                  <span className="text-xs sm:text-sm md:text-sm text-green-600 font-medium">✓ Saved to your journal</span>
                )}
                <Button
                  onClick={handleSaveJournal}
                  disabled={!journalText.trim() || !mounted}
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Save Entry
                </Button>
                {mounted && (
                  <Button variant="outline" size="sm" asChild>
                    <a href="/journal">View Journal →</a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Grounding Exercise */}
        <section className="mb-16">
          <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">5-4-3-2-1 Grounding Exercise</h2>
            <p className="text-center text-muted-foreground mb-6">Ground yourself by identifying sensory experiences</p>
            <div className="space-y-3">
              {[
                { num: 5, sense: 'See', example: 'things around you' },
                { num: 4, sense: 'Feel', example: 'things you can touch' },
                { num: 3, sense: 'Hear', example: 'sounds nearby' },
                { num: 2, sense: 'Smell', example: 'scents in the air' },
                { num: 1, sense: 'Taste', example: 'flavors on your tongue' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-primary">{step.num}</span> thing(s) you can {step.sense.toLowerCase()} - {step.example}
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Navigation Suggestions - CTA Section */}
        <section className="bg-primary text-primary-foreground py-8 sm:py-12 md:py-16 rounded-lg">
          <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Need Additional Support?</h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90">
              Self-care is important, but sometimes you need professional guidance
            </p>
            <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 justify-center">
              <Link href="/recovery">
                <Button size="sm" className="w-full md:w-auto" variant="secondary">
                  {t.selfCareReadRecovery}
                </Button>
              </Link>
              <Link href="/professionals">
                <Button size="sm" className="w-full md:w-auto" variant="outline">
                  Talk to a Professional
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

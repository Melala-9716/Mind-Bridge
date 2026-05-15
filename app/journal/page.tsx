'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface JournalEntry {
  id: number
  text: string
  date: string
  time: string
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('journalEntries') || '[]')
    setEntries(saved)
    setMounted(true)
  }, [])

  const handleDelete = (id: number) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('journalEntries', JSON.stringify(updated))
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/self-care">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Self-Care
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">My Journal</h1>
          <p className="text-lg text-muted-foreground">
            {entries.length === 0 ? 'You haven\'t written anything yet' : `${entries.length} journal ${entries.length === 1 ? 'entry' : 'entries'}`}
          </p>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Start your journaling journey by writing your first reflection.
              </p>
              <Link href="/self-care">
                <Button>Write in Your Journal</Button>
              </Link>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex-grow">
                    <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                      <span>{entry.date}</span>
                      <span>{entry.time}</span>
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {entry.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

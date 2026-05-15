'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Check } from 'lucide-react'

export function RateAppFeedback() {
  const [rating, setRating] = useState<number>(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoveredRating, setHoveredRating] = useState<number>(0)

  const handleSubmit = () => {
    // Mock data storage - in production, this would send to a backend
    const feedbackData = {
      rating: rating || null,
      feedback: feedback.trim() || null,
      timestamp: new Date().toISOString(),
    }
    
    console.log('[v0] Feedback submitted:', feedbackData)
    
    // Store in localStorage for demo purposes
    const existingFeedback = localStorage.getItem('appFeedback')
    const feedbackList = existingFeedback ? JSON.parse(existingFeedback) : []
    feedbackList.push(feedbackData)
    localStorage.setItem('appFeedback', JSON.stringify(feedbackList))
    
    setSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setRating(0)
      setFeedback('')
      setSubmitted(false)
    }, 3000)
  }

  const isFormEmpty = rating === 0 && feedback.trim() === ''
  const canSubmit = rating > 0 || feedback.trim().length > 0

  return (
    <Card className="p-6 border border-border bg-card max-w-md">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Rate this app
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Help us improve your experience
          </p>
        </div>

        {/* Star Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            How would you rate our app?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  size={32}
                  className={`transition-all ${
                    star <= (hoveredRating || rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Share your feedback (optional)
          </label>
          <textarea
            placeholder="What can we improve?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
            className="w-full min-h-24 resize-none bg-background border border-border rounded-md p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitted}
          />
          <p className="text-xs text-muted-foreground">
            {feedback.length} / 500 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitted}
          className="w-full transition-all"
        >
          {submitted ? (
            <>
              <Check size={16} className="mr-2" />
              Thank you for your feedback!
            </>
          ) : (
            'Submit Feedback'
          )}
        </Button>

        {/* Success Message */}
        {submitted && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-primary font-medium text-center">
              Your feedback helps us create a better experience for everyone.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

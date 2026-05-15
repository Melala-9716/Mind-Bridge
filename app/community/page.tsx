'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import { mockModerationCheck, moderationResponses } from '@/lib/support-data'
import { Heart, MessageCircle } from 'lucide-react'

interface Story {
  id: string
  name: string
  title: string
  content: string
  category: string
  timestamp: string
  likes: number
  comments: number
  status: 'safe' | 'sensitive' | 'blocked'
}

const sampleStories: Story[] = [
  {
    id: '1',
    name: 'Anonymous',
    title: 'Finding Hope After Depression',
    content:
      'I struggled with depression for years. The first step was reaching out to a counselor. Talking about my feelings made a huge difference. Now, with therapy and support, I\'m rebuilding my life one day at a time.',
    category: 'Mental Health',
    timestamp: '2 days ago',
    likes: 245,
    comments: 18,
    status: 'safe',
  },
  {
    id: '2',
    name: 'Anonymous',
    title: 'Breaking the Cycle of Anxiety',
    content:
      'Anxiety made me feel trapped. Through breathing exercises and counseling, I learned that my thoughts aren\'t facts. I now understand my triggers and have tools to manage them. Recovery is possible.',
    category: 'Mental Health',
    timestamp: '5 days ago',
    likes: 189,
    comments: 14,
    status: 'safe',
  },
  {
    id: '3',
    name: 'Anonymous',
    title: 'Standing Up Against Bullying',
    content:
      'I was bullied in school and thought I was alone. Connecting with others who experienced similar situations helped me realize it wasn\'t my fault. Building strong friendships and asking for help changed my perspective.',
    category: 'Anti-Bullying',
    timestamp: '1 week ago',
    likes: 312,
    comments: 25,
    status: 'safe',
  },
]

export default function CommunityPage() {
  const [stories, setStories] = useState<Story[]>(sampleStories)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    category: 'Mental Health',
  })
  const [submissionMessage, setSubmissionMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.title || !formData.content) {
      alert('Please fill in all fields')
      return
    }

    const status = mockModerationCheck(formData.content)
    const newStory: Story = {
      id: String(stories.length + 1),
      name: formData.name || 'Anonymous',
      title: formData.title,
      content: formData.content,
      category: formData.category,
      timestamp: 'just now',
      likes: 0,
      comments: 0,
      status,
    }

    setStories([newStory, ...stories])
    setSubmissionMessage(moderationResponses[status][0])

    setFormData({
      name: '',
      title: '',
      content: '',
      category: 'Mental Health',
    })

    setTimeout(() => {
      setShowForm(false)
      setSubmissionMessage('')
    }, 3000)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Community Stories</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Share your journey and inspire others. Every story matters. All submissions are anonymous and reviewed for community safety.
            </p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} size="lg">
                Share Your Story
              </Button>
            )}
          </div>

          {/* Submission Form */}
          {showForm && (
            <Card className="p-6 mb-8 border-2 border-primary/20">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Share Your Story</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldGroup>
                  <FieldLabel>Name (Optional)</FieldLabel>
                  <Input
                    placeholder="Leave blank to stay anonymous"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Story Title</FieldLabel>
                  <Input
                    placeholder="Give your story a title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Category</FieldLabel>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option>Mental Health</option>
                    <option>Crisis Support</option>
                    <option>Women Health</option>
                    <option>Anti-Bullying</option>
                    <option>Domestic Violence</option>
                    <option>Youth Support</option>
                  </select>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Your Story</FieldLabel>
                  <Textarea
                    placeholder="Share your experience and how you found support or hope..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    className="min-h-32"
                  />
                </FieldGroup>

                <div className="flex gap-3">
                  <Button type="submit">Submit Story</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setSubmissionMessage('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>

                {submissionMessage && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300">
                    {submissionMessage}
                  </div>
                )}
              </form>
            </Card>
          )}

          {/* Stories Feed */}
          <div className="space-y-6">
            {stories.map((story) => (
              <Card key={story.id} className="p-6">
                {story.status === 'blocked' && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
                    This story does not meet our community guidelines.
                  </div>
                )}

                {story.status === 'sensitive' && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-700 dark:text-yellow-300 text-sm">
                    This story contains sensitive content and is pending review.
                  </div>
                )}

                {story.status !== 'blocked' && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{story.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {story.name} · {story.category} · {story.timestamp}
                        </p>
                      </div>
                    </div>

                    <p className="text-foreground mb-4 leading-relaxed">{story.content}</p>

                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Heart className="w-4 h-4" />
                        {story.likes} likes
                      </button>
                      <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {story.comments} comments
                      </button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

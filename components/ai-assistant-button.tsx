'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, X } from 'lucide-react'

const navigationLinks = [
  {
    keyword: ['professional', 'doctor', 'therapist', 'counselor', 'psychiatrist', 'find'],
    label: 'Professionals',
    href: '/professionals'
  },
  {
    keyword: ['self-care', 'exercise', 'meditation', 'breathing', 'wellness', 'stress', 'relax'],
    label: 'Self-Care Tools',
    href: '/self-care'
  },
  {
    keyword: ['emergency', 'crisis', 'urgent', 'danger', 'help', 'hospital', 'hotline', 'suicidal'],
    label: 'Emergency Contacts',
    href: '/emergency'
  },
  {
    keyword: ['recovery', 'story', 'stories', 'journey', 'experience', 'inspire', 'hope'],
    label: 'Recovery Stories',
    href: '/recovery'
  },
  {
    keyword: ['daily', 'code', 'quote', 'wellness', 'motivation', 'task', 'mood'],
    label: 'Daily Code',
    href: '/daily-code'
  },
  {
    keyword: ['organizations', 'center', 'location', 'near', 'support', 'services'],
    label: 'Support Organizations',
    href: '/organizations'
  }
]

const disclaimers = [
  "I'm a navigation assistant, not a therapist",
  "I cannot provide diagnosis or medical advice",
  "For emergencies, always call the crisis hotline",
  "I help guide you to the right resources"
]

export function AIAssistantButton() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', text: string }>>([
    {
      type: 'ai',
      text: "Hi! I'm the MindBridge Navigator. I can help you find professionals, self-care tools, emergency support, recovery stories, or daily wellness guidance. What are you looking for?"
    }
  ])
  const [input, setInput] = useState('')
  const [suggestedLinks, setSuggestedLinks] = useState<Array<{ label: string; href: string }>>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage = input.toLowerCase()
    setMessages(prev => [...prev, { type: 'user', text: input }])
    setInput('')

    let matched: Array<{ label: string; href: string }> = []
    for (const link of navigationLinks) {
      if (link.keyword.some(kw => userMessage.includes(kw))) {
        matched.push({ label: link.label, href: link.href })
      }
    }

    let aiResponse = ''
    if (matched.length > 0) {
      setSuggestedLinks(matched)
      aiResponse = 'I found some resources that might help. Check out the suggestions below or let me know if you need more guidance.'
    } else {
      aiResponse = "I'm not sure what you're looking for. Try asking about professionals, self-care, emergency help, recovery stories, or daily wellness. I'm here to guide you!"
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', text: aiResponse }])
    }, 500)
  }

  const handleNavigate = (href: string) => {
    setOpen(false)
    setSuggestedLinks([])
    router.push(href)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 gap-2"
        size="lg"
      >
        <MessageCircle className="w-5 h-5" />
        AI Help
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-end sm:justify-center p-4">
          <div className="bg-background rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:w-[500px] h-[600px] flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div>
                <h2 className="text-lg font-semibold text-foreground">MindBridge Navigator</h2>
                <p className="text-xs text-muted-foreground">Navigation assistant</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setOpen(false)
                  setSuggestedLinks([])
                }}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {suggestedLinks.length > 0 && (
                <div className="space-y-2 mt-4">
                  {suggestedLinks.map((link, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => handleNavigate(link.href)}
                    >
                      → {link.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground space-y-1">
              {disclaimers.slice(0, 2).map((d, i) => (
                <p key={i}>• {d}</p>
              ))}
            </div>

            <div className="p-4 border-t border-border flex gap-2 bg-card">
              <Input
                placeholder="Ask for help..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

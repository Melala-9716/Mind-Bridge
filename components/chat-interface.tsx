'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send, Loader2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I&apos;m MindBridge Support. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Mental health responses
    if (lowerMessage.includes('anxiety') || lowerMessage.includes('anxious')) {
      return `Anxiety is a common experience. Here are some helpful strategies: 
      1. Practice deep breathing exercises (4-7-8 technique)
      2. Try mindfulness meditation
      3. Exercise regularly
      4. Limit caffeine intake
      5. Consider professional support
      
Would you like to know more about any of these?`
    }

    if (lowerMessage.includes('depression') || lowerMessage.includes('sad')) {
      return `I&apos;m sorry you&apos;re feeling this way. Depression is treatable. Consider:
      1. Reaching out to a mental health professional
      2. Staying connected with friends and family
      3. Engaging in activities you enjoy
      4. Maintaining a regular sleep schedule
      5. Getting professional help if needed
      
Your feelings are valid. Would you like to find a professional to talk to?`
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      return `Sleep is crucial for mental health. Try these sleep hygiene tips:
      1. Keep a consistent sleep schedule
      2. Avoid screens 1 hour before bed
      3. Create a dark, quiet bedroom
      4. Exercise during the day
      5. Practice relaxation techniques
      
If sleep issues persist, please consult a healthcare provider.`
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed')) {
      return `Stress management is important. Here are evidence-based techniques:
      1. Progressive muscle relaxation
      2. Box breathing (4-4-4-4)
      3. Time management and prioritization
      4. Physical activity
      5. Talk to someone you trust
      
Would you like guided exercises or professional support?`
    }

    if (lowerMessage.includes('suicide') || lowerMessage.includes('harm')) {
      return `I&apos;m concerned about your safety. Please reach out immediately:
      📞 National Suicide Prevention: Contact local emergency services
      📞 Crisis Hotline: Available 24/7
      
Immediate help is available. You&apos;re not alone. Please contact emergency services or visit the nearest hospital.`
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I&apos;m here to provide support and information. I can help with:
      - Mental health tips and strategies
      - Information about conditions like anxiety and depression
      - Wellness advice
      - Finding professional resources
      
What brings you here today?`
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('need')) {
      return `I&apos;m here to help! I can provide information about:
      - Mental health conditions and management
      - Wellness and self-care techniques
      - Finding professionals and facilities
      - Crisis support resources
      
What would you like to know more about?`
    }

    if (lowerMessage.includes('professional') || lowerMessage.includes('therapist') || lowerMessage.includes('psychologist')) {
      return `I can help you find mental health professionals! 
      - Visit the "Professionals" page to see our directory
      - Browse by specialization and location
      - Read reviews from other users
      - Book sessions directly
      
Would you like to explore our professional directory?`
    }

    if (lowerMessage.includes('resources')) {
      return `Great! We have many resources available:
      - Educational articles about mental health
      - Self-help guides and exercises
      - Wellness tips and strategies
      - Support group information
      - Crisis resources
      
Visit our Resources page to explore everything we offer.`
    }

    // Default response
    return `Thank you for reaching out. I understand. Could you tell me more about what&apos;s on your mind? I&apos;m here to help with mental health information and resources.`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate delay for natural conversation feel
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockResponse(input),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.isUser
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.text}
              </p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
              <Loader2 size={20} className="animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="bg-background"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}

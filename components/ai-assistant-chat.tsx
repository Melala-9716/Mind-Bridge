'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { MessageCircle, Send, AlertCircle } from 'lucide-react'
import { getNavigationResponse, NavigationResponse } from '@/lib/ai-assistant'

export function AIAssistantChat() {
  const [messages, setMessages] = useState<Array<{
    id: string
    type: 'user' | 'assistant'
    content: string
    response?: NavigationResponse
  }>>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm MindBridge's navigation assistant. I'm here to help guide you to the resources you need. What can I help you find today?"
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate response delay
    setTimeout(() => {
      const response = getNavigationResponse(input)
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: response.message,
        response: response
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 600)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-muted-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>

              {/* Response Actions */}
              {message.response && message.type === 'assistant' && (
                <div className="mt-3 space-y-2">
                  {message.response.action && (
                    <Link href={message.response.action.target || '#'}>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full"
                      >
                        {message.response.action.label || 'Navigate'}
                      </Button>
                    </Link>
                  )}

                  {message.response.suggestions && message.response.suggestions.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {message.response.suggestions.map((suggestion, idx) => (
                        <Link key={idx} href={suggestion.action}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                          >
                            {suggestion.text}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Important Notice */}
      <div className="mx-6 mb-4 bg-accent/10 border border-accent/30 rounded-lg p-3 flex gap-2">
        <AlertCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          I'm a navigation assistant. I cannot provide therapy, medical advice, or diagnosis. For immediate help, contact our emergency hotline.
        </p>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t border-border p-4 bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me how I can help..."
            disabled={isLoading}
            className="bg-background"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  )
}

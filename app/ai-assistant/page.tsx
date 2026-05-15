import { Navigation } from '@/components/navigation'
import { AIAssistantChat } from '@/components/ai-assistant-chat'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'AI Navigation Assistant - MindBridge Ethiopia',
  description: 'Get guided navigation assistance through MindBridge Ethiopia resources'
}

export default function AIAssistant() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 flex flex-col">
        <div className="bg-card border-b border-border py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Navigation Assistant
            </h1>
            <p className="text-muted-foreground text-lg">
              I'm here to help you navigate MindBridge and find the resources you need
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6 h-full">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="flex flex-col h-96 lg:h-full border border-border overflow-hidden">
                <AIAssistantChat />
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-4">
              <Card className="p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  What I Can Help With
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Find mental health professionals</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Request consultations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Access self-care tools</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Find support organizations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Get emergency contacts</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Navigate MindBridge resources</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 border border-accent/30 bg-accent/10">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Important</h4>
                    <p className="text-xs text-muted-foreground">
                      I'm a navigation assistant only. I cannot provide therapy, diagnosis, or medical advice. For crisis support, use our emergency hotline.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-3">Try Asking:</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-muted rounded text-muted-foreground cursor-help hover:bg-muted/80">
                    "Find me a therapist"
                  </div>
                  <div className="p-2 bg-muted rounded text-muted-foreground cursor-help hover:bg-muted/80">
                    "I need help with anxiety"
                  </div>
                  <div className="p-2 bg-muted rounded text-muted-foreground cursor-help hover:bg-muted/80">
                    "Emergency support"
                  </div>
                  <div className="p-2 bg-muted rounded text-muted-foreground cursor-help hover:bg-muted/80">
                    "Self-care exercises"
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

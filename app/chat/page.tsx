import { Navigation } from '@/components/navigation'
import { ChatInterface } from '@/components/chat-interface'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'AI Chat Support - MindBridge Ethiopia',
  description: 'Get instant mental health support through our AI chat system'
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Mental Health Chat Support
          </h1>
          <p className="text-muted-foreground text-lg">
            Get instant support and guidance. Our AI assistant is available 24/7.
          </p>
        </div>

        <Card className="h-96 sm:h-[600px] overflow-hidden flex flex-col">
          <ChatInterface />
        </Card>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">
              How I Can Help
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Provide mental health information</li>
              <li>✓ Share coping strategies and techniques</li>
              <li>✓ Suggest wellness activities</li>
              <li>✓ Guide you to professional resources</li>
              <li>✓ Offer support and encouragement</li>
              <li>✓ Answer mental health questions</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">
              Important Note
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              This chat system provides supportive information and resources. It is not a substitute for professional mental health treatment.
            </p>
            <p className="text-sm font-medium text-primary">
              If you&apos;re in crisis or experiencing thoughts of self-harm, please contact emergency services or visit your nearest hospital immediately.
            </p>
          </Card>
        </div>

        {/* Topics Section */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Common Topics You Can Ask About
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Anxiety and panic attacks',
              'Depression and mood changes',
              'Sleep problems and insomnia',
              'Stress management',
              'Relationships and communication',
              'Self-care and wellness',
              'Finding professional help',
              'Coping strategies'
            ].map((topic, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, TrendingUp, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard - MindBridge Ethiopia',
  description: 'Your personal mental health dashboard and wellness tracking'
}

export default function Dashboard() {
  const stats = [
    { icon: Heart, label: 'Wellness Score', value: '8.5/10', color: 'text-red-500' },
    { icon: TrendingUp, label: 'This Week', value: 'Improving', color: 'text-green-500' },
    { icon: Users, label: 'Sessions', value: '3', color: 'text-blue-500' },
    { icon: AlertCircle, label: 'Support', value: 'Available', color: 'text-yellow-500' },
  ]

  const resources = [
    {
      title: 'Understanding Anxiety',
      description: 'Learn about anxiety disorders and coping strategies',
      category: 'Mental Health'
    },
    {
      title: 'Mindfulness Exercises',
      description: 'Daily mindfulness practices for stress relief',
      category: 'Wellness'
    },
    {
      title: 'Sleep Hygiene Guide',
      description: 'Improve your sleep quality with evidence-based techniques',
      category: 'Sleep'
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your wellness journey and access resources tailored for you
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} opacity-75`} />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/professionals">
                  <Button className="w-full" size="lg">
                    Find a Professional
                  </Button>
                </Link>
                <Link href="/map">
                  <Button variant="outline" className="w-full" size="lg">
                    Find Facilities
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" className="w-full" size="lg">
                    Chat Support
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline" className="w-full" size="lg">
                    View Resources
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recommended Resources */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Recommended For You
              </h2>
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">
                        {resource.title}
                      </h3>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {resource.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {resource.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Wellness Tips */}
          <div>
            <Card className="p-8 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Today&apos;s Wellness Tip
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Practice Self-Compassion
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Treat yourself with the same kindness and understanding you would offer to a good friend. Self-compassion is a powerful tool for mental wellness.
                  </p>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-3">
                    Quick Mindfulness Exercise
                  </h3>
                  <ol className="text-muted-foreground text-sm space-y-2 list-decimal list-inside">
                    <li>Find a quiet space</li>
                    <li>Take 5 deep breaths</li>
                    <li>Notice your surroundings</li>
                    <li>Check in with your emotions</li>
                  </ol>
                </div>

                <Link href="/resources">
                  <Button variant="outline" className="w-full mt-6">
                    More Tips
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

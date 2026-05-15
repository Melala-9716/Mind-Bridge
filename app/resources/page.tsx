import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Video, FileText, Lightbulb } from 'lucide-react'

export const metadata = {
  title: 'Resources - MindBridge Ethiopia',
  description: 'Educational resources and mental health guides'
}

export default function Resources() {
  const articles = [
    {
      id: 1,
      title: 'Understanding Anxiety Disorders',
      category: 'Anxiety',
      readTime: '8 min read',
      description: 'A comprehensive guide to anxiety disorders, their symptoms, and evidence-based treatment approaches.',
      icon: BookOpen
    },
    {
      id: 2,
      title: 'Managing Depression: A Practical Guide',
      category: 'Depression',
      readTime: '12 min read',
      description: 'Learn about depression, its impact on daily life, and strategies for managing symptoms.',
      icon: FileText
    },
    {
      id: 3,
      title: 'Sleep Hygiene and Mental Health',
      category: 'Sleep',
      readTime: '6 min read',
      description: 'Discover how sleep affects mental health and practical tips for better sleep quality.',
      icon: Lightbulb
    },
    {
      id: 4,
      title: 'Stress Management Techniques',
      category: 'Stress',
      readTime: '10 min read',
      description: 'Explore various techniques to manage stress and build resilience in daily life.',
      icon: Video
    }
  ]

  const guides = [
    {
      title: 'Mindfulness Meditation',
      description: 'Step-by-step guide to practicing mindfulness meditation for stress relief',
      duration: '5-10 minutes daily'
    },
    {
      title: 'Deep Breathing Exercises',
      description: 'Learn the 4-7-8 breathing technique and other breathing exercises',
      duration: '3-5 minutes'
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Reduce tension through systematic muscle relaxation',
      duration: '15-20 minutes'
    },
    {
      title: 'Journaling for Mental Health',
      description: 'Use journaling as a tool for self-reflection and emotional processing',
      duration: 'Variable'
    },
    {
      title: 'Cognitive Reframing',
      description: 'Challenge negative thoughts and develop healthier perspectives',
      duration: '10-15 minutes'
    },
    {
      title: 'Grounding Techniques',
      description: 'Practical techniques to stay present and manage anxiety',
      duration: '5-10 minutes'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Mental Health Resources
          </h1>
          <p className="text-muted-foreground text-lg">
            Educational articles, guides, and tools to support your mental wellness journey
          </p>
        </div>

        {/* Articles Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article) => {
              const Icon = article.icon
              return (
                <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                  <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="mb-4 flex-grow">
                    <p className="text-xs font-medium text-primary mb-2">
                      {article.category}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                    <Button size="sm" variant="outline">
                      Read
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Guides Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Interactive Guides & Exercises
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex-grow">
                    {guide.title}
                  </h3>
                  <Video className="w-6 h-6 text-primary flex-shrink-0 ml-2" />
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {guide.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    ⏱️ {guide.duration}
                  </span>
                  <Button size="sm">
                    Start Guide
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Crisis Support Section */}
        <section className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Crisis Support
          </h2>
          <p className="text-muted-foreground mb-6">
            If you or someone you know is in crisis or experiencing thoughts of self-harm, please reach out immediately:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-background">
              <h3 className="font-bold text-foreground mb-3">
                Emergency Hotlines
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📞 <strong>National Emergency:</strong> 911</p>
                <p>📞 <strong>Mental Health Crisis Line:</strong> +251 911 123 456</p>
                <p>📞 <strong>Suicide Prevention Hotline:</strong> +251 912 234 567</p>
                <p>📞 <strong>Addiction Support:</strong> +251 913 345 678</p>
              </div>
            </Card>

            <Card className="p-6 bg-background">
              <h3 className="font-bold text-foreground mb-3">
                Immediate Actions
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Call emergency services immediately</p>
                <p>✓ Go to the nearest hospital or emergency room</p>
                <p>✓ Tell a trusted friend or family member</p>
                <p>✓ Remove any means of self-harm</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Additional Resources */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Additional Support
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">
                Support Groups
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Join peer support groups to connect with others who share similar experiences and find community.
              </p>
              <Button variant="outline" className="w-full">
                Find Groups
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">
                Self-Care Journal
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Keep track of your mental health, triggers, and victories with our interactive journal tool.
              </p>
              <Button variant="outline" className="w-full">
                Start Journaling
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">
                Community Forum
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Connect with others, share experiences, and get support from community members anonymously.
              </p>
              <Button variant="outline" className="w-full">
                Visit Forum
              </Button>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

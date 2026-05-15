'use client'

import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supportCategories } from '@/lib/support-data'
import Link from 'next/link'
import { Brain, AlertCircle, Heart, Shield, Hand, Users } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-8 h-8" />,
  AlertCircle: <AlertCircle className="w-8 h-8" />,
  Heart: <Heart className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Hand: <Hand className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
}

export default function SupportPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Support Categories</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose a support category to access resources, connect with professionals, and join our community of people who care.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {supportCategories.map((category) => (
              <Link key={category.id} href={`/support/${category.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="p-6 h-full flex flex-col">
                    <div className={`${category.color} ${category.textColor} p-3 rounded-lg w-fit mb-4`}>
                      {iconMap[category.icon]}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">
                      {category.description}
                    </p>
                    <Button className="w-full" variant="default">
                      Explore
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/chat">
                <Button variant="outline" className="w-full justify-start">
                  Chat with AI Support
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" className="w-full justify-start">
                  Community Stories
                </Button>
              </Link>
              <Link href="/emergency">
                <Button variant="outline" className="w-full justify-start">
                  Emergency Contacts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

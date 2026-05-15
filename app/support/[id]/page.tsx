'use client'

import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supportCategories } from '@/lib/support-data'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params
  const category = supportCategories.find((cat) => cat.id === params.id)

  if (!category) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground">Category not found</h1>
            <Link href="/support">
              <Button className="mt-4">Back to Support</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link href="/support" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Support
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className={`${category.color} ${category.textColor} p-4 rounded-lg w-fit mb-4`}>
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{category.title}</h1>
            <p className="text-lg text-muted-foreground">{category.description}</p>
          </div>

          {/* Resources */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold text-foreground">Resources</h2>
            {category.resources.map((resource, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.description}
                </p>
                <p className="text-foreground mb-4 leading-relaxed">
                  {resource.content}
                </p>
                <Button variant="outline">Learn More</Button>
              </Card>
            ))}
          </div>

          {/* Related Resources */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Related Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/map">
                <Button variant="outline" className="w-full justify-start">
                  Find Local Professionals
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full justify-start">
                  Chat with AI Support
                </Button>
              </Link>
              <Link href="/self-care">
                <Button variant="outline" className="w-full justify-start">
                  Self-Care Tools
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" className="w-full justify-start">
                  Community Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

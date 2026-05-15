'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { searchContent } from '@/lib/search-data'
import Link from 'next/link'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const results = searchContent(query)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Search MindBridge</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Find resources, professionals, support categories, and tools to help your mental health journey.
            </p>

            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Search resources, support categories, tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-lg h-12"
                autoFocus
              />
              <Button size="lg">Search</Button>
            </div>
          </div>

          {/* Results */}
          <div>
            {query && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </h2>

                {results.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No results found. Try searching for different keywords or browse our categories.
                    </p>
                    <Link href="/support">
                      <Button>Browse All Support Categories</Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <Link key={result.id} href={result.url}>
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{result.title}</h3>
                            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded whitespace-nowrap ml-2">
                              {result.type}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4">{result.description}</p>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!query && (
              <Card className="p-8 text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Start Searching</h2>
                <p className="text-muted-foreground mb-6">
                  Use the search box above to find support categories, resources, professionals, and tools.
                </p>
                <Link href="/support">
                  <Button>Browse Support Categories</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div />}>
      <SearchPageContent />
    </Suspense>
  )
}

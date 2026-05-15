'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { searchContent } from '@/lib/search-data'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchComponentProps {
  mobile?: boolean
}

export function SearchComponent({ mobile = false }: SearchComponentProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ReturnType<typeof searchContent>>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      setResults(searchContent(value))
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="relative w-full md:w-64">
      <Input
        type="search"
        placeholder="Search resources..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => query && setIsOpen(true)}
        className="w-full"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {results.slice(0, 8).map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result.url)}
                className="w-full text-left px-4 py-3 hover:bg-muted border-b border-border last:border-b-0 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-foreground">{result.title}</div>
                    <div className="text-sm text-muted-foreground">{result.description}</div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded ml-2 whitespace-nowrap">
                    {result.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <p className="text-muted-foreground text-center">No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}

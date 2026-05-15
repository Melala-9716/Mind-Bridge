'use client'

import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect, useRef, useMemo } from 'react'
import { siteCopy } from '@/lib/site-copy'
import { Phone, Mail, Globe, MapPin, Clock, CheckCircle2, Copy, Check } from 'lucide-react'
import { organizations, getAvailableLocations, getOrganizationTypes } from '@/lib/organizations'
import dynamic from 'next/dynamic'

const OrganizationsMap = dynamic(() => import('@/components/interactive-org-map'), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted flex items-center justify-center rounded-lg">Loading map...</div>
})

export default function Organizations() {
  const t = siteCopy
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedOrgId, setExpandedOrgId] = useState<string | null>(null)
  const [selectedOrgForMap, setSelectedOrgForMap] = useState<string | null>(null)
  const mapSectionRef = useRef<HTMLDivElement>(null)
  
  const locations = getAvailableLocations()
  const types = getOrganizationTypes()
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  // Highlight the organization card when map pin is clicked
  useEffect(() => {
    if (!selectedOrgForMap || !cardsContainerRef.current) return
    
    const cardElement = cardsContainerRef.current.querySelector(`[data-org-id="${selectedOrgForMap}"]`)
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedOrgForMap])

  // Memoize so child map/effects do not see a new array reference every render (avoids redundant work).
  const finalFiltered = useMemo(() => {
    let result = organizations

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.location.toLowerCase().includes(query) ||
          org.type.toLowerCase().includes(query) ||
          org.description.toLowerCase().includes(query) ||
          org.services.some((s) => s.toLowerCase().includes(query)),
      )
    }

    if (selectedLocation) {
      result = result.filter((org) => org.location === selectedLocation)
    }

    if (selectedType) {
      result = result.filter((org) => org.type === selectedType)
    }

    return result
  }, [searchQuery, selectedLocation, selectedType])

  // Copy to clipboard function
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Scroll to map section
  const scrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Get color based on organization type
  const getTypeColor = (type: string) => {
    if (type.includes('Hospital')) return 'bg-red-50 border-red-200 text-red-700'
    if (type.includes('Psychiatric')) return 'bg-amber-50 border-amber-200 text-amber-700'
    if (type.includes('Counseling')) return 'bg-blue-50 border-blue-200 text-blue-700'
    if (type.includes('Psychology')) return 'bg-purple-50 border-purple-200 text-purple-700'
    return 'bg-primary/10 border-primary/20 text-primary'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t.organizationsTitle}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t.organizationsDesc}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8 border border-border bg-card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t.searchOrganizations}
              </label>
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t.searchAcross}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.location}
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t.allLocations}</option>
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.organizationType}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t.allTypes}</option>
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-medium">
            Found <span className="text-foreground font-bold">{finalFiltered.length}</span> organization{finalFiltered.length !== 1 ? 's' : ''}
          </div>
          {(searchQuery || selectedLocation || selectedType) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedLocation('')
                setSelectedType('')
              }}
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Organizations Grid */}
        {finalFiltered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-16" ref={cardsContainerRef}>
            {finalFiltered.map((org) => (
              <Card
                key={org.id}
                data-org-id={org.id}
                className={`p-3 sm:p-4 md:p-5 border transition-all cursor-pointer flex flex-col ${
                  selectedOrgForMap === org.id
                    ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary'
                    : 'border-border hover:shadow-md'
                }`}
                onClick={() => setExpandedOrgId(expandedOrgId === org.id ? null : org.id)}
              >
                {/* Header with Type Badge */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm sm:text-base font-bold text-foreground flex-1 line-clamp-2">
                      {org.name}
                    </h3>
                    {org.verified && (
                      <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${getTypeColor(org.type)}`}>
                    {org.type}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span className="line-clamp-1">{org.location}</span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 flex-grow line-clamp-2">
                  {org.description}
                </p>

                {/* Services (collapsible on mobile, always on desktop) */}
                {org.services.length > 0 && (
                  <div className="mb-3 pb-3 border-t border-border">
                    <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                      {t.services}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {org.services.slice(0, 2).map((service, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          {service}
                        </span>
                      ))}
                      {org.services.length > 2 && (
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5">
                          +{org.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Hours */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                  <Clock size={12} className="flex-shrink-0" />
                  <span className="line-clamp-1">{org.hours}</span>
                </div>

                {/* Contact Information - Copy Buttons */}
                <div className="space-y-1.5 mb-3 pb-3 border-b border-border">
                  {/* Phone */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-1 min-w-0">
                      <Phone size={12} className="flex-shrink-0" />
                      <span className="truncate font-mono text-xs">{org.phone}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(org.phone, `phone-${org.id}`)
                      }}
                      className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                      title="Copy phone number"
                    >
                      {copiedId === `phone-${org.id}` ? (
                        <Check size={12} className="text-green-600" />
                      ) : (
                        <Copy size={12} className="text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-1 min-w-0">
                      <Mail size={12} className="flex-shrink-0" />
                      <span className="truncate font-mono text-xs">{org.email}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(org.email, `email-${org.id}`)
                      }}
                      className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                      title="Copy email address"
                    >
                      {copiedId === `email-${org.id}` ? (
                        <Check size={12} className="text-green-600" />
                      ) : (
                        <Copy size={12} className="text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Website */}
                  {org.website && (
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-1 min-w-0">
                        <Globe size={12} className="flex-shrink-0" />
                        <span className="truncate font-mono text-xs">{org.website}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(org.website, `website-${org.id}`)
                        }}
                        className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                        title="Copy website"
                      >
                        {copiedId === `website-${org.id}` ? (
                          <Check size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1.5 mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(org.phone, `copy-phone-${org.id}`)
                    }}
                    className="flex-1 p-1.5 sm:p-2 rounded hover:bg-muted transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm font-medium border border-border"
                  >
                    {copiedId === `copy-phone-${org.id}` ? (
                      <>
                        <Check size={12} className="text-green-600" />
                        <span className="text-green-600 hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Phone size={12} className="text-muted-foreground" />
                        <span className="text-muted-foreground hidden sm:inline">Phone</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(org.email, `copy-email-${org.id}`)
                    }}
                    className="flex-1 p-1.5 sm:p-2 rounded hover:bg-muted transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm font-medium border border-border"
                  >
                    {copiedId === `copy-email-${org.id}` ? (
                      <>
                        <Check size={12} className="text-green-600" />
                        <span className="text-green-600 hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Mail size={12} className="text-muted-foreground" />
                        <span className="text-muted-foreground hidden sm:inline">Email</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOrgForMap(org.id)
                      scrollToMap()
                    }}
                    className="flex-1 p-1.5 sm:p-2 rounded hover:bg-muted transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm font-medium border border-border"
                  >
                    <MapPin size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground hidden sm:inline">Map</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 sm:p-12 text-center border border-border mb-16">
            <MapPin size={40} className="mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground text-base sm:text-lg font-medium mb-2">
              No organizations found
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Try adjusting your search query, location, or organization type filters
            </p>
          </Card>
        )}

        {/* Map Section */}
        <div className="mt-20 pt-16 border-t border-border" ref={mapSectionRef}>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Organization Locations Across Ethiopia
          </h2>
          <p className="text-muted-foreground mb-8">
            Click on organization cards to highlight their location on the map.
          </p>

          {/* Selected Organization Info Card */}
          {selectedOrgForMap && (() => {
            const selectedOrg = organizations.find(org => org.id === selectedOrgForMap)
            return selectedOrg ? (
              <Card className="mb-6 p-4 border-2 border-primary bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">
                      Viewing on Map
                    </p>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {selectedOrg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrg.location} • {selectedOrg.type}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrgForMap(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    ✕
                  </button>
                </div>
              </Card>
            ) : null
          })()}

          <Card className="p-0 overflow-hidden border border-border">
            <OrganizationsMap 
              organizations={finalFiltered.length > 0 ? finalFiltered : organizations}
              highlightedOrgId={selectedOrgForMap}
              onOrgSelect={setSelectedOrgForMap}
            />
          </Card>
          <p className="text-sm text-muted-foreground mt-4 p-4 bg-card rounded-lg border border-border">
            A nationwide interactive map connecting users to verified mental health services across Ethiopia. Discover hospitals, psychology clinics, and support organizations, and access key details instantly through map markers and smart filters.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center p-4 bg-muted/30 rounded-lg border border-border/50">
            Contact details are based on publicly available institutional formats for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  )
}

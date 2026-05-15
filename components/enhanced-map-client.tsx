'use client'

import { useState } from 'react'
import { MapComponent } from '@/components/map-component'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Clock, X } from 'lucide-react'

interface Facility {
  id: number
  name: string
  type: string
  category: string
  lat: number
  lng: number
  address: string
  phone: string
  hours: string
  services: string[]
}

interface EnhancedMapClientProps {
  facilities: Facility[]
}

const categories = [
  'General Mental Health',
  'Counseling & Therapy',
  'Community Support',
  'Crisis Services',
  'Women\'s Health Services',
  'Youth Services',
]

export function EnhancedMapClient({ facilities }: EnhancedMapClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)

  const filteredFacilities =
    selectedCategories.length === 0
      ? facilities
      : facilities.filter((f) => selectedCategories.includes(f.category))

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategories.includes(category)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {selectedCategories.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </Card>

      {/* Map Container */}
      <Card className="p-1 overflow-hidden">
        <div className="w-full h-96 sm:h-[500px] rounded-lg">
          <MapComponent
            facilities={filteredFacilities.map((f) => ({
              id: f.id,
              name: f.name,
              lat: f.lat,
              lng: f.lng,
              type: f.type,
              contact: f.phone,
            }))}
          />
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">
          Facilities ({filteredFacilities.length})
        </h2>
        {selectedCategories.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing results for: {selectedCategories.join(', ')}
          </p>
        )}
      </div>

      {/* Facilities List */}
      {filteredFacilities.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No facilities found for the selected categories. Try adjusting your filters.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <Card
              key={facility.id}
              className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
                selectedFacility?.id === facility.id
                  ? 'ring-2 ring-primary'
                  : ''
              }`}
              onClick={() => setSelectedFacility(facility)}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {facility.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-1">
                  {facility.type}
                </p>
                <p className="text-xs bg-secondary/20 text-secondary inline-block px-2 py-1 rounded mb-2">
                  {facility.category}
                </p>
                <div className="flex items-start gap-2 text-muted-foreground text-sm">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{facility.address}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-t border-border pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone size={16} />
                  <a href={`tel:${facility.phone}`} className="hover:text-primary">
                    {facility.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock size={16} />
                  <span>{facility.hours}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground mb-2">
                  Services:
                </p>
                <div className="flex flex-wrap gap-1">
                  {facility.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <a href={`tel:${facility.phone}`}>
                <Button className="w-full">Call Facility</Button>
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

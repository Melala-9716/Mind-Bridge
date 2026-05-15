'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  facilities: Array<{
    id: number
    name: string
    lat: number
    lng: number
    type: string
    contact: string
  }>
}

export function MapComponent({ facilities }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([9.0320, 38.7469], 6)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current)

    // Custom icon
    const healthIcon = L.icon({
      iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234B7BA7" width="32" height="32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })

    // Add markers for each facility
    facilities.forEach((facility) => {
      L.marker([facility.lat, facility.lng], { icon: healthIcon })
        .bindPopup(`
          <div class="text-sm">
            <h4 class="font-bold mb-1">${facility.name}</h4>
            <p class="text-xs text-gray-600">${facility.type}</p>
            <p class="text-xs mt-1">${facility.contact}</p>
          </div>
        `)
        .addTo(mapInstance.current!)
    })
  }, [facilities])

  return <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />
}

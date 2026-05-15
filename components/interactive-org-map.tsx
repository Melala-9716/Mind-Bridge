'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Organization } from '@/lib/organizations'

interface OrganizationsMapProps {
  organizations: Organization[]
  highlightedOrgId?: string | null
  onOrgSelect?: (orgId: string) => void
}

export default function InteractiveOrgMap({ organizations, highlightedOrgId, onOrgSelect }: OrganizationsMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const [highlightedMarker, setHighlightedMarker] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Initialize map centered on Ethiopia
    mapRef.current = L.map(containerRef.current).setView([9.1450, 40.4897], 5)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current)

    // Custom icon colors based on organization type
    const getIconColor = (type: string) => {
      if (type.includes('Hospital')) return '#ef4444'
      if (type.includes('Psychiatric')) return '#f59e0b'
      if (type.includes('Counseling')) return '#3b82f6'
      return '#8b5cf6'
    }

    // Create highlighted icon
    const createIcon = (color: string, isHighlighted: boolean = false) => {
      const size = isHighlighted ? 48 : 32
      const shadow = isHighlighted ? '0 0 20px rgba(0,0,0,0.4), 0 0 40px ' + color + '40' : '0 2px 4px rgba(0,0,0,0.3)'
      
      const iconHtml = `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          border: ${isHighlighted ? '4' : '3'}px solid white;
          box-shadow: ${shadow};
          transition: all 0.3s ease;
          ${isHighlighted ? 'animation: pulse-highlight 2s infinite;' : ''}
        ">
          ●
        </div>
      `

      return L.divIcon({
        html: iconHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        className: 'custom-marker',
      })
    }

    // Add CSS for pulse animation
    if (!document.getElementById('pulse-animation')) {
      const style = document.createElement('style')
      style.id = 'pulse-animation'
      style.textContent = `
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0,0,0,0.4), 0 0 40px currentColor;
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 30px rgba(0,0,0,0.5), 0 0 60px currentColor;
            transform: scale(1.1);
          }
        }
      `
      document.head.appendChild(style)
    }

    // Add markers for each organization
    organizations.forEach((org) => {
      if (org.latitude && org.longitude && mapRef.current) {
        const color = getIconColor(org.type)
        const isHighlighted = org.id === highlightedOrgId

        // Create popup content
        const popupContent = `
          <div style="min-width: 250px; font-family: system-ui;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${org.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${org.type}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${org.location}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${org.description}</p>
            <div style="border-top: 1px solid #eee; padding-top: 8px;">
              <p style="margin: 0 0 4px 0; font-size: 11px;"><strong>Phone:</strong> ${org.phone}</p>
              <p style="margin: 0 0 4px 0; font-size: 11px;"><strong>Email:</strong> ${org.email}</p>
              ${org.hours ? `<p style="margin: 0 0 4px 0; font-size: 11px;"><strong>Hours:</strong> ${org.hours}</p>` : ''}
              ${org.services.length > 0 ? `<p style="margin: 0; font-size: 11px;"><strong>Services:</strong> ${org.services.slice(0, 2).join(', ')}</p>` : ''}
            </div>
          </div>
        `

        const marker = L.marker([org.latitude, org.longitude], { icon: createIcon(color, isHighlighted) })
          .addTo(mapRef.current)
          .bindPopup(popupContent, { maxWidth: 300 })

        // Store marker reference
        markersRef.current.set(org.id, marker)

        // Show popup on hover for better UX
        marker.on('mouseover', () => {
          marker.openPopup()
        })
        marker.on('mouseout', () => {
          marker.closePopup()
        })

        // Click handler to select organization
        marker.on('click', () => {
          if (onOrgSelect) {
            onOrgSelect(org.id)
          }
          setHighlightedMarker(org.id)
        })
      }
    })

    // Auto-fit bounds if multiple organizations
    if (organizations.length > 1 && mapRef.current) {
      const group = new L.FeatureGroup()
      organizations.forEach((org) => {
        if (org.latitude && org.longitude) {
          group.addLayer(L.marker([org.latitude, org.longitude]))
        }
      })
      if (group.getLayers().length > 0) {
        mapRef.current.fitBounds(group.getBounds().pad(0.1))
      }
    }
  }, [organizations, onOrgSelect])

  // Handle highlighting of selected organization
  useEffect(() => {
    if (!highlightedOrgId) return

    const org = organizations.find(o => o.id === highlightedOrgId)
    if (org && org.latitude && org.longitude && mapRef.current) {
      // Zoom to the organization
      mapRef.current.setView([org.latitude, org.longitude], 15, { animate: true })

      // Open popup for the marker
      const marker = markersRef.current.get(highlightedOrgId)
      if (marker) {
        marker.openPopup()
      }

      setHighlightedMarker(highlightedOrgId)

      // Update marker icon to highlighted version
      const updatedMarker = markersRef.current.get(highlightedOrgId)
      if (updatedMarker) {
        const org = organizations.find(o => o.id === highlightedOrgId)
        if (org) {
          const getIconColor = (type: string) => {
            if (type.includes('Hospital')) return '#ef4444'
            if (type.includes('Psychiatric')) return '#f59e0b'
            if (type.includes('Counseling')) return '#3b82f6'
            return '#8b5cf6'
          }
          const color = getIconColor(org.type)
          const highlightedIcon = L.divIcon({
            html: `
              <div style="
                background-color: ${color};
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                border: 4px solid white;
                box-shadow: 0 0 20px rgba(0,0,0,0.4), 0 0 40px ${color}40;
                animation: pulse-highlight 2s infinite;
              ">
                ●
              </div>
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 24],
            className: 'custom-marker',
          })
          updatedMarker.setIcon(highlightedIcon)
        }
      }
    }
  }, [highlightedOrgId, organizations])

  return (
    <div ref={containerRef} className="w-full h-96 rounded-lg overflow-hidden" />
  )
}

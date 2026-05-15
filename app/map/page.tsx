import { Navigation } from '@/components/navigation'
import { MapComponent } from '@/components/map-component'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Clock } from 'lucide-react'
import { EnhancedMapClient } from '@/components/enhanced-map-client'

export const metadata = {
  title: 'Find Facilities - MindBridge Ethiopia',
  description: 'Locate mental health facilities and support centers across Ethiopia'
}

export default function MapPage() {
  const facilities = [
    {
      id: 1,
      name: 'Addis Ababa Mental Health Center',
      type: 'Hospital',
      category: 'General Mental Health',
      lat: 9.0320,
      lng: 38.7469,
      address: 'Addis Ababa, Ethiopia',
      phone: '+251 911 123 456',
      hours: '24/7',
      services: ['Psychiatric Care', 'Therapy', 'Emergency Services']
    },
    {
      id: 2,
      name: 'Dire Dawa Wellness Clinic',
      type: 'Clinic',
      category: 'Counseling & Therapy',
      lat: 9.5833,
      lng: 41.8667,
      address: 'Dire Dawa, Ethiopia',
      phone: '+251 912 234 567',
      hours: '8AM - 8PM',
      services: ['Counseling', 'Therapy', 'Support Groups']
    },
    {
      id: 3,
      name: 'Adama Support Center',
      type: 'Community Center',
      category: 'Community Support',
      lat: 8.5469,
      lng: 39.2683,
      address: 'Adama, Ethiopia',
      phone: '+251 913 345 678',
      hours: '9AM - 5PM',
      services: ['Group Therapy', 'Workshops', 'Community Support']
    },
    {
      id: 4,
      name: 'Hawassa Health Institute',
      type: 'Institute',
      category: 'Crisis Services',
      lat: 5.0333,
      lng: 38.4667,
      address: 'Hawassa, Ethiopia',
      phone: '+251 914 456 789',
      hours: '24/7',
      services: ['Inpatient Care', 'Research', 'Training']
    },
    {
      id: 5,
      name: 'Mekelle Mind Care',
      type: 'Clinic',
      category: 'Women\'s Health Services',
      lat: 13.4911,
      lng: 39.4769,
      address: 'Mekelle, Ethiopia',
      phone: '+251 915 567 890',
      hours: '8AM - 6PM',
      services: ['Therapy', 'Counseling', 'Medication Management']
    },
    {
      id: 6,
      name: 'Bahir Dar Wellness Hub',
      type: 'Community Center',
      category: 'Youth Services',
      lat: 11.5964,
      lng: 37.3942,
      address: 'Bahir Dar, Ethiopia',
      phone: '+251 916 678 901',
      hours: '9AM - 5PM',
      services: ['Group Programs', 'Workshops', 'Peer Support']
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Mental Health Facilities Map
          </h1>
          <p className="text-muted-foreground text-lg">
            Find mental health centers, clinics, and support services across Ethiopia
          </p>
        </div>

        {/* Enhanced Map with Filters */}
        <EnhancedMapClient facilities={facilities} />
      </div>
    </div>
  )
}


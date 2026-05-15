'use client'

import { useState } from 'react'
import type React from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Dr. Sara Tesfaye',
    role: 'Psychologist',
    email: 'dr.sara@email.com',
    phone: '+251 911 234 567',
    location: 'Addis Ababa',
    languages: ['English', 'Amharic']
  })

  const [tempFormData, setTempFormData] = useState(formData)

  const ethiopianLanguages = ['Amharic', 'Afaan Oromo', 'Somali', 'Tigrinya', 'Gurage']
  const otherLanguages = [
    'English',
    'Arabic',
    'French',
    'German',
    'Spanish',
    'Italian',
    'Portuguese',
    'Russian',
    'Mandarin Chinese',
    'Japanese',
    'Korean',
    'Hindi',
    'Turkish',
    'Swedish',
    'Dutch'
  ]

  const handleEditClick = () => {
    setTempFormData(formData)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTempFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setTempFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const handleSave = () => {
    setFormData(tempFormData)
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/professional-dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your professional information</p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <Card className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-700 dark:text-green-300 font-semibold">Profile updated successfully</p>
              </div>
            </Card>
          )}

          {/* Profile Header Card */}
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">{formData.name}</h2>
                <p className="text-lg text-muted-foreground mb-4">{formData.role}</p>
                
                {/* Languages */}
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map(lang => (
                    <Badge key={lang} className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 font-medium">
                      🌐 {lang}
                    </Badge>
                  ))}
                </div>
              </div>
              {!isEditing && (
                <Button onClick={handleEditClick} className="bg-blue-600 hover:bg-blue-700">
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>📍</span>
              <span>{formData.location}</span>
            </div>
          </Card>

          {/* Contact Information Card */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Contact Information</h3>

            {isEditing ? (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <Input
                    name="name"
                    value={tempFormData.name}
                    onChange={handleInputChange}
                    className="bg-background border-border"
                  />
                </div>

                {/* Email (read-only display) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email (Read-only)</label>
                  <div className="p-3 bg-muted/50 rounded-md text-muted-foreground">
                    {tempFormData.email}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <Input
                    name="phone"
                    value={tempFormData.phone}
                    onChange={handleInputChange}
                    className="bg-background border-border"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location (City)</label>
                  <Input
                    name="location"
                    value={tempFormData.location}
                    onChange={handleInputChange}
                    className="bg-background border-border"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Languages</label>
                  
                  {/* Selected Languages Display */}
                  <div className="mb-3 p-3 bg-muted/30 rounded-lg min-h-12 flex flex-wrap gap-2 items-center border border-border">
                    {tempFormData.languages.length > 0 ? (
                      tempFormData.languages.map(lang => (
                        <Badge key={lang} className="bg-blue-600 text-white font-medium">
                          {lang}
                          <button
                            onClick={() => handleLanguageToggle(lang)}
                            className="ml-2 hover:opacity-75"
                          >
                            ✕
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Select languages...</span>
                    )}
                  </div>

                  {/* Language Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground text-left hover:bg-muted/50 transition-colors"
                    >
                      Choose languages ▼
                    </button>

                    {showLanguageDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                        {/* Ethiopian Languages */}
                        <div className="p-4 border-b border-border">
                          <p className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Ethiopian Languages</p>
                          <div className="space-y-2">
                            {ethiopianLanguages.map(lang => (
                              <button
                                key={lang}
                                onClick={() => handleLanguageToggle(lang)}
                                className={`w-full text-left p-2.5 rounded-lg transition-colors ${
                                  tempFormData.languages.includes(lang)
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'hover:bg-muted text-foreground'
                                }`}
                              >
                                {tempFormData.languages.includes(lang) && '✓ '}{lang}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Other Languages */}
                        <div className="p-4">
                          <p className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Other Languages</p>
                          <div className="space-y-2">
                            {otherLanguages.map(lang => (
                              <button
                                key={lang}
                                onClick={() => handleLanguageToggle(lang)}
                                className={`w-full text-left p-2.5 rounded-lg transition-colors ${
                                  tempFormData.languages.includes(lang)
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'hover:bg-muted text-foreground'
                                }`}
                              >
                                {tempFormData.languages.includes(lang) && '✓ '}{lang}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                  <p className="text-lg font-semibold text-foreground">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-lg font-semibold text-foreground">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Location</p>
                  <p className="text-lg font-semibold text-foreground">{formData.location}</p>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map(lang => (
                      <Badge key={lang} className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 font-medium">
                        🌐 {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </>
  )
}

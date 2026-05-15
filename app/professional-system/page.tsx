'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MessageSquare, CheckCircle2, ArrowRight, Globe, ChevronDown, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

type RegistrationDraft = {
  fullName: string
  email: string
  phone: string
  specialization: string
  languages: string[]
  clinic: string
  city: string
}

export default function ProfessionalSystemOverview() {
  const [isEntering, setIsEntering] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [customLanguage, setCustomLanguage] = useState('')
  const languageOptions = ['English', 'Amharic', 'Afaan Oromo', 'Somali', 'Tigrinya', 'Gurage', 'Sidama', 'Hadiyya', 'Gamo', 'Wolaita', 'Kaffa', 'Berta', 'Nuer', 'Maale', 'Daasanach']
  const [registrationData, setRegistrationData] = useState<RegistrationDraft>({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    languages: [],
    clinic: '',
    city: ''
  })

  const handleEnter = () => {
    setIsEntering(true)
    setTimeout(() => {
      window.location.href = '/professional-dashboard'
    }, 300)
  }

  const handleLanguageToggle = (language: string) => {
    setRegistrationData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const handleRegistrationChange = (e: any) => {
    const { name, value } = e.target
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (showRegistration) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <Card className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              Professional Registration
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-6 sm:mb-8">
              Join our network of mental health professionals at MindBridge Ethiopia
            </p>

            <form className="space-y-6 sm:space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Basic Information</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      value={registrationData.fullName}
                      onChange={handleRegistrationChange}
                      placeholder="Enter your full name"
                      className="bg-background text-xs sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={registrationData.email}
                        onChange={handleRegistrationChange}
                        placeholder="your.email@example.com"
                        className="bg-background text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                        Phone <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={registrationData.phone}
                        onChange={handleRegistrationChange}
                        placeholder="+251 9XX XXX XXXX"
                        className="bg-background text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                        City / Region <span className="text-destructive">*</span>
                      </label>
                      <select
                        name="city"
                        value={registrationData.city}
                        onChange={handleRegistrationChange}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select city or region</option>
                        <option value="addis-ababa">Addis Ababa</option>
                        <option value="adama">Adama</option>
                        <option value="dire-dawa">Dire Dawa</option>
                        <option value="hawassa">Hawassa</option>
                        <option value="mekelle">Mekelle</option>
                        <option value="bahir-dar">Bahir Dar</option>
                        <option value="jimma">Jimma</option>
                        <option value="gondar">Gondar</option>
                        <option value="dese">Dese</option>
                        <option value="jijiga">Jijiga</option>
                        <option value="arba-minch">Arba Minch</option>
                        <option value="agaro">Agaro</option>
                        <option value="asosa">Asosa</option>
                        <option value="billo">Billo</option>
                        <option value="bonga">Bonga</option>
                        <option value="dukem">Dukem</option>
                        <option value="harar">Harar</option>
                        <option value="holeta">Holeta</option>
                        <option value="kombolcha">Kombolcha</option>
                        <option value="metema">Metema</option>
                        <option value="mojo">Mojo</option>
                        <option value="neg-eile">Neg Eile</option>
                        <option value="sodo">Sodo</option>
                        <option value="wolaita-sodo">Wolaita Sodo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                        Clinic / Institution <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        name="clinic"
                        value={registrationData.clinic}
                        onChange={handleRegistrationChange}
                        placeholder="Your clinic or institution name"
                        className="bg-background text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Professional Details</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Specialization <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="specialization"
                      value={registrationData.specialization}
                      onChange={handleRegistrationChange}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select specialization</option>
                      <option value="psychologist">Psychologist</option>
                      <option value="psychiatrist">Psychiatrist</option>
                      <option value="counselor">Counselor</option>
                      <option value="therapist">Therapist</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Language Selection Form */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  Languages You Speak
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                  Select all languages you can provide consultation in. This helps us match you with clients who need support in these languages.
                </p>
                
                <label className="block text-xs sm:text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Choose Languages <span className="text-destructive">*</span>
                </label>

                {/* Language Dropdown */}
                <div className="relative mb-6">
                  <button
                    type="button"
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-border bg-card text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all flex items-center justify-between hover:border-primary/50"
                  >
                    <span className="text-left">
                      {registrationData.languages.length === 0 
                        ? 'Select languages...' 
                        : `${registrationData.languages.length} language${registrationData.languages.length !== 1 ? 's' : ''} selected`}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showLanguageDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            if (registrationData.languages.includes(lang)) {
                              setRegistrationData(prev => ({
                                ...prev,
                                languages: prev.languages.filter(l => l !== lang)
                              }))
                            } else {
                              setRegistrationData(prev => ({
                                ...prev,
                                languages: [...prev.languages, lang]
                              }))
                            }
                          }}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-primary/10 transition-colors border-b border-border/50 ${
                            registrationData.languages.includes(lang)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-foreground'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={registrationData.languages.includes(lang)}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0"
                          />
                          <span>{lang}</span>
                          {registrationData.languages.includes(lang) && (
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-primary flex-shrink-0" />
                          )}
                        </button>
                      ))}
                      
                      {/* Divider */}
                      <div className="border-b border-border/50" />
                      
                      {/* Others Option */}
                      <div className="p-3 sm:p-4 border-b border-border/50">
                        <button
                          type="button"
                          onClick={() => setCustomLanguage(customLanguage ? '' : 'true')}
                          className={`w-full px-2 sm:px-3 py-2.5 sm:py-3 text-left text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-primary/10 transition-colors rounded-md ${
                            customLanguage ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!customLanguage}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0"
                          />
                          <span>Others (Type your language)</span>
                          {customLanguage && (
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-primary flex-shrink-0" />
                          )}
                        </button>
                        
                        {/* Custom Language Input */}
                        {customLanguage && (
                          <div className="mt-2 sm:mt-3">
                            <input
                              type="text"
                              placeholder="Type language name..."
                              value={customLanguage === 'true' ? '' : customLanguage}
                              onChange={(e) => {
                                const value = e.target.value
                                setCustomLanguage(value)
                                // Add to languages if not empty and not already present
                                if (value && !registrationData.languages.includes(value)) {
                                  setRegistrationData(prev => ({
                                    ...prev,
                                    languages: [...prev.languages, value]
                                  }))
                                }
                              }}
                              className="w-full px-2 sm:px-3 py-2 rounded-md border border-primary bg-primary/5 text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              autoFocus
                            />
                            <p className="text-xs text-muted-foreground mt-1.5">Type a language name and press Enter or click away</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Languages Summary */}
                {registrationData.languages.length > 0 && (
                  <div className="p-4 sm:p-5 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg">
                    <p className="text-sm sm:text-base text-foreground font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Selected Languages:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {registrationData.languages.map((lang) => (
                        <Badge key={lang} className="text-xs sm:text-sm bg-green-600 text-white flex items-center gap-1.5">
                          {lang}
                          <button
                            type="button"
                            onClick={() => setRegistrationData(prev => ({
                              ...prev,
                              languages: prev.languages.filter(l => l !== lang)
                            }))}
                            className="hover:text-green-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {registrationData.languages.length === 0 && (
                  <div className="p-4 sm:p-5 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-lg">
                    <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium">
                      ⚠ Please select at least one language to continue
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <Button 
                  size="lg"
                  className="text-xs sm:text-sm py-2 sm:py-2.5 w-full"
                >
                  Complete Registration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="text-xs sm:text-sm py-2 sm:py-2.5 w-full"
                  onClick={() => setShowRegistration(false)}
                >
                  Back
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6">
              Professional Dashboard
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              A simulated view of how mental health professionals manage consultation requests on MindBridge Ethiopia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleEnter}
                className="text-sm sm:text-base gap-2"
              >
                Enter Dashboard
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowRegistration(true)}
                className="text-sm sm:text-base gap-2"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                Register as Professional
              </Button>
            </div>
          </div>

          {/* Info Text */}
          <div className="mt-8 sm:mt-12 md:mt-16 text-center">
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              Click above to view the full professional dashboard interface or register to join our network
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, ChevronDown, X, Globe, Info } from 'lucide-react'
import { ProfessionalWeeklyScheduleForm } from '@/components/professional-weekly-schedule-form'
import {
  DEFAULT_WEEKLY_SCHEDULE,
  isValidDayTimeRange,
  type WeeklyDaySchedule,
} from '@/lib/professionals-db'
import { PROFESSIONAL_AUTH_KEY } from '@/lib/professional-auth-storage'

type ValidationMessage = string | null

interface LoginForm {
  fullName: string
  password: string
}

interface RegistrationForm {
  fullName: string
  email: string
  phone: string
  specialization: string
  hospital: string
  city: string
  languages: string[]
  weeklySchedule: WeeklyDaySchedule[]
  bio: string
  password: string
  confirmPassword: string
}

export default function ProfessionalAuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showOtherLanguageInput, setShowOtherLanguageInput] = useState(false)
  const [customLanguageInput, setCustomLanguageInput] = useState('')
  const languageOptions = ['English', 'Amharic', 'Afaan Oromo', 'Somali', 'Tigrinya', 'Gurage', 'Sidama', 'Hadiyya', 'Gamo', 'Wolaita', 'Kaffa', 'Berta', 'Nuer', 'Maale', 'Daasanach']

  // Login state
  const [login, setLogin] = useState<LoginForm>({ fullName: '', password: '' })
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: ValidationMessage }>({})

  // Registration state
  const [registration, setRegistration] = useState<RegistrationForm>({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    hospital: '',
    city: '',
    languages: [],
    weeklySchedule: DEFAULT_WEEKLY_SCHEDULE.map((d) => ({ ...d })),
    bio: '',
    password: '',
    confirmPassword: '',
  })
  const [customCity, setCustomCity] = useState('')
  const [registrationErrors, setRegistrationErrors] = useState<{ [key: string]: ValidationMessage }>({})
  const [registrationSubmitError, setRegistrationSubmitError] = useState<string | null>(null)

  // Validation functions
  const validateEmail = (email: string): ValidationMessage => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Invalid email format'
    return null
  }

  const validatePassword = (password: string): ValidationMessage => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
    return null
  }

  const validatePhone = (phone: string): ValidationMessage => {
    if (!phone) return 'Phone number is required'
    const normalized = phone.replace(/\s|-/g, '')
    if (!/^\+251\d{9}$/.test(normalized)) {
      return 'Phone must be in format +251 followed by 9 digits (spaces optional)'
    }
    return null
  }

  // Login handlers
  const handleLoginChange = (field: keyof LoginForm, value: string) => {
    setLogin(prev => ({ ...prev, [field]: value }))
    setLoginErrors(prev => ({ ...prev, [field]: null }))
  }

  const validateLoginForm = (): boolean => {
    const errors: { [key: string]: ValidationMessage } = {}
    errors.fullName = login.fullName.trim() ? null : 'Full name is required'
    errors.password = login.password ? null : 'Password is required'

    setLoginErrors(errors)
    return Object.values(errors).every((e) => e === null)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLoginForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/professionals/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: login.fullName.trim(), password: login.password }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setLoginErrors((prev) => ({ ...prev, password: payload.error ?? 'Login failed' }))
        return
      }

      localStorage.setItem(PROFESSIONAL_AUTH_KEY, JSON.stringify(payload.professional))
      router.replace('/professional/dashboard/profile')
      return
    } finally {
      setIsLoading(false)
    }
  }

  // Registration handlers
  const handleRegistrationChange = (field: keyof RegistrationForm, value: string) => {
    setRegistration(prev => ({ ...prev, [field]: value }))
    setRegistrationErrors(prev => ({ ...prev, [field]: null }))
    setRegistrationSubmitError(null)
    if (field === 'city' && value !== 'other') {
      setCustomCity('')
    }
  }

  const validateRegistrationForm = (): boolean => {
    const errors: { [key: string]: ValidationMessage } = {}
    errors.fullName = registration.fullName ? null : 'Full name is required'
    errors.email = validateEmail(registration.email)
    errors.phone = validatePhone(registration.phone)
    errors.specialization = registration.specialization ? null : 'Specialization is required'
    errors.hospital = registration.hospital ? null : 'Hospital/Clinic name is required'
    if (!registration.city) {
      errors.city = 'City is required'
    } else if (registration.city === 'other' && !customCity.trim()) {
      errors.city = 'Please enter your city name'
    } else {
      errors.city = null
    }
    errors.languages = registration.languages.length === 0 ? 'Please select at least one language' : null

    if (!registration.weeklySchedule.some((d) => d.available)) {
      errors.weeklySchedule = 'Select at least one available day'
    } else {
      const invalid = registration.weeklySchedule.find(
        (d) => d.available && !isValidDayTimeRange(d.start, d.end),
      )
      errors.weeklySchedule = invalid ? `End time must be after start time (${invalid.day})` : null
    }

    const passwordError = validatePassword(registration.password)
    errors.password = passwordError
    
    if (registration.password !== registration.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    } else {
      errors.confirmPassword = null
    }

    setRegistrationErrors(errors)
    return Object.values(errors).every(e => e === null)
  }

  const addCustomLanguageFromInput = () => {
    const trimmed = customLanguageInput.trim()
    if (!trimmed) return
    const exists = registration.languages.some(
      (l) => l.trim().toLowerCase() === trimmed.toLowerCase(),
    )
    if (exists) {
      return
    }
    setRegistration((prev) => ({
      ...prev,
      languages: [...prev.languages, trimmed],
    }))
    setCustomLanguageInput('')
  }

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistrationSubmitError(null)
    if (!validateRegistrationForm()) return

    const finalCity = registration.city === 'other' ? customCity.trim() : registration.city

    setIsLoading(true)
    try {
      const response = await fetch('/api/professionals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: registration.fullName,
          email: registration.email,
          password: registration.password,
          specialization: registration.specialization,
          hospital: registration.hospital,
          city: finalCity,
          languages: registration.languages,
          weeklySchedule: registration.weeklySchedule,
          bio: registration.bio.trim(),
        }),
      })

      type RegisterResponse = {
        error?: string
        code?: string
        hints?: string[]
        debugMessage?: string
        envSummary?: {
          hasPublicUrl: boolean
          urlHost: string | null
          urlLooksInvalid: boolean
          hasServiceRoleKey: boolean
          hasAnonKey: boolean
        }
        professional?: { id: string; full_name: string; bio?: string | null }
      }
      let payload: RegisterResponse = {}
      let rawBody = ''
      try {
        rawBody = await response.text()
        if (rawBody) payload = JSON.parse(rawBody) as RegisterResponse
      } catch (parseErr) {
        console.error('[registration] Failed to parse response JSON:', parseErr, rawBody?.slice(0, 200))
      }

      if (!response.ok) {
        const fallback503 =
          'Database is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to .env.local (copy from .env.example), restart npm run dev, and run supabase/schema.sql in the Supabase SQL editor.'
        const baseMessage =
          typeof payload.error === 'string' && payload.error.trim()
            ? payload.error.trim()
            : response.status === 503
              ? fallback503
              : 'Registration failed. Please try again.'
        const hintSuffix =
          Array.isArray(payload.hints) && payload.hints.length > 0
            ? `\n\n${payload.hints.slice(0, 4).join('\n')}`
            : ''
        const message = `${baseMessage}${hintSuffix}`

        if (process.env.NODE_ENV === 'development') {
          console.error('[registration] Request failed:', {
            status: response.status,
            code: payload.code,
            url: '/api/professionals/register',
            rawBodyPreview: rawBody?.slice(0, 500),
            envSummary: payload.envSummary,
            debugMessage: payload.debugMessage,
          })
        }

        if (response.status === 409) {
          setRegistrationErrors((prev) => ({ ...prev, email: baseMessage }))
        } else {
          setRegistrationSubmitError(message)
        }
        if (response.status >= 500) {
          console.error('[registration] Server error:', response.status, payload.code, baseMessage)
        }
        return
      }

      const professional = payload.professional
      if (!professional?.id) {
        console.error('[registration] Missing professional in success payload:', payload)
        setRegistrationSubmitError('Registration failed. Please try again.')
        return
      }

      localStorage.setItem(
        PROFESSIONAL_AUTH_KEY,
        JSON.stringify({
          id: professional.id,
          full_name: professional.full_name,
        }),
      )
      try {
        sessionStorage.setItem('mindbridge:professionals-refresh', '1')
      } catch {
        /* ignore */
      }
      router.replace('/professional/dashboard/profile')
      return
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (
        err instanceof TypeError &&
        (msg.includes('fetch failed') || msg.includes('Failed to fetch') || msg.includes('NetworkError'))
      ) {
        console.error('[registration] Browser could not reach Next.js API route:', err)
        setRegistrationSubmitError(
          'Could not reach the app. Make sure the dev server is running (`npm run dev`) and check your network connection.',
        )
        return
      }
      console.error('[registration] Network or unexpected error:', err)
      setRegistrationSubmitError(msg || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background to-card py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Professional Access</h1>
            <p className="text-muted-foreground">For healthcare professionals only</p>
          </div>

          <Card className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="login-fullName" className="mb-2 block">
                      Full name (as registered)
                    </Label>
                    <Input
                      id="login-fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Dr. John Doe"
                      value={login.fullName}
                      onChange={(e) => handleLoginChange('fullName', e.target.value)}
                      className={loginErrors.fullName ? 'border-red-500' : ''}
                    />
                    {loginErrors.fullName && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {loginErrors.fullName}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="mb-2 block">
                      Password
                    </Label>
                    <PasswordInput
                      id="login-password"
                      placeholder="••••••••"
                      value={login.password}
                      onChange={(e) => handleLoginChange('password', e.target.value)}
                      className={loginErrors.password ? 'border-red-500' : ''}
                    />
                    {loginErrors.password && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {loginErrors.password}
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>

                  <div className="text-center">
                    <a href="/professional-forgot-password" className="text-sm text-primary hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                </form>
              </TabsContent>

              {/* Registration Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="mb-2 block flex items-center gap-2">
                      Full Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Dr. John Doe"
                      value={registration.fullName}
                      onChange={(e) => handleRegistrationChange('fullName', e.target.value)}
                      className={registrationErrors.fullName ? 'border-red-500' : ''}
                    />
                    {registrationErrors.fullName && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.fullName}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="mb-2 block flex items-center gap-2">
                      Email <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="firstname.lastname@gmail.com"
                      value={registration.email}
                      onChange={(e) => handleRegistrationChange('email', e.target.value)}
                      className={registrationErrors.email ? 'border-red-500' : ''}
                    />
                    {registrationErrors.email && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="mb-2 block flex items-center gap-2">
                      Phone <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+251912345678"
                      value={registration.phone}
                      onChange={(e) => handleRegistrationChange('phone', e.target.value)}
                      className={registrationErrors.phone ? 'border-red-500' : ''}
                    />
                    {registrationErrors.phone && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialization" className="mb-2 block flex items-center gap-2">
                      Specialization <span className="text-red-600">*</span>
                    </Label>
                    <Select value={registration.specialization} onValueChange={(val) => handleRegistrationChange('specialization', val)}>
                      <SelectTrigger id="specialization" className={registrationErrors.specialization ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                        <SelectItem value="psychologist">Psychologist</SelectItem>
                        <SelectItem value="counselor">Counselor</SelectItem>
                        <SelectItem value="therapist">Therapist</SelectItem>
                        <SelectItem value="social-worker">Social Worker</SelectItem>
                      </SelectContent>
                    </Select>
                    {registrationErrors.specialization && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.specialization}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="hospital" className="mb-2 block flex items-center gap-2">
                      Hospital/Clinic <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="hospital"
                      placeholder="Amanuel Mental Hospital"
                      value={registration.hospital}
                      onChange={(e) => handleRegistrationChange('hospital', e.target.value)}
                      className={registrationErrors.hospital ? 'border-red-500' : ''}
                    />
                    {registrationErrors.hospital && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.hospital}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city" className="mb-2 block flex items-center gap-2">
                      City <span className="text-red-600">*</span>
                    </Label>
                    <div className="relative">
                      <Select value={registration.city} onValueChange={(val) => handleRegistrationChange('city', val)}>
                        <SelectTrigger id="city" className={registrationErrors.city ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                          <SelectItem value="adama">Adama</SelectItem>
                          <SelectItem value="dire-dawa">Dire Dawa</SelectItem>
                          <SelectItem value="hawassa">Hawassa</SelectItem>
                          <SelectItem value="mekelle">Mekelle</SelectItem>
                          <SelectItem value="bahir-dar">Bahir Dar</SelectItem>
                          <SelectItem value="jimma">Jimma</SelectItem>
                          <SelectItem value="gondar">Gondar</SelectItem>
                          <SelectItem value="dese">Dese</SelectItem>
                          <SelectItem value="jijiga">Jijiga</SelectItem>
                          <SelectItem value="arba-minch">Arba Minch</SelectItem>
                          <SelectItem value="agaro">Agaro</SelectItem>
                          <SelectItem value="asosa">Asosa</SelectItem>
                          <SelectItem value="billo">Billo</SelectItem>
                          <SelectItem value="bonga">Bonga</SelectItem>
                          <SelectItem value="dukem">Dukem</SelectItem>
                          <SelectItem value="harar">Harar</SelectItem>
                          <SelectItem value="holeta">Holeta</SelectItem>
                          <SelectItem value="kombolcha">Kombolcha</SelectItem>
                          <SelectItem value="metema">Metema</SelectItem>
                          <SelectItem value="mojo">Mojo</SelectItem>
                          <SelectItem value="wolaita-sodo">Wolaita Sodo</SelectItem>
                          <SelectItem value="sodo">Sodo</SelectItem>
                          <SelectItem value="neg-eile">Neg Eile</SelectItem>
                          <SelectItem value="other">Other (Type your city)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {registration.city === 'other' && (
                      <div className="mt-2">
                        <Input
                          id="customCity"
                          placeholder="Type your city"
                          value={customCity}
                          onChange={(e) => {
                            setCustomCity(e.target.value)
                            setRegistrationErrors((prev) => ({ ...prev, city: null }))
                            setRegistrationSubmitError(null)
                          }}
                          className={registrationErrors.city ? 'border-red-500' : ''}
                          aria-label="Custom city name"
                        />
                      </div>
                    )}
                    {registrationErrors.city && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.city}
                      </div>
                    )}
                  </div>

                  {/* Languages Dropdown */}
                  <div>
                    <Label className="mb-2 block flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Languages <span className="text-red-600">*</span>
                    </Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all flex items-center justify-between hover:border-primary/50"
                      >
                        <span className="text-left">
                          {registration.languages.length === 0 
                            ? 'Select languages...' 
                            : `${registration.languages.length} language${registration.languages.length !== 1 ? 's' : ''}`}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {showLanguageDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {languageOptions.map((lang) => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => {
                                if (registration.languages.includes(lang)) {
                                  setRegistration(prev => ({
                                    ...prev,
                                    languages: prev.languages.filter(l => l !== lang)
                                  }))
                                } else {
                                  setRegistration(prev => ({
                                    ...prev,
                                    languages: [...prev.languages, lang]
                                  }))
                                }
                              }}
                              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-primary/10 transition-colors border-b border-border/50 ${
                                registration.languages.includes(lang)
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-foreground'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={registration.languages.includes(lang)}
                                onChange={() => {}}
                                className="w-4 h-4 text-primary flex-shrink-0"
                              />
                              <span>{lang}</span>
                              {registration.languages.includes(lang) && (
                                <CheckCircle2 className="w-4 h-4 ml-auto text-primary flex-shrink-0" />
                              )}
                            </button>
                          ))}
                          
                          {/* Divider */}
                          <div className="border-b border-border/50" />
                          
                          {/* Others Option */}
                          <div className="p-3 border-b border-border/50">
                            <button
                              type="button"
                              onClick={() =>
                                setShowOtherLanguageInput((open) => {
                                  const next = !open
                                  if (!next) setCustomLanguageInput('')
                                  return next
                                })
                              }
                              className={`w-full px-2 py-2 text-left text-sm flex items-center gap-2 hover:bg-primary/10 transition-colors rounded-md ${
                                showOtherLanguageInput ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={showOtherLanguageInput}
                                onChange={() => {}}
                                className="w-4 h-4 text-primary flex-shrink-0"
                              />
                              <span>Others</span>
                              {showOtherLanguageInput && (
                                <CheckCircle2 className="w-4 h-4 ml-auto text-primary flex-shrink-0" />
                              )}
                            </button>
                            
                            {/* Custom Language Input */}
                            {showOtherLanguageInput && (
                              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
                                <Input
                                  type="text"
                                  placeholder="Type language name, then Enter or Add"
                                  value={customLanguageInput}
                                  onChange={(e) => setCustomLanguageInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      addCustomLanguageFromInput()
                                    }
                                  }}
                                  className="border border-primary bg-primary/5 text-sm sm:flex-1"
                                  autoFocus
                                />
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="shrink-0 sm:h-auto"
                                  onClick={addCustomLanguageFromInput}
                                >
                                  Add
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {registrationErrors.languages && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.languages}
                      </div>
                    )}
                    {registration.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {registration.languages.map((lang) => (
                          <Badge key={lang} variant="secondary" className="text-xs flex items-center gap-1">
                            {lang}
                            <button
                              type="button"
                              onClick={() => setRegistration(prev => ({
                                ...prev,
                                languages: prev.languages.filter(l => l !== lang)
                              }))}
                              className="hover:opacity-70"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <ProfessionalWeeklyScheduleForm
                      value={registration.weeklySchedule}
                      onChange={(next) => {
                        setRegistration((prev) => ({ ...prev, weeklySchedule: next }))
                        setRegistrationErrors((prev) => ({ ...prev, weeklySchedule: null }))
                        setRegistrationSubmitError(null)
                      }}
                    />
                    {registrationErrors.weeklySchedule && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {registrationErrors.weeklySchedule}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="professional-bio" className="mb-2 block text-sm font-medium">
                      About you <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="professional-bio"
                      rows={4}
                      maxLength={2500}
                      placeholder="Short bio for your public profile — specialties, approach, populations you serve…"
                      value={registration.bio}
                      onChange={(e) => handleRegistrationChange('bio', e.target.value)}
                      className="resize-none rounded-lg bg-background text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="mb-2 block flex items-center gap-2">
                      Password <span className="text-red-600">*</span>
                    </Label>
                    <PasswordInput
                      id="password"
                      placeholder="••••••••"
                      value={registration.password}
                      onChange={(e) => handleRegistrationChange('password', e.target.value)}
                      className={registrationErrors.password ? 'border-red-500' : ''}
                    />
                    {registrationErrors.password && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.password}
                      </div>
                    )}
                    {!registrationErrors.password && registration.password && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Strong password
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="mb-2 block flex items-center gap-2">
                      Confirm Password <span className="text-red-600">*</span>
                    </Label>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="••••••••"
                      value={registration.confirmPassword}
                      onChange={(e) => handleRegistrationChange('confirmPassword', e.target.value)}
                      className={registrationErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {registrationErrors.confirmPassword && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {registrationErrors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {registrationSubmitError && (
                    <Alert variant="destructive" className="border-destructive/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="whitespace-pre-wrap text-sm">{registrationSubmitError}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <Alert className="border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm leading-relaxed">
                      This registration system is part of a hackathon prototype.
                      All professional onboarding is simulated to demonstrate the platform workflow.
                      <br />
                      <br />
                      In a real-world deployment, professional licenses and credentials would be verified through secure institutional or administrative review before activation.
                    </AlertDescription>
                  </Alert>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            All professional credentials are verified and kept confidential
          </p>
        </div>
      </main>
    </>
  )
}

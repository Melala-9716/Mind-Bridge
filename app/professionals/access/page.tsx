'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function ProfessionalAccess() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: 'Psychologist',
    clinicName: '',
    licenseNumber: '',
    yearsExperience: '',
    password: '',
    confirmPassword: '',
    agreeToGuidelines: false,
    availableForConsultation: true,
  })

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Professional login:', { email: loginEmail, password: loginPassword })
    setSubmitted(true)
    setTimeout(() => {
      setActiveTab('login')
      setLoginEmail('')
      setLoginPassword('')
      setSubmitted(false)
    }, 2000)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Professional registration:', registerData)
    setSubmitted(true)
    setTimeout(() => {
      setRegisterData({
        fullName: '',
        email: '',
        phone: '',
        profession: 'Psychologist',
        clinicName: '',
        licenseNumber: '',
        yearsExperience: '',
        password: '',
        confirmPassword: '',
        agreeToGuidelines: false,
        availableForConsultation: true,
      })
      setSubmitted(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <Navigation />

      {/* Header Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Professional Access
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join MindBridge Ethiopia as a licensed mental health professional and support users through online consultations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-6 py-3 font-semibold text-lg transition-colors ${
              activeTab === 'login'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-6 py-3 font-semibold text-lg transition-colors ${
              activeTab === 'register'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Register
          </button>
        </div>

        {/* Content */}
        <Card className="p-8 border border-border bg-card">
          {/* Login Tab */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Login as Professional</h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Email or Username
                </label>
                <Input
                  type="text"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-background pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              {submitted && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-sm text-primary">Login request processed!</span>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitted}>
                {submitted ? 'Processing...' : 'Login as Professional'}
              </Button>
            </form>
          )}

          {/* Register Tab */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Register as Professional</h2>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Dr. John Doe"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  className="bg-background"
                  required
                />
              </div>

              {/* Email and Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="bg-background"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="+251 9XX XXX XXXX"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    className="bg-background"
                    required
                  />
                </div>
              </div>

              {/* Profession and Clinic */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Profession *
                  </label>
                  <select
                    value={registerData.profession}
                    onChange={(e) => setRegisterData({ ...registerData, profession: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option>Psychologist</option>
                    <option>Psychiatrist</option>
                    <option>Counselor</option>
                    <option>Therapist</option>
                    <option>Clinical Social Worker</option>
                    <option>Mental Health Nurse</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Clinic / Organization Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your clinic or organization"
                    value={registerData.clinicName}
                    onChange={(e) => setRegisterData({ ...registerData, clinicName: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>

              {/* License and Experience */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    License Number *
                  </label>
                  <Input
                    type="text"
                    placeholder="Your license number"
                    value={registerData.licenseNumber}
                    onChange={(e) => setRegisterData({ ...registerData, licenseNumber: e.target.value })}
                    className="bg-background"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Years of Experience
                  </label>
                  <Input
                    type="number"
                    placeholder="5"
                    min="0"
                    value={registerData.yearsExperience}
                    onChange={(e) => setRegisterData({ ...registerData, yearsExperience: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="bg-background pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="bg-background pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 py-4 border-y border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registerData.agreeToGuidelines}
                    onChange={(e) => setRegisterData({ ...registerData, agreeToGuidelines: e.target.checked })}
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <span className="text-sm text-foreground">
                    I agree to ethical mental health guidelines
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registerData.availableForConsultation}
                    onChange={(e) => setRegisterData({ ...registerData, availableForConsultation: e.target.checked })}
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <span className="text-sm text-foreground">
                    Available for online consultation
                  </span>
                </label>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ⚠️ Professional accounts are subject to verification in future updates to ensure safe and trusted mental health support.
                </p>
              </div>

              {submitted && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-sm text-primary">Registration submitted! Please check your email.</span>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitted}>
                {submitted ? 'Processing...' : 'Register as Professional'}
              </Button>
            </form>
          )}
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© 2026 MindBridge Ethiopia. Secure and trusted mental health professional network.</p>
        </div>
      </footer>
    </div>
  )
}

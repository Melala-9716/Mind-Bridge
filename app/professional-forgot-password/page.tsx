'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-b from-background to-card py-12">
          <div className="max-w-md mx-auto px-4">
            <Card className="p-8">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
                <div className="bg-muted p-4 rounded-lg mb-6 text-left">
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Next steps:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    <li>1. Check your email inbox</li>
                    <li>2. Click the password reset link</li>
                    <li>3. Create a new password</li>
                    <li>4. Log in with your new password</li>
                  </ol>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  If you don&apos;t see the email, check your spam folder or wait a few minutes.
                </p>
                <Link href="/professional-login">
                  <Button className="w-full gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background to-card py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  className={error ? 'border-red-500' : ''}
                />
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <Link href="/professional-login">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </form>

            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                A password reset link will be sent to your email. The link expires in 24 hours.
              </AlertDescription>
            </Alert>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password? <a href="/professional-login" className="text-primary hover:underline">Log in here</a>
          </p>
        </div>
      </main>
    </>
  )
}

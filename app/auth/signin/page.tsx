'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Phone, Loader2 } from 'lucide-react'

export default function SignInPage() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    // Check if already signed in
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push(redirect)
      }
    })
  }, [router, redirect])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      })

      if (error) throw error

      setMessage('Check your email for the magic link!')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Format phone number (ensure it starts with country code)
      let formattedPhone = phone.trim()
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+94' + formattedPhone.substring(1)
        } else if (formattedPhone.startsWith('94')) {
          formattedPhone = '+' + formattedPhone
        } else {
          formattedPhone = '+94' + formattedPhone
        }
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (error) throw error

      // Redirect to OTP verification page
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(formattedPhone)}&redirect=${redirect}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-primary-100 mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Sign In to Continue
            </h1>
            <p className="text-gray-600">
              Choose your preferred sign-in method
            </p>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
                authMethod === 'email'
                  ? 'bg-white text-primary-600 shadow'
                  : 'text-gray-600'
              }`}
            >
              <Mail className="w-5 h-5" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
                authMethod === 'phone'
                  ? 'bg-white text-primary-600 shadow'
                  : 'text-gray-600'
              }`}
            >
              <Phone className="w-5 h-5" />
              Phone
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          {/* Email Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Magic Link'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We'll send you a magic link to sign in instantly
              </p>
            </form>
          )}

          {/* Phone Form */}
          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="077 123 4567"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 077XXXXXXX or +9477XXXXXXX
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We'll send you a one-time password to verify your number
              </p>
            </form>
          )}

          {/* Note about Supabase Auth */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Phone authentication requires Supabase Phone Auth to be enabled in your project settings.
              For testing, use email authentication or configure a phone provider (Twilio, MessageBird, etc.).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

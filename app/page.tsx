'use client'

import { useState } from 'react'
import supabase from '../utils/supabaseClient'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/signin`,
      },
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <img src="/logo.png" alt="Welcome IQ" className="w-16 h-16 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">Welcome IQ</h1>

        {status === 'sent' ? (
          <div className="text-blue-600 font-medium">
            A magic link has been sent to <span className="font-semibold">{email}</span>.
            <br />
            Please check your email.
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send Magic Link'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import createClient from '../utils/supabaseClient'
import { motion } from 'framer-motion'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true
      }
    })

    setLoading(false)

    if (error) {
      setError('Login failed. Check the email and try again.')
    } else {
      router.push('/signin')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Welcome IQ" className="w-24 h-24 mb-4" />
          <h1 className="text-2xl font-semibold text-center">Welcome IQ</h1>
          <p className="text-sm text-gray-500 text-center mt-1">Sign in to your organization</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-2 text-base font-medium"
          >
            {loading ? 'Sending magic link...' : 'Sign In'}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </motion.div>
  )
}

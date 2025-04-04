'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../utils/supabaseClient'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    })

    if (error) {
      setError(error.message)
    } else {
      setError('')
      router.push('/auth/check-email')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow p-6"
      >
        <h1 className="text-xl font-bold mb-4 text-center">Welcome IQ</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Sign-In Link
          </button>
        </form>
      </motion.div>
    </div>
  )
}

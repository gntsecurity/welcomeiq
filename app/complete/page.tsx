'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function CompletionPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(15)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval)
          router.push('/signin')
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 text-center space-y-6">
      <motion.img
        src="/logo.png"
        alt="Welcome IQ Logo"
        className="w-24 h-24"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      <motion.h1
        className="text-3xl font-bold text-blue-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        You're all set!
      </motion.h1>

      <motion.p
        className="text-lg text-gray-700 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Thank you for completing your check-in. You may now proceed. Returning to the welcome screen in {countdown} seconds...
      </motion.p>
    </div>
  )
}

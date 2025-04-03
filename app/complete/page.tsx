'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function CompletionPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(15)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/signin')
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <motion.div
        className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 space-y-6 border border-gray-200 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          src="/logo.png"
          alt="Welcome IQ Logo"
          className="w-20 h-20 mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
        <h1 className="text-2xl font-bold text-blue-700">You're All Set!</h1>
        <p className="text-gray-600 text-sm">
          Thank you for signing in. A notification has been sent to your host.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Returning to home screen in <span className="font-semibold">{countdown}</span> seconds...
        </p>
      </motion.div>
    </div>
  )
}

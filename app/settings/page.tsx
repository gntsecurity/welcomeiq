'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const [signInIdle, setSignInIdle] = useState(true)
  const [globalIdle, setGlobalIdle] = useState(true)

  useEffect(() => {
    const storedSignIn = localStorage.getItem('welcomeiq:idle2min')
    const storedGlobal = localStorage.getItem('welcomeiq:idle5min')

    if (storedSignIn !== null) setSignInIdle(storedSignIn === 'true')
    if (storedGlobal !== null) setGlobalIdle(storedGlobal === 'true')
  }, [])

  const handleToggle = (key: string, value: boolean) => {
    localStorage.setItem(key, value.toString())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex flex-col items-center justify-start">
      <motion.div
        className="w-full max-w-md text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/logo.png" alt="Welcome IQ" className="w-16 h-16 mx-auto mb-2" />
        <h1 className="text-3xl font-extrabold text-blue-700">Settings</h1>
        <p className="text-sm text-gray-600">Customize idle timeout behavior</p>
      </motion.div>

      <motion.div
        className="space-y-4 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <label className="flex items-center justify-between p-4 bg-white rounded-2xl shadow border text-gray-700">
          <span className="font-medium">2-Min Inactivity Screen (Sign-In)</span>
          <input
            type="checkbox"
            className="scale-125 accent-blue-600"
            checked={signInIdle}
            onChange={(e) => {
              setSignInIdle(e.target.checked)
              handleToggle('welcomeiq:idle2min', e.target.checked)
            }}
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-white rounded-2xl shadow border text-gray-700">
          <span className="font-medium">5-Min Auto Return to Sign-In</span>
          <input
            type="checkbox"
            className="scale-125 accent-blue-600"
            checked={globalIdle}
            onChange={(e) => {
              setGlobalIdle(e.target.checked)
              handleToggle('welcomeiq:idle5min', e.target.checked)
            }}
          />
        </label>
      </motion.div>
    </div>
  )
}
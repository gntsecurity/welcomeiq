'use client'

import { useEffect, useState } from 'react'

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
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Settings</h1>

      <div className="space-y-4 w-full max-w-md">
        <label className="flex items-center justify-between p-4 bg-white rounded-xl shadow border">
          <span>2-Min Inactivity Screen (Sign-In)</span>
          <input
            type="checkbox"
            checked={signInIdle}
            onChange={(e) => {
              setSignInIdle(e.target.checked)
              handleToggle('welcomeiq:idle2min', e.target.checked)
            }}
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-white rounded-xl shadow border">
          <span>5-Min Auto Return to Sign-In</span>
          <input
            type="checkbox"
            checked={globalIdle}
            onChange={(e) => {
              setGlobalIdle(e.target.checked)
              handleToggle('welcomeiq:idle5min', e.target.checked)
            }}
          />
        </label>
      </div>
    </div>
  )
}

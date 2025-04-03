'use client'

import { useEffect, useState } from 'react'

export default function InstallBanner() {
  const [promptEvent, setPromptEvent] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setPromptEvent(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = () => {
    promptEvent?.prompt()
    promptEvent?.userChoice.then(() => setShowBanner(false))
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-xl p-4 shadow-xl flex items-center justify-between z-50">
      <div>
        <p className="text-sm font-medium text-gray-800">Install Welcome IQ</p>
        <p className="text-xs text-gray-500">Get full-screen experience on your device</p>
      </div>
      <button
        onClick={handleInstall}
        className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700"
      >
        Install
      </button>
    </div>
  )
}

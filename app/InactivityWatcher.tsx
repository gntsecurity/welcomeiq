'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function InactivityWatcher() {
  const router = useRouter()
  const pathname = usePathname()

  const [showWarning, setShowWarning] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    setShowWarning(false)

    const globalSetting = localStorage.getItem('welcomeiq:idle5min')
    if (globalSetting === 'false') return

    timeoutRef.current = setTimeout(() => {
      setShowWarning(true)
      warningTimeoutRef.current = setTimeout(() => {
        if (pathname !== '/signin') router.push('/signin')
      }, 10000)
    }, 5 * 60 * 1000)
  }

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'touchstart']
    const handler = () => resetTimer()

    resetTimer()
    events.forEach(e => window.addEventListener(e, handler))

    return () => {
      events.forEach(e => window.removeEventListener(e, handler))
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    }
  }, [pathname])

  if (!showWarning || pathname === '/signin') return null

  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-90 flex items-center justify-center flex-col text-center px-6">
      <img src="/logo.png" alt="Welcome IQ Logo" className="w-20 h-20 mb-4" />
      <p className="text-xl text-blue-700 font-semibold">Are you still here?</p>
      <p className="text-gray-600 mt-1">Returning to sign-in in 10 seconds…</p>
    </div>
  )
}

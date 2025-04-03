'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Orientation() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      router.push('/policy')
    }

    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('ended', handleEnded)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-8 space-y-8">
      <motion.div
        className="w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Contractor Orientation</h1>
        <p className="text-sm text-gray-600">Please watch the entire video to continue</p>
      </motion.div>

      <motion.div
        className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl aspect-video bg-black"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <video
          ref={videoRef}
          src="/contractorvideo.mp4"
          controls
          autoPlay
          playsInline
          className="w-full h-full rounded-2xl"
        />
      </motion.div>

      <motion.p
        className="text-sm text-gray-500 text-center px-4 max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        You will be automatically taken to the policy agreement after the video finishes.
      </motion.p>
    </div>
  )
}

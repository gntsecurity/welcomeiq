'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PolicyAgreement() {
  const [modalOpen, setModalOpen] = useState(true)
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleSubmit = () => {
    if (!canvasRef.current || !name) return
    const signature = canvasRef.current.toDataURL()
    if (signature.length < 100) return
    setSubmitted(true)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let drawing = false

    const getPos = (e: TouchEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        }
      }
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top
      }
    }

    const start = (e: TouchEvent | MouseEvent) => {
      drawing = true
      const pos = getPos(e)
      ctx?.beginPath()
      ctx?.moveTo(pos.x, pos.y)
    }

    const draw = (e: TouchEvent | MouseEvent) => {
      if (!drawing) return
      const pos = getPos(e)
      ctx?.lineTo(pos.x, pos.y)
      ctx?.stroke()
    }

    const end = () => {
      drawing = false
    }

    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', end)
    canvas.addEventListener('mouseleave', end)
    canvas.addEventListener('touchstart', start)
    canvas.addEventListener('touchmove', draw)
    canvas.addEventListener('touchend', end)

    return () => {
      canvas.removeEventListener('mousedown', start)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', end)
      canvas.removeEventListener('mouseleave', end)
      canvas.removeEventListener('touchstart', start)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', end)
    }
  }, [])

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 text-center space-y-4">
        <motion.img
          src="/logo.png"
          alt="Welcome IQ"
          className="w-20 h-20 mb-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        />
        <h1 className="text-2xl font-bold text-blue-700">Agreement Submitted</h1>
        <p className="text-gray-600">Please wait in the lobby until you are met by company personnel.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700">Contractor Policy Agreement</h1>
        <p className="text-sm text-gray-600">Please sign below after reviewing the policy</p>
      </div>

      <div className="w-full max-w-md space-y-4 z-10">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <div>
          <p className="text-sm text-gray-600 mb-1">Signature:</p>
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="border rounded-xl bg-white w-full shadow-lg"
          />
          <button
            onClick={clearCanvas}
            className="text-sm mt-2 text-blue-600 underline"
          >
            Clear Signature
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!name}
          className={`w-full py-3 rounded-xl text-lg font-semibold transition-colors ${
            name ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Submit Agreement
        </button>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-3xl h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <img src="/logo.png" alt="Welcome IQ" className="w-10 h-10" />
                <h2 className="text-lg font-semibold text-blue-700">Angstrom Contractor Policy</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 leading-relaxed">
                <p><strong>Purpose:</strong> This policy establishes guidelines and expectations for contractors performing duties at Angstrom facilities.</p>
                <p className="mt-2"><strong>Scope:</strong> Applies to all contractors working at Angstrom facilities.</p>
                <p className="mt-2"><strong>PPE:</strong> Contractors must provide their own PPE. Safety glasses are mandatory at all times.</p>
                <p className="mt-2"><strong>Liability:</strong> Contractors assume full liability for any accidents, injuries, or property damage resulting from their actions.</p>
                <p className="mt-2"><strong>Safety Compliance:</strong> Contractors must follow Angstrom's Lockout/Tagout (LOTO) and Hot Work Permit processes at all times. Fall protection is mandatory at elevations of 4 feet or higher.</p>
                <p className="mt-2"><strong>Photography and Recording:</strong> Strictly prohibited unless supervised by Angstrom personnel and within scope of duties. Unauthorized devices may be confiscated.</p>
                <p className="mt-2"><strong>Emergency Protocol:</strong> Contractors must follow Angstrom’s Fire, Weather, and Spill protocols. Maps are available upon request.</p>
                <p className="mt-2"><strong>Facility Escort:</strong> Contractors must be escorted unless management permits unescorted access.</p>
                <p className="mt-2"><strong>Compliance:</strong> Violations may result in removal and termination of contract.</p>
              </div>
              <div className="p-4 border-t text-right">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  I Agree
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

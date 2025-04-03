'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SignaturePad from 'signature_pad'
import { motion } from 'framer-motion'

export default function PolicyAgreement() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sigPadRef = useRef<SignaturePad | null>(null)

  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      const sig = new SignaturePad(canvasRef.current, {
        backgroundColor: '#ffffff',
        penColor: '#000000',
      })
      sigPadRef.current = sig
    }
  }, [])

  const handleClear = () => {
    sigPadRef.current?.clear()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed || sigPadRef.current?.isEmpty()) return

    setLoading(true)

    if (!sigPadRef.current) return
const signature = sigPadRef.current.toDataURL('image/png')

    // Optional: Save to Supabase here
    // const { data, error } = await supabase.from('policies').insert({ signature })

    setTimeout(() => {
      router.push('/complete')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <motion.div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-8 space-y-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-extrabold text-blue-700">Policy Agreement</h1>
        <p className="text-sm text-gray-600">
          Please read and agree to the following policy. Then sign below to continue.
        </p>

        <div className="p-4 border border-gray-200 rounded-xl max-h-60 overflow-y-auto text-sm text-gray-700 bg-gray-50">
          <p>
            By checking in to this facility, you acknowledge and agree to comply with all site safety,
            health, and security policies. Unauthorized access, photography, or unsafe behavior may
            result in removal and further action. All visitors must be accompanied at all times unless
            otherwise approved. PPE is required in designated areas. By signing below, you agree to
            these terms.
          </p>
        </div>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="h-5 w-5 text-blue-600"
          />
          <span className="text-sm text-gray-700">I have read and agree to the above policy.</span>
        </label>

        <div>
          <p className="text-sm text-gray-700 mb-2">Signature:</p>
          <div className="border border-gray-300 rounded-xl bg-white">
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              className="w-full rounded-xl"
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-blue-600 mt-2 hover:underline"
          >
            Clear Signature
          </button>
        </div>

        <motion.button
          type="submit"
          onClick={handleSubmit}
          disabled={!agreed || loading}
          whileTap={{ scale: 0.96 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Agree and Continue'}
        </motion.button>
      </motion.div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import supabase from '../../utils/supabaseClient'

export default function SignIn() {
  const router = useRouter()
  const [hosts, setHosts] = useState<{ id: string; name: string }[]>([])
  const [orgId, setOrgId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    host: ''
  })

  const [inactive, setInactive] = useState(false)
  const [loading, setLoading] = useState(false)
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null)
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    if (localStorage.getItem('welcomeiq:idle2min') !== 'true') return
    inactivityTimer.current = setTimeout(() => {
      setInactive(true)
    }, 2 * 60 * 1000)
  }

  useEffect(() => {
    resetInactivityTimer()
    const events = ['mousemove', 'keydown', 'touchstart']
    const handler = () => {
      if (!inactive) resetInactivityTimer()
    }
    events.forEach(e => window.addEventListener(e, handler))
    return () => {
      events.forEach(e => window.removeEventListener(e, handler))
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [inactive])

  const dismissOverlay = () => {
    setInactive(false)
    resetInactivityTimer()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.company || !form.email || !form.host || !orgId) return

    setLoading(true)
    const { error } = await supabase.from('sign_ins').insert({
      name: form.name,
      company: form.company,
      email: form.email,
      host_id: form.host,
      organization_id: orgId
    })

    if (!error) {
      router.push('/orientation')
    } else {
      console.error('Submission failed:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      const slug = 'AFE'

      const { data: org, error: orgErr } = await supabase
        .from('organizations')
        .select('id')
        .ilike('slug', slug)
        .maybeSingle()

      if (!org || orgErr) {
        console.error('Org not found for slug:', slug, orgErr)
        return
      }

      setOrgId(org.id)

      const { data: staff, error: staffErr } = await supabase
        .from('staff')
        .select('id, name')
        .eq('organization_id', org.id)
        .order('name')

      if (!staff || staffErr) {
        console.error('Staff not loaded:', staffErr)
        return
      }

      setHosts(staff)
    }

    init()
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 overflow-hidden">
      <AnimatePresence>
        {inactive && (
          <motion.div
            className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={dismissOverlay}
          >
            <div className="absolute top-6 right-6 text-sm text-gray-500">{time}</div>
            <motion.img src="/logo.png" alt="Welcome IQ Logo" className="w-28 h-28 mb-4" />
            <motion.p className="text-xl font-semibold text-blue-700 mb-2">
              Tap to check in
            </motion.p>
            <motion.div
              className="text-blue-700 text-3xl mt-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ⬆️
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img src="/logo.png" alt="Welcome IQ" className="w-24 h-24 mb-4" />
            <motion.p className="text-lg font-medium text-blue-700">
              Welcome, {form.name.split(' ')[0]}...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 space-y-6 border border-gray-200 z-10"
        >
          <div className="text-center">
            <motion.img src="/logo.png" alt="Welcome IQ Logo" className="w-14 h-14 mx-auto mb-2" />
            <h1 className="text-3xl font-extrabold text-blue-700">Welcome IQ</h1>
            <p className="text-sm text-gray-500 mt-1">Touch to begin your visit</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your Full Name" value={form.name} onChange={handleChange} onFocus={resetInactivityTimer} className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-lg" required />
            <input type="text" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} onFocus={resetInactivityTimer} className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-lg" required />
            <input type="email" name="email" placeholder="Your Email Address" value={form.email} onChange={handleChange} onFocus={resetInactivityTimer} className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-lg" required />
            <select name="host" value={form.host} onChange={handleChange} onFocus={resetInactivityTimer} className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-lg" required>
              <option value="" disabled>Who Are You Here to See?</option>
              {hosts.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            <motion.button type="submit" whileTap={{ scale: 0.95 }} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition">
              Submit and Continue
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  )
}

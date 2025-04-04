'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../utils/supabaseClient'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/')
        return
      }

      setUserId(session.user.id)
      setEmail(session.user.email || '')

      const { data } = await supabase
        .from('staff')
        .select('name')
        .eq('user_id', session.user.id)
        .single()

      if (data?.name) setName(data.name)
      setLoading(false)
    }

    load()
  }, [router, supabase])

  const handleSave = async () => {
    if (!userId) return
    await supabase.from('staff').update({ name }).eq('user_id', userId)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <motion.div
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow border space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-blue-700">My Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Save Changes
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold border hover:bg-gray-200"
          >
            Log Out
          </button>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabaseClient'
import { motion } from 'framer-motion'

type StaffRow = {
  id: string
  name: string
  email: string
  role: string
  is_self: boolean
}

export default function StaffPage() {
  const { org_id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [staff, setStaff] = useState<StaffRow[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/')
        return
      }

      setUserId(session.user.id)

      const { data, error } = await supabase
        .from('staff')
        .select('id, name, email, role, user_id')
        .eq('organization_id', org_id)

      if (!error && data) {
        const parsed = data.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          role: s.role,
          is_self: s.user_id === session.user.id
        }))
        setStaff(parsed)
      }

      setLoading(false)
    }

    load()
  }, [org_id, router, supabase])

  const toggleRole = async (id: string, current: string) => {
    const newRole = current === 'admin' ? 'user' : 'admin'
    const { error } = await supabase
      .from('staff')
      .update({ role: newRole })
      .eq('id', id)

    if (!error) {
      setStaff(prev => prev.map(s => s.id === id ? { ...s, role: newRole } : s))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <motion.div
        className="max-w-xl mx-auto bg-white rounded-2xl shadow border p-6 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-blue-700">Staff Management</h1>
        {loading ? (
          <p className="text-gray-500 text-center">Loading staff...</p>
        ) : (
          <div className="space-y-4">
            {staff.map(s => (
              <div
                key={s.id}
                className="flex items-center justify-between border p-4 rounded-xl bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-blue-700">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.email}</div>
                </div>
                <div className="text-sm text-right">
                  <div className="font-medium text-gray-700 capitalize">{s.role}</div>
                  {!s.is_self && (
                    <button
                      onClick={() => toggleRole(s.id, s.role)}
                      className="text-blue-600 text-xs hover:underline mt-1"
                    >
                      Make {s.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

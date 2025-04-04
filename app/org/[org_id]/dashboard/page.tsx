'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabaseClient'
import { motion } from 'framer-motion'

type Visitor = {
  id: string
  name: string
  company: string
  email: string
  created_at: string
  host_name: string
}

export default function VisitorsPage() {
  const router = useRouter()
  const { org_id } = useParams()
  const supabase = createClient()
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('sign_ins')
        .select('id, name, company, email, created_at, host:host_id(name)')
        .eq('organization_id', org_id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        const parsed = data.map(v => ({
          id: v.id,
          name: v.name,
          company: v.company,
          email: v.email,
          created_at: new Date(v.created_at).toLocaleString(),
          host_name: v.host?.name || 'N/A'
        }))
        setVisitors(parsed)
      }

      setLoading(false)
    }

    load()
  }, [org_id, router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <motion.h1
        className="text-2xl font-bold text-blue-700 text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Visitor Log
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading visitors...</p>
      ) : (
        <div className="space-y-4">
          {visitors.map(v => (
            <div key={v.id} className="bg-white p-4 rounded-xl shadow border">
              <div className="font-semibold text-blue-700">{v.name}</div>
              <div className="text-sm text-gray-600">{v.company} &bull; {v.email}</div>
              <div className="text-xs text-gray-400 mt-1">Host: {v.host_name}</div>
              <div className="text-xs text-gray-400">{v.created_at}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

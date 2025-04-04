'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import createClient from '../../../../utils/supabaseClient'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const { org_id } = useParams()
  const [orgName, setOrgName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/')
        return
      }

      const { data: org, error } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', org_id)
        .single()

      if (org && !error) setOrgName(org.name)
      setLoading(false)
    }

    load()
  }, [org_id, router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10 flex flex-col items-center justify-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <img src="/logo.png" alt="Welcome IQ" className="w-20 h-20 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-blue-700">Welcome IQ Dashboard</h1>
        <p className="text-gray-600 text-sm">Organization: <span className="font-medium">{orgName}</span></p>
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button className="p-5 rounded-2xl bg-white border shadow hover:bg-blue-50 text-blue-700 font-semibold">
          View Visitors
        </button>
        <button className="p-5 rounded-2xl bg-white border shadow hover:bg-blue-50 text-blue-700 font-semibold">
          Audit Logs
        </button>
      </motion.div>
    </div>
  )
}

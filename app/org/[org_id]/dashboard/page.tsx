'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import supabase from '../../../../utils/supabaseClient'

type Visitor = {
  id: string
  name: string
  email: string
  created_at: string
  host: {
    name: string
  } | null
}

export default function DashboardPage() {
  const router = useRouter()
  const { org_id } = useParams()
  const [orgName, setOrgName] = useState('')
  const [visitors, setVisitors] = useState<
    { name: string; email: string; created_at: string; host_name: string }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', org_id)
        .single()

      if (!org || orgError) return router.push('/signin')
      setOrgName(org.name)

      const { data, error } = await supabase
        .from('visitors')
        .select('name, email, created_at, host(name)')
        .eq('organization_id', org_id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        const parsed = data.map((v: Visitor) => ({
          name: v.name,
          email: v.email,
          created_at: new Date(v.created_at).toLocaleString(),
          host_name: v.host?.name || 'N/A'
        }))
        setVisitors(parsed)
      }

      setLoading(false)
    }

    fetchData()
  }, [org_id, router])

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          {orgName} Visitor Dashboard
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : visitors.length === 0 ? (
          <p className="text-gray-500">No visitors yet.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto border rounded-xl"
          >
            <table className="min-w-full table-auto">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Checked In</th>
                  <th className="px-4 py-3 text-left">Host</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {visitors.map((v, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3">{v.name}</td>
                    <td className="px-4 py-3">{v.email}</td>
                    <td className="px-4 py-3">{v.created_at}</td>
                    <td className="px-4 py-3">{v.host_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  )
}

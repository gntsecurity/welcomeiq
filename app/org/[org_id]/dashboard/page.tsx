'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
  const { org_id } = useParams()
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisitors = async () => {
      const { data, error } = await supabase
        .from('visitor_log')
        .select('id, name, email, created_at, host(name)')
        .eq('org_id', org_id)

      if (!error && data) {
        const parsed = data.map((v) => ({
          id: v.id,
          name: v.name,
          email: v.email,
          created_at: new Date(v.created_at).toLocaleString(),
          host: v.host ?? null
        }))
        setVisitors(parsed)
      }

      setLoading(false)
    }

    fetchVisitors()
  }, [org_id])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Visitor Log</h1>
      <ul className="space-y-2">
        {visitors.map((v) => (
          <li key={v.id} className="border p-3 rounded-lg shadow-sm">
            <div><strong>Name:</strong> {v.name}</div>
            <div><strong>Email:</strong> {v.email}</div>
            <div><strong>Signed In:</strong> {v.created_at}</div>
            <div><strong>Host:</strong> {v.host?.name || 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

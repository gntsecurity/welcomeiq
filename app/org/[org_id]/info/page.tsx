'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '../../../../utils/supabaseClient'

type OrgInfo = {
  id: string
  name: string
  description: string
  created_at: string
}

export default function InfoPage() {
  const { org_id } = useParams()
  const router = useRouter()
  const [info, setInfo] = useState<OrgInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInfo = async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', org_id)
        .single()

      if (!error && data) {
        setInfo({
          id: data.id,
          name: data.name,
          description: data.description,
          created_at: new Date(data.created_at).toLocaleString()
        })
      }

      setLoading(false)
    }

    fetchInfo()
  }, [org_id])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Organization Info</h1>
      <div className="border p-4 rounded-lg shadow-sm space-y-2">
        <div><strong>ID:</strong> {info?.id}</div>
        <div><strong>Name:</strong> {info?.name}</div>
        <div><strong>Description:</strong> {info?.description}</div>
        <div><strong>Created At:</strong> {info?.created_at}</div>
      </div>
    </div>
  )
}

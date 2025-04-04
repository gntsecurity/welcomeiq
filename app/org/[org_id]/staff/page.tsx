'use client'

export const runtime = 'edge'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '../../../../utils/supabaseClient'
import { motion } from 'framer-motion'

type StaffMember = {
  id: string
  name: string
  email: string
  created_at: string
}

export default function StaffInvitePage() {
  const { org_id } = useParams()
  const router = useRouter()

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStaff = async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, email, created_at')
        .eq('org_id', org_id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        const parsed = data.map((v: any) => ({
          id: v.id,
          name: v.name,
          email: v.email,
          created_at: new Date(v.created_at).toLocaleString()
        }))
        setStaff(parsed)
      }

      setLoading(false)
    }

    fetchStaff()
  }, [org_id])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Staff Members</h1>
        <button
          onClick={() => router.push(`/org/${org_id}/staff/invite`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Invite
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : staff.length === 0 ? (
        <p>No staff members found.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          {staff.map(member => (
            <div
              key={member.id}
              className="border p-4 rounded bg-white shadow-sm"
            >
              <div className="font-semibold">{member.name}</div>
              <div className="text-sm text-gray-600">{member.email}</div>
              <div className="text-xs text-gray-400">{member.created_at}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

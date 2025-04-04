'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '../../../../utils/supabaseClient' from '../../../../utils/supabaseClient'
import { motion } from 'framer-motion'

type OrgInfo = {
  name: string
  slug: string
  created_at: string
  staff_count: number
  sign_in_count: number
}

export default function OrgInfoPage() {
  const { org_id } = useParams()
  const router = useRouter()
  const supabase = supabase
  const [info, setInfo] = useState<OrgInfo | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/')
        return
      }

      const { data: org, error } = await supabase
        .from('organizations')
        .select('name, slug, created_at')
        .eq('id', org_id)
        .single()

      const { count: staffCount } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org_id)

      const { count: signInCount } = await supabase
        .from('sign_ins')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org_id)

      if (!error && org) {
        setInfo({
          name: org.name,
          slug: org.slug,
          created_at: new Date(org.created_at).toLocaleString(),
          staff_count: staffCount || 0,
          sign_in_count: signInCount || 0
        })
      }
    }

    load()
  }, [org_id, router, supabase])

  if (!info) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <motion.div
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow border space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-blue-700">Organization Info</h1>
        <div className="text-sm text-gray-700">
          <div><span className="font-semibold">Name:</span> {info.name}</div>
          <div><span className="font-semibold">Slug:</span> {info.slug}</div>
          <div><span className="font-semibold">Created:</span> {info.created_at}</div>
          <div><span className="font-semibold">Staff Count:</span> {info.staff_count}</div>
          <div><span className="font-semibold">Visitor Sign-Ins:</span> {info.sign_in_count}</div>
        </div>
      </motion.div>
    </div>
  )
}

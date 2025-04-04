'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '../../../../../utils/supabaseClient'

export default function InviteStaffPage() {
  const { org_id } = useParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInvite = async () => {
    setSubmitting(true)
    setError(null)

    const { error } = await supabase.from('staff').insert({
      org_id,
      name,
      email
    })

    setSubmitting(false)

    if (error) {
      setError(error.message)
    } else {
      setName('')
      setEmail('')
      router.push(`/org/${org_id}/staff`)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Invite Staff Member</h1>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Full Name"
        className="border p-2 w-full rounded"
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email Address"
        className="border p-2 w-full rounded"
      />
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={handleInvite}
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Inviting...' : 'Invite'}
      </button>
    </div>
  )
}

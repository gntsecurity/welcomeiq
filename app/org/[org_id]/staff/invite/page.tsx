'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import createClient from '../../../../../utils/supabaseClient'
import { motion } from 'framer-motion'

export default function StaffInvitePage() {
  const { org_id } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSubmitting(true)

    const { data, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true
    })

    if (signUpError || !data?.user?.id) {
      setError('Failed to invite user. Email may already exist.')
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from('staff').insert({
      organization_id: org_id,
      user_id: data.user.id,
      name,
      email,
      role: 'user'
    })

    if (insertError) {
      setError('Failed to add staff to organization.')
    } else {
      setSuccess(true)
      setName('')
      setEmail('')
    }

    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <motion.div
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow border space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-blue-700">Invite Staff</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-4 rounded-xl border border-gray-300 text-base"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 rounded-xl border border-gray-300 text-base"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            {submitting ? 'Inviting...' : 'Send Invite'}
          </button>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <p className="text-sm text-green-600">
            Invite sent successfully!
          </p>
        )}
      </motion.div>
    </div>
  )
}

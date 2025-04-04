'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../../utils/supabaseClient'

export default function ProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/')
        return
      }
      const user = data.user
      setName(user.user_metadata?.name || '')
      setEmail(user.email || '')
    }

    fetchProfile()
  }, [router])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Your Profile</h1>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

export default function TestPage() {
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase.rpc('pg_get_user_tables')
      if (error) console.error('Error fetching tables:', error)
      else setTables(data || [])
    }

    fetchTables()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📦 Welcome IQ Tables</h1>
      <ul className="list-disc list-inside">
        {tables.map((table) => (
          <li key={table}>{table}</li>
        ))}
      </ul>
    </div>
  )
}

// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Server-only service role — DO NOT expose in browser!
const SUPABASE_URL = 'https://wsmpifbcjbfxkuxrzgpg.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || ''

// Safe client for use in the browser (auth, fetch, etc)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Use this server-only for secure scripts, admin jobs, etc.
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
// Construction is deferred. Configuration alone does not establish a working integration.
export function getSupabaseClient() {
  if (!url || !key) throw new Error('Supabase is not configured. Preview data is session-only.')
  if (!key.startsWith('sb_publishable_')) throw new Error('Use a Supabase publishable key, never a secret key.')
  if (new URL(url).protocol !== 'https:') throw new Error('Supabase URL must use HTTPS.')
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false } })
}

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
let instance: SupabaseClient<Database> | undefined
export function getSupabaseClient() {
  if (instance) return instance
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !key) throw new Error('Permanent storage is not configured. Add a dedicated Sankalpa Supabase URL and publishable key.')
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname))) throw new Error('Hosted Supabase requires HTTPS.')
  if (!key.startsWith('sb_publishable_')) throw new Error('Only publishable keys are allowed in the frontend.')
  instance = createClient<Database>(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'sankalpa-auth' } })
  return instance
}
export function configurationError() { try { getSupabaseClient(); return null } catch (e) { return e instanceof Error ? e.message : 'Invalid backend configuration.' } }

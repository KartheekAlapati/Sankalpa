import { useEffect, useRef, useState } from 'react'
import type { ReactNode, FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { configurationError, getSupabaseClient } from '../lib/supabase'
import { Button, Card, LoadingState } from './ui'
import { previewMode } from '../lib/mode'

export function AuthBoundary({ children }: { children: ReactNode }) {
  const query = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recovery, setRecovery] = useState(false)
  const owner = useRef<string | null>(null)
  const location = useLocation()
  const config = previewMode ? null : configurationError()
  useEffect(() => {
    if (previewMode || config) return
    const auth = getSupabaseClient().auth
    let active = true
    let observed = false
    function accept(next: Session | null) {
      if (!active) return
      const nextOwner = next?.user.id ?? null
      if (owner.current !== nextOwner) { void query.cancelQueries(); query.clear(); owner.current = nextOwner }
      setSession(next); setLoading(false)
    }
    const { data: { subscription } } = auth.onAuthStateChange((event, next) => {
      observed = true
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      accept(next)
    })
    void auth.getSession().then(({ data, error: cause }) => {
      if (!active || observed) return
      if (cause) setError(cause.message)
      accept(data.session)
    }).catch(() => { if (active) { setError('Session restoration failed. Sign in again.'); accept(null) } })
    return () => { active = false; subscription.unsubscribe() }
  }, [config, query])
  if (previewMode) return children
  if (config) return <div className="auth-shell"><Card><p className="eyebrow">SANKALPA</p><h1>Connect your permanent space.</h1><p>{config}</p><p className="muted">Saving is disabled. No session-only fallback is active.</p></Card></div>
  if (loading) return <div className="auth-shell"><LoadingState /></div>
  if (recovery || location.pathname === '/auth/reset') return <AuthForm mode="update" authenticated={!!session} onRecovered={() => setRecovery(false)} />
  if (!session) return <AuthForm initialError={error} />
  if (location.pathname.startsWith('/auth/')) return <Navigate to="/today" replace />
  return <div key={session.user.id}>{children}</div>
}
function AuthForm({ mode: initial = 'signin', authenticated = false, initialError = '', onRecovered }: { mode?: string; authenticated?: boolean; initialError?: string; onRecovered?: () => void }) {
  const [mode, setMode] = useState(initial)
  const [error, setError] = useState(initialError)
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setMessage(''); setPending(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    try {
      if (!navigator.onLine) throw new Error('You are offline. Reconnect before changing your account.')
      const auth = getSupabaseClient().auth
      const origin = window.location.origin
      if (mode === 'signin') { const { error } = await auth.signInWithPassword({ email, password }); if (error) throw error }
      else if (mode === 'signup') {
        const { data, error } = await auth.signUp({ email, password, options: { emailRedirectTo: origin + '/auth/callback' } })
        if (error) throw error
        if (!data.session) setMessage('Check your email to verify your account before signing in.')
      } else if (mode === 'reset') {
        const { error } = await auth.resetPasswordForEmail(email, { redirectTo: origin + '/auth/reset' }); if (error) throw error
        setMessage('If an account exists, a reset email will arrive. Open the link in this browser.')
      } else {
        if (!authenticated) throw new Error('Recovery session missing or expired. Request another reset email.')
        const { error } = await auth.updateUser({ password }); if (error) throw error
        onRecovered?.(); navigate('/today', { replace: true })
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Request failed. Your form is unchanged; try again.') }
    finally { setPending(false) }
  }
  return <div className="auth-shell"><Card><p className="eyebrow">SANKALPA</p><h1>{mode === 'signin' ? 'Return to your space.' : mode === 'signup' ? 'Create your private space.' : 'Reset your password.'}</h1><p className="muted">Your life, knowledge and growth. Saved to your account.</p><form onSubmit={submit}>
    {mode !== 'update' && <><label htmlFor="auth-email">Email</label><input id="auth-email" name="email" type="email" autoComplete="email" required /></>}
    {mode !== 'reset' && <><label htmlFor="auth-password">{mode === 'update' ? 'New password' : 'Password'}</label><input id="auth-password" name="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required minLength={mode === 'signin' ? 1 : 12} /></>}
    {error && <p className="form-error" role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <Button className="full-width section-gap" disabled={pending}>{pending ? 'Please wait…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset email' : 'Update password'}</Button>
  </form><div className="focus-controls">{mode !== 'signin' && <Button variant="ghost" onClick={() => { setMode('signin'); navigate('/auth/signin'); onRecovered?.(); setError(''); setMessage('') }}>Back to sign in</Button>}{mode === 'signin' && <><Button variant="ghost" onClick={() => setMode('signup')}>Create account</Button><Button variant="ghost" onClick={() => setMode('reset')}>Forgot password</Button></>}</div><p className="timer-caption">Email links require configured redirect allowlists.</p></Card></div>
}

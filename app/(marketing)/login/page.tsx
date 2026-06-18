'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { getSupabaseBrowser } from '@/lib/supabase/browser'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/today'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const sb = getSupabaseBrowser()
    // #region agent log
    fetch('http://127.0.0.1:7769/ingest/cd1573aa-08e7-4dc3-b06e-94b88c63d77d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f59c64'},body:JSON.stringify({sessionId:'f59c64',location:'login/page.tsx:onSubmit',message:'login attempt',data:{hasClient:!!sb,next},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    if (!sb) {
      setError('Supabase not configured')
      setBusy(false)
      return
    }
    const { error: err } = await sb.auth.signInWithPassword({ email, password })
    // #region agent log
    fetch('http://127.0.0.1:7769/ingest/cd1573aa-08e7-4dc3-b06e-94b88c63d77d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f59c64'},body:JSON.stringify({sessionId:'f59c64',location:'login/page.tsx:onSubmit',message:'login result',data:{ok:!err,errorCode:err?.message?.slice(0,80)??null},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="deck-card mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <input className="field-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="field-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <Link href="/" className="block text-center text-sm text-muted">← Back</Link>
    </form>
  )
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}

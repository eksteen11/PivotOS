'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { accountInitials } from '@/lib/auth/navigation'
import { PivotIcon } from '@/components/workspace/PivotIcon'

export function AccountMenu({ name, email, preview = false }: { name: string; email: string; preview?: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    function close(event: PointerEvent) { if (ref.current && !ref.current.contains(event.target as Node)) ref.current.open = false }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape' && ref.current?.open) { ref.current.open = false; ref.current.querySelector('summary')?.focus() } }
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape) }
  }, [])
  async function signOut() {
    setBusy(true); setError('')
    try {
      const { getSupabaseBrowser } = await import('@/lib/supabase/browser')
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Sign-out is unavailable. Please try again.')
      const { error } = await sb.auth.signOut()
      if (error) throw error
      window.location.assign('/login')
    } catch { setError('Could not sign out. Please try again.'); setBusy(false) }
  }
  return <details className="account-menu" ref={ref}><summary aria-label="Open account menu"><span className="pivot-live-indicator" /><span className="account-workspace-label">{preview ? 'Interactive preview' : 'Private workspace'}</span><span className="pivot-topbar-avatar">{accountInitials(name)}</span><span aria-hidden="true">⌄</span></summary>
    <div className="account-dropdown"><div className="account-dropdown-identity"><strong>{name}</strong><span>{preview ? 'Sample account' : email}</span><small>{preview ? 'Preview' : 'Workspace owner'}</small></div>
      {preview ? <Link href="/login">Sign in to your account <PivotIcon name="arrow" size={16} /></Link> : <><Link href="/account">Account & profile <PivotIcon name="arrow" size={16} /></Link><Link href="/account?tab=security">Password & security <PivotIcon name="lock" size={16} /></Link><Link href="/account?tab=team">Business access <PivotIcon name="systems" size={16} /></Link><button type="button" disabled={busy} onClick={() => void signOut()}>{busy ? 'Signing out…' : 'Sign out'}</button></>}
      <Link href="/install">Install Pivot OS <PivotIcon name="arrow" size={16} /></Link>
      {error ? <p className="account-error" role="alert">{error}</p> : null}
    </div></details>
}

'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { accountInitials } from '@/lib/auth/navigation'
import { PivotIcon, PivotMark } from '@/components/workspace/PivotIcon'
import { PasswordField } from './PasswordField'

type Props = { name: string; email: string; createdAt: string; confirmed: boolean; entities: { id: string; name: string }[]; entitiesError: boolean; initialTab: 'profile' | 'security' | 'team' }
export function AccountSettings({ name, email, createdAt, confirmed, entities, entitiesError, initialTab }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState(initialTab)
  const [displayName, setDisplayName] = useState(name)
  const [savedName, setSavedName] = useState(name)
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  function switchTab(next: typeof tab) { setTab(next); setError(''); setNotice(''); window.history.replaceState(null, '', `/account${next === 'profile' ? '' : `?tab=${next}`}`) }
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Account services are temporarily unavailable.')
      const { error } = await sb.auth.updateUser({ data: { display_name: displayName.trim() } })
      if (error) throw error
      setSavedName(displayName.trim()); setNotice('Your profile has been saved.'); router.refresh()
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not save your profile.') }
    finally { setBusy(false) }
  }
  async function changePassword(e: React.FormEvent) {
    e.preventDefault(); setError(''); setNotice('')
    if (password !== confirm) { setError('The two passwords do not match.'); return }
    if (password === currentPassword) { setError('Choose a different password from your current one.'); return }
    setBusy(true)
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Account services are temporarily unavailable.')
      // Supabase verifies the existing password without creating another sign-in session.
      const { error } = await sb.auth.updateUser({ password, current_password: currentPassword })
      if (error) throw error
      setCurrentPassword(''); setPassword(''); setConfirm(''); setNotice('Password updated. Use your new password the next time you sign in.')
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not update your password.') }
    finally { setBusy(false) }
  }
  async function signOut(everywhere = false) {
    setBusy(true); setError(''); setNotice('')
    try {
      const sb = getSupabaseBrowser()
      if (!sb) throw new Error('Account services are temporarily unavailable.')
      const { error } = await sb.auth.signOut({ scope: everywhere ? 'global' : 'local' })
      if (error) throw error
      window.location.assign('/login')
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not sign out.'); setBusy(false) }
  }
  return <main className="account-page">
    <header className="account-header"><Link href="/today" className="pivot-logo"><PivotMark /><span>pivot<span className="pivot-logo-os">os</span></span></Link><Link className="pivot-button-secondary" href="/today">← Back to my desk</Link></header>
    <section className="account-heading"><span className="account-eyebrow">YOUR WORKSPACE, YOUR WAY</span><h1>{tab === 'profile' ? 'Your account.' : tab === 'security' ? 'Password & security.' : 'Business access.'}</h1><p>{tab === 'profile' ? 'Your details. Your private workspace.' : tab === 'security' ? 'Control how you sign in and where you stay signed in.' : 'Your businesses, with clear boundaries.'}</p></section>
    <div className="account-layout"><aside className="account-navigation"><div className="account-identity"><span className="account-large-avatar">{accountInitials(savedName)}</span><strong>{savedName}</strong><span>{email}</span><small>Workspace owner</small></div><nav aria-label="Account settings">{([{ id: 'profile', label: 'My profile', icon: 'desk' }, { id: 'security', label: 'Password & security', icon: 'lock' }, { id: 'team', label: 'Business access', icon: 'systems' }] as const).map((item) => <button key={item.id} onClick={() => switchTab(item.id)} aria-current={tab === item.id ? 'page' : undefined} disabled={busy}><PivotIcon name={item.icon} size={18} />{item.label}</button>)}</nav><button className="account-signout" onClick={() => void signOut()} disabled={busy}>Sign out</button></aside>
    <div className="account-content">
      <section className="account-overview" aria-label="Account overview">
        <button onClick={() => switchTab('profile')} disabled={busy}><span className="account-overview-icon"><PivotIcon name="desk" size={20} /></span><span><small>PROFILE</small><strong>{savedName}</strong></span><PivotIcon name="arrow" size={17} /></button>
        <button onClick={() => switchTab('security')} disabled={busy}><span className="account-overview-icon"><PivotIcon name={confirmed ? 'check' : 'lock'} size={20} /></span><span><small>SIGN-IN EMAIL</small><strong>{confirmed ? 'Verified' : 'Verification pending'}</strong></span><PivotIcon name="arrow" size={17} /></button>
        <button onClick={() => switchTab('team')} disabled={busy}><span className="account-overview-icon"><PivotIcon name="systems" size={20} /></span><span><small>WORKSPACE ACCESS</small><strong>Owner · private</strong></span><PivotIcon name="arrow" size={17} /></button>
      </section>
      {error ? <p role="alert" className="account-error">{error}</p> : null}{notice ? <p role="status" className="account-success">{notice}</p> : null}
      {tab === 'profile' ? <section className="account-panel"><div className="account-panel-heading"><span className="account-panel-icon"><PivotIcon name="desk" /></span><div><h2>My profile</h2><p>The details people recognise.</p></div></div><form className="account-form" onSubmit={saveProfile}><label className="account-field"><span>Display name</span><input autoComplete="name" minLength={2} maxLength={80} required value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></label><label className="account-field"><span>Email address</span><input type="email" value={email} readOnly /><small className="account-hint">Your sign-in address · {confirmed ? 'Email verified' : 'Email verification pending'}</small></label><div className="account-profile-meta"><span>Account created</span><strong>{new Date(createdAt).toLocaleDateString('en-ZA', { timeZone: 'Africa/Johannesburg', day: 'numeric', month: 'long', year: 'numeric' })}</strong></div><button className="pivot-button" disabled={busy || !displayName.trim() || displayName.trim() === savedName}>{busy ? 'Saving…' : 'Save profile'}</button></form></section> : null}
      {tab === 'security' ? <><section className="account-panel"><div className="account-panel-heading"><span className="account-panel-icon"><PivotIcon name="lock" /></span><div><h2>Password & security</h2><p>Choose a strong password. Keep access in your hands.</p></div></div><form onSubmit={changePassword} className="account-form"><PasswordField label="Current password" value={currentPassword} onChange={setCurrentPassword} /><PasswordField label="New password" autoComplete="new-password" value={password} onChange={setPassword} minLength={12} /><p className="account-hint">Use at least 12 characters and a password you don’t use elsewhere.</p><PasswordField label="Confirm new password" autoComplete="new-password" value={confirm} onChange={setConfirm} minLength={12} /><button className="pivot-button" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button><Link className="account-text-link" href="/forgot-password">Forgot your current password?</Link></form></section><section className="account-panel"><h2>Signed-in sessions</h2><p className="account-lead">Sign out on this device, or end your sessions across all devices.</p><p className="account-hint">Signing out everywhere may take a short time to end access on other devices.</p><div className="account-session-actions"><button className="pivot-button-secondary" disabled={busy} onClick={() => void signOut()}>Sign out here</button><button className="pivot-button-secondary" disabled={busy} onClick={() => void signOut(true)}>Sign out everywhere</button></div></section></> : null}
      {tab === 'team' ? <><section className="account-panel"><div className="account-panel-heading"><span className="account-panel-icon"><PivotIcon name="systems" /></span><div><h2>Business access</h2><p>Your workspace is private. Invitations remain closed.</p></div></div><div className="account-member"><span className="account-large-avatar">{accountInitials(savedName)}</span><div><strong>{savedName} <small>(you)</small></strong><span>{email}</span></div><b>Owner</b></div><p className="account-notice"><PivotIcon name="lock" size={18} />Only you have access. Team invitations remain closed while business-level sharing is being built.</p><h3>Your businesses</h3>{entitiesError ? <p role="alert" className="account-error">Business access could not be loaded. Please refresh.</p> : entities.length ? <div className="account-business-list">{entities.map((entity) => <div key={entity.id}><span>{entity.name}</span><b>Owner</b></div>)}</div> : <p className="account-hint">No businesses have been created for this account yet.</p>}</section><details className="account-panel account-planned-roles"><summary>How future sharing will work <span>Planned</span></summary><span className="account-eyebrow">TEAM SHARING · PLANNED</span><h2>Clear boundaries from day one.</h2><p className="account-lead">Roles will apply to an invited business. Your personal workspace stays yours.</p><div className="account-role-list">{[{ role: 'Owner', detail: 'Owns the workspace and controls membership and access.' }, { role: 'Admin', detail: 'Manages the invited business and its team.' }, { role: 'Member', detail: 'Works on records inside the invited business.' }, { role: 'Viewer', detail: 'Reads shared records without changing them.' }].map((role) => <div key={role.role}><strong>{role.role}</strong><span>{role.detail}</span></div>)}</div><p className="account-hint">Invitations, business selection, role changes and access revocation are the next sharing milestone. These planned roles do not grant access today.</p></details></> : null}
    </div></div><footer className="account-footer"><PivotIcon name="lock" size={14} />Private by default. Shared by your choice.</footer>
  </main>
}

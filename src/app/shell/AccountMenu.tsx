import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'
import { useMyMemberships } from '../../lib/team/teamRepo'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

function initialsFromEmail(email: string | undefined): string {
  const s = (email ?? '').trim().toUpperCase()
  if (!s) return '?'
  const local = (s.split('@')[0] ?? s).replace(/[^A-Z0-9]+/gi, ' ').trim()
  const parts = local.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).slice(0, 2)
  return local.slice(0, 2) || '?'
}

function formatRole(role: string): string {
  const s = role.replace(/_/g, ' ')
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

type Props = {
  /** Wider panel and accent alignment for marketing header */
  variant?: 'marketing' | 'app'
}

export function AccountMenu({ variant = 'app' }: Props) {
  const { session } = useSupabaseSession()
  const { entityId, entities, currentEntityDbId } = useAppState()
  const { memberships, loading } = useMyMemberships(session?.user.id ?? null)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const email = session?.user.email ?? ''
  const userIdShort = session?.user.id ? `${session.user.id.slice(0, 8)}…` : '—'

  const focusLabel = useMemo(() => {
    if (entityId === ALL_ENTITIES_SLUG) return 'All entities'
    return entities.find((e) => e.id === entityId)?.label ?? entityId
  }, [entities, entityId])

  const roleInFocus = useMemo(() => {
    if (!currentEntityDbId) return null
    return memberships.find((m) => m.entityId === currentEntityDbId)?.role ?? null
  }, [currentEntityDbId, memberships])

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      const el = rootRef.current
      if (el && !el.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  if (!session) return null

  const panelClass = variant === 'marketing' ? 'accountMenuPanel accountMenuPanelMarketing' : 'accountMenuPanel'

  return (
    <div className="accountMenu" ref={rootRef}>
      <button
        type="button"
        className="accountMenuTrigger"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="accountMenuAvatar" aria-hidden>
          {initialsFromEmail(email)}
        </span>
        <span className="accountMenuTriggerLabel">{email || 'Account'}</span>
      </button>
      {open ? (
        <div className={panelClass} role="menu">
          <div className="accountMenuSection">
            <div className="accountMenuEmail">{email || 'Signed in'}</div>
            <div className="accountMenuMeta">User ID: {userIdShort}</div>
          </div>
          <div className="accountMenuSection">
            <div className="accountMenuSectionTitle">App focus</div>
            <div className="accountMenuMeta">
              {focusLabel}
              {currentEntityDbId
                ? roleInFocus
                  ? (
                      <>
                        {' '}
                        · <span className="accountMenuRole">{formatRole(roleInFocus)}</span>
                      </>
                    )
                  : loading
                    ? ' · …'
                    : ' · —'
                : ' · Pick one entity in the header to see your role for team tools.'}
            </div>
          </div>
          <div className="accountMenuSection">
            <div className="accountMenuSectionTitle">Your entity access</div>
            {loading ? (
              <div className="accountMenuMeta">Loading…</div>
            ) : memberships.length === 0 ? (
              <div className="accountMenuMeta">No memberships loaded yet.</div>
            ) : (
              <ul className="accountMenuRoleList">
                {memberships.map((m) => (
                  <li key={m.entityId}>
                    <span className="accountMenuEntityName">{m.name}</span>
                    <span className="accountMenuRole">{formatRole(m.role)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="accountMenuActions">
            <Link className="accountMenuLink" to="/settings" role="menuitem" onClick={() => setOpen(false)}>
              Settings &amp; account
            </Link>
            <button
              type="button"
              className="accountMenuSignOut"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                void supabase?.auth.signOut()
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

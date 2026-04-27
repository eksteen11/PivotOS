import { useMemo, useState } from 'react'

import { hasSupabaseEnv, supabase } from '../../lib/supabase/client'
import { useSupabaseSession } from '../../lib/supabase/useSession'
import { db } from '../../lib/db/db'
import { changeEntityMemberRole, createEntityInvite, revokeEntityInvite, useEntityTeam, type EntityRole } from '../../lib/team/teamRepo'
import { ALL_ENTITIES_SLUG, isAllEntitiesScope, useAppState } from '../state/AppState'

export function SettingsPage() {
  const { session } = useSupabaseSession()
  const { entities, entityId, currentEntityDbId } = useAppState()
  const { loading: teamLoading, error: teamError, members, invites, refresh } = useEntityTeam(currentEntityDbId)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<EntityRole>('member')
  const [teamNote, setTeamNote] = useState<string | null>(null)

  const currentEntityLabel = useMemo(() => {
    if (entityId === ALL_ENTITIES_SLUG) return 'All entities'
    return entities.find((e) => e.id === entityId)?.label ?? entityId
  }, [entities, entityId])

  return (
    <section>
      <div className="card">
        <h2 className="cardTitle">Settings</h2>
        <p className="muted" style={{ margin: 0 }}>
          In V1, Supabase handles login + sync and keeps secrets server-side. This screen becomes the control panel for connections.
        </p>
      </div>

      <div className="card">
        <h2 className="cardTitle">Account</h2>
        {!hasSupabaseEnv ? (
          <p className="muted" style={{ margin: 0 }}>
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to a local `.env` to enable sign-in and sync.
          </p>
        ) : session ? (
          <>
            <p className="muted" style={{ marginTop: 0 }}>
              Signed in as {session.user.email ?? '—'}
            </p>
            <p className="muted" style={{ marginTop: 0 }}>
              User ID: {session.user.id}
            </p>
            <button
              className="btn"
              type="button"
              onClick={async () => {
                await supabase?.auth.signOut()
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <p className="muted" style={{ margin: 0 }}>
            Use the sign-in screen (shown automatically) to log in.
          </p>
        )}
      </div>

      <div className="card">
        <h2 className="cardTitle">Webhooks</h2>
        <p className="muted" style={{ margin: 0 }}>
          Inbound: `webhook-in` creates inbox items. Outbound: item changes enqueue events in `sync_outbox` for `outbox-dispatch`.
        </p>
      </div>

      <div className="card">
        <h2 className="cardTitle">Team Access</h2>
        {!session ? (
          <p className="muted" style={{ margin: 0 }}>
            Sign in to manage team access.
          </p>
        ) : isAllEntitiesScope(entityId) ? (
          <p className="muted" style={{ margin: 0 }}>
            Invites and roles are per entity. Select one company in the header (not {currentEntityLabel}), then return here.
          </p>
        ) : !currentEntityDbId ? (
          <p className="muted" style={{ margin: 0 }}>
            Sign in and sync this entity to manage team access.
          </p>
        ) : (
          <>
            <p className="muted" style={{ marginTop: 0 }}>
              Current entity: {currentEntityLabel}
            </p>

            <div className="field" style={{ marginBottom: 10 }}>
              <label>Invite by email</label>
              <input
                style={{ width: '100%', background: 'transparent', border: 0, outline: 'none', padding: 0 }}
                inputMode="email"
                autoComplete="email"
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="field" style={{ marginBottom: 10 }}>
              <label>Role</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as EntityRole)} style={{ width: '100%' }}>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <button
              className="btn"
              type="button"
              disabled={!inviteEmail.trim()}
              onClick={async () => {
                try {
                  await createEntityInvite({
                    entityId: currentEntityDbId,
                    email: inviteEmail,
                    role: inviteRole,
                    invitedBy: session.user.id,
                  })
                  setInviteEmail('')
                  setInviteRole('member')
                  setTeamNote('Invite created.')
                  await refresh()
                } catch (e: any) {
                  setTeamNote(e?.message ?? 'Failed to create invite.')
                }
              }}
            >
              Create invite
            </button>

            {teamNote ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                {teamNote}
              </p>
            ) : null}
            {teamError ? (
              <p className="muted" style={{ marginBottom: 0 }}>
                {teamError}
              </p>
            ) : null}

            <div style={{ height: 12 }} />
            <h3 className="cardTitle" style={{ marginBottom: 8 }}>
              Members
            </h3>
            {teamLoading ? (
              <p className="muted" style={{ margin: 0 }}>
                Loading team…
              </p>
            ) : members.length === 0 ? (
              <p className="muted" style={{ margin: 0 }}>
                No members found.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                {members.map((m) => (
                  <li
                    key={m.id}
                    style={{
                      border: '1px solid rgba(26, 28, 28, 0.12)',
                      background: 'rgba(255, 255, 255, 0.72)',
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <div className="muted" style={{ fontSize: 12 }}>
                      {m.userId}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginTop: 6 }}>
                      <div style={{ fontWeight: 720 }}>{m.role}</div>
                      <select
                        value={m.role}
                        onChange={async (e) => {
                          const role = e.target.value as EntityRole
                          try {
                            await changeEntityMemberRole(m.id, role)
                            setTeamNote('Role updated.')
                            await refresh()
                          } catch (err: any) {
                            setTeamNote(err?.message ?? 'Failed to update role.')
                          }
                        }}
                        style={{ width: 120 }}
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ height: 12 }} />
            <h3 className="cardTitle" style={{ marginBottom: 8 }}>
              Invites
            </h3>
            {invites.length === 0 ? (
              <p className="muted" style={{ margin: 0 }}>
                No invites yet.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                {invites.map((i) => (
                  <li
                    key={i.id}
                    style={{
                      border: '1px solid rgba(26, 28, 28, 0.12)',
                      background: 'rgba(255, 255, 255, 0.72)',
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 720 }}>{i.email}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {i.role} · {i.acceptedAt ? 'Accepted' : i.revokedAt ? 'Revoked' : 'Pending'}
                        </div>
                      </div>
                      {!i.acceptedAt && !i.revokedAt ? (
                        <button
                          className="btn"
                          type="button"
                          style={{
                            width: 'auto',
                            padding: '10px 12px',
                            borderColor: 'rgba(255, 82, 99, 0.28)',
                            background: 'rgba(255, 82, 99, 0.08)',
                          }}
                          onClick={async () => {
                            try {
                              await revokeEntityInvite(i.id)
                              setTeamNote('Invite revoked.')
                              await refresh()
                            } catch (err: any) {
                              setTeamNote(err?.message ?? 'Failed to revoke invite.')
                            }
                          }}
                        >
                          Revoke
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <div className="card">
        <h2 className="cardTitle">Local</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          <button
            className="btn"
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem('pivotos.offline.allowed')
              } catch {}
              window.location.reload()
            }}
          >
            Turn off offline mode
          </button>
          <button
            className="btn"
            type="button"
            onClick={async () => {
              await db.delete()
              window.location.reload()
            }}
            style={{
              borderColor: 'rgba(255, 82, 99, 0.28)',
              background: 'rgba(255, 82, 99, 0.08)',
            }}
          >
            Reset local data
          </button>
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>
          Reset clears this device only.
        </p>
      </div>

      <div className="card">
        <h2 className="cardTitle">Coming next</h2>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'rgba(26, 28, 28, 0.92)' }}>
          <li>Sign in</li>
          <li>Sync across devices (offline-first)</li>
          <li>AI actions powered by OpenAI (server-side)</li>
          <li>Webhook endpoints for automations</li>
        </ul>
      </div>
    </section>
  )
}


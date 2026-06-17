import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

import { useDirtyCount, useLastSyncAt } from '../../lib/sync/syncStatus'
import { AccountMenu } from './AccountMenu'
import { QuickCapture } from './QuickCapture'
import { ALL_ENTITIES_SLUG, useAppState } from '../state/AppState'

function useRouteLabel() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/command')) return { title: 'Command Centre', hint: 'Know what matters now' }
  if (pathname.startsWith('/today')) return { title: 'Today', hint: 'One clear next action' }
  if (pathname.startsWith('/tasks')) return { title: 'Tasks', hint: 'Plan, start, complete' }
  if (pathname.startsWith('/projects')) return { title: 'Projects', hint: 'Execution lanes and ownership' }
  if (pathname.startsWith('/contacts')) return { title: 'Contacts', hint: 'Follow-ups and relationship memory' }
  if (pathname.startsWith('/deals')) return { title: 'Deals', hint: 'Value, risk, and next action' }
  if (pathname.startsWith('/documents')) return { title: 'Documents', hint: 'Contracts, notes, reports' }
  if (pathname.startsWith('/inbox')) return { title: 'Inbox', hint: 'Capture first, sort later' }
  if (pathname.startsWith('/meetings')) return { title: 'Meetings', hint: 'Schedule and follow through' }
  if (pathname.startsWith('/library')) return { title: 'Library', hint: 'Processes, decisions, knowledge' }
  if (pathname.startsWith('/agents')) return { title: 'Agents', hint: 'AI-assisted actions' }
  if (pathname.startsWith('/settings')) return { title: 'Settings', hint: 'Connections and preferences' }
  return { title: 'PivotOS', hint: 'Control tower' }
}

export function AppLayout() {
  const { title, hint } = useRouteLabel()
  const {
    entities,
    entityId,
    setEntityId,
    divisionsForCurrentEntity,
    divisionId,
    setDivisionId,
    workstreamsForCurrentScope,
    workstreamId,
    setWorkstreamId,
  } = useAppState()
  const dirtyCount = useDirtyCount() ?? 0
  const lastSyncAt = useLastSyncAt()
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true

  return (
    <section className="appShell">
      <header className="topBar">
        <div className="topBarRow">
            <div className="titleLine">
              <div className="appBrandRow">
                <Link to="/home" className="appBrand" aria-label="PivotOS marketing home">
                  <span className="marketingLogoMark marketingLogoMarkSm" aria-hidden />
                  <span className="appBrandName">PivotOS</span>
                </Link>
                <div className="appTitleBlock">
                  <div className="appTitle">{title}</div>
                  <div className="appHintSub">{hint}</div>
                </div>
              </div>
              <div className="appHint appHintWithAccount" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className={`appStatusDot${online ? '' : ' appStatusDotOffline'}`} aria-hidden />
                  {online ? (dirtyCount ? `Sync ${dirtyCount}` : lastSyncAt ? 'Synced' : 'Online') : 'Offline'}
                </span>
                <AccountMenu variant="app" />
              </div>
            </div>

          <div className="filters">
            <div className="field">
              <label>Entity</label>
              <select value={entityId} onChange={(e) => setEntityId(e.target.value)}>
                <option value={ALL_ENTITIES_SLUG}>All entities</option>
                {entities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Division</label>
              <select
                value={divisionId ?? ''}
                onChange={(e) => setDivisionId(e.target.value || null)}
                disabled={divisionsForCurrentEntity.length === 0}
              >
                {divisionsForCurrentEntity.length === 0 ? (
                  <option value="">—</option>
                ) : (
                  <>
                    <option value="">All divisions</option>
                    {divisionsForCurrentEntity.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="field">
              <label>Workstream</label>
              <select
                value={workstreamId ?? ''}
                onChange={(e) => setWorkstreamId(e.target.value || null)}
                disabled={workstreamsForCurrentScope.length === 0}
              >
                {workstreamsForCurrentScope.length === 0 ? (
                  <option value="">—</option>
                ) : (
                  <>
                    <option value="">All workstreams</option>
                    {workstreamsForCurrentScope.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="contentInner">
          <Outlet />
        </div>
      </main>

      <QuickCapture />

      <nav className="bottomNav" aria-label="Primary">
        <div className="bottomNavInner">
          <NavItem to="/command" label="Command" />
          <NavItem to="/today" label="Today" />
          <NavItem to="/tasks" label="Tasks" />
          <NavItem to="/inbox" label="Inbox" />
          <NavItem to="/meetings" label="Meetings" />
          <NavItem to="/settings" label="Settings" />
        </div>
      </nav>
    </section>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <>
      <NavLink to={to} className={({ isActive }) => (isActive ? 'navItem navItemActive' : 'navItem')}>
        {label}
      </NavLink>
    </>
  )
}

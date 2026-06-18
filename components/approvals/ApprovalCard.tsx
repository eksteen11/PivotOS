'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { StatusBadge } from '@/components/cards/StatusBadge'
import type { Approval } from '@/lib/types/database'

export function ApprovalCard({ approval }: { approval: Approval }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function act(status: 'approved' | 'rejected') {
    setBusy(true)
    await fetch(`/api/approvals/${approval.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setBusy(false)
    router.refresh()
  }

  return (
    <article className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap gap-2">
        <StatusBadge label={approval.risk_level} tone={approval.risk_level === 'high' ? 'high' : 'normal'} />
        <StatusBadge label={approval.action_type.replace(/_/g, ' ')} tone="pending" />
        {approval.agents?.name ? <StatusBadge label={approval.agents.name} tone="active" /> : null}
      </div>
      <p className="text-sm">{approval.reason}</p>
      <pre className="mt-3 max-h-24 overflow-auto rounded-lg bg-black/[0.03] p-3 text-xs text-muted">
        {JSON.stringify(approval.payload, null, 2)}
      </pre>
      {approval.status === 'pending' && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-primary text-sm" disabled={busy} onClick={() => act('approved')}>
            Approve
          </button>
          <button type="button" className="btn-secondary text-sm" disabled={busy} onClick={() => act('rejected')}>
            Reject
          </button>
        </div>
      )}
    </article>
  )
}

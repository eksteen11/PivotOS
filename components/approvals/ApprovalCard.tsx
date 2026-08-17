'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
    <article className="rounded-2xl border border-accent/15 bg-white/95 p-5 shadow-deck sm:p-7">
      <div className="border-b border-black/[0.07] pb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          Proposed by {approval.agents?.name ?? 'Pivot agent'}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.12em] text-muted">{approval.entities?.name ?? 'Selected business'}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">{approval.action_type.replace(/_/g, ' ')}</h2>
      </div>
      <div className="space-y-5 py-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Reason</p>
          <p className="mt-2 text-sm leading-6">{approval.reason}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Evidence</p>
          <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-xl bg-[#f5f2eb] p-3 text-xs leading-5 text-muted">
            {JSON.stringify(approval.payload, null, 2)}
          </pre>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Risk</p>
          <p className="mt-2 text-sm capitalize">{approval.risk_level} risk · execution remains blocked until you decide.</p>
        </div>
      </div>
      {approval.status === 'pending' && (
        <div className="space-y-3 border-t border-black/[0.07] pt-5">
          <button type="button" className="btn-primary w-full" disabled={busy} onClick={() => act('approved')}>
            {busy ? 'Working…' : '✓ Approve request'}
          </button>
          <button type="button" className="mx-auto block min-h-10 px-4 text-xs font-bold uppercase tracking-[0.18em] text-muted hover:text-danger" disabled={busy} onClick={() => act('rejected')}>
            Reject
          </button>
        </div>
      )}
    </article>
  )
}

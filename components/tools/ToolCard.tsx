import { StatusBadge } from '@/components/cards/StatusBadge'
import type { Tool, ToolConnection } from '@/lib/types/database'

export function ToolCard({ tool, connection }: { tool: Tool; connection?: ToolConnection }) {
  const status = connection?.status ?? 'disconnected'
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{tool.name}</h3>
        <StatusBadge label={status} tone={status} />
      </div>
      <p className="text-sm text-muted">{tool.provider} · {tool.category}</p>
      {connection?.connected_account ? (
        <p className="mt-2 text-xs text-muted">{connection.connected_account}</p>
      ) : (
        <button type="button" className="btn-secondary mt-4 text-sm" disabled>
          Connect (placeholder)
        </button>
      )}
    </article>
  )
}

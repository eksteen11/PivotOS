import { StatusBadge } from '@/components/cards/StatusBadge'
import type { Tool, ToolConnection } from '@/lib/types/database'

export function ToolCard({
  tool,
  connection,
}: {
  tool: Tool
  connection?: ToolConnection
}) {
  const status = connection?.status ?? 'disconnected'

  return (
    <article className="rounded-2xl border border-black/[0.07] bg-white/85 p-5 shadow-deck">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{tool.name}</h3>
        <StatusBadge label={status} tone={status} />
      </div>
      <p className="text-sm text-muted">{tool.provider} · {tool.category}</p>
      {connection?.connected_account ? (
        <p className="mt-2 text-xs text-muted">{connection.connected_account}</p>
      ) : (
        <p className="mt-4 rounded-xl bg-[#f5f2eb] px-3 py-2 text-xs text-muted">
          Not connected · credentials and live OAuth are required.
        </p>
      )}
      {connection?.last_sync_at ? (
        <p className="mt-2 text-xs text-muted">Last sync {new Date(connection.last_sync_at).toLocaleString()}</p>
      ) : null}
    </article>
  )
}

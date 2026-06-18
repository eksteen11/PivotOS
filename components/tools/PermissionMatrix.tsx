import { StatusBadge } from '@/components/cards/StatusBadge'

type Row = {
  id: string
  permission_level: string
  tool_connections?: { tools?: { name: string } }
}

export function PermissionMatrix({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="text-sm text-muted">No tool permissions assigned yet.</p>
  return (
    <div className="overflow-hidden rounded-xl border border-black/5">
      <table className="w-full text-sm">
        <thead className="bg-black/[0.02] text-left text-muted">
          <tr>
            <th className="px-4 py-2 font-medium">Tool</th>
            <th className="px-4 py-2 font-medium">Permission</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-black/5">
              <td className="px-4 py-3">{r.tool_connections?.tools?.name ?? '—'}</td>
              <td className="px-4 py-3">
                <StatusBadge label={r.permission_level.replace(/_/g, ' ')} tone="normal" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

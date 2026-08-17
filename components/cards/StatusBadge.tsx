import clsx from 'clsx'

const styles: Record<string, string> = {
  urgent: 'bg-danger/10 text-danger border-danger/20',
  high: 'bg-danger/10 text-danger border-danger/20',
  normal: 'bg-black/[0.04] text-muted border-black/10',
  low: 'bg-accent/10 text-accent border-accent/20',
  active: 'bg-accent/10 text-accent border-accent/20',
  paused: 'bg-warn/10 text-warn border-warn/20',
  blocked: 'bg-warn/10 text-warn border-warn/20',
  waiting: 'bg-warn/10 text-warn border-warn/20',
  pending: 'bg-warn/10 text-warn border-warn/20',
  approved: 'bg-accent/10 text-accent border-accent/20',
  rejected: 'bg-danger/10 text-danger border-danger/20',
  disconnected: 'bg-black/[0.04] text-muted border-black/10',
  connected: 'bg-accent/10 text-accent border-accent/20',
}

export function StatusBadge({ label, tone = 'normal' }: { label: string; tone?: string }) {
  return (
    <span className={clsx('inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', styles[tone] ?? styles.normal)}>
      {label}
    </span>
  )
}

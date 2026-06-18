import clsx from 'clsx'

const styles: Record<string, string> = {
  urgent: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-red-50 text-red-700 border-red-200',
  normal: 'bg-gray-50 text-gray-600 border-gray-200',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  active: 'bg-teal-50 text-teal-700 border-teal-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  blocked: 'bg-orange-50 text-orange-700 border-orange-200',
  waiting: 'bg-blue-50 text-blue-700 border-blue-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  disconnected: 'bg-gray-50 text-gray-500 border-gray-200',
  connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export function StatusBadge({ label, tone = 'normal' }: { label: string; tone?: string }) {
  return (
    <span className={clsx('inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', styles[tone] ?? styles.normal)}>
      {label}
    </span>
  )
}

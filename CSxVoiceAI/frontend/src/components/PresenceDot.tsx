import { cn } from '@/lib/utils'
import type { PresenceStatus } from '@/lib/csxiq-data'

export const PRESENCE_META: Record<PresenceStatus, { label: string; color: string }> = {
  available: { label: 'Active', color: 'emerald' },
  busy: { label: 'Busy', color: 'red' },
  away: { label: 'AFK', color: 'amber' },
}

// Three states only: green = active, red = busy, yellow = AFK.
export default function PresenceDot({
  status,
  size = 'md',
}: {
  status: PresenceStatus
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
  const bg =
    status === 'available' ? 'bg-emerald-500' : status === 'busy' ? 'bg-red-500' : 'bg-amber-400'

  return <span className={cn('inline-flex rounded-full flex-shrink-0', dim, bg)} />
}

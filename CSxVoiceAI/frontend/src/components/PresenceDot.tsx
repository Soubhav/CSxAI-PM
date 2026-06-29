import { cn } from '@/lib/utils'
import type { PresenceStatus } from '@/lib/csxiq-data'

export const PRESENCE_META: Record<PresenceStatus, { label: string; color: string }> = {
  available: { label: 'Available', color: 'emerald' },
  busy: { label: 'Busy', color: 'red' },
  presenting: { label: 'Presenting', color: 'red' },
}

// Green dot = available, red dot = busy, red dot with a hyphen = presenting.
export default function PresenceDot({
  status,
  size = 'md',
}: {
  status: PresenceStatus
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
  const bg = status === 'available' ? 'bg-emerald-400' : 'bg-red-400'

  return (
    <span className={cn('relative inline-flex items-center justify-center rounded-full flex-shrink-0', dim, bg)}>
      {status === 'presenting' && (
        <span className="absolute h-[1.5px] w-[55%] rounded-full bg-background" />
      )}
    </span>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Headset,
  Inbox,
  PhoneOutgoing,
  Radio,
  ChevronDown,
  ArrowUpRight,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CALLBACKS, ESCALATIONS, type PresenceStatus } from '@/lib/csxiq-data'
import PresenceDot, { PRESENCE_META } from './PresenceDot'

const pendingCallbacks = CALLBACKS.filter((c) => c.status === 'pending').length
const liveEscalations = ESCALATIONS.length

const navGroups = [
  {
    label: 'WORKSPACE',
    items: [
      { label: 'Home', href: '/csxiq', icon: Inbox },
      { label: 'Callbacks', href: '/csxiq/callbacks', icon: PhoneOutgoing, badge: `${pendingCallbacks}`, tone: 'amber' },
      { label: 'Live Escalations', href: '/csxiq/escalations', icon: Radio, badge: `${liveEscalations} live`, tone: 'emerald' },
    ],
  },
]

export default function CsxiqSidebar() {
  const pathname = usePathname()
  const [status, setStatus] = useState<PresenceStatus>('available')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="fixed top-0 left-0 h-screen w-60 flex flex-col z-50 border-r border-border"
      style={{ background: 'oklch(0.10 0.02 265)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Headset className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-foreground font-bold text-lg leading-tight tracking-tight">CSxIQ</div>
            <div className="text-muted-foreground text-xs mt-0.5">AI Assist · Support Desk</div>
          </div>
        </div>
      </div>

      {/* Org */}
      <div className="px-3 py-3 border-b border-border">
        <div className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="flex-1 text-left text-sm font-medium text-foreground truncate">Lakeside CU</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon, badge, tone }: any) => {
                const isActive = href === '/csxiq' ? pathname === '/csxiq' : pathname.startsWith(href)
                const toneCls =
                  tone === 'amber'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className={cn('flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full border', toneCls)}>
                        {tone === 'emerald' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Cross-link back to CSxAI analytics */}
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">Analytics</p>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">Open CSxAI</span>
          </Link>
        </div>
      </nav>

      {/* Presence + user */}
      <div className="px-3 py-3 border-t border-border relative">
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-popover border border-border rounded-xl p-1 shadow-xl">
            {(Object.keys(PRESENCE_META) as PresenceStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s)
                  setMenuOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                  status === s ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <PresenceDot status={s} />
                <span>{PRESENCE_META[s].label}</span>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">M</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-[oklch(0.10_0.02_265)] rounded-full">
              <PresenceDot status={status} size="sm" />
            </span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium text-foreground truncate">Maya Patel</p>
            <p className="text-xs text-muted-foreground">{PRESENCE_META[status].label}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}

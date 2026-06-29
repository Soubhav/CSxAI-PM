'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Headset,
  Inbox,
  PhoneOutgoing,
  Radio,
  ChevronsUpDown,
  ArrowUpRight,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CALLBACKS, ESCALATIONS, type PresenceStatus } from '@/lib/csxiq-data'
import PresenceDot, { PRESENCE_META } from './PresenceDot'

const pendingCallbacks = CALLBACKS.filter((c) => c.status === 'pending').length
const liveEscalations = ESCALATIONS.length

const nav = [
  { label: 'Home', href: '/csxiq', icon: Inbox },
  { label: 'Callbacks', href: '/csxiq/callbacks', icon: PhoneOutgoing, count: pendingCallbacks },
  { label: 'Live Escalations', href: '/csxiq/escalations', icon: Radio, live: liveEscalations },
]

export default function CsxiqSidebar() {
  const pathname = usePathname()
  const [status, setStatus] = useState<PresenceStatus>('available')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 h-screen w-60 flex flex-col z-50 bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
            <Headset className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-slate-900 font-semibold text-[15px] tracking-tight">CSxIQ</div>
            <div className="text-slate-400 text-[11px]">AI Assist · Support Desk</div>
          </div>
        </div>
      </div>

      {/* Org */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50/60">
          <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-semibold text-white">L</span>
          </div>
          <span className="flex-1 text-left text-[13px] font-medium text-slate-700 truncate">Lakeside CU</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <p className="px-2.5 mb-1 mt-1 text-[11px] font-medium text-slate-400">Workspace</p>
        <div className="space-y-0.5">
          {nav.map(({ label, href, icon: Icon, count, live }) => {
            const isActive = href === '/csxiq' ? pathname === '/csxiq' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors',
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive ? 'text-slate-900' : 'text-slate-400')} />
                <span className="flex-1">{label}</span>
                {count ? (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-1.5 py-px tabular-nums">
                    {count}
                  </span>
                ) : null}
                {live ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {live}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>

        <p className="px-2.5 mb-1 mt-5 text-[11px] font-medium text-slate-400">Analytics</p>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <ArrowUpRight className="w-[18px] h-[18px] flex-shrink-0 text-slate-400" />
          <span className="flex-1">Open CSxAI</span>
        </Link>
      </nav>

      {/* Presence + user */}
      <div className="px-3 py-3 border-t border-slate-100 relative">
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-slate-200 rounded-xl p-1 shadow-lg shadow-slate-200/60">
            {(Object.keys(PRESENCE_META) as PresenceStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s)
                  setMenuOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors',
                  status === s ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <PresenceDot status={s} />
                <span className="flex-1 text-left">{PRESENCE_META[s].label}</span>
                {status === s && <Check className="w-3.5 h-3.5 text-slate-900" />}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-full flex items-center gap-2.5 px-1.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-slate-600">MP</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full">
              <PresenceDot status={status} size="sm" />
            </span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[13px] font-medium text-slate-900 truncate leading-tight">Maya Patel</p>
            <p className="text-[11px] text-slate-400">{PRESENCE_META[status].label}</p>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}

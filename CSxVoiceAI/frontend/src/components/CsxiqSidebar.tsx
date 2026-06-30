'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Headset,
  Inbox,
  PhoneOutgoing,
  Radio,
  Clock,
  BookOpen,
  ShieldCheck,
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
  { label: 'History', href: '/csxiq/history', icon: Clock },
  { label: 'Knowledge Base', href: '/csxiq/knowledge', icon: BookOpen },
]

export default function CsxiqSidebar() {
  const pathname = usePathname()
  const [status, setStatus] = useState<PresenceStatus>('available')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 h-screen w-60 flex flex-col z-50 bg-[#F7F6F5] border-r border-[#E9E9E7]">
      {/* Logo */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-[#EFEEEC] transition-colors cursor-default">
          <div className="w-[22px] h-[22px] rounded-md bg-[#37352F] flex items-center justify-center flex-shrink-0">
            <Headset className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <div className="text-[#37352F] font-semibold text-[14px] tracking-tight">CSxIQ</div>
          </div>
          <span className="text-[10px] text-[#9B9A97]">Lakeside CU</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <p className="px-2 mb-1 mt-1 text-[11px] font-medium text-[#9B9A97]">Workspace</p>
        <div className="space-y-px">
          {nav.map(({ label, href, icon: Icon, count, live }) => {
            const isActive = href === '/csxiq' ? pathname === '/csxiq' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[14px] transition-colors',
                  isActive
                    ? 'bg-[#EAEAE8] text-[#37352F] font-medium'
                    : 'text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F]'
                )}
              >
                <Icon className={cn('w-[17px] h-[17px] flex-shrink-0', isActive ? 'text-[#37352F]' : 'text-[#9B9A97]')} />
                <span className="flex-1 truncate">{label}</span>
                {count ? (
                  <span className="text-[11px] font-medium text-[#9B7B2E] bg-[#FBF3DB] rounded px-1.5 py-px tabular-nums">{count}</span>
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

        <p className="px-2 mb-1 mt-5 text-[11px] font-medium text-[#9B9A97]">More</p>
        <div className="space-y-px">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[14px] text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F] transition-colors"
          >
            <ShieldCheck className="w-[17px] h-[17px] flex-shrink-0 text-[#9B9A97]" />
            <span className="flex-1">Admin portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C7C6C2]" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[14px] text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F] transition-colors"
          >
            <ArrowUpRight className="w-[17px] h-[17px] flex-shrink-0 text-[#9B9A97]" />
            <span className="flex-1">Open CSxAI</span>
          </Link>
        </div>
      </nav>

      {/* Presence + user */}
      <div className="px-3 py-2.5 border-t border-[#E9E9E7] relative">
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-[#E9E9E7] rounded-lg p-1 shadow-[0_8px_24px_rgba(15,15,15,0.12)]">
            <p className="px-2 py-1 text-[10px] font-medium text-[#9B9A97] uppercase tracking-wide">Set status</p>
            {(Object.keys(PRESENCE_META) as PresenceStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s)
                  setMenuOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[14px] transition-colors',
                  status === s ? 'bg-[#F1F0EE] text-[#37352F]' : 'text-[#787774] hover:bg-[#F1F0EE]'
                )}
              >
                <PresenceDot status={s} />
                <span className="flex-1 text-left">{PRESENCE_META[s].label}</span>
                {status === s && <Check className="w-3.5 h-3.5 text-[#37352F]" />}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-[#EFEEEC] transition-colors"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-[#EAEAE8] flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-[#787774]">MP</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-[#F7F6F5] rounded-full">
              <PresenceDot status={status} size="sm" />
            </span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[13px] font-medium text-[#37352F] truncate leading-tight">Maya Patel</p>
            <p className="text-[11px] text-[#9B9A97]">{PRESENCE_META[status].label}</p>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-[#9B9A97] flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}

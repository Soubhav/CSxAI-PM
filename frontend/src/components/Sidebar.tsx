'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Lightbulb,
  PhoneCall,
  Bot,
  FlaskConical,
  Radio,
  Wrench,
  Headphones,
  Building2,
  ChevronDown,
  BookOpen,
  ClipboardCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'ANALYTICS',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Insights', href: '/insights', icon: Lightbulb },
      { label: 'Call Logs', href: '/call-logs', icon: PhoneCall },
    ],
  },
  {
    label: 'AGENTS',
    items: [
      { label: 'Agent Canvas', href: '/scenarios', icon: Bot },
      { label: 'Sandbox', href: '/sandbox', icon: FlaskConical },
      { label: 'Knowledge', href: '/knowledge', icon: BookOpen },
      { label: 'Tools', href: '/tools', icon: Wrench },
    ],
  },
  {
    label: 'MONITOR',
    items: [
      { label: 'Live Monitor', href: '/live-monitor', icon: Radio, badge: '3 live' },
    ],
  },
  {
    label: 'REVIEW',
    items: [
      { label: 'Evaluations', href: '/evaluations', icon: ClipboardCheck },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 h-screen w-60 flex flex-col z-50 border-r border-border"
      style={{ background: 'oklch(0.10 0.02 265)' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Headphones className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-foreground font-bold text-lg leading-tight tracking-tight">CSxAI</div>
            <div className="text-muted-foreground text-xs mt-0.5">Credit Union AI</div>
          </div>
        </div>
      </div>

      {/* Organization selector */}
      <div className="px-3 py-3 border-b border-border">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="flex-1 text-left text-sm font-medium text-foreground truncate">Lakeside CU</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon, badge }: { label: string; href: string; icon: any; badge?: string }) => {
                const isActive =
                  href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 text-xs font-medium px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom user area */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-2.5 px-3">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">S</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">Sarah Chen</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" title="System healthy" />
        </div>
      </div>
    </div>
  )
}

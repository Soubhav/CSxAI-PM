'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck, LayoutGrid, Users, Plug, BookOpen, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Overview', href: '/admin', icon: LayoutGrid },
  { label: 'Customer Support Reps', href: '/admin/csrs', icon: Users },
  { label: 'Integrations', href: '/admin/integrations', icon: Plug },
  { label: 'Knowledge Base', href: '/csxiq/knowledge', icon: BookOpen, external: true },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 h-screen w-60 flex flex-col z-50 bg-[#F7F6F5] border-r border-[#E9E9E7]">
      {/* Logo */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-default">
          <div className="w-[22px] h-[22px] rounded-md bg-[#37352F] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <div className="text-[#37352F] font-semibold text-[14px] tracking-tight">CSxIQ Admin</div>
          </div>
          <span className="text-[10px] text-[#9B9A97]">Lakeside CU</span>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        <p className="px-2 mb-1 mt-1 text-[11px] font-medium text-[#9B9A97]">Manage</p>
        <div className="space-y-px">
          {nav.map(({ label, href, icon: Icon, external }) => {
            const isActive = !external && (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[14px] transition-colors',
                  isActive ? 'bg-[#EAEAE8] text-[#37352F] font-medium' : 'text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F]'
                )}
              >
                <Icon className={cn('w-[17px] h-[17px] flex-shrink-0', isActive ? 'text-[#37352F]' : 'text-[#9B9A97]')} />
                <span className="flex-1">{label}</span>
                {external && <ArrowUpRight className="w-3.5 h-3.5 text-[#C7C6C2]" />}
              </Link>
            )
          })}
        </div>

        <p className="px-2 mb-1 mt-5 text-[11px] font-medium text-[#9B9A97]">More</p>
        <Link
          href="/csxiq"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[14px] text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F] transition-colors"
        >
          <ArrowUpRight className="w-[17px] h-[17px] flex-shrink-0 text-[#9B9A97]" />
          <span className="flex-1">Back to CSxIQ</span>
        </Link>
      </nav>

      <div className="px-3 py-2.5 border-t border-[#E9E9E7]">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-[#EAEAE8] flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-semibold text-[#787774]">NP</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-[#37352F] truncate leading-tight">Nina Powell</p>
            <p className="text-[11px] text-[#9B9A97]">Team Lead · Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

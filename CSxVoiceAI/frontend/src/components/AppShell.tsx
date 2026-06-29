'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Sidebar from './Sidebar'
import CsxiqSidebar from './CsxiqSidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCsxiq = pathname.startsWith('/csxiq')

  return (
    <div className={cn('flex min-h-screen', isCsxiq ? 'bg-[#FAFAFA]' : 'bg-background')}>
      {isCsxiq ? <CsxiqSidebar /> : <Sidebar />}
      <main className={cn('ml-60 flex-1 min-h-screen', isCsxiq ? 'bg-[#FAFAFA] text-slate-900' : 'bg-background')}>
        {children}
      </main>
    </div>
  )
}

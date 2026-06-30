'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Sidebar from './Sidebar'
import CsxiqSidebar from './CsxiqSidebar'
import AdminSidebar from './AdminSidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCsxiq = pathname.startsWith('/csxiq')
  const isAdmin = pathname.startsWith('/admin')
  const light = isCsxiq || isAdmin

  return (
    <div className={cn('flex min-h-screen', light ? 'bg-white' : 'bg-background')}>
      {isAdmin ? <AdminSidebar /> : isCsxiq ? <CsxiqSidebar /> : <Sidebar />}
      <main className={cn('ml-60 flex-1 min-h-screen', light ? 'bg-white text-[#37352F]' : 'bg-background')}>
        {children}
      </main>
    </div>
  )
}

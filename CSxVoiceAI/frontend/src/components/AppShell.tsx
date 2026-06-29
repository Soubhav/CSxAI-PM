'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import CsxiqSidebar from './CsxiqSidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCsxiq = pathname.startsWith('/csxiq')

  return (
    <div className="flex min-h-screen bg-background">
      {isCsxiq ? <CsxiqSidebar /> : <Sidebar />}
      <main className="ml-60 flex-1 min-h-screen bg-background">{children}</main>
    </div>
  )
}

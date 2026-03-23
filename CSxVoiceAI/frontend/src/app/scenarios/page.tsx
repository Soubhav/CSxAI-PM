'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AGENTS } from '@/lib/mock-data'
import { Mic, MessageSquare, Layers, Plus, Search, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const typeConfig = {
  voice: { label: 'Voice', icon: Mic, bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/25' },
  chat: { label: 'Chat', icon: MessageSquare, bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/25' },
  'multi-modal': { label: 'Multi-modal', icon: Layers, bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/25' },
}

export default function ScenariosPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newAgentType, setNewAgentType] = useState<'voice' | 'chat' | 'multi-modal'>('voice')

  const filtered = AGENTS.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agents</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your AI agents and their configurations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New agent
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/40 border-b border-border/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Agent type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Resolution</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">FCR</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Last updated</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((agent) => {
              const tc = typeConfig[agent.type]
              return (
                <tr key={agent.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors group">
                  <td className="px-5 py-4">
                    <Link href={`/scenarios/${agent.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      {agent.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{agent.description}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', tc.bg, tc.text, tc.border)}>
                      <tc.icon className="w-3 h-3" />
                      {tc.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {agent.status === 'active' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                          </span>
                          <span className="text-xs text-emerald-400 font-medium">Active</span>
                        </>
                      ) : agent.status === 'testing' ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-xs text-amber-400 font-medium">Testing</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                          <span className="text-xs text-muted-foreground font-medium">Inactive</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground">{agent.resolutionRate > 0 ? `${agent.resolutionRate}%` : '—'}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{agent.fcrRate > 0 ? `${agent.fcrRate}%` : '—'}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{agent.lastUpdated}</td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/sandbox?agent=${agent.id}`}
                      className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                    >
                      Go to sandbox →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* New Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Create new agent</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Name</label>
                <input type="text" placeholder="My agent" className="w-full h-9 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Description</label>
                <textarea placeholder="Describe what your agent does..." className="w-full rounded-lg border border-border bg-secondary p-3 text-sm text-foreground resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">Agent type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['chat', 'voice', 'multi-modal'] as const).map((t) => {
                    const cfg = typeConfig[t]
                    return (
                      <button
                        key={t}
                        onClick={() => setNewAgentType(t)}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all',
                          newAgentType === t
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-secondary hover:bg-accent'
                        )}
                      >
                        <cfg.icon className={cn('w-5 h-5 mb-2', cfg.text)} />
                        <p className="text-sm font-medium text-foreground">{cfg.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t === 'chat' ? 'Text-based agent' : t === 'voice' ? 'Voice-enabled agent' : 'Voice + Chat'}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Relevant documents</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Drag files here or click to browse</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Create agent</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

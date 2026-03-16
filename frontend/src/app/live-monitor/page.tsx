'use client'

import { LIVE_CALLS, SCENARIO_LABELS } from '@/lib/mock-data'
import { Headphones, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDurationMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const activeCalls = LIVE_CALLS.filter((c) => c.status === 'in-progress')
const testingCalls = LIVE_CALLS.filter((c) => c.status === 'testing')

export default function LiveMonitorPage() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">Live Monitor</h1>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-sm font-semibold text-emerald-400">
                {LIVE_CALLS.length} active call{LIVE_CALLS.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Updates every 30 seconds — read only</p>
        </div>
        <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground bg-card border border-border rounded-lg px-3 py-2 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {LIVE_CALLS.map((call) => (
          <div key={call.id}
            className={cn('bg-card rounded-xl overflow-hidden border transition-all',
              call.status === 'in-progress' ? 'border-emerald-500/30' : 'border-amber-500/25')}
            style={call.status === 'in-progress' ? { boxShadow: '0 0 0 1px rgba(34,197,94,0.15), 0 0 20px rgba(34,197,94,0.06)' } : undefined}>
            <div className={cn('h-0.5', call.status === 'in-progress' ? 'bg-emerald-500' : 'bg-amber-500')} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {call.status === 'in-progress' ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">In Progress</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-xs text-amber-400 font-semibold">Testing</span>
                    </>
                  )}
                </div>
                <span className="text-xs text-muted-foreground bg-secondary border border-border px-2.5 py-0.5 rounded-full">
                  {SCENARIO_LABELS[call.scenario]}
                </span>
              </div>

              <div className="mb-5">
                <p className="font-bold text-foreground text-base">{call.memberName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={cn(
                    'flex items-center gap-1.5 text-sm font-mono font-semibold rounded-lg px-2.5 py-1.5',
                    call.status === 'in-progress'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                  )}>
                    <span className="text-xs opacity-70">Elapsed:</span>
                    <span>{formatDurationMMSS(call.duration)}</span>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border',
                    call.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                    call.sentiment === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/25' :
                    'bg-secondary text-muted-foreground border-border'
                  )}>
                    {call.sentiment}
                  </span>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/15 text-primary border border-primary/25 text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors"
                onClick={() => alert('Live listening coming in Phase 2')}
              >
                <Headphones className="w-4 h-4" /> Listen In
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">Session Summary</p>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{LIVE_CALLS.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Active</div>
          </div>
          <div className="text-center border-x border-border">
            <div className="text-3xl font-bold text-emerald-400">{activeCalls.length}</div>
            <div className="text-sm text-muted-foreground mt-1">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{testingCalls.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Testing</div>
          </div>
        </div>
      </div>
    </div>
  )
}

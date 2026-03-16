'use client'

import { useState } from 'react'
import { CALLS, SCENARIO_LABELS } from '@/lib/mock-data'
import type { Call, CallScenario } from '@/lib/mock-data'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Search, X, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDuration(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const statusStyle = {
  successful: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  partial: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  failed: 'bg-red-500/10 text-red-400 border-red-500/25',
}

const scoreColor = (s: number) => s >= 8 ? 'bg-emerald-400' : s >= 5 ? 'bg-amber-400' : 'bg-red-400'

export default function CallLogsPage() {
  const [search, setSearch] = useState('')
  const [scenarioFilter, setScenarioFilter] = useState<string>('all')
  const [escalatedOnly, setEscalatedOnly] = useState(false)
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)
  const [playPosition, setPlayPosition] = useState(0)

  const filtered = CALLS.filter((c) => {
    if (search && !c.memberName.toLowerCase().includes(search.toLowerCase())) return false
    if (scenarioFilter !== 'all' && c.scenario !== scenarioFilter) return false
    if (escalatedOnly && !c.escalated) return false
    return true
  })

  const stats = {
    total: CALLS.length,
    successful: CALLS.filter((c) => c.status === 'successful').length,
    partial: CALLS.filter((c) => c.status === 'partial').length,
    failed: CALLS.filter((c) => c.status === 'failed').length,
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Call Logs</h1>
        <p className="text-muted-foreground mt-1 text-sm">Review completed call recordings, transcripts, and outcomes</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Calls', value: stats.total, color: 'text-foreground' },
          { label: 'Successful', value: stats.successful, color: 'text-emerald-400' },
          { label: 'Partial', value: stats.partial, color: 'text-amber-400' },
          { label: 'Failed', value: stats.failed, color: 'text-red-400' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">{s.label}</p>
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by member name..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <select value={scenarioFilter} onChange={(e) => setScenarioFilter(e.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="all">All scenarios</option>
          {Object.entries(SCENARIO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={() => setEscalatedOnly(!escalatedOnly)}
          className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            escalatedOnly ? 'bg-red-500/15 text-red-400 border-red-500/25' : 'bg-card border-border text-muted-foreground hover:text-foreground')}>
          Escalated Only
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/40 border-b border-border/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Member</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Scenario</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Time</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Duration</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">NPS</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Escalated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((call) => (
              <tr key={call.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{call.memberName}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{SCENARIO_LABELS[call.scenario]}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatTime(call.startTime)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{formatDuration(call.duration)}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', statusStyle[call.status])}>
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('w-2 h-2 rounded-full', scoreColor(call.overallScore))} />
                    <span className="text-sm text-foreground">{call.overallScore}/10</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{call.npsScore !== null ? call.npsScore : '—'}</td>
                <td className="px-4 py-3">
                  {call.escalated ? (
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/25">Escalated</span>
                      {call.escalationPath && <p className="text-xs text-muted-foreground/60 mt-0.5">{call.escalationPath}</p>}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => { setSelectedCall(call); setPlayPosition(0) }}
                    className="text-xs text-primary font-medium hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Call Detail Drawer */}
      <Sheet open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <SheetContent className="w-[520px] sm:max-w-[520px] overflow-y-auto bg-card border-l border-border">
          {selectedCall && (
            <>
              <SheetHeader>
                <SheetTitle className="text-foreground">{selectedCall.memberName}</SheetTitle>
                <p className="text-xs text-muted-foreground">{SCENARIO_LABELS[selectedCall.scenario]} · {formatTime(selectedCall.startTime)} · {formatDuration(selectedCall.duration)}</p>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Signal Scores */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Resolution', value: selectedCall.resolutionRate ? 'Resolved' : 'Unresolved', color: selectedCall.resolutionRate ? 'text-emerald-400' : 'text-red-400' },
                    { label: 'Sentiment', value: selectedCall.sentimentScore, color: selectedCall.sentimentScore === 'positive' ? 'text-emerald-400' : selectedCall.sentimentScore === 'neutral' ? 'text-amber-400' : 'text-red-400' },
                    { label: 'Efficiency', value: selectedCall.efficiencyScore, color: selectedCall.efficiencyScore === 'faster' ? 'text-emerald-400' : selectedCall.efficiencyScore === 'same' ? 'text-amber-400' : 'text-red-400' },
                  ].map((s) => (
                    <div key={s.label} className="bg-secondary border border-border rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                      <p className={cn('text-sm font-bold capitalize', s.color)}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Overall Score */}
                <div className={cn('p-3 rounded-xl text-center', selectedCall.overallScore >= 8 ? 'bg-emerald-500/10 border border-emerald-500/25' : selectedCall.overallScore >= 5 ? 'bg-amber-500/10 border border-amber-500/25' : 'bg-red-500/10 border border-red-500/25')}>
                  <span className="text-lg font-bold text-foreground">{selectedCall.overallScore}/10</span>
                  <span className="text-xs text-muted-foreground ml-2">Overall Score</span>
                  {selectedCall.npsScore !== null && <span className="text-xs text-muted-foreground ml-3">NPS: {selectedCall.npsScore}</span>}
                </div>

                {/* Summary */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">AI Summary</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedCall.summary}</p>
                </div>

                {/* Escalation Timeline */}
                {selectedCall.escalated && selectedCall.escalationPath && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Escalation</p>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                      <p className="text-sm text-red-400 font-medium">{selectedCall.escalationPath}</p>
                      {selectedCall.agentOutcome && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Resolved: <span className={selectedCall.agentOutcome.resolvedByAgent ? 'text-emerald-400' : 'text-red-400'}>{selectedCall.agentOutcome.resolvedByAgent ? 'Yes' : 'No'}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Time to resolve: <span className="text-foreground">{Math.floor(selectedCall.agentOutcome.timeToResolveSeconds / 60)}m {selectedCall.agentOutcome.timeToResolveSeconds % 60}s</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Bot summary: <span className={cn('capitalize', selectedCall.agentOutcome.botSummaryAccuracy === 'accurate' ? 'text-emerald-400' : 'text-amber-400')}>{selectedCall.agentOutcome.botSummaryAccuracy}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">{selectedCall.agentOutcome.agentNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tools */}
                {selectedCall.toolsUsed.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tools Used</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCall.toolsUsed.map((t) => (
                        <span key={t} className="text-xs bg-primary/10 text-primary border border-primary/25 px-2.5 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recording */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recording</p>
                  <div className="bg-secondary border border-border rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setPlayPosition((p) => p > 0 ? 0 : 40)}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition-colors">
                        <Play className="w-3.5 h-3.5 text-primary-foreground ml-0.5" />
                      </button>
                      <div className="flex-1 flex items-end gap-0.5 h-6">
                        {Array.from({ length: 40 }).map((_, i) => {
                          const h = 30 + Math.random() * 70
                          return (
                            <div key={i} className="flex-1 rounded-full transition-colors"
                              style={{ height: `${h}%`, background: i < playPosition ? '#7c3aed' : 'rgba(255,255,255,0.12)' }} />
                          )
                        })}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{formatDuration(selectedCall.duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Transcript */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Transcript</p>
                  <div className="space-y-3">
                    {selectedCall.transcript.map((line, i) => (
                      <div key={i} className={cn('flex flex-col max-w-[85%]', line.speaker === 'member' ? 'self-end items-end ml-auto' : 'self-start items-start')}>
                        {line.speaker === 'agent' && <span className="text-xs text-muted-foreground mb-0.5 px-1">CSxAI Agent</span>}
                        <div className={cn('rounded-2xl px-3 py-2 text-xs leading-relaxed',
                          line.speaker === 'agent'
                            ? 'bg-secondary text-foreground rounded-tl-sm border border-border'
                            : 'bg-primary text-primary-foreground rounded-tr-sm'
                        )}>
                          {line.text}
                        </div>
                        <span className="text-[10px] text-muted-foreground/50 mt-0.5 px-1">{formatDuration(line.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

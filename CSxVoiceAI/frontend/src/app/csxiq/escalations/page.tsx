'use client'

import { useEffect, useState } from 'react'
import { ESCALATIONS, type Escalation } from '@/lib/csxiq-data'
import {
  Radio,
  PhoneCall,
  Sparkles,
  User,
  Clock,
  AlertTriangle,
  ArrowRight,
  Mic,
  PhoneOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const priorityMeta: Record<Escalation['priority'], { label: string; cls: string }> = {
  urgent: { label: 'Urgent', cls: 'bg-red-500/10 text-red-400 border-red-500/25' },
  high: { label: 'High', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/25' },
  normal: { label: 'Normal', cls: 'bg-sky-500/10 text-sky-400 border-sky-500/25' },
}

function fmtClock(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${(s % 60).toString().padStart(2, '0')}`
}

export default function EscalationsPage() {
  const [selectedId, setSelectedId] = useState(ESCALATIONS[0].id)
  const [joined, setJoined] = useState(false)
  const [callSeconds, setCallSeconds] = useState(0)
  const [accept, setAccept] = useState(ESCALATIONS[0].acceptWindowSeconds)

  const selected = ESCALATIONS.find((e) => e.id === selectedId)!

  // reset on select
  useEffect(() => {
    setJoined(false)
    setCallSeconds(0)
    setAccept(selected.acceptWindowSeconds)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  // accept-window countdown
  useEffect(() => {
    if (joined || accept <= 0) return
    const t = setInterval(() => setAccept((a) => Math.max(0, a - 1)), 1000)
    return () => clearInterval(t)
  }, [joined, accept])

  // live timer once joined
  useEffect(() => {
    if (!joined) return
    const t = setInterval(() => setCallSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [joined])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Waiting list */}
      <div className="w-[360px] flex-shrink-0 border-r border-border flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <h1 className="text-xl font-bold text-foreground">Live Escalations</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">Voice handoffs from the CSxAI agent — claim within the accept window</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {ESCALATIONS.map((e) => {
            const pm = priorityMeta[e.priority]
            const isSel = e.id === selectedId
            return (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className={cn('w-full text-left rounded-xl border p-3 transition-all',
                  isSel ? 'border-primary/50 bg-primary/5' : 'border-border bg-card hover:bg-accent/30')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">{e.contactName}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', pm.cls)}>{pm.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{e.scenario}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> live
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground/80">
                    <Clock className="w-3 h-3" /> waiting {e.waitingSeconds}s
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Handoff detail */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{selected.contactName}</h2>
                <p className="text-xs text-muted-foreground">
                  {selected.scenario} · Member since {selected.context.memberSince} · {selected.context.accountType}
                </p>
              </div>
            </div>
            <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', priorityMeta[selected.priority].cls)}>
              {priorityMeta[selected.priority].label}
            </span>
          </div>

          {/* Trigger */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" /> {selected.trigger}
            </span>
            <span className="text-muted-foreground">Sentiment: {selected.context.sentiment}</span>
          </div>

          {/* AI summary handoff card — the add-on */}
          <div className="mt-5 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">AI Handoff Summary</p>
              <span className="ml-auto text-[10px] text-muted-foreground/60">Read before you join</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{selected.aiSummary}</p>
          </div>

          {/* Live transcript so far */}
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Conversation so far</p>
            <div className="space-y-2">
              {selected.liveTranscript.map((line, i) => (
                <div key={i} className={cn('flex flex-col max-w-[80%]', line.speaker === 'member' ? 'ml-auto items-end' : 'items-start')}>
                  {line.speaker === 'agent' && <span className="text-[10px] text-muted-foreground mb-0.5 px-1">CSxAI Agent</span>}
                  <div className={cn('rounded-2xl px-3 py-2 text-xs leading-relaxed',
                    line.speaker === 'agent' ? 'bg-secondary text-foreground rounded-tl-sm border border-border' : 'bg-primary text-primary-foreground rounded-tr-sm')}>
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join / live */}
          <div className="mt-6">
            {!joined ? (
              <div className="bg-card border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Member is on the line with the AI</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {accept > 0 ? <>Accept window — <span className="text-emerald-400 font-medium">{accept}s</span> left before it re-routes</> : 'Window expired — re-routing to next available CSR'}
                  </p>
                </div>
                <button
                  onClick={() => setJoined(true)}
                  disabled={accept <= 0}
                  className={cn('px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors',
                    accept > 0 ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-secondary text-muted-foreground cursor-not-allowed')}
                >
                  <PhoneCall className="w-4 h-4" /> Join call
                </button>
              </div>
            ) : (
              <div className="bg-card border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium text-foreground">You’re live with {selected.contactName}</span>
                  </div>
                  <span className="text-sm font-mono text-emerald-400">{fmtClock(callSeconds)}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 py-2 rounded-lg text-xs font-medium border bg-secondary text-muted-foreground border-border hover:text-foreground flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" /> Mute
                  </button>
                  <button onClick={() => setJoined(false)} className="ml-auto px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 flex items-center gap-1.5">
                    <PhoneOff className="w-3.5 h-3.5" /> End call
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

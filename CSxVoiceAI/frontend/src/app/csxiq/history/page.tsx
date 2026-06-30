'use client'

import { useEffect, useRef, useState } from 'react'
import {
  HISTORY,
  CALLABLE_STATUSES,
  CHANNEL_LABEL,
  type HistoryItem,
  type InteractionType,
  type InteractionStatus,
  type Sentiment,
} from '@/lib/csxiq-data'
import {
  Search,
  X,
  PhoneOutgoing,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  Radio,
  Sparkles,
  CheckCircle2,
  Mic,
  ArrowRight,
  RotateCcw,
  Clock,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const statusMeta: Record<InteractionStatus, { label: string; cls: string; dot: string }> = {
  resolved: { label: 'Resolved', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  unresolved: { label: 'Unresolved', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  unreachable: { label: 'Unreachable', cls: 'bg-[#F1F0EE] text-[#5F5E5B] border-[#E9E9E7]', dot: 'bg-[#9B9A97]' },
  followup: { label: 'Follow-up', cls: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  escalated: { label: 'Escalated', cls: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
}

const sentimentMeta: Record<Sentiment, { label: string; dot: string; text: string }> = {
  positive: { label: 'Positive', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  neutral: { label: 'Neutral', dot: 'bg-[#9B9A97]', text: 'text-[#787774]' },
  negative: { label: 'Negative', dot: 'bg-red-500', text: 'text-red-700' },
}

const typeMeta: Record<InteractionType, { label: string; icon: any }> = {
  callback: { label: 'Callback', icon: PhoneOutgoing },
  chat: { label: 'Chat', icon: MessageSquare },
  escalation: { label: 'Escalation', icon: Radio },
}

function isCallable(s: InteractionStatus) {
  return CALLABLE_STATUSES.includes(s)
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
function fmtClock(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${(s % 60).toString().padStart(2, '0')}`
}

type DialPhase = 'idle' | 'dialing' | 'connected' | 'disposition' | 'done'
type Outcome = 'connected' | 'no-answer' | 'voicemail' | 'busy'

const typeFilters: { key: 'all' | InteractionType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'chat', label: 'Chat' },
  { key: 'callback', label: 'Callback' },
  { key: 'escalation', label: 'Escalation' },
]

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>(HISTORY)
  const [typeFilter, setTypeFilter] = useState<'all' | InteractionType>('all')
  const [needsCallback, setNeedsCallback] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // dial machine for the open item
  const [phase, setPhase] = useState<DialPhase>('idle')
  const [callSeconds, setCallSeconds] = useState(0)
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null)
  const [notes, setNotes] = useState('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const selected = items.find((h) => h.id === selectedId) || null

  useEffect(() => {
    setPhase('idle')
    setCallSeconds(0)
    setLastOutcome(null)
    setNotes('')
    if (timerRef.current) clearInterval(timerRef.current)
  }, [selectedId])

  useEffect(() => {
    if (phase === 'connected') {
      timerRef.current = setInterval(() => setCallSeconds((s) => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase])

  function applyOutcome(o: Outcome) {
    setLastOutcome(o)
    if (o === 'connected') {
      setCallSeconds(0)
      setPhase('connected')
    } else {
      setPhase('idle')
    }
  }

  function resolveItem() {
    if (!selected) return
    setItems((prev) =>
      prev.map((h) =>
        h.id === selected.id
          ? { ...h, status: 'resolved', outcome: 'Resolved by callback', handledBy: 'Maya Patel', sentiment: 'positive' }
          : h
      )
    )
    setPhase('done')
  }

  const filtered = items.filter((h) => {
    if (typeFilter !== 'all' && h.type !== typeFilter) return false
    if (needsCallback && !isCallable(h.status)) return false
    if (search && !h.contactName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stats = {
    total: items.length,
    needsCallback: items.filter((h) => isCallable(h.status)).length,
    resolved: items.filter((h) => h.status === 'resolved').length,
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-7">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[#37352F] tracking-tight">History</h1>
            <p className="text-[#787774] text-[13px] mt-0.5">Every message and call — tagged by outcome. Call back any unresolved member from here.</p>
          </div>
          <div className="flex items-stretch rounded-xl border border-[#E9E9E7] bg-white divide-x divide-[#E9E9E7]">
            {[
              { label: 'Interactions', value: stats.total, color: 'text-[#37352F]' },
              { label: 'Needs callback', value: stats.needsCallback, color: 'text-amber-600' },
              { label: 'Resolved', value: stats.resolved, color: 'text-emerald-600' },
            ].map((s) => (
              <div key={s.label} className="px-5 py-2.5 text-center">
                <p className={cn('text-[19px] font-semibold tabular-nums leading-none', s.color)}>{s.value}</p>
                <p className="text-[11px] text-[#9B9A97] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mt-5">
          <div className="flex items-center bg-white border border-[#E9E9E7] rounded-lg p-0.5">
            {typeFilters.map((t) => (
              <button
                key={t.key}
                onClick={() => setTypeFilter(t.key)}
                className={cn('px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors',
                  typeFilter === t.key ? 'bg-[#37352F] text-white' : 'text-[#787774] hover:text-[#37352F]')}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setNeedsCallback((v) => !v)}
            className={cn('px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition-colors flex items-center gap-1.5',
              needsCallback ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-[#787774] border-[#E9E9E7] hover:text-[#37352F]')}
          >
            <PhoneOutgoing className="w-3.5 h-3.5" /> Needs callback
          </button>
          <div className="relative ml-auto w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9A97]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by member…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E9E9E7] bg-white text-[13px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#37352F]/10 focus:border-[#D6D5D2]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 bg-white border border-[#E9E9E7] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EFEEEC] text-left">
                {['Member', 'Type', 'Outcome', 'Sentiment', 'Handled by', 'Closed', ''].map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => {
                const sm = statusMeta[h.status]
                const tm = typeMeta[h.type]
                const sent = sentimentMeta[h.sentiment]
                const callable = isCallable(h.status)
                return (
                  <tr
                    key={h.id}
                    onClick={() => setSelectedId(h.id)}
                    className="border-b border-[#F1F0EE] last:border-0 hover:bg-[#F7F6F5] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-[13.5px] font-medium text-[#37352F]">{h.contactName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] text-[#787774]">
                        <tm.icon className="w-3.5 h-3.5 text-[#9B9A97]" /> {tm.label}
                        <span className="text-[#C7C6C2]">·</span> {CHANNEL_LABEL[h.channel]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11.5px] font-medium border', sm.cls)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sm.dot)} /> {h.outcome}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 text-[12.5px]', sent.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', sent.dot)} /> {sent.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-[#787774]">{h.handledBy}</td>
                    <td className="px-4 py-3 text-[12.5px] text-[#9B9A97] tabular-nums">{fmtTime(h.closedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {callable ? (
                        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-emerald-700">
                          <PhoneOutgoing className="w-3.5 h-3.5" /> Call back
                        </span>
                      ) : (
                        <span className="text-[12.5px] text-[#9B9A97]">View</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#9B9A97]">No interactions match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail drawer ───────────────────────────────────────── */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-[#37352F]/20 z-40" onClick={() => setSelectedId(null)} />
          <div className="fixed top-0 right-0 h-screen w-[560px] bg-white border-l border-[#E9E9E7] z-50 flex flex-col shadow-xl shadow-[#37352F]/10">
            <Drawer
              item={selected}
              phase={phase}
              callSeconds={callSeconds}
              lastOutcome={lastOutcome}
              notes={notes}
              onClose={() => setSelectedId(null)}
              onStartCall={() => setPhase('dialing')}
              onOutcome={applyOutcome}
              onNotes={setNotes}
              onEndCall={() => setPhase('disposition')}
              onResolve={resolveItem}
              onCloseDisposition={() => setPhase('done')}
              onRetry={() => setPhase('idle')}
            />
          </div>
        </>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────

function Drawer(props: {
  item: HistoryItem
  phase: DialPhase
  callSeconds: number
  lastOutcome: Outcome | null
  notes: string
  onClose: () => void
  onStartCall: () => void
  onOutcome: (o: Outcome) => void
  onNotes: (v: string) => void
  onEndCall: () => void
  onResolve: () => void
  onCloseDisposition: () => void
  onRetry: () => void
}) {
  const { item, phase, callSeconds, lastOutcome, notes } = props
  const sm = statusMeta[item.status]
  const tm = typeMeta[item.type]
  const sent = sentimentMeta[item.sentiment]
  const callable = isCallable(item.status)

  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#EFEEEC] flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F1F0EE] border border-[#E9E9E7] flex items-center justify-center">
            <User className="w-5 h-5 text-[#787774]" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-[#37352F] leading-tight">{item.contactName}</h2>
            <p className="text-[12px] text-[#787774]">
              <tm.icon className="w-3 h-3 inline -mt-0.5 mr-1 text-[#9B9A97]" />
              {tm.label} · {CHANNEL_LABEL[item.channel]} · {item.phoneMasked}
            </p>
          </div>
        </div>
        <button onClick={props.onClose} className="w-7 h-7 rounded-lg hover:bg-[#E9E9E7] flex items-center justify-center text-[#9B9A97] hover:text-[#4B4A45]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11.5px] font-medium border', sm.cls)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', sm.dot)} /> {item.outcome}
          </span>
          <span className={cn('inline-flex items-center gap-1.5 text-[12px]', sent.text)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', sent.dot)} /> {sent.label} sentiment
          </span>
          <span className="ml-auto text-[12px] text-[#9B9A97] flex items-center gap-1">
            <Clock className="w-3 h-3" /> {fmtTime(item.closedAt)} · {item.durationLabel}
          </span>
        </div>

        {/* Why still open (callable) */}
        {callable && item.whyOpen && (
          <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3">
            <p className="text-[10.5px] font-semibold text-amber-700 uppercase tracking-wider mb-1">Why this still needs a callback</p>
            <p className="text-[12.5px] text-amber-900/80">{item.whyOpen}</p>
          </div>
        )}

        {/* AI summary */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9B9A97]" />
            <p className="text-[11px] font-semibold text-[#787774] uppercase tracking-wider">AI Summary</p>
          </div>
          <p className="text-[13.5px] text-[#4B4A45] leading-relaxed">{item.summary}</p>
        </div>

        {/* Transcript */}
        <div>
          <p className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wider mb-2">Transcript</p>
          <div className="space-y-2">
            {item.transcript.map((line, i) => (
              <div key={i} className={cn('flex flex-col max-w-[82%]', line.speaker === 'member' ? 'ml-auto items-end' : 'items-start')}>
                {line.speaker !== 'member' && (
                  <span className="text-[10px] text-[#9B9A97] mb-0.5 px-1">{line.speaker === 'agent' ? 'CSxAI Agent' : 'CSR'}</span>
                )}
                <div className={cn('rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed',
                  line.speaker === 'member' ? 'bg-[#37352F] text-white rounded-tr-sm' : 'bg-[#F1F0EE] text-[#4B4A45] rounded-tl-sm')}>
                  {line.text}
                </div>
                <span className="text-[10px] text-[#C7C6C2] mt-0.5 px-1">{line.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div>
            <p className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wider mb-1.5">CSR Notes</p>
            <p className="text-[12.5px] text-[#5F5E5B] bg-[#F7F6F5] border border-[#E9E9E7] rounded-lg p-2.5">{item.notes}</p>
          </div>
        )}
      </div>

      {/* ── Action footer: the WebRTC callback journey ──────────── */}
      <div className="border-t border-[#EFEEEC] p-4">
        {/* resolved / non-callable */}
        {!callable && (
          <div className="text-[12.5px] text-[#787774] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            This interaction is closed — {item.outcome.toLowerCase()}.
          </div>
        )}

        {/* idle: offer the call */}
        {callable && props.phase === 'idle' && (
          <div className="flex items-center justify-between gap-3">
            <div>
              {lastOutcome && lastOutcome !== 'connected' ? (
                <p className="text-[12.5px] text-[#787774] flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Last try: <span className="capitalize text-[#4B4A45] font-medium">{lastOutcome.replace('-', ' ')}</span> — try again
                </p>
              ) : (
                <>
                  <p className="text-[13px] font-medium text-[#37352F]">Call {item.contactName} back</p>
                  <p className="text-[12px] text-[#787774]">WebRTC outbound · {item.phoneMasked}</p>
                </>
              )}
            </div>
            <button onClick={props.onStartCall} className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <PhoneOutgoing className="w-4 h-4" /> Call back
            </button>
          </div>
        )}

        {/* dialing */}
        {props.phase === 'dialing' && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-[13px] font-medium text-[#37352F] mt-2">Calling {item.contactName}…</p>
            <p className="text-[10px] text-[#C7C6C2] mt-3 uppercase tracking-[0.18em]">Demo · simulate outcome</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => props.onOutcome('connected')} className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[12.5px] font-medium hover:bg-emerald-100">Member answered</button>
              <button onClick={() => props.onOutcome('no-answer')} className="px-3 py-2 rounded-lg bg-[#F7F6F5] text-[#5F5E5B] border border-[#E9E9E7] text-[12.5px] font-medium hover:bg-[#E9E9E7]">No answer</button>
              <button onClick={() => props.onOutcome('voicemail')} className="px-3 py-2 rounded-lg bg-[#F7F6F5] text-[#5F5E5B] border border-[#E9E9E7] text-[12.5px] font-medium hover:bg-[#E9E9E7]">Voicemail</button>
              <button onClick={() => props.onOutcome('busy')} className="px-3 py-2 rounded-lg bg-[#F7F6F5] text-[#5F5E5B] border border-[#E9E9E7] text-[12.5px] font-medium hover:bg-[#E9E9E7]">Busy</button>
            </div>
          </div>
        )}

        {/* connected */}
        {props.phase === 'connected' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-[13px] font-medium text-[#37352F]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live with {item.contactName}
              </span>
              <span className="text-[13px] font-mono text-emerald-700 tabular-nums">{fmtClock(callSeconds)}</span>
            </div>
            {item.copilotSuggestion && (
              <div className="bg-[#F7F6F5] border border-[#E9E9E7] rounded-lg p-2.5 mb-2">
                <p className="text-[10.5px] font-semibold text-[#787774] uppercase tracking-wider mb-0.5 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Copilot</p>
                <p className="text-[12px] text-[#5F5E5B] leading-relaxed">{item.copilotSuggestion}</p>
              </div>
            )}
            <textarea
              value={notes}
              onChange={(e) => props.onNotes(e.target.value)}
              placeholder="Call notes…"
              className="w-full h-14 rounded-lg border border-[#E9E9E7] bg-white text-[12.5px] text-[#37352F] p-2 placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#37352F]/10 resize-none"
            />
            <div className="flex items-center gap-2 mt-2">
              <button className="px-3 py-2 rounded-lg text-[12.5px] font-medium border bg-white text-[#5F5E5B] border-[#E9E9E7] hover:bg-[#F1F0EE] flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Mute
              </button>
              <button onClick={props.onEndCall} className="ml-auto px-4 py-2 rounded-lg bg-red-600 text-white text-[12.5px] font-semibold hover:bg-red-700 flex items-center gap-1.5">
                <PhoneOff className="w-3.5 h-3.5" /> End &amp; wrap up
              </button>
            </div>
          </div>
        )}

        {/* disposition */}
        {props.phase === 'disposition' && (
          <div>
            <p className="text-[13px] font-medium text-[#37352F] mb-2">How did the callback end?</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={props.onResolve} className="px-3 py-2.5 rounded-lg text-[12.5px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Resolved
              </button>
              <button onClick={props.onCloseDisposition} className="px-3 py-2.5 rounded-lg text-[12.5px] font-medium border bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Follow-up
              </button>
              <button onClick={props.onCloseDisposition} className="px-3 py-2.5 rounded-lg text-[12.5px] font-medium border bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Escalate
              </button>
              <button onClick={props.onCloseDisposition} className="px-3 py-2.5 rounded-lg text-[12.5px] font-medium border bg-[#F7F6F5] text-[#5F5E5B] border-[#E9E9E7] hover:bg-[#E9E9E7] flex items-center gap-2">
                <PhoneOff className="w-4 h-4" /> Wrong number
              </button>
            </div>
          </div>
        )}

        {/* done */}
        {props.phase === 'done' && (
          item.status === 'resolved' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-emerald-700 font-medium text-[13px]">
                <CheckCircle2 className="w-4.5 h-4.5" /> Resolved by callback
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11.5px]">
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">Was: Unresolved</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9B9A97]" />
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">Resolved</span>
              </div>
              <p className="text-[11.5px] text-[#787774] mt-1.5">Status updated here and written back to CSxAI’s final resolution rate.</p>
            </div>
          ) : (
            <div className="text-[12.5px] text-[#5F5E5B] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#9B9A97]" /> Callback logged. Interaction updated.
            </div>
          )
        )}
      </div>
    </>
  )
}

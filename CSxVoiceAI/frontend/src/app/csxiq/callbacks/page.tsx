'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CALLBACKS,
  RESOLUTION_THRESHOLD,
  type Callback,
  type CallbackReason,
} from '@/lib/csxiq-data'
import {
  PhoneOutgoing,
  PhoneCall,
  PhoneOff,
  Voicemail,
  Lock,
  Clock,
  MessageSquare,
  Mail,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Mic,
  MicOff,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_ATTEMPTS = 3
const CSR = 'Maya Patel'

type Phase = 'review' | 'dialing' | 'connected' | 'fallback' | 'disposition' | 'done'
type Outcome = 'connected' | 'no-answer' | 'voicemail' | 'busy'
type Disposition = 'resolved' | 'follow-up' | 'escalate' | 'wrong-number'

const reasonMeta: Record<CallbackReason, { label: string; cls: string; dot: string }> = {
  dropped: { label: 'Dropped', cls: 'bg-sky-500/10 text-sky-400 border-sky-500/25', dot: 'bg-sky-400' },
  unresolved: { label: 'Unresolved', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/25', dot: 'bg-amber-400' },
}

function fmtClock(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${(s % 60).toString().padStart(2, '0')}`
}

export default function CallbacksPage() {
  const [items, setItems] = useState<Callback[]>(CALLBACKS)
  const [selectedId, setSelectedId] = useState<string>(CALLBACKS[0].id)

  // workspace machine (per selection)
  const [phase, setPhase] = useState<Phase>('review')
  const [attempts, setAttempts] = useState(0)
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null)
  const [callSeconds, setCallSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [notes, setNotes] = useState('')
  const [disposition, setDisposition] = useState<Disposition | null>(null)
  const [fallbackSent, setFallbackSent] = useState<null | 'sms' | 'email'>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const selected = items.find((c) => c.id === selectedId)!

  // reset machine when selection changes
  useEffect(() => {
    setPhase('review')
    setAttempts(selected.attempts)
    setLastOutcome(null)
    setCallSeconds(0)
    setMuted(false)
    setNotes('')
    setDisposition(null)
    setFallbackSent(null)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  // call timer
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

  function claim(id: string) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'claimed', claimedBy: CSR } : c)))
    setSelectedId(id)
  }

  function applyOutcome(o: Outcome) {
    setLastOutcome(o)
    if (o === 'connected') {
      setCallSeconds(0)
      setPhase('connected')
      return
    }
    const next = attempts + 1
    setAttempts(next)
    setPhase(next >= MAX_ATTEMPTS ? 'fallback' : 'review')
  }

  function finishDisposition(d: Disposition) {
    setDisposition(d)
    setPhase('done')
    setItems((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, status: d === 'resolved' ? 'resolved' : c.status, claimedBy: CSR }
          : c
      )
    )
  }

  function sendFallback(kind: 'sms' | 'email') {
    setFallbackSent(kind)
    setItems((prev) => prev.map((c) => (c.id === selectedId ? { ...c, status: 'unreachable', claimedBy: CSR } : c)))
  }

  const stats = {
    pending: items.filter((c) => c.status === 'pending').length,
    claimed: items.filter((c) => c.status === 'claimed').length,
    unreachable: items.filter((c) => c.status === 'unreachable').length,
    resolved: items.filter((c) => c.status === 'resolved').length,
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Queue list ──────────────────────────────────────────── */}
      <div className="w-[380px] flex-shrink-0 border-r border-border flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Callbacks</h1>
          <p className="text-muted-foreground text-xs mt-1">
            Unresolved &amp; dropped AI calls — pull, claim, and call back
          </p>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Queue', value: stats.pending, color: 'text-amber-400' },
              { label: 'Mine', value: stats.claimed, color: 'text-primary' },
              { label: 'No reach', value: stats.unreachable, color: 'text-muted-foreground' },
              { label: 'Closed', value: stats.resolved, color: 'text-emerald-400' },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-lg p-2 text-center">
                <p className={cn('text-lg font-bold', s.color)}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.map((c) => {
            const rm = reasonMeta[c.reason]
            const isSel = c.id === selectedId
            const mine = c.claimedBy === CSR
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  'w-full text-left rounded-xl border p-3 transition-all',
                  isSel ? 'border-primary/50 bg-primary/5' : 'border-border bg-card hover:bg-accent/30'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">{c.contactName}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1', rm.cls)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', rm.dot)} />
                    {rm.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{c.scenario}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {c.waitedMinutes}m waiting
                  </span>
                  {c.reason === 'unresolved' && (
                    <span className="text-amber-400/90">score {c.resolutionScore}</span>
                  )}
                  <span>· {c.attempts} {c.attempts === 1 ? 'try' : 'tries'}</span>
                </div>
                <div className="mt-2">
                  {c.status === 'pending' && (
                    <span className="text-[10px] text-muted-foreground/60">In shared queue</span>
                  )}
                  {c.status === 'claimed' && (
                    <span className={cn('text-[10px] flex items-center gap-1', mine ? 'text-primary' : 'text-muted-foreground/60')}>
                      <Lock className="w-3 h-3" /> {mine ? 'Claimed by you' : `Claimed by ${c.claimedBy}`}
                    </span>
                  )}
                  {c.status === 'resolved' && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolved by callback
                    </span>
                  )}
                  {c.status === 'unreachable' && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Unreachable · followed up
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Workspace ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <Workspace
          key={selected.id}
          cb={selected}
          phase={phase}
          attempts={attempts}
          lastOutcome={lastOutcome}
          callSeconds={callSeconds}
          muted={muted}
          notes={notes}
          disposition={disposition}
          fallbackSent={fallbackSent}
          onClaim={() => claim(selected.id)}
          onStartCall={() => setPhase('dialing')}
          onOutcome={applyOutcome}
          onToggleMute={() => setMuted((m) => !m)}
          onNotes={setNotes}
          onEndCall={() => setPhase('disposition')}
          onDispose={finishDisposition}
          onRetry={() => setPhase('review')}
          onSendFallback={sendFallback}
        />
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────

function Workspace(props: {
  cb: Callback
  phase: Phase
  attempts: number
  lastOutcome: Outcome | null
  callSeconds: number
  muted: boolean
  notes: string
  disposition: Disposition | null
  fallbackSent: null | 'sms' | 'email'
  onClaim: () => void
  onStartCall: () => void
  onOutcome: (o: Outcome) => void
  onToggleMute: () => void
  onNotes: (v: string) => void
  onEndCall: () => void
  onDispose: (d: Disposition) => void
  onRetry: () => void
  onSendFallback: (k: 'sms' | 'email') => void
}) {
  const { cb, phase, attempts, lastOutcome, callSeconds, muted, notes, disposition, fallbackSent } = props
  const rm = reasonMeta[cb.reason]
  const claimed = cb.claimedBy === CSR
  const attemptsLeft = MAX_ATTEMPTS - attempts

  return (
    <div className="max-w-3xl mx-auto px-8 py-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{cb.contactName}</h2>
            <p className="text-xs text-muted-foreground">
              {cb.phoneMasked} · Member since {cb.context.memberSince} · {cb.context.accountType}
            </p>
          </div>
        </div>
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5', rm.cls)}>
          <span className={cn('w-1.5 h-1.5 rounded-full', rm.dot)} />
          {rm.label}
        </span>
      </div>

      {/* Risk flags */}
      {cb.context.riskFlags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {cb.context.riskFlags.map((f) => (
            <span key={f} className="text-[11px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {f}
            </span>
          ))}
        </div>
      )}

      {/* AI Summary / context card (reused at escalation handoff too) */}
      <div className="mt-5 bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">AI Call Summary</p>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{cb.aiSummary}</p>
        <div className="mt-3 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide mb-1">Why it needs a callback</p>
          <p className="text-xs text-muted-foreground">{cb.whyUnresolved}</p>
          {cb.reason === 'unresolved' && (
            <p className="text-[11px] text-muted-foreground/70 mt-1.5">
              AI resolution score <span className="text-amber-400 font-medium">{cb.resolutionScore}</span> · below threshold of {RESOLUTION_THRESHOLD}
            </p>
          )}
        </div>
      </div>

      {/* Transcript snippet */}
      <div className="mt-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Last exchange before drop-off</p>
        <div className="space-y-2">
          {cb.transcriptSnippet.map((line, i) => (
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

      {/* ── Action zone ─────────────────────────────────────────── */}
      <div className="mt-6 sticky bottom-0">
        {/* Not claimed yet */}
        {!claimed && phase === 'review' && (
          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">This callback is in the shared queue</p>
              <p className="text-xs text-muted-foreground mt-0.5">Claim it to lock it to you and start the callback.</p>
            </div>
            <button onClick={props.onClaim} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Lock className="w-4 h-4" /> Claim
            </button>
          </div>
        )}

        {/* Claimed → ready to call */}
        {claimed && phase === 'review' && (
          <div className="bg-card border border-border rounded-xl p-4">
            {lastOutcome && (
              <div className="mb-3 text-xs text-muted-foreground flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5" />
                Last attempt: <span className="text-foreground font-medium capitalize">{lastOutcome.replace('-', ' ')}</span>
                · {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} left
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Ready to call back</p>
                <p className="text-xs text-muted-foreground mt-0.5">Dialing {cb.phoneMasked} via WebRTC · attempt {attempts + 1} of {MAX_ATTEMPTS}</p>
              </div>
              <button onClick={props.onStartCall} className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2">
                <PhoneOutgoing className="w-4 h-4" /> Call back
              </button>
            </div>
          </div>
        )}

        {/* Dialing */}
        {phase === 'dialing' && (
          <div className="bg-card border border-border rounded-xl p-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-foreground mt-3">Calling {cb.contactName}…</p>
            <p className="text-xs text-muted-foreground">{cb.phoneMasked}</p>
            <p className="text-[10px] text-muted-foreground/50 mt-4 uppercase tracking-widest">Demo · simulate outcome</p>
            <div className="grid grid-cols-2 gap-2 mt-2 max-w-sm mx-auto">
              <button onClick={() => props.onOutcome('connected')} className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-medium hover:bg-emerald-500/20">Member answered</button>
              <button onClick={() => props.onOutcome('no-answer')} className="px-3 py-2 rounded-lg bg-secondary text-muted-foreground border border-border text-xs font-medium hover:text-foreground">No answer</button>
              <button onClick={() => props.onOutcome('voicemail')} className="px-3 py-2 rounded-lg bg-secondary text-muted-foreground border border-border text-xs font-medium hover:text-foreground">Voicemail</button>
              <button onClick={() => props.onOutcome('busy')} className="px-3 py-2 rounded-lg bg-secondary text-muted-foreground border border-border text-xs font-medium hover:text-foreground">Busy</button>
            </div>
          </div>
        )}

        {/* Connected */}
        {phase === 'connected' && (
          <div className="bg-card border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-foreground">Live with {cb.contactName}</span>
              </div>
              <span className="text-sm font-mono text-emerald-400">{fmtClock(callSeconds)}</span>
            </div>

            {/* Copilot */}
            <div className="mt-3 bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <p className="text-[11px] font-semibold text-primary uppercase tracking-wide">Copilot suggestion</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{cb.copilotSuggestion}</p>
            </div>

            {/* Notes */}
            <textarea
              value={notes}
              onChange={(e) => props.onNotes(e.target.value)}
              placeholder="Call notes…"
              className="w-full mt-3 h-16 rounded-lg border border-border bg-secondary text-sm text-foreground p-2.5 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />

            <div className="flex items-center gap-2 mt-3">
              <button onClick={props.onToggleMute} className={cn('px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5', muted ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' : 'bg-secondary text-muted-foreground border-border hover:text-foreground')}>
                {muted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />} {muted ? 'Muted' : 'Mute'}
              </button>
              <button onClick={props.onEndCall} className="ml-auto px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 flex items-center gap-1.5">
                <PhoneOff className="w-3.5 h-3.5" /> End &amp; wrap up
              </button>
            </div>
          </div>
        )}

        {/* Fallback (max attempts reached) */}
        {phase === 'fallback' && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Voicemail className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Member unreachable after {MAX_ATTEMPTS} attempts</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Send a follow-up so they can reach back on their terms.</p>
            {fallbackSent ? (
              <div className="mt-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg p-3 text-sm text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {fallbackSent === 'sms' ? 'SMS' : 'Email'} follow-up sent to {cb.contactName}.
              </div>
            ) : (
              <div className="flex gap-2 mt-3">
                <button onClick={() => props.onSendFallback('sms')} className="flex-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-accent flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Send SMS
                </button>
                <button onClick={() => props.onSendFallback('email')} className="flex-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-accent flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Send Email
                </button>
              </div>
            )}
          </div>
        )}

        {/* Disposition */}
        {phase === 'disposition' && (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-medium text-foreground mb-3">How did the callback end?</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { d: 'resolved', label: 'Resolved', icon: CheckCircle2, cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
                { d: 'follow-up', label: 'Follow-up needed', icon: RotateCcw, cls: 'bg-sky-500/10 text-sky-400 border-sky-500/25' },
                { d: 'escalate', label: 'Escalate', icon: ArrowRight, cls: 'bg-amber-500/10 text-amber-400 border-amber-500/25' },
                { d: 'wrong-number', label: 'Wrong number', icon: PhoneOff, cls: 'bg-secondary text-muted-foreground border-border' },
              ] as const).map(({ d, label, icon: Icon, cls }) => (
                <button key={d} onClick={() => props.onDispose(d)} className={cn('px-3 py-2.5 rounded-lg text-sm font-medium border flex items-center gap-2 hover:opacity-90', cls)}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Done */}
        {phase === 'done' && (
          <div className="bg-card border border-border rounded-xl p-4">
            {disposition === 'resolved' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-lg p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                  <CheckCircle2 className="w-5 h-5" /> Callback resolved
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/25">Original call: Unresolved</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">Resolved by callback</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Write-back sent to CSxAI — this counts toward the <span className="text-foreground">final resolution rate</span> on the analytics dashboard.
                </p>
              </div>
            ) : (
              <div className="text-sm text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Callback closed as <span className="font-medium capitalize">{disposition?.replace('-', ' ')}</span>.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

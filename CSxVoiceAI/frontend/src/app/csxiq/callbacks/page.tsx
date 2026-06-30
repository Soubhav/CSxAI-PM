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
  dropped: { label: 'Dropped', cls: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  unresolved: { label: 'Unresolved', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
}

function fmtClock(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${(s % 60).toString().padStart(2, '0')}`
}

export default function CallbacksPage() {
  const [items, setItems] = useState<Callback[]>(CALLBACKS)
  const [selectedId, setSelectedId] = useState<string>(CALLBACKS[0].id)

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
        c.id === selectedId ? { ...c, status: d === 'resolved' ? 'resolved' : c.status, claimedBy: CSR } : c
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
      <div className="w-[372px] flex-shrink-0 border-r border-[#E9E9E7] bg-white flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-[#EFEEEC]">
          <h1 className="text-[17px] font-semibold text-[#37352F] tracking-tight">Callbacks</h1>
          <p className="text-[#787774] text-[13px] mt-0.5">Unresolved &amp; dropped AI calls — pull, claim, call back</p>

          {/* inline metric strip */}
          <div className="mt-4 flex items-stretch rounded-xl border border-[#E9E9E7] bg-[#F7F6F5] divide-x divide-[#E9E9E7]">
            {[
              { label: 'In queue', value: stats.pending, color: 'text-amber-600' },
              { label: 'Mine', value: stats.claimed, color: 'text-[#37352F]' },
              { label: 'No reach', value: stats.unreachable, color: 'text-[#9B9A97]' },
              { label: 'Closed', value: stats.resolved, color: 'text-emerald-600' },
            ].map((s) => (
              <div key={s.label} className="flex-1 px-2 py-2.5 text-center">
                <p className={cn('text-[17px] font-semibold tabular-nums leading-none', s.color)}>{s.value}</p>
                <p className="text-[11px] text-[#9B9A97] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1.5">
          {items.map((c) => {
            const rm = reasonMeta[c.reason]
            const isSel = c.id === selectedId
            const mine = c.claimedBy === CSR
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  'w-full text-left px-4 py-3 border-l-2 transition-colors',
                  isSel ? 'border-[#37352F] bg-[#F7F6F5]' : 'border-transparent hover:bg-[#F7F6F5]'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-medium text-[#37352F] truncate">{c.contactName}</span>
                  <span className={cn('px-1.5 py-px rounded-md text-[11px] font-medium border flex items-center gap-1', rm.cls)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', rm.dot)} />
                    {rm.label}
                  </span>
                </div>
                <p className="text-[12.5px] text-[#787774] mt-0.5 truncate">{c.scenario}</p>
                <div className="flex items-center gap-2.5 mt-1.5 text-[11.5px] text-[#9B9A97]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {c.waitedMinutes}m
                  </span>
                  {c.reason === 'unresolved' && <span className="text-amber-600">score {c.resolutionScore}</span>}
                  <span>{c.attempts} {c.attempts === 1 ? 'try' : 'tries'}</span>
                  <span className="ml-auto">
                    {c.status === 'claimed' && (
                      <span className={cn('flex items-center gap-1', mine ? 'text-[#4B4A45]' : 'text-[#9B9A97]')}>
                        <Lock className="w-3 h-3" /> {mine ? 'You' : c.claimedBy?.split(' ')[0]}
                      </span>
                    )}
                    {c.status === 'resolved' && <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Resolved</span>}
                    {c.status === 'unreachable' && <span className="flex items-center gap-1 text-[#9B9A97]"><Mail className="w-3 h-3" /> Followed up</span>}
                  </span>
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
          <div className="w-11 h-11 rounded-full bg-[#F1F0EE] border border-[#E9E9E7] flex items-center justify-center">
            <User className="w-5 h-5 text-[#787774]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#37352F] tracking-tight">{cb.contactName}</h2>
            <p className="text-[12.5px] text-[#787774]">
              {cb.phoneMasked} · Member since {cb.context.memberSince} · {cb.context.accountType}
            </p>
          </div>
        </div>
        <span className={cn('px-2 py-1 rounded-md text-[12px] font-medium border flex items-center gap-1.5', rm.cls)}>
          <span className={cn('w-1.5 h-1.5 rounded-full', rm.dot)} />
          {rm.label}
        </span>
      </div>

      {/* Risk flags */}
      {cb.context.riskFlags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {cb.context.riskFlags.map((f) => (
            <span key={f} className="text-[11.5px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {f}
            </span>
          ))}
        </div>
      )}

      {/* AI Summary / context card */}
      <div className="mt-5 bg-white border border-[#E9E9E7] rounded-xl p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#9B9A97]" />
          <p className="text-[11px] font-semibold text-[#787774] uppercase tracking-wider">AI Call Summary</p>
        </div>
        <p className="text-[13.5px] text-[#4B4A45] leading-relaxed">{cb.aiSummary}</p>
        <div className="mt-3 bg-amber-50/60 border border-amber-200 rounded-lg p-3">
          <p className="text-[10.5px] font-semibold text-amber-700 uppercase tracking-wider mb-1">Why it needs a callback</p>
          <p className="text-[12.5px] text-amber-900/80">{cb.whyUnresolved}</p>
          {cb.reason === 'unresolved' && (
            <p className="text-[11.5px] text-amber-700/80 mt-1.5">
              AI resolution score <span className="font-semibold">{cb.resolutionScore}</span> · below threshold of {RESOLUTION_THRESHOLD}
            </p>
          )}
        </div>
      </div>

      {/* Transcript snippet */}
      <div className="mt-4">
        <p className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wider mb-2">Last exchange before drop-off</p>
        <div className="space-y-2">
          {cb.transcriptSnippet.map((line, i) => (
            <div key={i} className={cn('flex flex-col max-w-[78%]', line.speaker === 'member' ? 'ml-auto items-end' : 'items-start')}>
              {line.speaker === 'agent' && <span className="text-[10.5px] text-[#9B9A97] mb-0.5 px-1">CSxAI Agent</span>}
              <div className={cn('rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed',
                line.speaker === 'agent' ? 'bg-[#F1F0EE] text-[#4B4A45] rounded-tl-sm' : 'bg-[#37352F] text-white rounded-tr-sm')}>
                {line.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action zone ─────────────────────────────────────────── */}
      <div className="mt-6">
        {!claimed && phase === 'review' && (
          <div className="bg-white border border-[#E9E9E7] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[13.5px] font-medium text-[#37352F]">This callback is in the shared queue</p>
              <p className="text-[12.5px] text-[#787774] mt-0.5">Claim it to lock it to you and start the callback.</p>
            </div>
            <button onClick={props.onClaim} className="px-3.5 py-2 rounded-lg bg-[#37352F] text-white text-[13px] font-medium hover:bg-[#2A2925] transition-colors flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Claim
            </button>
          </div>
        )}

        {claimed && phase === 'review' && (
          <div className="bg-white border border-[#E9E9E7] rounded-xl p-4">
            {lastOutcome && (
              <div className="mb-3 text-[12px] text-[#787774] flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                Last attempt: <span className="text-[#37352F] font-medium capitalize">{lastOutcome.replace('-', ' ')}</span>
                · {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} left
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13.5px] font-medium text-[#37352F]">Ready to call back</p>
                <p className="text-[12.5px] text-[#787774] mt-0.5">Dialing {cb.phoneMasked} via WebRTC · attempt {attempts + 1} of {MAX_ATTEMPTS}</p>
              </div>
              <button onClick={props.onStartCall} className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <PhoneOutgoing className="w-4 h-4" /> Call back
              </button>
            </div>
          </div>
        )}

        {phase === 'dialing' && (
          <div className="bg-white border border-[#E9E9E7] rounded-xl p-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-[14px] font-medium text-[#37352F] mt-3">Calling {cb.contactName}…</p>
            <p className="text-[12.5px] text-[#787774]">{cb.phoneMasked}</p>
            <p className="text-[10px] text-[#C7C6C2] mt-4 uppercase tracking-[0.18em]">Demo · simulate outcome</p>
            <div className="grid grid-cols-2 gap-2 mt-2 max-w-sm mx-auto">
              <button onClick={() => props.onOutcome('connected')} className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[12.5px] font-medium hover:bg-emerald-100">Member answered</button>
              <button onClick={() => props.onOutcome('no-answer')} className="px-3 py-2 rounded-lg bg-[#F7F6F5] text-[#5F5E5B] border border-[#E9E9E7] text-[12.5px] font-medium hover:bg-[#E9E9E7]">No answer</button>
              <button onClick={() => props.onOutcome('voicemail')} className="px-3 py-2 rounded-lg bg-[#F7F6F5] text-[#5F5E5B] border border-[#E9E9E7] text-[12.5px] font-medium hover:bg-[#E9E9E7]">Voicemail</button>
              <button onClick={() => props.onOutcome('busy')} className="px-3 py-2 rounded-lg bg-[#F7F6F5] text-[#5F5E5B] border border-[#E9E9E7] text-[12.5px] font-medium hover:bg-[#E9E9E7]">Busy</button>
            </div>
          </div>
        )}

        {phase === 'connected' && (
          <div className="bg-white border border-emerald-300 rounded-xl p-4 shadow-sm shadow-emerald-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[13.5px] font-medium text-[#37352F]">Live with {cb.contactName}</span>
              </div>
              <span className="text-[13.5px] font-mono text-emerald-700 tabular-nums">{fmtClock(callSeconds)}</span>
            </div>

            <div className="mt-3 bg-[#F7F6F5] border border-[#E9E9E7] rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#9B9A97]" />
                <p className="text-[10.5px] font-semibold text-[#787774] uppercase tracking-wider">Copilot suggestion</p>
              </div>
              <p className="text-[12.5px] text-[#5F5E5B] leading-relaxed">{cb.copilotSuggestion}</p>
            </div>

            <textarea
              value={notes}
              onChange={(e) => props.onNotes(e.target.value)}
              placeholder="Call notes…"
              className="w-full mt-3 h-16 rounded-lg border border-[#E9E9E7] bg-white text-[13px] text-[#37352F] p-2.5 placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#37352F]/10 focus:border-[#D6D5D2] resize-none"
            />

            <div className="flex items-center gap-2 mt-3">
              <button onClick={props.onToggleMute} className={cn('px-3 py-2 rounded-lg text-[12.5px] font-medium border flex items-center gap-1.5', muted ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-[#5F5E5B] border-[#E9E9E7] hover:bg-[#F1F0EE]')}>
                {muted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />} {muted ? 'Muted' : 'Mute'}
              </button>
              <button onClick={props.onEndCall} className="ml-auto px-4 py-2 rounded-lg bg-red-600 text-white text-[12.5px] font-semibold hover:bg-red-700 flex items-center gap-1.5">
                <PhoneOff className="w-3.5 h-3.5" /> End &amp; wrap up
              </button>
            </div>
          </div>
        )}

        {phase === 'fallback' && (
          <div className="bg-white border border-[#E9E9E7] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Voicemail className="w-4 h-4 text-[#9B9A97]" />
              <p className="text-[13.5px] font-medium text-[#37352F]">Member unreachable after {MAX_ATTEMPTS} attempts</p>
            </div>
            <p className="text-[12.5px] text-[#787774] mt-0.5">Send a follow-up so they can reach back on their terms.</p>
            {fallbackSent ? (
              <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[13px] text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {fallbackSent === 'sms' ? 'SMS' : 'Email'} follow-up sent to {cb.contactName}.
              </div>
            ) : (
              <div className="flex gap-2 mt-3">
                <button onClick={() => props.onSendFallback('sms')} className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-[#E9E9E7] text-[13px] font-medium text-[#4B4A45] hover:bg-[#F1F0EE] flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#9B9A97]" /> Send SMS
                </button>
                <button onClick={() => props.onSendFallback('email')} className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-[#E9E9E7] text-[13px] font-medium text-[#4B4A45] hover:bg-[#F1F0EE] flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-[#9B9A97]" /> Send Email
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'disposition' && (
          <div className="bg-white border border-[#E9E9E7] rounded-xl p-4">
            <p className="text-[13.5px] font-medium text-[#37352F] mb-3">How did the callback end?</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { d: 'resolved', label: 'Resolved', icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
                { d: 'follow-up', label: 'Follow-up needed', icon: RotateCcw, cls: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' },
                { d: 'escalate', label: 'Escalate', icon: ArrowRight, cls: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
                { d: 'wrong-number', label: 'Wrong number', icon: PhoneOff, cls: 'bg-[#F7F6F5] text-[#5F5E5B] border-[#E9E9E7] hover:bg-[#E9E9E7]' },
              ] as const).map(({ d, label, icon: Icon, cls }) => (
                <button key={d} onClick={() => props.onDispose(d)} className={cn('px-3 py-2.5 rounded-lg text-[13px] font-medium border flex items-center gap-2 transition-colors', cls)}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="bg-white border border-[#E9E9E7] rounded-xl p-4">
            {disposition === 'resolved' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-emerald-700 font-medium text-[13.5px]">
                  <CheckCircle2 className="w-5 h-5" /> Callback resolved
                </div>
                <div className="mt-3 flex items-center gap-2 text-[12px]">
                  <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">Original call: Unresolved</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#9B9A97]" />
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">Resolved by callback</span>
                </div>
                <p className="text-[11.5px] text-[#787774] mt-2">
                  Write-back sent to CSxAI — this counts toward the <span className="text-[#4B4A45] font-medium">final resolution rate</span> on the analytics dashboard.
                </p>
              </div>
            ) : (
              <div className="text-[13.5px] text-[#4B4A45] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9B9A97]" />
                Callback closed as <span className="font-medium capitalize">{disposition?.replace('-', ' ')}</span>.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

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
  Mic,
  PhoneOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const priorityMeta: Record<Escalation['priority'], { label: string; cls: string }> = {
  urgent: { label: 'Urgent', cls: 'bg-red-50 text-red-700 border-red-200' },
  high: { label: 'High', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  normal: { label: 'Normal', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
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

  useEffect(() => {
    setJoined(false)
    setCallSeconds(0)
    setAccept(selected.acceptWindowSeconds)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (joined || accept <= 0) return
    const t = setInterval(() => setAccept((a) => Math.max(0, a - 1)), 1000)
    return () => clearInterval(t)
  }, [joined, accept])

  useEffect(() => {
    if (!joined) return
    const t = setInterval(() => setCallSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [joined])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Waiting list */}
      <div className="w-[352px] flex-shrink-0 border-r border-[#E9E9E7] bg-white flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-[#EFEEEC]">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <h1 className="text-[17px] font-semibold text-[#37352F] tracking-tight">Live Escalations</h1>
          </div>
          <p className="text-[#787774] text-[13px] mt-1">Voice handoffs from the CSxAI agent — claim within the accept window</p>
        </div>
        <div className="flex-1 overflow-y-auto py-1.5">
          {ESCALATIONS.map((e) => {
            const pm = priorityMeta[e.priority]
            const isSel = e.id === selectedId
            return (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className={cn('w-full text-left px-4 py-3 border-l-2 transition-colors',
                  isSel ? 'border-[#37352F] bg-[#F7F6F5]' : 'border-transparent hover:bg-[#F7F6F5]')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-medium text-[#37352F] truncate">{e.contactName}</span>
                  <span className={cn('px-1.5 py-px rounded-md text-[11px] font-medium border', pm.cls)}>{pm.label}</span>
                </div>
                <p className="text-[12.5px] text-[#787774] mt-0.5 truncate">{e.scenario}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[11.5px]">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> live
                  </span>
                  <span className="flex items-center gap-1 text-[#9B9A97]">
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
              <div className="w-11 h-11 rounded-full bg-[#F1F0EE] border border-[#E9E9E7] flex items-center justify-center">
                <User className="w-5 h-5 text-[#787774]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#37352F] tracking-tight">{selected.contactName}</h2>
                <p className="text-[12.5px] text-[#787774]">
                  {selected.scenario} · Member since {selected.context.memberSince} · {selected.context.accountType}
                </p>
              </div>
            </div>
            <span className={cn('px-2 py-1 rounded-md text-[12px] font-medium border', priorityMeta[selected.priority].cls)}>
              {priorityMeta[selected.priority].label}
            </span>
          </div>

          {/* Trigger */}
          <div className="mt-3 flex items-center gap-2 text-[12px]">
            <span className="flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
              <AlertTriangle className="w-3 h-3" /> {selected.trigger}
            </span>
            <span className="text-[#9B9A97]">Sentiment: {selected.context.sentiment}</span>
          </div>

          {/* AI summary handoff card */}
          <div className="mt-5 bg-white border border-[#E9E9E7] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9B9A97]" />
              <p className="text-[11px] font-semibold text-[#787774] uppercase tracking-wider">AI Handoff Summary</p>
              <span className="ml-auto text-[10.5px] text-[#C7C6C2]">Read before you join</span>
            </div>
            <p className="text-[13.5px] text-[#4B4A45] leading-relaxed">{selected.aiSummary}</p>
          </div>

          {/* Live transcript */}
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wider mb-2">Conversation so far</p>
            <div className="space-y-2">
              {selected.liveTranscript.map((line, i) => (
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

          {/* Join / live */}
          <div className="mt-6">
            {!joined ? (
              <div className="bg-white border border-emerald-300 rounded-xl p-4 flex items-center justify-between shadow-sm shadow-emerald-100/50">
                <div>
                  <p className="text-[13.5px] font-medium text-[#37352F]">Member is on the line with the AI</p>
                  <p className="text-[12.5px] text-[#787774] mt-0.5">
                    {accept > 0 ? <>Accept window — <span className="text-emerald-700 font-medium tabular-nums">{accept}s</span> left before it re-routes</> : 'Window expired — re-routing to next available CSR'}
                  </p>
                </div>
                <button
                  onClick={() => setJoined(true)}
                  disabled={accept <= 0}
                  className={cn('px-4 py-2.5 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-colors',
                    accept > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#F1F0EE] text-[#9B9A97] cursor-not-allowed')}
                >
                  <PhoneCall className="w-4 h-4" /> Join call
                </button>
              </div>
            ) : (
              <div className="bg-white border border-emerald-300 rounded-xl p-4 shadow-sm shadow-emerald-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[13.5px] font-medium text-[#37352F]">You’re live with {selected.contactName}</span>
                  </div>
                  <span className="text-[13.5px] font-mono text-emerald-700 tabular-nums">{fmtClock(callSeconds)}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 py-2 rounded-lg text-[12.5px] font-medium border bg-white text-[#5F5E5B] border-[#E9E9E7] hover:bg-[#F1F0EE] flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" /> Mute
                  </button>
                  <button onClick={() => setJoined(false)} className="ml-auto px-4 py-2 rounded-lg bg-red-600 text-white text-[12.5px] font-semibold hover:bg-red-700 flex items-center gap-1.5">
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

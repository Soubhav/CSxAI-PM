'use client'

import { useState } from 'react'
import {
  CHAT_THREADS,
  CSR_STATS,
  TEAM,
  CHANNEL_LABEL,
  type ChatThread,
  type ChatMessage,
  type Channel,
} from '@/lib/csxiq-data'
import {
  MessageCircle,
  CheckCheck,
  Inbox as InboxIcon,
  Timer,
  Send,
  Globe,
  Mail,
  MessageSquare,
  Phone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import PresenceDot from '@/components/PresenceDot'

const channelIcon: Record<Channel, any> = {
  whatsapp: MessageSquare,
  web: Globe,
  email: Mail,
  voice: Phone,
}
const channelTone: Record<Channel, string> = {
  whatsapp: 'text-emerald-600',
  web: 'text-sky-600',
  email: 'text-amber-600',
  voice: 'text-slate-600',
}

export default function CsxiqHome() {
  const [threads, setThreads] = useState<ChatThread[]>(CHAT_THREADS)
  const [activeId, setActiveId] = useState(CHAT_THREADS[0].id)
  const [draft, setDraft] = useState('')

  const active = threads.find((t) => t.id === activeId)!

  function send() {
    if (!draft.trim()) return
    const msg: ChatMessage = { from: 'csr', text: draft.trim(), time: 'now' }
    setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, messages: [...t.messages, msg], unread: 0, preview: msg.text } : t)))
    setDraft('')
  }

  const stats = [
    { label: 'Open chats', value: CSR_STATS.openChats, icon: InboxIcon },
    { label: 'Closed today', value: CSR_STATS.closedToday, icon: CheckCheck },
    { label: 'Inquiries today', value: CSR_STATS.inquiriesToday, icon: MessageCircle },
    { label: 'Avg handle', value: `${CSR_STATS.avgHandleMinutes}m`, icon: Timer },
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Header + personal stat strip */}
      <div className="px-8 pt-6 pb-5 border-b border-slate-200 bg-white">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Good morning, Maya</h1>
            <p className="text-slate-500 text-[13px] mt-0.5">Here’s your desk for today.</p>
          </div>
          {/* inline metric strip */}
          <div className="flex items-stretch rounded-xl border border-slate-200 bg-slate-50/50 divide-x divide-slate-200">
            {stats.map((s) => (
              <div key={s.label} className="px-5 py-2.5 text-center">
                <p className="text-[19px] font-semibold text-slate-900 tabular-nums leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 justify-center">
                  <s.icon className="w-3 h-3" /> {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inbox + chat + team */}
      <div className="flex-1 flex overflow-hidden">
        {/* Inbox */}
        <div className="w-[300px] flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inbox · Omnichannel</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((t) => {
              const Icon = channelIcon[t.channel]
              const isSel = t.id === activeId
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveId(t.id)
                    setThreads((prev) => prev.map((x) => (x.id === t.id ? { ...x, unread: 0 } : x)))
                  }}
                  className={cn('w-full text-left px-4 py-3 border-l-2 border-b border-b-slate-50 transition-colors',
                    isSel ? 'border-l-slate-900 bg-slate-50' : 'border-l-transparent hover:bg-slate-50/70')}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', channelTone[t.channel])} />
                    <span className="text-[13.5px] font-medium text-slate-900 truncate flex-1">{t.contactName}</span>
                    {t.unread > 0 && (
                      <span className="bg-slate-900 text-white text-[10px] font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center tabular-nums">{t.unread}</span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-slate-500 truncate mt-0.5">{t.preview}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-slate-400">{CHANNEL_LABEL[t.channel]}</span>
                    {t.waitingMinutes > 0 && <span className="text-[11px] text-amber-600">{t.waitingMinutes}m waiting</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA]">
          <div className="px-5 py-2.5 border-b border-slate-200 bg-white flex items-center gap-2">
            {(() => {
              const Icon = channelIcon[active.channel]
              return <Icon className={cn('w-4 h-4', channelTone[active.channel])} />
            })()}
            <span className="text-[13.5px] font-semibold text-slate-900">{active.contactName}</span>
            <span className="text-[12px] text-slate-400">· {CHANNEL_LABEL[active.channel]}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {active.messages.map((m, i) => (
              <div key={i} className={cn('flex flex-col max-w-[68%]', m.from === 'csr' ? 'ml-auto items-end' : 'items-start')}>
                <div className={cn('rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed',
                  m.from === 'csr' ? 'bg-slate-900 text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm')}>
                  {m.text}
                </div>
                <span className="text-[10.5px] text-slate-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-300 transition">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={`Reply to ${active.contactName}…`}
                className="flex-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none py-1"
              />
              <button onClick={send} className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-colors flex-shrink-0 disabled:opacity-40" disabled={!draft.trim()}>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Team presence */}
        <div className="w-60 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Team</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {TEAM.map((m) => (
              <div key={m.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500">{m.name.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full">
                    <PresenceDot status={m.status} size="sm" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-slate-900 truncate leading-tight">{m.name}</p>
                  <p className="text-[11px] text-slate-400">{m.role}</p>
                </div>
                {m.activeCount > 0 && (
                  <span className="text-[10.5px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-px tabular-nums">{m.activeCount}</span>
                )}
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-100 space-y-1.5">
            {[
              { s: 'available' as const, l: 'Available' },
              { s: 'busy' as const, l: 'Busy' },
              { s: 'presenting' as const, l: 'Presenting' },
            ].map(({ s, l }) => (
              <div key={s} className="flex items-center gap-2">
                <PresenceDot status={s} size="sm" />
                <span className="text-[11.5px] text-slate-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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
  Users,
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
  whatsapp: 'text-emerald-400',
  web: 'text-sky-400',
  email: 'text-amber-400',
  voice: 'text-primary',
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
    { label: 'My open chats', value: CSR_STATS.openChats, icon: InboxIcon, color: 'text-primary' },
    { label: 'Closed today', value: CSR_STATS.closedToday, icon: CheckCheck, color: 'text-emerald-400' },
    { label: 'Inquiries today', value: CSR_STATS.inquiriesToday, icon: MessageCircle, color: 'text-sky-400' },
    { label: 'Avg handle time', value: `${CSR_STATS.avgHandleMinutes}m`, icon: Timer, color: 'text-amber-400' },
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Header + personal stats strip */}
      <div className="px-8 pt-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Good morning, Maya</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Here’s your desk for today.</p>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <s.icon className={cn('w-4 h-4', s.color)} />
              </div>
              <div>
                <p className={cn('text-xl font-bold leading-none', s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inbox + chat + team */}
      <div className="flex-1 flex overflow-hidden">
        {/* Inbox list */}
        <div className="w-80 flex-shrink-0 border-r border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Inbox · Omnichannel</p>
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
                  className={cn('w-full text-left px-4 py-3 border-b border-border/50 transition-colors', isSel ? 'bg-primary/5' : 'hover:bg-accent/30')}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', channelTone[t.channel])} />
                    <span className="text-sm font-medium text-foreground truncate flex-1">{t.contactName}</span>
                    {t.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{t.unread}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">{t.preview}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground/60">{CHANNEL_LABEL[t.channel]}</span>
                    {t.waitingMinutes > 0 && <span className="text-[10px] text-amber-400/80">{t.waitingMinutes}m waiting</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            {(() => {
              const Icon = channelIcon[active.channel]
              return <Icon className={cn('w-4 h-4', channelTone[active.channel])} />
            })()}
            <span className="text-sm font-semibold text-foreground">{active.contactName}</span>
            <span className="text-xs text-muted-foreground">· {CHANNEL_LABEL[active.channel]}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {active.messages.map((m, i) => (
              <div key={i} className={cn('flex flex-col max-w-[70%]', m.from === 'csr' ? 'ml-auto items-end' : 'items-start')}>
                <div className={cn('rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                  m.from === 'csr' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-secondary text-foreground rounded-tl-sm border border-border')}>
                  {m.text}
                </div>
                <span className="text-[10px] text-muted-foreground/50 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={`Reply to ${active.contactName}…`}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
              <button onClick={send} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0">
                <Send className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Team presence */}
        <div className="w-60 flex-shrink-0 border-l border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Team</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {TEAM.map((m) => (
              <div key={m.name} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-accent/30 transition-colors">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-muted-foreground">{m.name.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background rounded-full">
                    <PresenceDot status={m.status} size="sm" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{m.role}</p>
                </div>
                {m.activeCount > 0 && (
                  <span className="text-[10px] text-muted-foreground bg-secondary border border-border rounded-full px-1.5 py-0.5">{m.activeCount}</span>
                )}
              </div>
            ))}
          </div>
          {/* legend */}
          <div className="px-4 py-3 border-t border-border space-y-1.5">
            {[
              { s: 'available' as const, l: 'Available' },
              { s: 'busy' as const, l: 'Busy' },
              { s: 'presenting' as const, l: 'Presenting' },
            ].map(({ s, l }) => (
              <div key={s} className="flex items-center gap-2">
                <PresenceDot status={s} size="sm" />
                <span className="text-[11px] text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

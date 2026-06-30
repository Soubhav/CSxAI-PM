'use client'

import { useEffect, useState } from 'react'
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
  Smartphone,
  Phone,
  Sparkles,
  CornerDownLeft,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import PresenceDot, { PRESENCE_META } from '@/components/PresenceDot'
import type { PresenceStatus } from '@/lib/csxiq-data'

const channelIcon: Record<Channel, any> = { whatsapp: MessageCircle, sms: Smartphone, web: Globe, email: Mail, voice: Phone }
const channelTone: Record<Channel, string> = {
  whatsapp: 'text-emerald-600',
  sms: 'text-sky-600',
  web: 'text-[#787774]',
  email: 'text-amber-600',
  voice: 'text-[#787774]',
}

const channelFilters: { key: 'all' | Channel; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'sms', label: 'SMS' },
  { key: 'email', label: 'Email' },
]

export default function CsxiqHome() {
  const [threads, setThreads] = useState<ChatThread[]>(CHAT_THREADS)
  const [channelFilter, setChannelFilter] = useState<'all' | Channel>('all')
  const [activeId, setActiveId] = useState(CHAT_THREADS[0].id)
  const [draft, setDraft] = useState('')
  const [emailSubject, setEmailSubject] = useState('')

  const active = threads.find((t) => t.id === activeId)!
  const isEmail = active.channel === 'email'

  // keep a sensible reply subject when switching to an email thread
  useEffect(() => {
    if (active.channel === 'email') {
      setEmailSubject(active.subject?.startsWith('Re:') ? active.subject : `Re: ${active.subject ?? ''}`)
    }
    setDraft('')
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const visible = threads.filter((t) => channelFilter === 'all' || t.channel === channelFilter)

  function send() {
    if (!draft.trim()) return
    const msg: ChatMessage = { from: 'csr', text: draft.trim(), time: 'now' }
    setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, messages: [...t.messages, msg], unread: 0, preview: draft.trim() } : t)))
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
      {/* Header + personal stats */}
      <div className="px-8 pt-6 pb-4 border-b border-[#E9E9E7]">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#37352F] tracking-tight">Good morning, Maya 👋</h1>
            <p className="text-[#787774] text-[13.5px] mt-0.5">Here’s your desk for today.</p>
          </div>
          <div className="flex items-stretch divide-x divide-[#E9E9E7]">
            {stats.map((s) => (
              <div key={s.label} className="px-5 text-center">
                <p className="text-[20px] font-semibold text-[#37352F] tabular-nums leading-none">{s.value}</p>
                <p className="text-[11.5px] text-[#9B9A97] mt-1 flex items-center gap-1 justify-center">
                  <s.icon className="w-3 h-3" /> {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Inbox */}
        <div className="w-[300px] flex-shrink-0 border-r border-[#E9E9E7] bg-[#FBFBFA] flex flex-col">
          <div className="px-3 pt-3 pb-2">
            <p className="text-[11px] font-medium text-[#9B9A97] px-1 mb-2">Inbox · Omnichannel</p>
            {/* Channel filters */}
            <div className="flex items-center gap-1 bg-[#EFEEEC] rounded-lg p-0.5">
              {channelFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setChannelFilter(f.key)}
                  className={cn('flex-1 px-2 py-1 rounded-md text-[12px] font-medium transition-colors',
                    channelFilter === f.key ? 'bg-white text-[#37352F] shadow-sm' : 'text-[#787774] hover:text-[#37352F]')}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            {visible.map((t) => {
              const Icon = channelIcon[t.channel]
              const isSel = t.id === activeId
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveId(t.id)
                    setThreads((prev) => prev.map((x) => (x.id === t.id ? { ...x, unread: 0 } : x)))
                  }}
                  className={cn('w-full text-left px-2.5 py-2.5 rounded-md transition-colors mb-0.5',
                    isSel ? 'bg-[#EAEAE8]' : 'hover:bg-[#F1F0EE]')}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', channelTone[t.channel])} />
                    <span className="text-[13.5px] font-medium text-[#37352F] truncate flex-1">{t.contactName}</span>
                    {t.unread > 0 && (
                      <span className="bg-[#37352F] text-white text-[10px] font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center tabular-nums">{t.unread}</span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-[#787774] truncate mt-0.5">{t.channel === 'email' && t.subject ? t.subject : t.preview}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-[#9B9A97]">{CHANNEL_LABEL[t.channel]}</span>
                    {t.waitingMinutes > 0 && <span className="text-[11px] text-amber-600">{t.waitingMinutes}m waiting</span>}
                  </div>
                </button>
              )
            })}
            {visible.length === 0 && (
              <p className="px-3 py-8 text-center text-[12.5px] text-[#9B9A97]">No {channelFilter} conversations.</p>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {isEmail ? (
            <EmailView active={active} draft={draft} setDraft={setDraft} subject={emailSubject} setSubject={setEmailSubject} onSend={send} />
          ) : (
            <ChatView active={active} draft={draft} setDraft={setDraft} onSend={send} />
          )}
        </div>

        {/* Right column: AI Assist Copilot + Team */}
        <div className="w-[300px] flex-shrink-0 border-l border-[#E9E9E7] bg-[#FBFBFA] flex flex-col">
          <div className="p-3 border-b border-[#E9E9E7]">
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <Sparkles className="w-3.5 h-3.5 text-[#37352F]" />
              <p className="text-[12px] font-semibold text-[#37352F]">AI Assist</p>
              <span className="ml-auto text-[10px] text-emerald-700 bg-[#EDF3EC] rounded px-1.5 py-px font-medium">Live</span>
            </div>
            {active.copilotSuggestion ? (
              <div className="bg-white border border-[#E9E9E7] rounded-xl p-3">
                <p className="text-[13px] text-[#37352F] leading-relaxed whitespace-pre-line">{active.copilotSuggestion}</p>
                {active.copilotSource && (
                  <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#9B9A97]">
                    <BookOpen className="w-3 h-3" /><span className="truncate">{active.copilotSource}</span>
                  </div>
                )}
                <button
                  onClick={() => setDraft(active.copilotSuggestion || '')}
                  className="w-full mt-3 px-3 py-1.5 rounded-lg bg-[#37352F] text-white text-[12.5px] font-medium hover:bg-[#2A2925] transition-colors flex items-center justify-center gap-1.5"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" /> {isEmail ? 'Insert into email' : 'Insert into reply'}
                </button>
                <p className="text-[10.5px] text-[#9B9A97] mt-2 text-center">Suggestion only — review before sending.</p>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-[#E9E9E7] rounded-xl p-4 text-center text-[12.5px] text-[#9B9A97]">
                No suggestion yet — the Copilot will surface one as the member writes.
              </div>
            )}
          </div>

          <div className="px-4 py-2.5"><p className="text-[11px] font-medium text-[#9B9A97]">Team</p></div>
          <div className="flex-1 overflow-y-auto px-2">
            {TEAM.map((m) => (
              <div key={m.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-[#F1F0EE] transition-colors">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-[#EAEAE8] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10.5px] font-semibold text-[#787774]">{m.name.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-[#FBFBFA] rounded-full"><PresenceDot status={m.status} size="sm" /></span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[#37352F] truncate leading-tight">{m.name}</p>
                  <p className="text-[11px] text-[#9B9A97]">{m.role}</p>
                </div>
                {m.activeCount > 0 && <span className="text-[10.5px] text-[#787774] bg-[#F1F0EE] rounded px-1.5 py-px tabular-nums">{m.activeCount}</span>}
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[#E9E9E7] flex items-center gap-4">
            {(Object.keys(PRESENCE_META) as PresenceStatus[]).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <PresenceDot status={s} size="sm" />
                <span className="text-[11px] text-[#787774]">{PRESENCE_META[s].label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Chat (WhatsApp / SMS) view ──────────────────────────────────────────
function ChatView({ active, draft, setDraft, onSend }: { active: ChatThread; draft: string; setDraft: (v: string) => void; onSend: () => void }) {
  const Icon = channelIcon[active.channel]
  return (
    <>
      <div className="px-5 py-2.5 border-b border-[#E9E9E7] flex items-center gap-2">
        <Icon className={cn('w-4 h-4', channelTone[active.channel])} />
        <span className="text-[13.5px] font-semibold text-[#37352F]">{active.contactName}</span>
        <span className="text-[12px] text-[#9B9A97]">· {CHANNEL_LABEL[active.channel]}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {active.messages.map((m, i) => (
          <div key={i} className={cn('flex flex-col max-w-[68%]', m.from === 'csr' ? 'ml-auto items-end' : 'items-start')}>
            <div className={cn('rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed whitespace-pre-line',
              m.from === 'csr' ? 'bg-[#37352F] text-white rounded-tr-sm' : 'bg-[#F1F0EE] text-[#37352F] rounded-tl-sm')}>
              {m.text}
            </div>
            <span className="text-[10.5px] text-[#9B9A97] mt-0.5 px-1">{m.time}</span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[#E9E9E7]">
        <div className="flex items-center gap-2 bg-white border border-[#E9E9E7] rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#37352F]/10 focus-within:border-[#D6D5D2] transition">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder={`Reply by ${CHANNEL_LABEL[active.channel]}…`}
            className="flex-1 bg-transparent text-[13.5px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none py-1"
          />
          <button onClick={onSend} disabled={!draft.trim()} className="w-7 h-7 rounded-lg bg-[#37352F] flex items-center justify-center hover:bg-[#2A2925] transition-colors flex-shrink-0 disabled:opacity-40">
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </>
  )
}

// ── Email view (renders + composes as email) ────────────────────────────
function EmailView({ active, draft, setDraft, subject, setSubject, onSend }: {
  active: ChatThread; draft: string; setDraft: (v: string) => void; subject: string; setSubject: (v: string) => void; onSend: () => void
}) {
  return (
    <>
      <div className="px-6 py-3 border-b border-[#E9E9E7]">
        <p className="text-[15px] font-semibold text-[#37352F]">{active.subject}</p>
        <p className="text-[12px] text-[#9B9A97] mt-0.5">{active.fromEmail} → {active.toEmail}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {active.messages.map((m, i) => {
          const fromCsr = m.from === 'csr'
          return (
            <div key={i} className="rounded-xl border border-[#E9E9E7] bg-white">
              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#EFEEEC]">
                <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                  fromCsr ? 'bg-[#37352F]' : 'bg-[#EAEAE8]')}>
                  <span className={cn('text-[11px] font-semibold', fromCsr ? 'text-white' : 'text-[#787774]')}>
                    {(fromCsr ? 'Maya · Lakeside' : active.contactName).split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[#37352F]">{fromCsr ? 'Lakeside Member Support' : active.contactName}</p>
                  <p className="text-[11.5px] text-[#9B9A97] truncate">{fromCsr ? active.toEmail : active.fromEmail}</p>
                </div>
                <span className="text-[11.5px] text-[#9B9A97] flex-shrink-0">{m.time}</span>
              </div>
              <p className="px-4 py-3.5 text-[13.5px] text-[#37352F] leading-relaxed whitespace-pre-line">{m.text}</p>
            </div>
          )
        })}
      </div>
      {/* Email composer */}
      <div className="p-4 border-t border-[#E9E9E7]">
        <div className="rounded-xl border border-[#E9E9E7] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#37352F]/10 focus-within:border-[#D6D5D2] transition">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EFEEEC]">
            <span className="text-[12px] text-[#9B9A97] w-12">To</span>
            <span className="text-[12.5px] text-[#37352F] bg-[#F1F0EE] rounded px-2 py-0.5">{active.fromEmail}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EFEEEC]">
            <span className="text-[12px] text-[#9B9A97] w-12">Subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="flex-1 bg-transparent text-[13px] text-[#37352F] focus:outline-none" />
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write your email reply…"
            className="w-full h-28 px-3 py-2.5 bg-transparent text-[13.5px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#EFEEEC]">
            <span className="text-[11px] text-[#9B9A97]">Replies thread to the member’s email</span>
            <button onClick={onSend} disabled={!draft.trim()} className="px-3.5 py-1.5 rounded-lg bg-[#37352F] text-white text-[12.5px] font-medium hover:bg-[#2A2925] disabled:opacity-40 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Send email
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
